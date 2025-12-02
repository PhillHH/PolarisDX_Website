from playwright.sync_api import sync_playwright, expect
import time

def verify_features():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            print("Navigating to homepage...")
            # Navigate to the frontend
            page.goto("http://localhost:5173")

            # 1. Verify Cookie Banner
            print("Verifying Cookie Banner...")
            cookie_banner = page.locator("text=Wir respektieren Ihre Privatsphäre")
            expect(cookie_banner).to_be_visible(timeout=10000)

            # Click Settings
            page.get_by_role("button", name="Einstellungen").click()
            expect(page.get_by_text("Notwendig")).to_be_visible()

            # Take screenshot of Cookie Banner with Settings open
            page.screenshot(path="verification/cookie_banner.png")
            print("Cookie Banner verified and screenshot taken.")

            # Accept All
            page.get_by_role("button", name="Alle akzeptieren").click()
            expect(cookie_banner).not_to_be_visible()

            # 2. Verify Contact Form
            print("Navigating to Contact Page...")
            page.goto("http://localhost:5173/contact")

            # Use specific selectors based on the code I read
            # id="name", id="email", etc.
            # wait for form to be visible
            expect(page.locator("form")).to_be_visible()

            page.fill("#company", "Test Company")
            page.fill("#name", "Test User")
            page.fill("#phone", "123456789")
            page.fill("#email", "test@example.com")

            # Select area
            page.select_option("#area", "lab")

            page.fill("#requirements", "Test Message content.")

            # Intercept the request to verify URL
            with page.expect_request("**/api/contact") as request_info:
                # Submit
                page.locator("button[type=submit]").click()

            req = request_info.value
            print(f"Request made to: {req.url}")
            assert "/api/contact" in req.url

            # Take screenshot of filled contact form
            # Give it a moment for UI update (success or error message)
            page.wait_for_timeout(2000)
            page.screenshot(path="verification/contact_form_submitted.png")
            print("Contact form verification complete.")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_features()
