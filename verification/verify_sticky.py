from playwright.sync_api import sync_playwright

def verify_sticky_button():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile Viewport
        context = browser.new_context(viewport={"width": 390, "height": 844}, locale="de-DE")
        page = context.new_page()
        page.goto("http://localhost:5173/")

        # Wait for button
        # Locator logic: 'Call us' was key, but now localized 'Rufen Sie uns an'.
        # Since I set locale to de-DE, it should render "Rufen Sie uns an".
        # But wait, button aria-label uses t('contact.call_us_button')

        # Take screenshot of collapsed state
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/mobile_sticky_collapsed.png")

        # Click to expand
        # Try finding by role button, since aria-label is dynamic.
        # But we can select by class or generic role button.
        buttons = page.get_by_role("button")
        # There might be menu buttons etc.
        # Let's target the one with the Phone icon or specific classes if needed.
        # It has `fixed right-0` classes.

        # Or just use the selector for the unique wrapper.

        # Clicking the button
        page.click("button[aria-label='Rufen Sie uns an']") # Assuming translation works
        page.wait_for_timeout(500)

        # Take screenshot of expanded state
        page.screenshot(path="verification/mobile_sticky_expanded.png")

        browser.close()

if __name__ == "__main__":
    verify_sticky_button()
