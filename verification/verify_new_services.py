from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # We start with a context that tries to set locale, but the app might use local storage.
        # We will manually switch language if needed.
        context = browser.new_context(locale='de-DE')
        page = context.new_page()

        # Define the service pages to check
        services = [
            "stoffwechsel-herz",
            "hormon-tests",
            "kompatibilitaet-integration"
        ]

        # Ensure the server is up
        time.sleep(2)

        # First, go to home page and ensure language is German
        page.goto("http://localhost:5173/")
        page.wait_for_load_state("networkidle")

        # Check current language button text
        # The button contains the current language code uppercase
        lang_btn = page.get_by_label("Select language").first
        if "DE" not in lang_btn.inner_text():
            print("Switching to German...")
            lang_btn.click()
            page.get_by_role("button", name="Deutsch").click()
            time.sleep(1) # wait for switch

        for service_id in services:
            url = f"http://localhost:5173/services/{service_id}"
            print(f"Navigating to {url}")
            try:
                page.goto(url)

                # Wait a bit for content to render/translate
                page.wait_for_timeout(2000)

                screenshot_path = f"verification/{service_id}.png"
                page.screenshot(path=screenshot_path, full_page=True)
                print(f"Screenshot saved to {screenshot_path}")

                # Check for specific German text to confirm content loading
                if service_id == "stoffwechsel-herz":
                     expect(page.get_by_text("Stoffwechsel & Herzgesundheit: Chronische Überwachung auf Knopfdruck")).to_be_visible()
                elif service_id == "hormon-tests":
                     expect(page.get_by_text("Hormon- & Endokrinologie-Tests: Spezialdiagnostik leicht gemacht")).to_be_visible()
                elif service_id == "kompatibilitaet-integration":
                     expect(page.get_by_text("Herstellerübergreifende Kompatibilität: Investitionssicherheit durch Offenheit")).to_be_visible()

                print(f"Verified {service_id}")
            except Exception as e:
                print(f"Failed to verify {service_id}: {e}")

        browser.close()

if __name__ == "__main__":
    run()
