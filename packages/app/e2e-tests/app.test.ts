import { test, expect } from '@playwright/test';

test('App should render the welcome page', async ({ page }) => {
  await page.goto('/');

  const enterButton = page.getByRole('button', { name: 'Enter' });
  await expect(enterButton).toBeVisible();
  await enterButton.click();

  await expect(page.getByText('S3 Viewer')).toBeVisible();
});
