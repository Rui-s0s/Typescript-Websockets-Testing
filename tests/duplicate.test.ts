import { test, expect } from '@playwright/test';
import { exec } from 'child_process';

test.setTimeout(120000);

function runArtillery () {
  return new Promise((resolve, reject) => {
    exec('artillery run chat-load-test.yml', (err, stdout, stderr) => {
      if (err) reject(err)
      else resolve(stdout)
    })
  })
}


test('messages are not duplicated or corrupted after Artillery', async ({ page }) => {
  const seen = new Set<string>();
  const duplicates: string[] = [];

  await page.goto('http://localhost:4000');

  // Fill login form
  await page.fill('#username', 'pw-checker');
  await page.fill('#room', 'roomLoad');
  await page.click('#login button'); // click Join

  // Wait for chat UI to appear
  await page.waitForSelector('#chat', { state: 'visible', timeout: 10000 });

  // Wait a short moment to ensure messages rendered
  await page.waitForTimeout(1000);

  await page.click('button:has-text("Send")');

  await runArtillery()

  // Grab all messages
  const messages = await page.evaluate(() => {
    const container = document.querySelector('#messages');
    if (!container) return [];

    return [...container.querySelectorAll('p')]
      .filter(p => (p as HTMLElement).dataset.id)
      .map(p => ({
        id: (p as HTMLElement).dataset.id,
        text: p.textContent || ''
      }));
  });

  for (const msg of messages) {
    expect(msg.id, 'Missing message ID').not.toBeNull();

    if (seen.has(msg.id!)) {
      duplicates.push(msg.id!);
    } else {
      seen.add(msg.id!);
    }

    expect(msg.text.length).toBeGreaterThan(0);
    expect(msg.text).not.toContain('undefined');
    expect(msg.text).not.toContain('[object Object]');
  }

  expect(duplicates, `Duplicate messages detected: ${duplicates}`).toEqual([]);
});
