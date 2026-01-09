import asyncio
from playwright.async_api import async_playwright, expect

async def verify_navigation_a11y():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Go to home page
        await page.goto("http://localhost:3000/")

        # Wait for hydration
        await page.wait_for_timeout(1000)

        # Verify aria-current on "Portfolio" link (which is active on /)
        # Use exact=True to avoid matching "View Full Portfolio"
        # And ensure we are picking the one in the main navigation (nav element)
        nav = page.locator("nav")
        portfolio_link = nav.get_by_role("link", name="Portfolio", exact=True).first
        await expect(portfolio_link).to_have_attribute("aria-current", "page")

        # Verify other links do NOT have aria-current
        services_link = nav.get_by_role("link", name="Services", exact=True).first
        await expect(services_link).not_to_have_attribute("aria-current", "page")

        print("✅ aria-current verification passed for Desktop")

        # Verify Mobile Menu
        # Set viewport to mobile
        await page.set_viewport_size({"width": 375, "height": 667})

        # Open mobile menu
        menu_button = page.get_by_label("Open main menu")
        await menu_button.click()

        # Wait for menu to appear
        await page.wait_for_timeout(500)

        # Check for dialog role on the overlay container
        # We need to find the container. The container has aria-label="Mobile navigation"
        mobile_menu = page.get_by_label("Mobile navigation")

        await expect(mobile_menu).to_be_visible()
        await expect(mobile_menu).to_have_attribute("role", "dialog")
        await expect(mobile_menu).to_have_attribute("aria-modal", "true")

        print("✅ Mobile Menu accessible attributes verification passed")

        # Take a screenshot of the mobile menu
        await page.screenshot(path="verification/mobile_menu_a11y.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify_navigation_a11y())
