
from playwright.sync_api import sync_playwright

def verify_portfolio_manager():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(color_scheme='light')
        page = context.new_page()

        page.goto("http://localhost:3000/#/test-portfolio")

        # Force remove 'dark' class to ensure Light Mode
        page.evaluate("document.documentElement.classList.remove('dark')")

        # Wait for the "Add New Item" button to appear
        page.wait_for_selector("text=Add New Item")

        # Click "Add New Item" to open the modal
        page.click("text=Add New Item")

        # Wait for modal to appear
        page.wait_for_selector("text=New Portfolio Item")

        # Ensure dark mode is still off (sometimes re-renders might add it back)
        page.evaluate("document.documentElement.classList.remove('dark')")

        # Hover over the close button to verify hover state
        # The close button has aria-label="Close modal"
        page.hover("button[aria-label='Close modal']")

        page.screenshot(path="verification/portfolio_modal_light_mode_forced.png")

        browser.close()

if __name__ == "__main__":
    verify_portfolio_manager()
