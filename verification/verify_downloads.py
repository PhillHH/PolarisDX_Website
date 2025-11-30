import time
from playwright.sync_api import sync_playwright, expect

def verify_downloads_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a wide desktop viewport
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()

        print("Navigating to homepage...")
        page.goto("http://localhost:3000/")

        # Wait for content
        page.wait_for_timeout(3000)

        print("Taking screenshot of Hero Section...")
        page.screenshot(path="verification/hero_section_en.png")

        # Check for the button (English text as seen in screenshot)
        download_btn = page.get_by_role("link", name="Download Info Materials")
        expect(download_btn).to_be_visible()

        print("Clicking 'Download Info Materials'...")
        download_btn.click()

        # Verify navigation
        print("Waiting for navigation...")
        page.wait_for_url("**/downloads")

        # Wait for content
        page.wait_for_timeout(2000)

        print("Taking screenshot of Downloads Page...")
        page.screenshot(path="verification/downloads_page_en.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    verify_downloads_page()
