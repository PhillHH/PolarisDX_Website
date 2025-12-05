from playwright.sync_api import sync_playwright

def verify_changes():
    with sync_playwright() as p:
        # Launch browser (headless=True for standard execution)
        # We use a mobile viewport to test the mobile call button
        browser = p.chromium.launch(headless=True)

        # Test 1: Mobile Call Button (Mobile Viewport)
        context_mobile = browser.new_context(viewport={"width": 390, "height": 844}) # iPhone 12/13
        page_mobile = context_mobile.new_page()
        page_mobile.goto("http://localhost:5173/")

        # Wait for button
        page_mobile.wait_for_selector("button[aria-label='Call us']") # Using translation key fallback if needed, but 'Call us' was fallback in code

        # Take screenshot of collapsed state
        page_mobile.screenshot(path="verification/mobile_collapsed.png")

        # Click to expand
        page_mobile.click("button[aria-label='Call us']")
        page_mobile.wait_for_timeout(500) # Wait for animation

        # Take screenshot of expanded state
        page_mobile.screenshot(path="verification/mobile_expanded.png")

        # Test 2: Contact Page Texts (Desktop Viewport)
        context_desktop = browser.new_context(viewport={"width": 1280, "height": 720})
        page_desktop = context_desktop.new_page()
        page_desktop.goto("http://localhost:5173/contact")

        # Wait for text updates
        # Check for "Termin vereinbaren" in Hero (Kicker or Title)
        # Note: Depending on default language (detected), it might be German or English.
        # We can force language via localStorage or URL query if supported, or just check what's there.
        # Assuming defaults to English or System?
        # Actually, let's switch to German if possible or check for "Book Appointment" if English.
        # Let's check the text content.

        page_desktop.wait_for_load_state("networkidle")
        page_desktop.screenshot(path="verification/contact_desktop.png")

        browser.close()

if __name__ == "__main__":
    verify_changes()
