import { expect, test, type Page } from "@playwright/test";

type SpeechHistoryEntry = {
  lang: string;
  rate: number;
  text: string;
};

type SpeechMockState = {
  paused: boolean;
  pending: number;
  speaking: boolean;
};

async function installSpeechMock(page: Page) {
  await page.addInitScript(() => {
    class TestUtterance {
      lang = "";
      rate = 1;
      onstart: ((event: Event) => void) | null = null;
      onpause: ((event: Event) => void) | null = null;
      onresume: ((event: Event) => void) | null = null;
      onboundary: ((event: { charIndex: number; charLength: number; name: string }) => void) | null = null;
      onend: ((event: Event) => void) | null = null;
      onerror: ((event: Event) => void) | null = null;

      constructor(public text: string) {}
    }

    const pending: TestUtterance[] = [];
    const history: TestUtterance[] = [];
    let active: TestUtterance | null = null;
    let startScheduled = false;

    const scheduleStart = () => {
      if (startScheduled || active || synthesis.paused || pending.length === 0) return;
      startScheduled = true;
      queueMicrotask(() => {
        startScheduled = false;
        if (active || synthesis.paused || pending.length === 0) return;
        active = pending.shift() ?? null;
        if (!active) return;
        synthesis.speaking = true;
        active.onstart?.(new Event("start"));
      });
    };

    const synthesis = {
      speaking: false,
      paused: false,
      get pending() {
        return pending.length > 0;
      },
      cancel: () => {
        pending.splice(0);
        active = null;
        synthesis.speaking = false;
        // Web Speech keeps the global paused state after cancel().
      },
      pause: () => {
        if (synthesis.paused) return;
        synthesis.paused = true;
        const pausedUtterance = active;
        queueMicrotask(() => pausedUtterance?.onpause?.(new Event("pause")));
      },
      resume: () => {
        const wasPaused = synthesis.paused;
        synthesis.paused = false;
        if (active && wasPaused) {
          const resumedUtterance = active;
          queueMicrotask(() => resumedUtterance.onresume?.(new Event("resume")));
          return;
        }
        scheduleStart();
      },
      speak: (utterance: TestUtterance) => {
        pending.push(utterance);
        history.push(utterance);
        scheduleStart();
      },
    };

    const speechTest = {
      boundary: (charIndex: number, charLength = 0, name = "word") => {
        const boundaryUtterance = active;
        queueMicrotask(() => boundaryUtterance?.onboundary?.({ charIndex, charLength, name }));
      },
      end: () => {
        const finished = active;
        if (!finished) return;
        queueMicrotask(() => {
          if (active === finished) {
            active = null;
            synthesis.speaking = false;
          }
          finished.onend?.(new Event("end"));
          scheduleStart();
        });
      },
      utteranceEvent: (
        utteranceIndex: number,
        type: "start" | "pause" | "resume" | "boundary" | "end" | "error",
        charIndex = 0,
        charLength = 0,
        name = "word",
      ) => {
        const utterance = history[utteranceIndex];
        if (!utterance) return;
        queueMicrotask(() => {
          if (type === "start") utterance.onstart?.(new Event("start"));
          else if (type === "pause") utterance.onpause?.(new Event("pause"));
          else if (type === "resume") utterance.onresume?.(new Event("resume"));
          else if (type === "boundary") utterance.onboundary?.({ charIndex, charLength, name });
          else if (type === "end") utterance.onend?.(new Event("end"));
          else utterance.onerror?.(new Event("error"));
        });
      },
      history: () => history.map(({ lang, rate, text }) => ({ lang, rate, text })),
      state: () => ({
        paused: synthesis.paused,
        pending: pending.length,
        speaking: synthesis.speaking,
      }),
    };

    Object.defineProperty(window, "SpeechSynthesisUtterance", { configurable: true, value: TestUtterance });
    Object.defineProperty(window, "speechSynthesis", { configurable: true, value: synthesis });
    Object.defineProperty(window, "speechTest", { configurable: true, value: speechTest });
  });
}

