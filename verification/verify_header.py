from playwright.sync_api import sync_playwright

def verify_language_switcher():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to the app
        page.goto("http://localhost:5173")

        # Wait for content to load
        page.wait_for_selector("header")

        # Take screenshot of the header (Desktop)
        page.screenshot(path="verification/header_desktop.png")

        # Click the language switcher (Desktop)
        # We target the one in the desktop view (hidden lg:flex)
        # The mobile one is lg:hidden
        # It seems the error was that it found 2 elements and the first one (maybe desktop?) was not visible?
        # Actually in Header.tsx:
        # Desktop: <div class="hidden lg:flex ..."><LanguageSwitcher ... /></div>
        # Mobile: <div class="lg:hidden ..."><LanguageSwitcher ... /></div>

        # So on desktop size (default 1280x720), the first one should be visible if it is the desktop one.
        # But wait, the component renders the button directly.

        # Let's make sure we click the visible one.
        # Desktop viewport is default, so we look for the one inside `hidden lg:flex`

        # Use a more specific selector
        desktop_button = page.locator(".lg\\:flex button[aria-label='Select language']")
        if desktop_button.is_visible():
            desktop_button.click()
            page.wait_for_timeout(500)
            page.screenshot(path="verification/header_desktop_dropdown.png")
        else:
            print("Desktop button not visible?")

        # Test Mobile View
        page.set_viewport_size({"width": 375, "height": 812})
        page.wait_for_timeout(500)
        page.screenshot(path="verification/header_mobile.png")

        # Open Dropdown in mobile
        mobile_button = page.locator(".lg\\:hidden button[aria-label='Select language']")
        mobile_button.click()
        page.wait_for_timeout(500)
        page.screenshot(path="verification/header_mobile_dropdown.png")

        browser.close()

if __name__ == "__main__":
    verify_language_switcher()
