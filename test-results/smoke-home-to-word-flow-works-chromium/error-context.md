# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: smoke.spec.ts >> home to word flow works
- Location: e2e\smoke.spec.ts:3:5

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('html')
Expected: "light"
Received: "system"
Timeout:  5000ms

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for locator('html')
    14 × locator resolved to <html lang="uk" data-theme="light" data-theme-preference="system" class="geist_a71539c9-module__T19VSG__variable geist_mono_8d43a2aa-module__8Li5zG__variable h-full antialiased">…</html>
       - unexpected value "system"

```

```yaml
- document:
  - banner
  - main
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("home to word flow works", async ({ page }) => {
  4  |   await page.goto("/");
  5  |   await expect(page.getByRole("heading", { name: /Самостійне вивчення англійської/ })).toBeVisible();
  6  |   await expect(page.locator("html")).toHaveAttribute("data-theme-preference", "system");
  7  | 
  8  |   await page.getByRole("radio", { name: "Світла тема" }).click();
> 9  |   await expect(page.locator("html")).toHaveAttribute("data-theme-preference", "light");
     |                                      ^ Error: expect(locator).toHaveAttribute(expected) failed
  10 |   await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  11 | 
  12 |   await page.reload();
  13 |   await expect(page.locator("html")).toHaveAttribute("data-theme-preference", "light");
  14 | 
  15 |   await page.getByRole("radio", { name: "Темна тема" }).click();
  16 |   await expect(page.locator("html")).toHaveAttribute("data-theme-preference", "dark");
  17 | 
  18 |   await page.getByRole("link", { name: "A1" }).first().click();
  19 |   await expect(page.getByRole("heading", { name: "Словник A1" })).toBeVisible();
  20 | 
  21 |   await page.getByPlaceholder("Пошук англійською або українською").fill("apple");
  22 |   await page.getByRole("link", { name: /apple/i }).first().click();
  23 |   await expect(page.getByRole("heading", { name: "apple" })).toBeVisible();
  24 |   await expect(page.getByText("яблуко", { exact: true })).toBeVisible();
  25 | });
  26 | 
```