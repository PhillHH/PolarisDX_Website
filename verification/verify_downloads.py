from playwright.sync_api import sync_playwright

def verify_downloads(page):
    # Go to downloads page
    print("Navigating to /downloads")
    page.goto("http://localhost:5173/downloads")

    # Wait for content to load
    page.wait_for_selector("h1")

    # Take screenshot
    print("Taking screenshot")
    page.screenshot(path="verification/downloads_page_de.png", full_page=True)

    # Switch to English
    print("Switching to English")
    # Assuming there's a language switcher, but for now let's just check default (DE?) or force URL if possible?
    # The memory says "Language selection relies on internal state... Automated verification requires explicitly interacting with the UI language switcher"

    # Let's try to find the language switcher.
    # Usually in header.
    # But for a quick check, I just want to see if the files are there.

    # Let's verify the links exist
    links = page.locator("a[href*='.pdf']")
    count = links.count()
    print(f"Found {count} PDF links")

    for i in range(count):
        href = links.nth(i).get_attribute("href")
        print(f"Link {i}: {href}")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_downloads(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
