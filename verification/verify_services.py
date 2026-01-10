
from playwright.sync_api import sync_playwright

def verify_services_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to Services page using hash router
        print("Navigating to Services page...")
        page.goto("http://localhost:3000/#/services")

        # Wait for the comparison table to be visible
        # We look for "Compare Tiers" heading which is near the table
        print("Waiting for 'Compare Tiers' heading...")
        page.wait_for_selector("text=Compare Tiers", timeout=30000)

        # Check if the static data we optimized is actually rendered
        # We check for the first row's content
        print("Verifying table content...")
        page.wait_for_selector("text=Photo Resolution")
        page.wait_for_selector("text=Ultra High Res (42MP+)")

        # Take a screenshot
        print("Taking screenshot...")
        page.screenshot(path="verification/services_verification.png", full_page=True)

        browser.close()
        print("Verification complete.")

if __name__ == "__main__":
    verify_services_page()
