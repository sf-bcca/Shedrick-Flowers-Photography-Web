from playwright.sync_api import sync_playwright, expect

def verify_book_now_link():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use a larger viewport to ensure "Book Now" is visible if it was responsive (though it seems static)
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        try:
            # Navigate to the services page
            # Note: Using hash router
            page.goto("http://localhost:3000/#/services")

            # Wait for content to load
            page.wait_for_selector("text=Select Your Session")

            # Look for the new "Book Now" link
            # We look for a link with text "Book Now"
            # We don't check the specific label because the data might be from cache or DB and not the fallback I expected.

            # Check the first link
            book_link = page.locator("a", has_text="Book Now").first

            # Verify it is visible
            expect(book_link).to_be_visible()

            # Verify the href is correct
            expect(book_link).to_have_attribute("href", "#/contact")

            # Verify it HAS an aria-label (any value is better than none)
            label = book_link.get_attribute("aria-label")
            print(f"Found aria-label: {label}")
            if not label or not label.startswith("Book "):
                 raise Exception(f"Invalid aria-label: {label}")

            print("Verified 'Book Now' link exists with correct attributes.")

            # Take a screenshot of the services grid
            # Scroll to the grid
            page.locator("text=Select Your Session").scroll_into_view_if_needed()
            page.screenshot(path=".jules/verification/verification.png")

        except Exception as e:
            print(f"Verification failed: {e}")
            # Take error screenshot
            page.screenshot(path=".jules/verification/error.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_book_now_link()
