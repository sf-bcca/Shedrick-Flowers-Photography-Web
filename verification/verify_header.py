from playwright.sync_api import sync_playwright, expect
import sys

def verify_header_link(page):
    # Wait for localhost to be available - simple retry loop or just rely on page.goto timeout
    try:
        page.goto("http://localhost:3000")
    except Exception as e:
        print(f"Failed to load page: {e}")
        sys.exit(1)

    # Wait for the header to be visible
    page.wait_for_selector("header")

    # Locate the "Book a Session" link
    book_link = page.get_by_role("link", name="Book a Session")

    # Assert it is visible
    expect(book_link).to_be_visible()

    # Check href
    href = book_link.get_attribute("href")
    print(f"Book a Session href: {href}")

    if href == "#/contact":
        print("Verification SUCCESS: Href is correct.")
    else:
        print(f"Verification FAILED: Expected '#/contact', got '{href}'")
        sys.exit(1)

    # Take screenshot of the header
    header = page.locator("header")
    header.screenshot(path="verification/verification.png")


if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_header_link(page)
        except Exception as e:
            print(f"Error: {e}")
            sys.exit(1)
        finally:
            browser.close()
