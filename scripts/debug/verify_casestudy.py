from playwright.sync_api import sync_playwright, expect
import time

def verify_homepage_widgets(page):
    # Navigate to the homepage
    page.goto("http://localhost:5173/")

    # Wait for the page to load
    page.wait_for_load_state("networkidle")

    # Dismiss cookie banner if present
    try:
        accept_button = page.get_by_role("button", name="Alle akzeptieren")
        if accept_button.is_visible():
            accept_button.click()
            time.sleep(1)
    except Exception as e:
        print(f"Cookie banner handling error: {e}")

    # Scroll down to reveal the sections
    page.evaluate("window.scrollTo(0, 2000)")
    time.sleep(3) # Wait for Reveal animations

    # Take a screenshot
    page.screenshot(path="homepage_casestudy.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 800})
        try:
            verify_homepage_widgets(page)
        finally:
            browser.close()
