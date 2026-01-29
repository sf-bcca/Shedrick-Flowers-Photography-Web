import os
from playwright.sync_api import sync_playwright, expect

def verify_char_count():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        print("Navigating to Contact page...")
        page.goto("http://localhost:3000/#/contact")

        # Wait for page content
        page.wait_for_selector("text=Let's Create Together")

        print("Finding textarea...")
        # Since the label text is "Your Vision", and textarea is nested
        textarea = page.get_by_label("Your Vision")
        expect(textarea).to_be_visible()

        print("Checking initial count...")
        # We expect "0/2000" to be visible
        initial_count = page.get_by_text("0/2000")
        expect(initial_count).to_be_visible()
        print("Initial count 0/2000 verified.")

        print("Typing text...")
        textarea.fill("Hello World")

        print("Checking updated count...")
        # "Hello World" is 11 chars
        updated_count = page.get_by_text("11/2000")
        expect(updated_count).to_be_visible()
        print("Updated count 11/2000 verified.")

        # Take screenshot of the form area
        # We can locate the form or just the whole page
        page.screenshot(path="verification/contact_char_count.png")
        print("Screenshot saved to verification/contact_char_count.png")

        browser.close()

if __name__ == "__main__":
    verify_char_count()
