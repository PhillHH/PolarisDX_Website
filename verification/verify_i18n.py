from playwright.sync_api import sync_playwright

def verify_translation(page):
    # Go to home
    page.goto("http://localhost:3000")
    page.wait_for_selector("text=Sie suchen nach garantierter Performance") # Check if DE text loaded (lazy loading)

    # Check CTA in German (default)
    print("Checking German CTA...")
    page.screenshot(path="verification/home_de.png")

    # Go to Contact
    page.goto("http://localhost:3000/contact")
    page.wait_for_selector("text=IglooPro Performance-Analyse anfordern")

    print("Checking German Contact...")
    page.screenshot(path="verification/contact_de.png")

    # Try to switch language?
    # The app detects language from browser. I can emulate browser language.

def verify_french(page):
    # Set extra HTTP headers or context for language?
    # Actually simpler to set locale in context
    pass

if __name__ == "__main__":
    with sync_playwright() as p:
        # 1. German (Default)
        browser = p.chromium.launch()
        context = browser.new_context(locale='de-DE')
        page = context.new_page()
        try:
            print("Verifying German...")
            page.goto("http://localhost:3000")
            page.wait_for_timeout(2000) # wait for i18n
            page.screenshot(path="verification/home_de.png")

            page.goto("http://localhost:3000/contact")
            page.wait_for_timeout(2000)
            page.screenshot(path="verification/contact_de.png")
        finally:
            context.close()
            browser.close()

    with sync_playwright() as p:
        # 2. French
        browser = p.chromium.launch()
        context = browser.new_context(locale='fr-FR')
        page = context.new_page()
        try:
            print("Verifying French...")
            page.goto("http://localhost:3000")
            page.wait_for_timeout(2000)
            # Check CTA text in French
            # "Vous recherchez une performance garantie et une expertise POC ?"
            page.screenshot(path="verification/home_fr.png")

            page.goto("http://localhost:3000/contact")
            page.wait_for_timeout(2000)
            # Check Contact Form in French
            page.screenshot(path="verification/contact_fr.png")
        finally:
            context.close()
            browser.close()
