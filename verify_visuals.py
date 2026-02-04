from playwright.sync_api import sync_playwright, expect
import time

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate desktop to see full header
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # 1. Verify Home Page Button Style
        print("Verifying Home Page...")
        page.goto("http://localhost:5173/")
        page.wait_for_load_state("networkidle")

        # Robustly dismiss cookie banner
        try:
            cookie_btn = page.get_by_role("button", name="Alle akzeptieren")
            if cookie_btn.is_visible():
                cookie_btn.click()
                time.sleep(1) # Wait for banner to disappear
        except Exception as e:
            print(f"Cookie banner handling info: {e}")

        # Check "Termin buchen" button style
        page.screenshot(path="verification_home_buttons.png")
        print("Captured Home Page screenshot.")

        # 2. Verify Igloo Widget Hover
        print("Verifying Igloo Widget Hover...")
        igloo_img = page.locator("img[alt='Igloo Pro']")
        igloo_img.scroll_into_view_if_needed()

        try:
            igloo_img.hover(timeout=5000)
            time.sleep(1)
            page.screenshot(path="verification_igloo_hover.png")
            print("Captured Igloo Hover screenshot.")
        except Exception as e:
            print(f"Could not hover Igloo image: {e}")
            page.screenshot(path="verification_igloo_overlap.png")

        # 3. Verify About Page Hero & Header
        print("Verifying About Page Hero...")
        page.goto("http://localhost:5173/about")
        page.wait_for_load_state("networkidle")

        page.mouse.wheel(0, 300)
        time.sleep(1)
        page.screenshot(path="verification_about_scrolled.png")
        print("Captured About Page Scrolled screenshot.")

        # 4. Verify Search Functionality (Full Text)
        print("Verifying Search...")
        page.goto("http://localhost:5173/")

        # Use first search button (Desktop)
        page.get_by_label("Search").first.click()
        time.sleep(0.5)

        # Use ID for search input to avoid disabled chat input
        page.fill("#search-input", "Frank")
        time.sleep(1)
        page.screenshot(path="verification_search_frank.png")
        print("Captured Search for 'Frank' screenshot.")

        page.fill("#search-input", "")
        page.fill("#search-input", "ecosystem")
        time.sleep(1)
        page.screenshot(path="verification_search_article.png")
        print("Captured Search for 'article' screenshot.")

        browser.close()

if __name__ == "__main__":
    verify_changes()
