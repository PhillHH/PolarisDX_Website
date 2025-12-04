from playwright.sync_api import sync_playwright

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # We need a big viewport to see footer and sidebar
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # 1. Verify Home/Services Buttons
        print("Checking Homepage...")
        page.goto("http://localhost:5173/")
        page.wait_for_load_state("networkidle")

        # Check for "Book Appointment" button on homepage (CTA section might be at bottom)
        # Note: Language detection might default to EN or DE.
        # Let's force English first to check "Book Appointment"
        page.goto("http://localhost:5173/?lng=en")
        page.wait_for_timeout(1000) # wait for i18n

        page.screenshot(path="verification/home_en.png", full_page=True)
        print("Screenshot saved: verification/home_en.png")

        # 2. Verify Footer Links (Terms moved)
        # Check if Terms & Conditions link is in the bottom bar
        # In full_page screenshot of home, footer should be visible.

        # 3. Verify Terms Page (Sidebar)
        print("Checking Terms Page...")
        page.goto("http://localhost:5173/terms?lng=de")
        page.wait_for_timeout(1000)

        page.screenshot(path="verification/terms_de.png", full_page=True)
        print("Screenshot saved: verification/terms_de.png")

        # 4. Verify Services Page Button
        print("Checking Services Page...")
        page.goto("http://localhost:5173/services/dental?lng=de") # Pick one service
        page.wait_for_timeout(1000)
        page.screenshot(path="verification/service_dental_de.png", full_page=True)
        print("Screenshot saved: verification/service_dental_de.png")

        browser.close()

if __name__ == "__main__":
    verify_changes()
