from playwright.sync_api import sync_playwright

def verify_sticky_button():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Mobile Viewport
        context = browser.new_context(viewport={"width": 390, "height": 844})
        page = context.new_page()
        page.goto("http://localhost:5173/")

        # Wait for any button that looks like ours (fixed, right aligned)
        # Or just wait a bit.
        page.wait_for_timeout(2000)

        # Snapshot to see what's there
        page.screenshot(path="verification/debug_screen.png")

        # Try to click the phone icon button (SVG inside button)
        # The button has a Phone icon.
        # We can select by the SVG or the wrapper class.
        # Wrapper has 'fixed right-0'

        # Click the button
        try:
             # Try to find button with Phone icon
             page.locator("button:has(svg)").click() # Simplistic, might hit menu, but menu is usually 'Menu' icon.
             page.wait_for_timeout(1000)
             page.screenshot(path="verification/mobile_sticky_expanded.png")
        except:
             print("Could not click button, check debug_screen.png")

        browser.close()

if __name__ == "__main__":
    verify_sticky_button()
