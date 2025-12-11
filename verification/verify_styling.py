from playwright.sync_api import sync_playwright

def verify_styling():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Emulate desktop with German locale
        context = browser.new_context(viewport={'width': 1280, 'height': 800}, locale='de-DE')
        page = context.new_page()

        try:
            # Go to home page
            page.goto("http://localhost:5173")

            # Wait for content to load
            page.wait_for_load_state('networkidle')

            # Debug: print all text content to see what's rendered
            # print(page.content())

            # Wait for ChatWidget to appear (it has an animation)
            # Try a broader selector or wait for the widget container
            # The chat widget has "PolarisDX Concierge" in the header.
            # But maybe the translation isn't loaded yet?

            # Try waiting for the chat container first.
            # It has class 'fixed bottom-24 ...'
            # Or text "DX"

            # Use a more generic wait and screenshot
            page.wait_for_timeout(3000)

            # Dismiss Cookie Banner if present to clear the view
            # Cookie banner usually has "Alle akzeptieren" or similar
            if page.is_visible('text=Alle akzeptieren'):
                page.click('text=Alle akzeptieren')
                page.wait_for_timeout(500) # wait for animation

            # 1. Take screenshot of Open Chat on Desktop (Default)
            page.screenshot(path="verification/desktop_chat_open.png")
            print("Captured desktop_chat_open.png")

            # Check if "PolarisDX Concierge" is visible
            if page.is_visible('text=PolarisDX Concierge'):
                print("Text 'PolarisDX Concierge' is visible.")
            else:
                print("Text 'PolarisDX Concierge' is NOT visible.")
                # Maybe it is "Chat" still?
                if page.is_visible('text=Chat'):
                     print("Text 'Chat' IS visible (Old text).")

            # 2. Minimize Chat to see the FAB on Desktop
            # Click minimize button (Minus icon)
            # We can use the locator for the minimize button

            # Find the minimize button. It has a specific click handler.
            # It is in the header.
            # Let's target the minus icon.
            minus_icon = page.locator('.lucide-minus')
            if minus_icon.count() > 0:
                minus_icon.first.click()
                page.wait_for_timeout(1000)

                # Now Chat should be closed, FAB should be visible.
                page.screenshot(path="verification/desktop_chat_minimized_fab.png")
                print("Captured desktop_chat_minimized_fab.png")
            else:
                print("Could not find minimize button")

            # 3. Scroll down to trigger Header styling
            page.evaluate("window.scrollTo(0, 500)")
            page.wait_for_timeout(1000)
            page.screenshot(path="verification/desktop_header_scrolled.png")
            print("Captured desktop_header_scrolled.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_styling()
