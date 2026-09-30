import type { RoadmapStage } from "../types";
import { EXTERNAL, SITE } from "./links";

export const STAGE_START: RoadmapStage = {
  id: "start",
  code: "Pre-A1",
  title: "Старт",
  cefrName: "Нульовий рівень",
  tagline: "Алфавіт, звуки, правила читання й перші фрази",
  summary:
    "Етап для тих, хто починає з нуля. Ви вивчаєте алфавіт і звуки англійської, вчитеся читати слова за правилами й транскрипцією, запам’ятовуєте перші фрази та налаштовуєте щоденну систему навчання. Якщо ви вже читаєте англійською й знаєте базові фрази, пройдіть діагностичний тест і відмітьте знайомі пункти.",
  stageHours: "≈ 20–30 год",
  totalHours: "≈ 20–30 год",
  pace: "3–4 тижні при 1 год на день",
  vocabulary: "≈ 100–150 слів і фраз «виживання»",
  certification: "Діагностичний онлайн-тест, якщо ви починаєте не з абсолютного нуля",
  outcomes: [
    { skill: "interaction", items: ["Вітаєтеся, прощаєтеся, дякуєте й перепрошуєте.", "Кажете, що не зрозуміли, і просите повторити повільніше."] },
    { skill: "production", items: ["Називаєте своє ім’я, вік і країну однією-двома фразами."] },
    { skill: "listening", items: ["Розрізняєте на слух літери алфавіту, числа до 100 і дні тижня."] },
    { skill: "reading", items: ["Читаєте прості слова за правилами читання й транскрипцією."] },
    { skill: "writing", items: ["Пишете без помилок своє ім’я, email і прості знайомі слова."] },
  ],
  functions: ["Привітання й прощання", "Ввічливі фрази", "Прохання повторити", "Числа й спелінг"],
  topics: ["Знайомство", "Числа", "Кольори", "Дні тижня й місяці"],
  pitfalls: [
    {
      wrong: "Wednesday = «ведн-ес-дей»",
      right: "Wednesday /ˈwenzdeɪ/",
      note: "Англійські слова часто читаються не так, як пишуться. Завжди звіряйтеся з транскрипцією та аудіо в словнику.",
    },
    {
      wrong: "west = «вест»",
      right: "west /west/ — губи округлені",
      note: "Звук /w/ — не українське «в»: губи витягнуті трубочкою й не торкаються зубів. Порівняйте west – vest, wine – vine.",
    },
    {
      wrong: "think = «сінк» або «фінк»",
      right: "think /θɪŋk/",
      note: "Для /θ/ і /ð/ кінчик язика легко торкається верхніх зубів. «Сінк» — це вже інше слово, sink (раковина).",
    },
    {
      wrong: "hello з дзвінким «г»",
      right: "hello /həˈləʊ/ — легкий видих",
      note: "Англійський /h/ — глухий видих, без голосу, помітно слабший за українське «г».",
    },
  ],
  modules: [
    {
      id: "start-setup",
      kind: "setup",
      title: "Налаштування навчання",
      intro: "Кілька рішень на старті заощадять місяці: мета, розклад і зручні інструменти.",
      tasks: [
        {
          id: "start-setup-goal",
          title: "Сформулюйте мету й термін",
          details:
            "Навіщо вам англійська: робота, подорожі, іспит, фільми чи переїзд? Запишіть конкретну мету з терміном, наприклад «рівень B1 до вересня й вільна розмова на побутові теми». Мета підкаже, яким навичкам приділяти більше часу.",
        },
        {
          id: "start-setup-schedule",
          title: "Заплануйте 30–60 хвилин щодня",
          details:
            "Регулярність важливіша за тривалість: пів години щодня дає більше, ніж чотири години раз на тиждень. Прив’яжіть заняття до сталої звички (після сніданку, у транспорті) і відмічайте дні в календарі.",
        },
        {
          id: "start-setup-tools",
          title: "Підготуйте інструменти",
          details:
            "Словник із транскрипцією та аудіо, картки з інтервальним повторенням і нотатник для нових фраз та власних помилок.",
          links: [EXTERNAL.cambridgeDictionary, SITE.flashcards, EXTERNAL.anki],
        },
        {
          id: "start-setup-test",
          title: "Пройдіть діагностичний тест",
          details:
            "Якщо ви вже вчили англійську, безкоштовний онлайн-тест покаже поточний рівень. Відмітьте пункти, які впевнено знаєте, і починайте з першого невпевненого.",
          links: [EXTERNAL.efset, EXTERNAL.cambridgeTest],
          optional: true,
        },
      ],
    },
    {
      id: "start-sounds",
      kind: "pronunciation",
      title: "Алфавіт, звуки й читання",
      intro: "В англійській 26 літер, але 44 звуки, тому без транскрипції не обійтися.",
      tasks: [
        {
          id: "start-sounds-alphabet",
          title: "Англійський алфавіт",
          details:
            "Вивчіть назви 26 літер: A /eɪ/, E /iː/, I /aɪ/, G /dʒiː/, J /dʒeɪ/, R /ɑː/, W /ˈdʌbəljuː/. Навчіться диктувати по літерах ім’я, прізвище та email — це потрібно в кожній анкеті й телефонній розмові.",
          examples: ["How do you spell your name?", "It's K-A-T-E."],
        },
        {
          id: "start-sounds-ipa",
          title: "Транскрипція IPA",
          details:
            "Одна літера може звучати по-різному (cat, cake, car), тому вивчіть знаки транскрипції: довгі голосні /iː/, /uː/, /ɑː/, короткі /ɪ/, /ʊ/, /æ/, дифтонги /eɪ/, /aɪ/, /əʊ/ і приголосні /θ/, /ð/, /ʃ/, /ŋ/.",
          links: [EXTERNAL.phonemicChart, EXTERNAL.bbcPronunciation],
        },
        {
          id: "start-sounds-new",
          title: "Звуки, яких немає в українській",
          details:
            "/θ/ і /ð/ (think, this), /w/ (we), /æ/ (cat), /ŋ/ (sing), /ɜː/ (bird), англійські /r/ і /h/. Тренуйте їх перед дзеркалом і порівнюйте з аудіо в словнику.",
          examples: ["think – sink", "west – vest", "bad – bed", "thin – tin"],
        },
        {
          id: "start-sounds-rules",
          title: "Основні правила читання",
          details:
            "Відкритий і закритий склад (name – man, bike – big), німа «e» в кінці слова, буквосполучення sh, ch, th, ph, ck, ee, ea, oo, igh і закінчення -tion. У правил є винятки, тож звіряйтеся з транскрипцією.",
          examples: ["make – man", "site – sit", "ship, chair, phone", "see, sea, book", "night, station"],
        },
        {
          id: "start-sounds-listen",
          title: "Читайте вголос з озвученням",
          details:
            "Вставте слова чи фрази на сторінці «Читання», прослухайте озвучення й повторіть за диктором. Запишіть себе на диктофон і порівняйте.",
          links: [SITE.reading],
        },
      ],
    },
    {
      id: "start-phrases",
      kind: "vocabulary",
      title: "Перші слова й фрази",
      intro: "Фрази «виживання», з якими можна почати спілкування вже зараз.",
      tasks: [
        {
          id: "start-phrases-greetings",
          title: "Привітання й знайомство",
          details: "Hello / Hi, Good morning, Goodbye / Bye, See you, My name is…, Nice to meet you.",
          examples: ["Hi! My name is Olena.", "Nice to meet you.", "See you tomorrow!"],
        },
        {
          id: "start-phrases-polite",
          title: "Ввічливі слова",
          details:
            "please, thank you / thanks, sorry, excuse me, you're welcome. В англійській вони звучать значно частіше, ніж в українській: прохання без please може здатися грубим.",
          examples: ["Can I have a tea, please?", "Excuse me, where is the station?", "Thank you! — You're welcome."],
        },
        {
          id: "start-phrases-numbers",
          title: "Числа від 0 до 100",
          details:
            "Особлива увага — парам -teen / -ty з різним наголосом: thirˈteen – ˈthirty. Номер телефону називають по цифрах, 0 читають як «oh» або «zero».",
          examples: ["thirteen – thirty", "fifteen – fifty", "I'm twenty-five years old."],
        },
        {
          id: "start-phrases-calendar",
          title: "Дні тижня, місяці, кольори",
          details: "Дні тижня й місяці пишуться з великої літери: Monday, January. Кольори — перші прикметники: a red car.",
          examples: ["Today is Monday.", "My birthday is in May.", "My favourite colour is blue."],
        },
        {
          id: "start-phrases-repair",
          title: "Фрази, коли щось незрозуміло",
          details:
            "Найкорисніші фрази початківця: з ними розмова не обривається, навіть коли ви чогось не зрозуміли.",
          examples: [
            "Sorry, I don't understand.",
            "Can you repeat that, please?",
            "Can you speak more slowly, please?",
            "What does this word mean?",
            "How do you say it in English?",
          ],
        },
        {
          id: "start-phrases-first-words",
          title: "Перші 100 слів зі словника A1",
          details:
            "Почніть з найуживаніших слів: займенники, числа, сім’я, їжа, базові дієслова. Додайте їх у картки й повторюйте щодня.",
          links: [SITE.dictionaryA1, SITE.flashcards],
        },
      ],
    },
    {
      id: "start-checkpoint",
      kind: "checkpoint",
      title: "Контрольна точка",
      intro: "Переходьте до A1, коли впевнено виконуєте всі три завдання.",
      tasks: [
        {
          id: "start-checkpoint-spell",
          title: "Продиктуйте ім’я та email по літерах",
          details: "Без підглядання й довгих пауз — так, як під час телефонної розмови.",
        },
        {
          id: "start-checkpoint-read",
          title: "Прочитайте вголос 20 нових слів за транскрипцією",
          details: "Візьміть незнайомі слова зі словника, прочитайте їх за транскрипцією, а потім перевірте себе аудіо.",
        },
        {
          id: "start-checkpoint-intro",
          title: "Представтеся за 30 секунд",
          details: "Ім’я, вік, місто, робота або навчання. Запишіть себе на диктофон і прослухайте.",
          examples: ["Hello! My name is Andrii. I'm thirty. I'm from Lviv, Ukraine. I'm a programmer."],
        },
      ],
    },
  ],
  resources: [
    { ...EXTERNAL.cambridgeDictionary, note: "Переклад, транскрипція та британська й американська вимова" },
    { ...EXTERNAL.phonemicChart, note: "Усі 44 звуки англійської з аудіоприкладами" },
    { ...EXTERNAL.bbcPronunciation, note: "Короткі відео про звуки та вимову" },
    { ...SITE.reading, note: "Тренажер вимови на цьому сайті" },
    { ...SITE.dictionaryA1, note: "Перші слова з перекладом і прикладами" },
  ],
};
