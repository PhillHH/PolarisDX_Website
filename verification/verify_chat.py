from playwright.sync_api import sync_playwright, expect
import time

def verify_chat_widget():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # 1. Desktop Verification
        context_desktop = browser.new_context(viewport={'width': 1280, 'height': 720})
        page_desktop = context_desktop.new_page()
        page_desktop.goto("http://localhost:5173")

        # Dismiss cookie banner
        # Try both English and German labels
        try:
            page_desktop.get_by_role("button", name="Accept All").click(timeout=1000)
        except:
             try:
                 page_desktop.get_by_role("button", name="Alle akzeptieren").click(timeout=1000)
             except:
                 print("Could not find/click cookie banner on Desktop (might be already gone or not loaded)")

        print("Checking Desktop state (Default EN)...")
        # Check Chat Window Visibility
        chat_window = page_desktop.locator("div.fixed.z-40.bg-white.shadow-2xl")
        expect(chat_window).to_be_visible()

        # Check FAB Visibility (should be hidden)
        fab = page_desktop.get_by_label("Open Chat")
        expect(fab).to_be_hidden()

        # Check English text (verifying JSON fix)
        expect(page_desktop.get_by_text("Chat", exact=True)).to_be_visible()
        expect(page_desktop.get_by_text("Welcome!", exact=False)).to_be_visible()

        page_desktop.screenshot(path="verification/desktop_open_en.png")
        print("Captured desktop_open_en.png")

        # Switch to German
        print("Switching to German...")
        page_desktop.get_by_label("Select language").first.click()
        page_desktop.get_by_role("button", name="Deutsch").click()

        # Verify German text
        expect(page_desktop.get_by_text("Willkommen!", exact=False)).to_be_visible()

        page_desktop.screenshot(path="verification/desktop_open_de.png")
        print("Captured desktop_open_de.png")

        # Minimize
        page_desktop.locator("button:has(svg.lucide-minus)").click()

        # Expect Window hidden, FAB visible
        expect(chat_window).to_be_hidden()
        expect(fab).to_be_visible()

        page_desktop.screenshot(path="verification/desktop_minimized.png")
        print("Captured desktop_minimized.png")

        # 2. Mobile Verification
        context_mobile = browser.new_context(viewport={'width': 375, 'height': 667})
        page_mobile = context_mobile.new_page()
        page_mobile.goto("http://localhost:5173")

        # Dismiss cookie banner
        # On mobile it is very likely to cover the FAB
        try:
            page_mobile.get_by_role("button", name="Accept All").click(timeout=2000)
            print("Clicked Accept All on mobile")
            # Wait for animation
            time.sleep(0.5)
        except:
             try:
                 page_mobile.get_by_role("button", name="Alle akzeptieren").click(timeout=2000)
                 print("Clicked Alle akzeptieren on mobile")
                 time.sleep(0.5)
             except:
                 print("Could not find/click cookie banner on Mobile")

        print("Checking Mobile state...")
        # Initial: Chat should be closed, FAB visible
        chat_window_mobile = page_mobile.locator("div.fixed.z-40.bg-white.shadow-2xl")
        fab_mobile = page_mobile.get_by_label("Open Chat")

        expect(chat_window_mobile).to_be_hidden()
        expect(fab_mobile).to_be_visible()

        page_mobile.screenshot(path="verification/mobile_closed.png")
        print("Captured mobile_closed.png")

        # Open Chat
        # Force click if obscured (though we tried to dismiss cookie banner)
        fab_mobile.click(force=True)

        expect(chat_window_mobile).to_be_visible()
        expect(fab_mobile).to_be_visible()

        page_mobile.screenshot(path="verification/mobile_open.png")
        print("Captured mobile_open.png")

        browser.close()

if __name__ == "__main__":
    verify_chat_widget()
