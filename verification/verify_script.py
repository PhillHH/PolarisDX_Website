from playwright.sync_api import sync_playwright

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        # Mobile Context (iPhone 12/13) - German Locale
        context_mobile = browser.new_context(viewport={"width": 390, "height": 844}, locale="de-DE")
        page_mobile = context_mobile.new_page()

        print("Navigating to home page (Mobile)...")
        page_mobile.goto("http://localhost:5173/")
        page_mobile.wait_for_load_state("networkidle")

        print("Verifying Mobile Call Button...")
        # Check if button exists
        call_btn_container = page_mobile.locator('.fixed.right-4.top-24')
        call_btn = call_btn_container.locator('button')
        call_btn.click()

        # Verify text "Rufen Sie uns an" is visible
        page_mobile.wait_for_selector('text="Rufen Sie uns an"')
        print("Call button text 'Rufen Sie uns an' is visible.")

        # Screenshot Mobile Top
        page_mobile.screenshot(path="verification/mobile_top_de.png")
        print("Saved verification/mobile_top_de.png")

        print("Verifying Hero Stats (Mobile)...")
        # Check if stats container has flex-row
        # In HeroSection.tsx, we added a wrapper div with flex-row around stats.
        # But wait, the stats are StatItem.
        # Structure: div.flex.flex-col.gap-3 > div.flex.flex-row.items-start.gap-6
        # We can look for "48h" and check its parent's parent or similar.
        stat_48h = page_mobile.get_by_text("48h")
        # The parent of the stat item should be the flex container? No, stat item is div.
        # The container of the two StatItems is the one we want to check.
        # Let's rely on screenshot for layout.

        print("Verifying Testimonials Stats (Mobile)...")
        testimonials_section = page_mobile.locator('#testimonials')
        testimonials_section.scroll_into_view_if_needed()
        page_mobile.wait_for_timeout(500)

        # Verify the container of "4.9" is flex-row
        # In TestimonialsSection, we changed:
        # <div className="flex flex-row justify-center gap-10 text-center md:gap-16">
        # It was flex-col on mobile before. Now it is flex-row.
        # We can check if the container has class 'flex-row'
        stats_container = page_mobile.locator('text="4.9"').locator('..').locator('..').locator('..')
        # The structure is: div.flex.flex-row... > div > div > span(4.9)
        # So up 3 levels?
        # Actually, let's just check if 4.9 and 99% are roughly on the same Y coordinate?
        # Or check the class of the parent.
        # Let's inspect the element with Playwright locator logic is tricky without ID.
        # Screenshot is best.
        page_mobile.screenshot(path="verification/mobile_testimonials_de.png")
        print("Saved verification/mobile_testimonials_de.png")

        # Desktop Context - German Locale
        context_desktop = browser.new_context(viewport={"width": 1280, "height": 800}, locale="de-DE")
        page_desktop = context_desktop.new_page()
        print("Navigating to home page (Desktop)...")
        page_desktop.goto("http://localhost:5173/")
        page_desktop.wait_for_load_state("networkidle")

        # Verify Gap between About and Igloo
        print("Verifying Gap...")
        # Now with de-DE, "Exzellenz und Sicherheit" should be visible
        excellence_text = page_desktop.get_by_text("Exzellenz und Sicherheit")
        excellence_text.scroll_into_view_if_needed()
        page_desktop.wait_for_timeout(500)
        page_desktop.screenshot(path="verification/desktop_gap_de.png")
        print("Saved verification/desktop_gap_de.png")

        # Verify Footer Gap
        print("Verifying Footer Gap...")
        footer = page_desktop.locator('footer')
        footer.scroll_into_view_if_needed()
        page_desktop.wait_for_timeout(500)
        page_desktop.screenshot(path="verification/desktop_footer_de.png")
        print("Saved verification/desktop_footer_de.png")

        browser.close()

if __name__ == "__main__":
    verify_changes()
