from playwright.sync_api import sync_playwright

def verify_chat_widget():
    with sync_playwright() as p:
        # Launch browser with a desktop viewport size
        browser = p.chromium.launch(headless=True)
        # Desktop context
        context_desktop = browser.new_context(viewport={'width': 1280, 'height': 800}, locale='de-DE')
        page_desktop = context_desktop.new_page()

        print("Navigating to http://localhost:5173 (Desktop)...")
        page_desktop.goto("http://localhost:5173")

        # Wait for the chat to be visible (should be open by default on desktop)
        # The chat window usually has text "Support Assistant" or "PolarisDX Assistant"
        # We can look for the "Support Assistant" text which is in the header of the open chat
        print("Waiting for chat window to be visible on Desktop...")
        try:
            page_desktop.wait_for_selector("text=Support Assistant", timeout=5000)
            print("Chat window is OPEN by default on Desktop.")
        except:
            print("ERROR: Chat window is NOT open by default on Desktop.")

        # Check for the prototype message
        print("Checking for prototype message...")
        prototype_text = "Unser AI-Chatbot wird in den nächsten Tagen aktiviert"
        if page_desktop.get_by_text(prototype_text).is_visible():
            print("Prototype message is visible.")
        else:
            print("ERROR: Prototype message is NOT visible.")

        # Take screenshot for Desktop
        page_desktop.screenshot(path="verification/chat_desktop.png")
        print("Screenshot saved to verification/chat_desktop.png")

        # Now test Mobile
        print("\nTesting Mobile context...")
        context_mobile = browser.new_context(viewport={'width': 375, 'height': 667}, locale='de-DE')
        page_mobile = context_mobile.new_page()
        page_mobile.goto("http://localhost:5173")

        # Cookie Banner might obscure things on mobile, dismiss it if possible
        try:
            page_mobile.get_by_role("button", name="Alles akzeptieren").click(timeout=3000)
        except:
            pass # Maybe not there

        # Chat should be CLOSED on mobile (only the FAB button visible)
        # "Support Assistant" should NOT be visible
        if page_mobile.get_by_text("Support Assistant").is_visible():
             print("ERROR: Chat window is OPEN on Mobile (should be closed).")
        else:
             print("Chat window is CLOSED on Mobile (correct).")

        # Open it manually
        page_mobile.get_by_label("Open Chat").click()
        page_mobile.wait_for_selector("text=Support Assistant")
        page_mobile.screenshot(path="verification/chat_mobile_open.png")
        print("Screenshot saved to verification/chat_mobile_open.png")

        browser.close()

if __name__ == "__main__":
    verify_chat_widget()
