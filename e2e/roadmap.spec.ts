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

test("module links open their level on load and after an in-page hash change", async ({ page }) => {
  await page.goto("/roadmap/#module-a2-grammar");
  await expect(page.locator("[data-hydrated]")).toHaveAttribute("data-hydrated", "true");
  await expect(page.getByRole("button", { name: /A2 · Елементарний/ })).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#module-a2-grammar")).toBeInViewport();

  await page.evaluate(() => {
    window.location.hash = "#module-b1-writing";
  });
  await expect(page.getByRole("button", { name: /B1 · Середній/ })).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#module-b1-writing")).toBeInViewport();
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

test("a task opens an AI assistant with a detailed study prompt", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  // Never hit the real services from tests.
  await context.route(/^https:\/\/(chatgpt\.com|claude\.ai|gemini\.google\.com|www\.perplexity\.ai|copilot\.microsoft\.com|grok\.com)\//, (route) =>
    route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>AI stub</title>" }),
  );
  await openRoadmap(page);

  const task = page.locator("#task-start-setup-goal");
  const trigger = task.getByRole("button", { name: `Вивчити з ШІ: ${FIRST_TASK}` });
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();

  await trigger.click();
  const chatgpt = task.getByRole("link", { name: /ChatGPT/ });
  const prompt = new URL((await chatgpt.getAttribute("href")) ?? "").searchParams.get("q");
  expect(prompt).toContain(`Пункт: ${FIRST_TASK}.`);
  expect(prompt).toContain("Мій рівень: Pre-A1");
  await expect(task.getByRole("link", { name: /Gemini/ })).toHaveAttribute("href", "https://gemini.google.com/app");

  const popupPromise = context.waitForEvent("page");
  await chatgpt.click();
  const popup = await popupPromise;
  await expect(popup).toHaveURL(/^https:\/\/chatgpt\.com\/\?q=/);
  await popup.close();

  await page.bringToFront();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(prompt);
});

test("the AI prompt can be copied and reviewed", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await openRoadmap(page);

  const task = page.locator("#task-start-phrases-greetings");
  await task.getByRole("button", { name: /Вивчити з ШІ/ }).click();
  await task.getByRole("button", { name: "Скопіювати запит" }).click();
  await expect(task.getByRole("button", { name: "Запит скопійовано" })).toBeVisible();

  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("Пункт: Привітання й знайомство.");
  expect(copied).toContain("Приклади з плану: Hi! My name is Olena.");

  await task.getByText("Переглянути запит").click();
  await expect(task.locator("pre")).toContainText("Пункт: Привітання й знайомство.");
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
