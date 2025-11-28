from playwright.sync_api import sync_playwright

def verify_translation():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Force locale to DE in browser context or use URL param
        context = browser.new_context(locale='de-DE')
        page = context.new_page()

        # 1. Verify Home Page (German - Default)
        print("Navigating to Home Page (DE)...")
        page.goto("http://localhost:5173/?lng=de")

        # Wait for something distinctive.
        # "IglooPro" is common.
        # "Point-of-Care. Perfekt. Sofort." contains special chars/newlines.
        # Let's look for "Sichern Sie sich das Performance-Paket" (Description in DE)
        page.wait_for_selector("text=Sichern Sie sich das Performance-Paket")

        page.screenshot(path="verification/home_de.png")
        print("Home Page DE screenshot taken.")

        # 2. Verify Contact Page (German)
        print("Navigating to Contact Page (DE)...")
        page.goto("http://localhost:5173/contact?lng=de")
        # Check for Contact Hero Title
        page.wait_for_selector("text=IglooPro Performance-Analyse anfordern")
        # Verify form label
        page.wait_for_selector("text=Name des Unternehmens / der Praxis")
        page.screenshot(path="verification/contact_de.png")
        print("Contact Page DE screenshot taken.")

        # 3. Verify Contact Page (English)
        print("Navigating to Contact Page (EN)...")
        page.goto("http://localhost:5173/contact?lng=en")
        # Check for Contact Hero Title
        page.wait_for_selector("text=Request IglooPro Performance Analysis")
        # Verify form label
        page.wait_for_selector("text=Company / Practice Name")
        page.screenshot(path="verification/contact_en.png")
        print("Contact Page EN screenshot taken.")

        # 4. Verify CTA Section on Home Page (EN)
        print("Navigating to Home Page (EN) for CTA Section...")
        page.goto("http://localhost:5173/?lng=en")
        # Scroll to bottom/footer
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        # Check for CTA Title
        page.wait_for_selector("text=Looking for guaranteed performance and POC expertise?")
        page.screenshot(path="verification/home_cta_en.png")
        print("Home CTA EN screenshot taken.")

        # 5. Verify Contact Page (Polish)
        print("Navigating to Contact Page (PL)...")
        page.goto("http://localhost:5173/contact?lng=pl")
        # Check for Contact Hero Title
        page.wait_for_selector("text=Zamów analizę wydajności IglooPro")
        page.screenshot(path="verification/contact_pl.png")
        print("Contact Page PL screenshot taken.")

        browser.close()

if __name__ == "__main__":
    verify_translation()
