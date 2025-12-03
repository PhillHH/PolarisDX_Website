
import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Go to home page
        print("Navigating to Home...")
        await page.goto("http://localhost:5173/")
        await page.wait_for_load_state("networkidle")

        # Accept cookies to clear banner
        print("Accepting cookies...")
        try:
            # Look for the button with text "Alle akzeptieren" or similar
            # Based on previous screenshot, it is "Alle akzeptieren"
            await page.get_by_role("button", name="Alle akzeptieren").click()
            await asyncio.sleep(1) # Wait for animation
        except Exception as e:
            print(f"Could not click cookie button: {e}")

        # Scroll to bottom
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await asyncio.sleep(1)

        # Take screenshot of the footer
        print("Taking footer screenshot...")
        # Select the footer element
        footer = await page.query_selector('footer')
        if footer:
            await footer.screenshot(path="verification/footer_clean.png")
            print("Screenshot saved to verification/footer_clean.png")
        else:
            print("Footer not found!")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
