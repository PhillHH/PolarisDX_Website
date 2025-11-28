from playwright.sync_api import sync_playwright

def verify_i18n():
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # 1. German (via URL)
        context = browser.new_context()
        page = context.new_page()
        print("Verifying German (via URL)...")
        # Use ?lng=de to force language
        page.goto("http://localhost:3000/contact?lng=de")

        # Wait for translation to load (look for German specific text)
        try:
            page.wait_for_selector("text=IglooPro Performance-Analyse anfordern", timeout=5000)
            page.screenshot(path="verification/contact_de_force.png")
            print("German verified.")
        except Exception as e:
            print(f"German verification failed: {e}")
            page.screenshot(path="verification/contact_de_fail.png")

        # 2. French (via URL)
        print("Verifying French (via URL)...")
        page.goto("http://localhost:3000/contact?lng=fr")

        # Wait for translation to load
        try:
            # "Demander une analyse de performance IglooPro" is the FR title I added
            page.wait_for_selector("text=Demander une analyse de performance IglooPro", timeout=5000)
            page.screenshot(path="verification/contact_fr_force.png")
            print("French verified.")
        except Exception as e:
            print(f"French verification failed: {e}")
            page.screenshot(path="verification/contact_fr_fail.png")

        # 3. Spanish (via URL)
        print("Verifying Spanish (via URL)...")
        page.goto("http://localhost:3000/contact?lng=es")
        try:
            # "Solicitar análisis de rendimiento IglooPro"
            page.wait_for_selector("text=Solicitar análisis de rendimiento IglooPro", timeout=5000)
            page.screenshot(path="verification/contact_es_force.png")
            print("Spanish verified.")
        except Exception as e:
            print(f"Spanish verification failed: {e}")
            page.screenshot(path="verification/contact_es_fail.png")

        context.close()
        browser.close()

if __name__ == "__main__":
    verify_i18n()
