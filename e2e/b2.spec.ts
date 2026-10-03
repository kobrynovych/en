import { expect, test } from "@playwright/test";

test("B2 dictionary opens from the home page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Рівень.*B2/ }).click();
  // The B2 page renders 2 777 words, so give a busy dev server time to compile and stream it.
  await expect(page.getByRole("heading", { name: "Словник B2" })).toBeVisible({ timeout: 30_000 });
});

test("B2 word page shows the curated translation and examples", async ({ page }) => {
  await page.goto("/words/outbreak-noun/");
  await expect(page.getByRole("heading", { name: "outbreak" })).toBeVisible();
  await expect(page.getByText("спалах (хвороби, війни)", { exact: true })).toBeVisible();
  await expect(page.getByText("There was an outbreak of flu at school.")).toBeVisible();
});

test("irregular verbs can be filtered to B2", async ({ page }) => {
  await page.goto("/irregular-verbs/");
  const b2 = page.getByRole("button", { name: "B2", exact: true });
  await b2.click();
  await expect(b2).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Показано 35 дієслів")).toBeVisible();
  await expect(page.getByText("withdraw", { exact: true })).toBeVisible();
  await expect(page.getByText("went", { exact: true })).toHaveCount(0);
});
