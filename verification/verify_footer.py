
from playwright.sync_api import sync_playwright

def verify_footer():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        # Wait for dev server to start
        page.goto("http://localhost:3000", timeout=60000)

        # Scroll to footer
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")

        # Take screenshot of footer
        # We target the footer element
        footer = page.locator("footer")
        footer.wait_for()
        footer.screenshot(path="verification/footer_initial.png")
        print("Screenshot saved to verification/footer_initial.png")

        browser.close()

if __name__ == "__main__":
    verify_footer()
