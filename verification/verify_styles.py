from playwright.sync_api import sync_playwright

def verify_styling():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1440, 'height': 900})

        # Listen for console errors
        page.on("console", lambda msg: print(f"Browser console: {msg.text}"))
        page.on("pageerror", lambda exc: print(f"Browser uncaught exception: {exc}"))

        try:
            print("Navigating to home page...")
            page.goto("http://localhost:5173/", timeout=60000)

            # Wait for something very basic
            page.wait_for_selector("body", timeout=10000)

            print("Page loaded. Checking for Hero...")
            # Use a more generic locator first
            hero = page.locator("#hero")
            hero.wait_for(state="visible", timeout=10000)

            print("Hero found. Taking screenshot...")
            hero.screenshot(path="verification/hero_verification.png")

            print("Navigating to About page...")
            page.goto("http://localhost:5173/about", timeout=60000)
            page.wait_for_load_state("networkidle")

            print("Screenshotting About Page...")
            page.screenshot(path="verification/about_verification.png", full_page=True)

            print("Verification script finished successfully.")

        except Exception as e:
            print(f"Error: {e}")
            # Take a fallback screenshot to see what's happening
            try:
                page.screenshot(path="verification/error_state.png")
            except:
                pass
        finally:
            browser.close()

if __name__ == "__main__":
    verify_styling()
