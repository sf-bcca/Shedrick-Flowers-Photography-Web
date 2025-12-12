
from playwright.sync_api import sync_playwright
import time

def verify_admin_dashboard():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # 1. Login (Using HashRouter syntax)
        print("Navigating to login...")
        page.goto("http://localhost:3000/#/login", timeout=60000)

        # Wait for input to appear
        print("Waiting for inputs...")
        try:
            page.wait_for_selector("input[type='email']", timeout=30000)
        except:
             print("Timeout waiting for email input. Dumping page content...")
             # print(page.content())
             page.screenshot(path="verification/error_login_timeout.png")
             browser.close()
             return


        page.fill("input[type='email']", "admin@lensandlight.com")
        page.fill("input[type='password']", "admin")

        # Screenshot Login Page (to verify Google Button)
        print("Taking Login screenshot...")
        page.screenshot(path="verification/0_login.png")

        page.click("button[type='submit']")

        # Wait for navigation to dashboard (HashRouter)
        print("Waiting for dashboard...")
        page.wait_for_url("**/#/admin", timeout=60000)
        time.sleep(5)

        # Screenshot Dashboard
        print("Taking Dashboard screenshot...")
        page.screenshot(path="verification/1_dashboard.png")

        # 2. Navigate to Media Library
        print("Navigating to Media Library...")
        page.goto("http://localhost:3000/#/admin/media")
        time.sleep(3)
        page.screenshot(path="verification/2_media.png")

        # 3. Navigate to Blog Manager
        print("Navigating to Blog Manager...")
        page.goto("http://localhost:3000/#/admin/blog")
        time.sleep(3)

        # Click "New Post"
        print("Opening Editor...")
        page.click("text=New Post")
        time.sleep(2)
        page.screenshot(path="verification/3_blog_editor.png")

        # 4. Comments
        print("Navigating to Comments...")
        page.goto("http://localhost:3000/#/admin/comments")
        time.sleep(3)
        page.screenshot(path="verification/4_comments.png")

        # 5. Settings
        print("Navigating to Settings...")
        page.goto("http://localhost:3000/#/admin/settings")
        time.sleep(3)
        page.screenshot(path="verification/5_settings.png")

        browser.close()

if __name__ == "__main__":
    verify_admin_dashboard()
