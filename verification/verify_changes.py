from playwright.sync_api import sync_playwright, expect
import time

def verify_case_study():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a larger viewport to see the "fancy widget" properly
        page = browser.new_page(viewport={"width": 1280, "height": 3000})

        # 1. Visit Homepage
        page.goto("http://localhost:5174/")

        # Wait for translation to load (sometimes takes a moment)
        time.sleep(2)

        # 2. Check for Testimonial Slider (Dr. Kristian Grimm)
        # We look for his name in the DOM. The slider auto-rotates, so he might not be visible immediately,
        # but he should be in the DOM.
        # Ideally we click the dots to find him, but let's just check presence first.
        # testimonials.ts has ID "kristian_grimm", so we check if text "Dr. Kristian Grimm" is there.
        # The slider renders all slides but hides them with overflow:hidden and transform.
        # But we can still check for the text existence.

        # Note: The component renders all testimonials in a flex row.
        expect(page.get_by_text("Dr. Kristian Grimm")).to_be_attached()

        # 3. Check for the "Featured Case Study" Widget
        # Look for the title used in the component: reasons32.title -> "Longevity & Design..."
        # We can look for "Longevity & Design"
        expect(page.get_by_role("heading", name="Longevity & Design")).to_be_visible()

        # Take a screenshot of the homepage focusing on the new widget
        # Scroll to the widget. It's below testimonials.
        widget = page.get_by_role("heading", name="Longevity & Design")
        widget.scroll_into_view_if_needed()
        time.sleep(1) # Wait for any animations
        page.screenshot(path="verification/homepage_widget.png")

        # 4. Click the CTA to go to the Case Study Page
        # Link text uses key 'teaser.cta': "Zur Case Study" or "View Case Study"
        # We can try finding the link with "Case Study" text.
        page.get_by_role("link", name="Case Study", exact=False).click()

        # 5. Verify Case Study Page Content
        expect(page).to_have_url("http://localhost:5174/casestudys/32reasons")
        time.sleep(2) # Wait for page load and animations

        # Check for title
        # "Longevity & Design: Die Zukunft der Zahnmedizin bei 32reasons" or English equivalent
        # "Longevity & Design" should be common enough.
        expect(page.get_by_role("heading", name="Longevity & Design")).to_be_visible()

        # Check for "Philosophy" section
        # Since headless might default to English, we should check for English text too if German fails,
        # or just check for something generic that exists in both or is present in the DOM.
        # English title: "The Philosophy: Systemic Health"
        # German title: "Die Philosophie: Systemische Gesundheit"

        # We can just check for "Philosophy" or "Philosophie"
        expect(page.get_by_role("heading", name="Philosoph", exact=False)).to_be_visible()

        page.screenshot(path="verification/casestudy_page.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    verify_case_study()
