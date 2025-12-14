import asyncio
from playwright.async_api import async_playwright
import json
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Mock the Supabase response for testimonials
        async def handle_testimonials_route(route):
            response_data = [
                {
                    "id": "1",
                    "client_name": "Test Client",
                    "quote": "This is a test testimonial.",
                    "rating": 5,
                    "image_url": "https://via.placeholder.com/150",
                    "display_order": 1,
                    "subtitle": "Test Subtitle"
                }
            ]

            await route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps(response_data)
            )

        # Intercept the specific Supabase REST endpoint
        await page.route("**/rest/v1/testimonials*", handle_testimonials_route)

        print("Navigating to About page...")
        # Use HashRouter syntax and port 3004 (assuming server is still running)
        await page.goto("http://localhost:3004/#/about")

        print("Waiting for network requests...")
        await page.wait_for_timeout(3000)

        # Verify content
        try:
            # Check for the header "Latest Words"
            header = page.get_by_text("Latest Words")
            await header.wait_for(state="visible", timeout=5000)

            # Check for the mocked testimonial content
            client = page.get_by_text("Test Client")
            await client.wait_for(state="visible", timeout=2000)

            # Screenshot for debugging
            screenshot_path = "/home/jules/verification/about_page_final.png"
            await page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")

            print("SUCCESS: Testimonials verification passed.")

        except Exception as e:
            print(f"FAILURE: Verification failed. {e}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
