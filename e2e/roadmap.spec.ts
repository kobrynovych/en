import { expect, test, type Page } from "@playwright/test";

const FIRST_TASK = "Сформулюйте мету й термін";
// Dictionary pages embed thousands of words; the dev server needs a few seconds to compile and stream them.
const DICTIONARY_PAGE = { timeout: 20_000 };

async function openRoadmap(page: Page) {
  await page.goto("/roadmap/");
  await expect(page.getByRole("heading", { level: 1, name: /Дорожня карта англійської/ })).toBeVisible();
  await expect(page.locator("[data-hydrated]")).toHaveAttribute("data-hydrated", "true");
}

test("roadmap checklist progress persists across reloads and can be reset", async ({ page }) => {
  await openRoadmap(page);

  const task = page.getByRole("checkbox", { name: FIRST_TASK });
  await expect(task).not.toBeChecked();
  await task.check();
  await expect(task).toBeChecked();
  await expect(page.locator("#stage-start").getByText(/^1 з \d+ пунктів$/)).toBeVisible();

  await page.reload();
  await expect(page.locator("[data-hydrated]")).toHaveAttribute("data-hydrated", "true");
  await expect(page.getByRole("checkbox", { name: FIRST_TASK })).toBeChecked();

  await page.getByRole("button", { name: "Скинути прогрес" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Скинути", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: FIRST_TASK })).not.toBeChecked();
});

test("continue button focuses the next unfinished task", async ({ page }) => {
  await openRoadmap(page);

  await page.getByRole("checkbox", { name: FIRST_TASK }).check();
  await page.getByRole("button", { name: "Продовжити" }).click();
  await expect(page.getByRole("checkbox", { name: "Заплануйте 30–60 хвилин щодня" })).toBeFocused();
});

test("stage sections expand and collapse", async ({ page }) => {
  await openRoadmap(page);

  const a1 = page.getByRole("button", { name: /A1 · Початковий/ });
  await expect(a1).toHaveAttribute("aria-expanded", "false");
  await a1.click();
  await expect(a1).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("checkbox", { name: "Дієслово to be: am / is / are" })).toBeVisible();

  await a1.click();
  await expect(page.getByRole("checkbox", { name: "Дієслово to be: am / is / are" })).toHaveCount(0);
});

test("site navigation reaches the roadmap", async ({ page, isMobile }) => {
  await page.goto("/");

  if (isMobile) {
    await page.getByRole("button", { name: "Відкрити меню" }).click();
    const menu = page.getByRole("dialog", { name: "Меню" });
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: /Дорожня карта/ }).click();
    await expect(menu).toBeHidden();
  } else {
    await page.getByRole("navigation", { name: "Головна навігація" }).getByRole("link", { name: "Дорожня карта" }).click();
  }

  await expect(page).toHaveURL(/\/roadmap\/?$/);
  await expect(page.getByRole("heading", { level: 1, name: /Дорожня карта англійської/ })).toBeVisible();
});

test("mobile tab bar highlights the current section", async ({ page, isMobile }) => {
  test.skip(!isMobile, "The tab bar is only shown on small screens");
  await page.goto("/roadmap/");

  const tabs = page.getByRole("navigation", { name: "Швидка навігація" });
  await expect(tabs.getByRole("link", { name: "Карта" })).toHaveAttribute("aria-current", "page");
  await tabs.getByRole("link", { name: "Словник" }).click();
  await expect(page).toHaveURL(/\/levels\/A1\/?$/, DICTIONARY_PAGE);
  await expect(tabs.getByRole("link", { name: "Словник" })).toHaveAttribute("aria-current", "page");
});

test("desktop dropdown opens dictionary levels", async ({ page, isMobile }) => {
  test.skip(isMobile, "Dropdowns are part of the desktop header");
  await page.goto("/roadmap/");

  const nav = page.getByRole("navigation", { name: "Головна навігація" });
  const trigger = nav.getByRole("button", { name: "Словник" });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();

  await trigger.click();
  await nav.getByRole("link", { name: /^B1/ }).click();
  await expect(page).toHaveURL(/\/levels\/B1\/?$/, DICTIONARY_PAGE);
  await expect(page.getByRole("heading", { name: "Словник B1" })).toBeVisible();
});
