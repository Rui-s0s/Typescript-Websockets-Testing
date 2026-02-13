import { test, expect } from '@playwright/test';

test.describe('Chat Frontend Logic', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/'); // Uses the baseURL from playwright.config.ts
  });

  test('should display room name in title after joining', async ({ page }) => {
    const roomName = 'TestRoom';
    await page.fill('#username', 'User1');
    await page.fill('#room', roomName);
    await page.click('button:has-text("Join")');

    // Check if the title updates
    const title = page.locator('#room-title');
    await expect(title).toContainText(`Room: ${roomName}`);
  });

  test('should render messages with correct timestamp format and user details', async ({ page }) => {
    await page.fill('#username', 'User1');
    await page.fill('#room', 'MsgRoom');
    await page.click('button:has-text("Join")');

    const testMsg = 'Hello World';
    await page.fill('#msg', testMsg);
    await page.click('button:has-text("Send")');

    // 1. Locate the last message paragraph
    const lastMessage = page.locator('#messages p').last();

    // 2. Check the timestamp format [HH:MM:SS] using a Regex
    // This matches: [ + two digits + : + two digits + : + two digits + ]
    const timestampRegex = /\[\d{2}:\d{2}:\d{2}\]/;
    await expect(lastMessage).toContainText(timestampRegex);

    // 3. Check for Username and Message content
    await expect(lastMessage).toContainText('User1:');
    await expect(lastMessage).toContainText(testMsg);

    // 4. (Optional) Specific check for the timestamp span color
    const timeSpan = lastMessage.locator('span');
    await expect(timeSpan).toHaveCSS('color', 'rgb(102, 102, 102)'); // This is #666
  });

  test('should increase user count when others join', async ({ page, browser }) => {
    // 1. Join with the first user
    await page.fill('#username', 'PrimaryUser');
    await page.fill('#room', 'CountRoom');
    await page.click('button:has-text("Join")');
    
    const countElement = page.locator('#user-count');
    // It might start at 1 or whatever your logic says
    
    // 2. Open a second "Incognito" context to simulate another person
    const secondContext = await browser.newContext();
    const secondPage = await secondContext.newPage();
    await secondPage.goto('/');
    await secondPage.fill('#username', 'SecondUser');
    await secondPage.fill('#room', 'CountRoom');
    await secondPage.click('button:has-text("Join")');

    // 3. Verify the count increases on the FIRST page
    await expect(countElement).toContainText('Count: 2');

    await secondContext.close();
  });
});