function speechDriver(page: Page) {
  return {
    boundary: (charIndex: number, charLength = 0, name = "word") => page.evaluate(
      ({ index, length, boundaryName }) => {
        (window as unknown as {
          speechTest: { boundary: (charIndex: number, charLength: number, name: string) => void };
        }).speechTest.boundary(index, length, boundaryName);
      },
      { index: charIndex, length: charLength, boundaryName: name },
    ),
    end: () => page.evaluate(() => {
      (window as unknown as { speechTest: { end: () => void } }).speechTest.end();
    }),
    history: () => page.evaluate(() => (
      window as unknown as { speechTest: { history: () => SpeechHistoryEntry[] } }
    ).speechTest.history()),
    state: () => page.evaluate(() => (
      window as unknown as { speechTest: { state: () => SpeechMockState } }
    ).speechTest.state()),
  };
}

test.beforeEach(async ({ page }) => {
  await installSpeechMock(page);
});

test("reading queues whole sentences and keeps highlighting synchronized", async ({ page }) => {
  await page.goto("/reading/");
  const textarea = page.getByLabel("Англійський текст");
  await expect(textarea).toHaveAttribute("data-hydrated", "true");
  await textarea.fill("One two three.\n\nFour five.");

  const documentHeightBefore = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.getByRole("button", { name: "Озвучити весь текст" }).click();

  const speech = speechDriver(page);
  await expect.poll(() => speech.history()).toEqual([
    { lang: "en-US", rate: 0.75, text: "One two three." },
    { lang: "en-US", rate: 0.75, text: "Four five." },
  ]);

  const controls = page.getByRole("status");
  await expect(controls).toContainText("Текст читається");
  await expect(controls).toHaveCSS("position", "fixed");
  expect(await controls.evaluate((node) => node.parentElement === document.body)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(documentHeightBefore);

  const activeSentence = page.locator('[data-sentence][data-active="true"]');
  const activeWord = page.locator('[data-word-id][data-active="true"]');
  await expect(activeSentence).toHaveCount(1);
  await expect(activeSentence).toContainText("One two three.");
  await expect(activeWord).toHaveCount(0);

  await speech.boundary(0);
  await expect(activeSentence).toHaveCount(1);
  await expect(activeWord).toHaveCount(0);

  await speech.boundary(4);
  await expect(activeSentence).toHaveCount(0);
  await expect(activeWord).toHaveText("two");

  await page.getByRole("button", { name: "Призупинити читання" }).click();
  await expect(controls).toContainText("Читання призупинено");
  await speech.boundary(8);
  await expect(activeWord).toHaveText("two");

  await page.getByRole("button", { name: "Продовжити читання" }).click();
  await expect(controls).toContainText("Текст читається");
  await speech.boundary(8);
  await expect(activeWord).toHaveText("three");

  await speech.end();
  await expect(activeSentence).toHaveCount(1);
  await expect(activeSentence).toContainText("Four five.");

  await speech.boundary(0, 4);
  await expect(activeSentence).toHaveCount(0);
  await expect(activeWord).toHaveText("Four");
});

test("stop resets a paused engine and editing cancels the active snapshot", async ({ page }) => {
  await page.goto("/reading/");
  const textarea = page.getByLabel("Англійський текст");
  await expect(textarea).toHaveAttribute("data-hydrated", "true");
  await textarea.fill("One two. Three four.");

  const play = page.getByRole("button", { name: "Озвучити весь текст" });
  const controls = page.getByRole("status");
  const speech = speechDriver(page);

  await play.click();
  await expect(controls).toContainText("Текст читається");
  await page.getByRole("button", { name: "Призупинити читання" }).click();
  await expect(controls).toContainText("Читання призупинено");

  await page.getByRole("button", { name: "Зупинити читання" }).click();
  await expect(controls).toHaveCount(0);
  await expect.poll(() => speech.state()).toEqual({ paused: false, pending: 0, speaking: false });

  await play.click();
  await expect(controls).toContainText("Текст читається");

  await textarea.fill("A changed text.");
  await expect(controls).toHaveCount(0);
  await expect(page.locator("[data-active='true']")).toHaveCount(0);
  await expect.poll(() => speech.state()).toEqual({ paused: false, pending: 0, speaking: false });
});
