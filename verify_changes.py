from playwright.sync_api import sync_playwright
import time

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Set locale to 'de' to check default language or similar
        context = browser.new_context(locale="de-DE")
        page = context.new_page()

        try:
            # 1. Check Article Page Headings
            # Need a slug. "article-1" is usually a fallback or I can find one in src/data/articles.ts
            # Let's try /articles/article-1
            print("Navigating to Article Page...")
            page.goto("http://localhost:5173/articles/article-1")
            page.wait_for_load_state("networkidle")

            # Screenshot of the article header
            page.screenshot(path="verification/article_page.png", full_page=True)
            print("Article page screenshot taken.")

            # 2. Check About Page Team & Links
            print("Navigating to About Page...")
            page.goto("http://localhost:5173/about")
            page.wait_for_load_state("networkidle")

            # Check for Zuccala
            content = page.content()
            if "Zuccala" in content:
                print("Found 'Zuccala' in content.")
            else:
                print("WARNING: 'Zuccala' NOT found in content.")

            page.screenshot(path="verification/about_page.png", full_page=True)
            print("About page screenshot taken.")

            # 3. Check Footer
            # Scroll to bottom
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            page.screenshot(path="verification/footer.png")
            print("Footer screenshot taken.")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    # Wait for server to start
    time.sleep(5)
    verify_changes()
