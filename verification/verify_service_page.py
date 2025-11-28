from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to one of the new service pages
        # The dev server usually runs on port 5173
        try:
            page.goto("http://localhost:5173/services/poc-systemloesungen")
            page.wait_for_load_state("networkidle")

            # Wait for content to appear (translation might be lazy loaded)
            page.wait_for_selector("text=POC-Systemlösungen")

            # Take a full page screenshot
            page.screenshot(path="verification/service_page.png", full_page=True)
            print("Screenshot saved to verification/service_page.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
