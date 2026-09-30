import type { RoadmapLink } from "../types";

const learnEnglish = "https://learnenglish.britishcouncil.org/free-resources";

/** British Council LearnEnglish grammar lesson, e.g. `bcGrammar("Present simple", "a1-a2/present-simple")`. */
export function bcGrammar(topic: string, path: string): RoadmapLink {
  return { label: `British Council: ${topic}`, href: `${learnEnglish}/grammar/${path}` };
}

export function bcSkill(skill: "listening" | "reading" | "writing" | "speaking", level: "a1" | "a2" | "b1" | "b2"): RoadmapLink {
  const names = { listening: "аудіювання", reading: "читання", writing: "письмо", speaking: "говоріння" } as const;
  return { label: `British Council: ${names[skill]} ${level.toUpperCase()}`, href: `${learnEnglish}/${skill}/${level}` };
}

/** Pages of this site. */
export const SITE = {
  dictionaryA1: { label: "Словник A1", href: "/levels/A1" },
  dictionaryA2: { label: "Словник A2", href: "/levels/A2" },
  dictionaryB1: { label: "Словник B1", href: "/levels/B1" },
  irregularVerbs: { label: "Неправильні дієслова", href: "/irregular-verbs" },
  reading: { label: "Читання з озвученням", href: "/reading" },
  flashcards: { label: "Флеш-картки", href: "/practice/flashcards" },
  review: { label: "Повторення Leitner", href: "/practice/review" },
  tests: { label: "Міні-тести", href: "/practice/tests" },
} satisfies Record<string, RoadmapLink>;

/** External resources used in several stages. */
export const EXTERNAL = {
  cambridgeDictionary: { label: "Cambridge Dictionary (EN–UA)", href: "https://dictionary.cambridge.org/dictionary/english-ukrainian/" },
  phonemicChart: { label: "Interactive Phonemic Chart", href: "https://www.onestopenglish.com/interactive-phonemic-chart-british-english/156649.article" },
  bbcPronunciation: { label: "BBC: Pronunciation", href: "https://www.bbc.co.uk/learningenglish/english/features/pronunciation" },
  bbcLearningEnglish: { label: "BBC Learning English", href: "https://www.bbc.co.uk/learningenglish/" },
  bbcYoutube: { label: "BBC Learning English (YouTube)", href: "https://www.youtube.com/@bbclearningenglish" },
  sixMinuteEnglish: { label: "BBC: 6 Minute English", href: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english" },
  englishWeSpeak: { label: "BBC: The English We Speak", href: "https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak" },
  efset: { label: "EF SET — тест рівня", href: "https://www.efset.org/" },
  cambridgeTest: { label: "Cambridge: Test your English", href: "https://www.cambridgeenglish.org/test-your-english/" },
  keyPreparation: { label: "A2 Key: зразки завдань", href: "https://www.cambridgeenglish.org/exams-and-tests/qualifications/key/preparation/" },
  preliminaryPreparation: { label: "B1 Preliminary: зразки завдань", href: "https://www.cambridgeenglish.org/exams-and-tests/qualifications/preliminary/preparation/" },
  firstPreparation: { label: "B2 First: зразки завдань", href: "https://www.cambridgeenglish.org/exams-and-tests/qualifications/first/preparation/" },
  newsInLevels: { label: "News in Levels", href: "https://www.newsinlevels.com/" },
  breakingNewsEnglish: { label: "Breaking News English", href: "https://breakingnewsenglish.com/" },
  writeAndImprove: { label: "Write & Improve (Cambridge)", href: "https://writeandimprove.com/" },
  anki: { label: "Anki", href: "https://apps.ankiweb.net/" },
  oxfordWordlists: { label: "Oxford 3000 і 5000", href: "https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000" },
  youglish: { label: "YouGlish", href: "https://youglish.com/" },
  tedEd: { label: "TED-Ed", href: "https://ed.ted.com/" },
  tedTalks: { label: "TED Talks", href: "https://www.ted.com/talks" },
  lyricsTraining: { label: "LyricsTraining", href: "https://lyricstraining.com/" },
  tvSeries: { label: "Learn English With TV Series", href: "https://www.youtube.com/@LearnEnglishWithTVSeries" },
  englishWithLucy: { label: "English with Lucy (британська)", href: "https://www.youtube.com/@EnglishwithLucy" },
  rachelsEnglish: { label: "Rachel’s English (американська)", href: "https://www.youtube.com/@rachelsenglish" },
  lukesPodcast: { label: "Luke’s English Podcast", href: "https://teacherluke.co.uk/" },
  allEarsEnglish: { label: "All Ears English", href: "https://www.allearsenglish.com/" },
  italki: { label: "italki — викладачі", href: "https://www.italki.com/" },
  tandem: { label: "Tandem — мовний обмін", href: "https://www.tandem.net/" },
} satisfies Record<string, RoadmapLink>;
