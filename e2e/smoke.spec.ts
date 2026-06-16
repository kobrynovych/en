import { expect, test } from "@playwright/test";

test("home to word flow works", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Самостійне вивчення англійської/ })).toBeVisible();

  await page.getByRole("link", { name: "A1" }).first().click();
  await expect(page.getByRole("heading", { name: "Словник A1" })).toBeVisible();

  await page.getByPlaceholder("Пошук англійською або українською").fill("apple");
  await page.getByRole("link", { name: /apple/i }).first().click();
  await expect(page.getByRole("heading", { name: "apple" })).toBeVisible();
  await expect(page.getByText("яблуко")).toBeVisible();
});
