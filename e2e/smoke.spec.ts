import { expect, test } from "@playwright/test";

test("theme switching persists across reloads", async ({ page }) => {
  await page.goto("/");

  const toggle = page.locator("button[aria-label^='Перемкнути на']:visible");
  await expect(toggle).toHaveCount(1);
  await expect(toggle).toHaveAttribute("data-theme-ready", "true");
  const initialTheme = await page.locator("html").getAttribute("data-theme");

  await toggle.click();
  const changedTheme = initialTheme === "dark" ? "light" : "dark";
  await expect(page.locator("html")).toHaveAttribute("data-theme", changedTheme);
  await expect(page.locator("html")).toHaveClass(changedTheme === "dark" ? /dark/ : /^(?!.*\bdark\b)/);

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", changedTheme);
});

test("reading trainer parses and restores user text", async ({ page }) => {
  await page.goto("/reading/");
  await expect(page.getByRole("heading", { name: "Читання з правильною вимовою" })).toBeVisible();

  const textarea = page.getByLabel("Англійський текст");
  await expect(textarea).toHaveAttribute("data-hydrated", "true");
  await textarea.fill("Hello world.\n\nHow are you?");
  await expect(page.getByText("5 слів", { exact: true })).toBeVisible();
  await expect(page.getByText("Hello", { exact: true })).toBeVisible();
  await expect(page.getByText("How", { exact: true })).toBeVisible();

  await page.reload();
  await expect(textarea).toHaveValue("Hello world.\n\nHow are you?");

  const firstParagraph = page.locator(".group\\/paragraph").first();
  const sentenceButton = firstParagraph.getByRole("button", { name: "Озвучити речення 1" });
  if (await sentenceButton.count()) {
    await expect(sentenceButton).toHaveCSS("position", "absolute");
  }
});

test("sentence anchor stays on the final line when text wraps", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/reading/");

  const textarea = page.getByLabel("Англійський текст");
  await expect(textarea).toHaveAttribute("data-hydrated", "true");
  await textarea.fill("At the end of the day, Anna thought how small things, like a chair, can make a difference. She did not feel tired or upset but happy to solve the mystery.");

  const firstSentence = page.locator("[data-sentence]").first();
  const anchorPosition = await firstSentence.evaluate((sentence) => {
    const lines = Array.from(sentence.getClientRects());
    const anchor = sentence.querySelector("[data-sentence-end]")?.getBoundingClientRect();
    const finalLine = lines.at(-1);
    return {
      lineCount: lines.length,
      anchorTop: anchor?.top,
      finalLineTop: finalLine?.top,
      finalLineBottom: finalLine?.bottom,
    };
  });

  expect(anchorPosition.lineCount).toBeGreaterThan(1);
  expect(anchorPosition.anchorTop).toBeGreaterThanOrEqual(anchorPosition.finalLineTop ?? 0);
  expect(anchorPosition.anchorTop).toBeLessThanOrEqual(anchorPosition.finalLineBottom ?? 0);
});

test("home to word flow works", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "A1", exact: true }).first().click();
  await expect(page.getByRole("heading", { name: "Словник A1" })).toBeVisible();

  await page.getByPlaceholder("Пошук англійською або українською").fill("apple");
  await page.getByRole("link", { name: /apple/i }).first().click();
  await expect(page.getByRole("heading", { name: "apple" })).toBeVisible();
  await expect(page.getByText("яблуко", { exact: true })).toBeVisible();
});
