from playwright.sync_api import sync_playwright
import time

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1440, "height": 900}, locale="de-DE")
        page = context.new_page()

        try:
            print("Navigating to localhost:5173...")
            page.goto("http://localhost:5173", timeout=60000)
            page.wait_for_load_state("networkidle")

            # --- Explicit Language Switch to German ---
            print("Switching language to German...")
            try:
                page.locator("button[aria-label='Select language']").first.click()
                page.locator("button:has-text('Deutsch')").first.click()
                page.wait_for_selector("text=Termin buchen", timeout=5000)
                print("Language switched.")
            except Exception as e:
                print(f"Language switch warning: {e}")

            # Dismiss Cookie Banner
            try:
                page.click("button:has-text('Alle akzeptieren')", timeout=3000)
            except:
                pass

            # 1. Stats Section (Hero)
            print("Capturing Stats...")
            page.evaluate("window.scrollTo(0, 0)")
            time.sleep(1) # Wait for header animation/rendering
            page.screenshot(path="stats_desktop.png")
            print("Saved stats_desktop.png")

            # 2. About Section
            print("Capturing About Section...")
            about_text = "Exzellenz und Sicherheit: Der Standard, den wir setzen."
            try:
                el = page.get_by_text(about_text).first
                el.scroll_into_view_if_needed()
                # Scroll a bit up to center it better if needed, or just take viewport
                page.evaluate("window.scrollBy(0, -100)")
                time.sleep(1)
                page.screenshot(path="about_desktop.png")
                print("Saved about_desktop.png")
            except Exception as e:
                print(f"Could not capture About section: {e}")

            # 3. Igloo Widget Section
            print("Capturing Igloo Widget Section...")
            igloo_text = "Anwendungsbereiche"
            try:
                el = page.get_by_text(igloo_text).first
                el.scroll_into_view_if_needed()
                page.evaluate("window.scrollBy(0, -100)")
                time.sleep(1)
                page.screenshot(path="igloo_desktop.png")
                print("Saved igloo_desktop.png")
            except Exception as e:
                print(f"Could not capture Igloo section: {e}")

        except Exception as e:
            print(f"Global Error: {e}")
            page.screenshot(path="error_screenshot.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_changes()
