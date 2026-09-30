import type { RoadmapStage } from "../types";
import { bcGrammar, bcSkill, EXTERNAL, SITE } from "./links";

export const STAGE_B1: RoadmapStage = {
  id: "b1",
  code: "B1",
  title: "Середній",
  cefrName: "Threshold",
  tagline: "Самостійне спілкування: думки, досвід, подорожі, робота",
  summary:
    "Ви розумієте основний зміст чіткого стандартного мовлення на знайомі теми: робота, навчання, дозвілля. Впораєтеся з більшістю ситуацій під час подорожі країною, де говорять англійською. Складаєте простий зв’язний текст на знайомі теми, описуєте враження, події, мрії та плани, коротко пояснюєте свої думки.",
  stageHours: "≈ 170–200 год",
  totalHours: "≈ 350–400 год",
  pace: "6–7 місяців при 1 год на день",
  vocabulary: "≈ 2500–3000 слів (Oxford 3000: ще 700 слів рівня B1)",
  certification: "Cambridge B1 Preliminary (PET), IELTS 4.0–5.0",
  outcomes: [
    {
      skill: "interaction",
      items: [
        "Починаєте, підтримуєте й завершуєте розмову на знайомі теми.",
        "Висловлюєте та запитуєте думку в неформальній дискусії, ввічливо погоджуєтеся й заперечуєте.",
        "Ведете прості телефонні розмови, питаєте й розумієте детальні пояснення дороги.",
      ],
    },
    {
      skill: "production",
      items: [
        "Детально розповідаєте про досвід, почуття й реакції.",
        "Коротко пояснюєте та обґрунтовуєте свою думку.",
        "Робите коротку підготовлену презентацію на знайому тему й відповідаєте на запитання.",
      ],
    },
    {
      skill: "listening",
      items: [
        "Розумієте головне в чіткому стандартному мовленні на повсякденні теми.",
        "Стежите за короткими доповідями й обговореннями, якщо говорять чітко.",
      ],
    },
    {
      skill: "reading",
      items: [
        "Розумієте головне в статтях і фактичних текстах на цікаві вам теми.",
        "Розумієте особисті листи про події, почуття й побажання настільки, щоб на них відповісти.",
      ],
    },
    {
      skill: "writing",
      items: [
        "Пишете зв’язні тексти на знайомі теми: розповіді про поїздки, події, враження.",
        "Пишете email друзям і колегам та короткий офіційний лист із запитом.",
      ],
    },
    {
      skill: "strategies",
      items: [
        "Просите пояснити або уточнити сказане, перепитуєте, щоб перевірити розуміння.",
        "Коли забули слово, описуєте його іншими словами й просите підказати.",
      ],
    },
  ],
  functions: [
    "Перевірка розуміння",
    "Розповідь про досвід і події",
    "Опис почуттів та емоцій",
    "Думка, згода й незгода",
    "Початок і завершення розмови",
    "Керування розмовою: перебити, змінити тему, повернутися",
  ],
  topics: ["Книги й література", "Освіта", "Кіно", "Дозвілля", "Медіа", "Новини, стиль життя, актуальні події"],
  pitfalls: [
    {
      wrong: "I live here since 2020.",
      right: "I have lived here since 2020.",
      note: "Дія, що почалася в минулому й триває досі, — це Present Perfect (Continuous) з since / for, а не теперішній час, як в українській.",
    },
    {
      wrong: "She asked where do I live.",
      right: "She asked where I lived.",
      note: "У непрямих запитаннях — прямий порядок слів без do / did і зсув часів.",
    },
    {
      wrong: "If I would have time, I would travel.",
      right: "If I had time, I would travel.",
      note: "У частині з if would не вживаємо.",
    },
    {
      wrong: "I want to make a photo.",
      right: "I want to take a photo.",
      note: "Колокації не перекладаються дослівно: take a photo, heavy rain, strong coffee, turn on the light.",
    },
    {
      wrong: "Can you give me some advices?",
      right: "Can you give me some advice?",
      note: "advice, information, news, furniture, luggage — незлічувані: без -s і без a / an.",
    },
    {
      wrong: "This topic is very actual.",
      right: "This topic is very relevant.",
      note: "actual — справжній, actually — насправді. «Актуальний» — це relevant або topical.",
    },
    {
      wrong: "Don't you like it? — No, I like it.",
      right: "Don't you like it? — Yes, I do.",
      note: "Yes / no залежить від факту, а не від форми запитання: якщо подобається — Yes, I do.",
    },
  ],
  modules: [
    {
      id: "b1-grammar",
      kind: "grammar",
      title: "Граматика",
      intro:
        "Теми B1 за British Council / EAQUALS Core Inventory: перфектні й розповідні часи, умовні речення, пасив і непряма мова.",
      tasks: [
        {
          id: "b1-grammar-perfect-vs-past",
          title: "Present Perfect чи Past Simple",
          details:
            "Present Perfect пов’язує минуле з теперішнім (for, since, just, already, yet, still), Past Simple описує завершену подію в конкретний момент.",
          examples: ["I've lived here for five years.", "I moved here in 2020.", "Have you finished yet? — Not yet."],
          links: [
            bcGrammar("present perfect", "b1-b2/present-perfect"),
            bcGrammar("just, yet, still, already", "b1-b2/present-perfect-just-yet-still-already"),
          ],
        },
        {
          id: "b1-grammar-perfect-continuous",
          title: "Present Perfect Continuous",
          details:
            "Тривала дія, що почалася в минулому й триває досі або щойно завершилася й має видимий результат.",
          examples: ["I've been learning English for two years.", "It's been raining all day.", "You look tired. Have you been working?"],
          links: [bcGrammar("present perfect simple and continuous", "b1-b2/present-perfect-simple-continuous")],
        },
        {
          id: "b1-grammar-narrative",
          title: "Past Perfect і розповідні часи",
          details:
            "Past Perfect — дія, що відбулася раніше за іншу минулу дію. У розповіді поєднуйте Past Simple, Past Continuous і Past Perfect.",
          examples: ["When I arrived, the train had already left.", "She was tired because she had worked all night."],
          links: [bcGrammar("past perfect", "b1-b2/past-perfect")],
        },
        {
          id: "b1-grammar-used-to",
          title: "used to для минулих звичок і станів",
          details:
            "Те, що було раніше, а тепер ні. Не плутайте used to do (раніше робив) і be used to doing (звик робити).",
          examples: ["I used to live in Kharkiv.", "Did you use to play football?"],
          links: [bcGrammar("uses of used to", "b1-b2-grammar/different-uses-of-used-to")],
        },
        {
          id: "b1-grammar-future",
          title: "Прогнози й Future Continuous",
          details:
            "will — прогноз-думка, going to — прогноз на підставі очевидних ознак, Future Continuous — процес у певний момент майбутнього.",
          examples: [
            "Look at those clouds — it's going to rain.",
            "I think our team will win.",
            "This time tomorrow I'll be flying to Rome.",
          ],
        },
        {
          id: "b1-grammar-conditionals",
          title: "Другий і третій умовні",
          details:
            "Second conditional — уявна ситуація в теперішньому чи майбутньому, third conditional — нереальне минуле, про яке шкодуємо.",
          examples: [
            "If I had more time, I would travel more.",
            "If I were you, I'd take the job.",
            "If I had known, I would have told you.",
          ],
          links: [
            bcGrammar("zero, first and second conditionals", "b1-b2/conditionals-zero-first-second"),
            bcGrammar("third and mixed conditionals", "b1-b2/conditionals-third-mixed"),
          ],
        },
        {
          id: "b1-grammar-deduction",
          title: "Припущення: must, might, may, can't",
          details: "must — майже впевнені, might / may / could — можливо, can't — неможливо.",
          examples: ["She must be at work — her car isn't here.", "He might be late.", "That can't be true!"],
          links: [bcGrammar("deductions about the present", "b1-b2/modals-deductions-about-present")],
        },
        {
          id: "b1-grammar-past-modals",
          title: "should have / could have / might have",
          details: "Жаль і критика щодо минулого: треба було (should have), можна було (could have).",
          examples: ["You should have told me.", "We could have taken a taxi."],
        },
        {
          id: "b1-grammar-obligation",
          title: "must / have to / don't have to / mustn't",
          details:
            "must — внутрішній обов’язок або правило, have to — зовнішня необхідність; don't have to — «немає потреби», mustn't — «заборонено».",
          examples: ["I must call my mum.", "I have to wear a uniform at work.", "You don't have to come if you're busy."],
          links: [bcGrammar("permission and obligation", "b1-b2/modals-permission-obligation")],
        },
        {
          id: "b1-grammar-passive",
          title: "Пасивний стан у простих часах",
          details: "Коли важлива дія, а не виконавець: be + третя форма дієслова.",
          examples: [
            "English is spoken all over the world.",
            "The bridge was built in 1900.",
            "The results will be announced tomorrow.",
          ],
          links: [bcGrammar("passives", "b1-b2/passives")],
        },
        {
          id: "b1-grammar-reported",
          title: "Непряма мова",
          details:
            "Зсув часів (is → was, will → would), зміна займенників і слів часу, непрямі запитання з if / whether.",
          examples: ["She said she was tired.", "He asked if I liked coffee.", "They told me they would call later."],
          links: [
            bcGrammar("reported statements", "b1-b2/reported-speech-statements"),
            bcGrammar("reported questions", "b1-b2/reported-speech-questions"),
          ],
        },
        {
          id: "b1-grammar-question-tags",
          title: "Розділові запитання (question tags)",
          details:
            "Щоб перевірити інформацію чи отримати згоду: після ствердження — заперечний «хвостик», після заперечення — стверджувальний.",
          examples: ["It's cold today, isn't it?", "You haven't seen my keys, have you?", "Let's go, shall we?"],
          links: [bcGrammar("question tags", "b1-b2/question-tags")],
        },
        {
          id: "b1-grammar-relative",
          title: "Означальні підрядні: who, which, that, where",
          details: "Уточнюють, про кого чи про що йдеться: The man who lives next door is a doctor.",
          examples: ["The book that I'm reading is great.", "This is the place where we met."],
          links: [bcGrammar("defining relative clauses", "b1-b2/relative-clauses-defining-relative-clauses")],
        },
        {
          id: "b1-grammar-intensifiers",
          title: "too, enough, so, such",
          details: "too — надто, enough — достатньо (після прикметника), so + прикметник, such + іменник.",
          examples: ["It's too expensive.", "He isn't old enough to drive.", "It was such a good film!"],
          links: [bcGrammar("enough", "b1-b2/using-enough"), bcGrammar("so and such", "b1-b2/intensifiers-so-such")],
        },
        {
          id: "b1-grammar-comparatives",
          title: "Складніші порівняння",
          details: "much / far / a bit + вищий ступінь, the more …, the better, as … as possible.",
          examples: ["This phone is much cheaper.", "The more you read, the more you learn."],
          links: [bcGrammar("modifying comparatives", "b1-b2/modifying-comparatives")],
        },
        {
          id: "b1-grammar-linkers",
          title: "Зв’язки причини, наслідку й контрасту",
          details: "because, so, as a result, although, however, while, on the other hand.",
          examples: ["Although it was raining, we went out.", "The tickets were expensive. However, the concert was worth it."],
          links: [bcGrammar("although, despite and others", "b1-b2/contrasting-ideas-although-despite-others")],
        },
        {
          id: "b1-grammar-phrasal",
          title: "Фразові дієслова: розширений набір",
          details: "look forward to, put off, run out of, get on with, turn down, come up with, set up.",
          examples: ["I'm looking forward to seeing you.", "We've run out of milk.", "She came up with a great idea."],
          links: [bcGrammar("phrasal verbs", "b1-b2/phrasal-verbs")],
        },
        {
          id: "b1-grammar-verb-patterns",
          title: "Дієслова з -ing і to-інфінітивом (розширено)",
          details:
            "avoid / suggest / consider + -ing; decide / manage / refuse + to; після прийменника — завжди -ing: interested in learning.",
          examples: ["I avoid driving in the city centre.", "She managed to find a job.", "I'm interested in learning Spanish."],
        },
      ],
    },
    {
      id: "b1-vocabulary",
      kind: "vocabulary",
      title: "Лексика й теми",
      intro: "На B1 важливо не лише знати слова, а й поєднувати їх природно: колокації, словотвір, розмовні вирази.",
      tasks: [
        {
          id: "b1-vocabulary-dictionary",
          title: "Пройдіть словник B1 на сайті",
          details: "Близько 2 400 слів рівня B1. Вчіть їх разом із прикладами й перевіряйте себе в тестах.",
          links: [SITE.dictionaryB1, SITE.tests],
        },
        {
          id: "b1-vocabulary-collocations",
          title: "Колокації",
          details:
            "Сталі сполучення слів: heavy rain, make a decision, take part in, pay attention, strong coffee, highly recommended.",
          examples: ["We made a decision.", "Please pay attention.", "There was heavy rain last night."],
        },
        {
          id: "b1-vocabulary-word-formation",
          title: "Словотвір: префікси й суфікси",
          details:
            "un-, dis-, im-, re-; -ful, -less, -ment, -ness, -tion, -able. Одне слово дає кілька нових: help → helpful, helpless, unhelpful.",
          examples: ["happy – unhappy – happiness", "use – useful – useless"],
        },
        {
          id: "b1-vocabulary-opinions",
          title: "Думки, почуття й реакції",
          details: "In my opinion…, I'm keen on…, I'm fed up with…, It's worth…, I can't stand…",
          examples: ["In my opinion, it's worth trying.", "I'm fed up with the rain."],
        },
        {
          id: "b1-vocabulary-colloquial",
          title: "Розмовні вирази",
          details: "Guess what!, No way!, It's up to you., I'm not sure about that., Never mind.",
          examples: ["Guess what! I got the job!", "It's up to you."],
        },
        {
          id: "b1-vocabulary-topics",
          title: "Теми B1: медіа, кіно, книги, освіта, робота",
          details:
            "Лексика, щоб обговорювати новини, фільми, книжки, навчання й кар’єру: plot, review, headline, apply for a job, degree.",
          examples: ["The plot was really exciting.", "She applied for a job in marketing."],
        },
        {
          id: "b1-vocabulary-false-friends",
          title: "Хибні друзі перекладача",
          details:
            "magazine — журнал, accurate — точний, sympathetic — співчутливий, artist — художник, fabric — тканина, decade — десятиліття.",
          examples: ["He is very accurate.", "Thank you for being so sympathetic."],
        },
      ],
    },
    {
      id: "b1-pronunciation",
      kind: "pronunciation",
      title: "Вимова",
      tasks: [
        {
          id: "b1-pronunciation-linking",
          title: "Зв’язне мовлення: linking",
          details: "Кінцевий приголосний «переходить» до наступного голосного: an_apple, turn_it_off, pick_it_up.",
          examples: ["turn it off", "pick it up", "an apple"],
        },
        {
          id: "b1-pronunciation-pairs",
          title: "Мінімальні пари",
          details:
            "Складні для україномовних пари: /æ/ – /e/ (man – men), /ɪ/ – /iː/ (live – leave), /θ/ – /s/ (think – sink), /v/ – /w/ (vine – wine), /ɜː/ – /ɔː/ (work – walk).",
          examples: ["man – men", "work – walk", "vine – wine"],
        },
        {
          id: "b1-pronunciation-intonation",
          title: "Інтонація: згода, сумнів, ввічливість",
          details:
            "Висхідний тон — сумнів або справжнє запитання, спадний — впевненість. У question tags ↘ означає, що ви чекаєте згоди, ↗ — що справді питаєте.",
          examples: ["It's a nice day, isn't it?", "Really?", "Could you help me, please?"],
        },
        {
          id: "b1-pronunciation-shadowing",
          title: "Shadowing 10 хвилин щодня",
          details:
            "Повторюйте одночасно з диктором короткі фрагменти подкастів чи відео з транскриптом — копіюйте ритм, паузи й інтонацію.",
          links: [EXTERNAL.sixMinuteEnglish],
        },
      ],
    },
    {
      id: "b1-listening",
      kind: "listening",
      title: "Аудіювання",
      tasks: [
        {
          id: "b1-listening-podcasts",
          title: "Навчальні подкасти 20–30 хвилин щодня",
          details: "6 Minute English, The English We Speak та інші подкасти з транскриптами й поясненням лексики.",
          links: [EXTERNAL.sixMinuteEnglish, EXTERNAL.englishWeSpeak],
        },
        {
          id: "b1-listening-series",
          title: "Серіали з англійськими субтитрами",
          details:
            "Оберіть ситком чи серіал на знайому тему й дивіться з англійськими субтитрами. Незнайомі фрази додавайте в картки.",
          links: [EXTERNAL.tvSeries],
        },
        {
          id: "b1-listening-talks",
          title: "Короткі лекції та відео (5–10 хвилин)",
          details: "Слухайте основну ідею й 3–4 ключові аргументи, а потім перевірте себе за транскриптом.",
          links: [EXTERNAL.tedEd],
        },
        {
          id: "b1-listening-notes",
          title: "Слухання з нотатками",
          details:
            "Під час прослуховування записуйте ключові слова, а потім перекажіть зміст — так тренуєте водночас розуміння й говоріння.",
          links: [bcSkill("listening", "b1")],
        },
      ],
    },
    {
      id: "b1-reading",
      kind: "reading",
      title: "Читання",
      tasks: [
        {
          id: "b1-reading-graded",
          title: "3–4 адаптовані книги рівня B1",
          details: "Oxford Bookworms Stage 3–4, Penguin Readers Level 3–4 чи подібні серії. Читайте щодня хоча б 15–20 хвилин.",
        },
        {
          id: "b1-reading-articles",
          title: "Статті й блоги на ваші теми",
          details:
            "Одна стаття щодня про роботу, хобі чи новини. Не перекладайте кожне слово — виписуйте лише ті, що заважають зрозуміти зміст.",
          links: [EXTERNAL.breakingNewsEnglish, bcSkill("reading", "b1")],
        },
        {
          id: "b1-reading-skim-scan",
          title: "Skimming і scanning",
          details:
            "Skimming — швидко схопити головну думку, scanning — знайти конкретну інформацію. Обидві навички потрібні і на іспитах, і в роботі.",
        },
        {
          id: "b1-reading-letters",
          title: "Особисті листи й email",
          details: "Розумійте події, почуття й побажання автора настільки, щоб відповісти.",
        },
      ],
    },
    {
      id: "b1-speaking",
      kind: "speaking",
      title: "Говоріння",
      tasks: [
        {
          id: "b1-speaking-opinion",
          title: "Думка з аргументом",
          details: "Схема «думка → причина → приклад»: I think…, because…, For example…",
          examples: [
            "I think working from home is great because you save time. For example, I don't spend two hours a day on the road.",
          ],
        },
        {
          id: "b1-speaking-agree",
          title: "Згода й незгода ввічливо",
          details: "Exactly!, I see what you mean, but…, I'm not sure I agree., That's a good point. However…",
          examples: ["I see what you mean, but I don't agree.", "That's a good point."],
        },
        {
          id: "b1-speaking-story",
          title: "Історія з життя (3 хвилини)",
          details: "Розповідь про подію з деталями, почуттями й реакціями, з розповідними часами.",
          examples: ["It happened while I was travelling in Spain. I had just arrived at the hotel when the lights went out."],
        },
        {
          id: "b1-speaking-presentation",
          title: "Коротка презентація (3–5 хвилин)",
          details:
            "Підготуйте виступ на знайому тему (моє місто, моя робота, улюблена книжка) і відповідайте на запитання слухачів.",
        },
        {
          id: "b1-speaking-manage",
          title: "Керування розмовою",
          details: "Перебити, змінити тему, повернутися до попередньої: Sorry to interrupt, but… By the way… Anyway, as I was saying…",
          examples: ["Sorry to interrupt, but can I ask something?", "By the way, did you hear about Tom?", "Anyway, as I was saying…"],
        },
        {
          id: "b1-speaking-circumlocution",
          title: "Пояснення забутого слова",
          details: "It's a kind of…, It's something you use for…, It's like…, but bigger.",
          examples: ["It's a thing you use to open bottles.", "It's a kind of bird that can't fly."],
        },
        {
          id: "b1-speaking-practice",
          title: "Розмовна практика 1–2 рази на тиждень",
          details:
            "Викладач, розмовний клуб або мовний обмін. Після кожної розмови записуйте 3 нові фрази й 3 свої помилки.",
          links: [EXTERNAL.italki, EXTERNAL.tandem],
        },
      ],
    },
    {
      id: "b1-writing",
      kind: "writing",
      title: "Письмо",
      tasks: [
        {
          id: "b1-writing-email",
          title: "Неформальний email (≈100 слів)",
          details: "Як у B1 Preliminary: відповідь другові, де розкрито всі пункти завдання.",
          examples: ["Hi Alex, thanks for your email! I'd love to come to your party on Saturday."],
        },
        {
          id: "b1-writing-story",
          title: "Історія або стаття (≈100 слів)",
          details: "Чіткий початок, розвиток і завершення; розповідні часи та зв’язки.",
        },
        {
          id: "b1-writing-formal",
          title: "Короткий офіційний лист",
          details: "Запит інформації: Dear Sir or Madam, I am writing to ask about…, I look forward to hearing from you.",
          examples: ["I am writing to ask about the English course.", "I look forward to hearing from you."],
        },
        {
          id: "b1-writing-paragraph",
          title: "Структура абзацу",
          details: "Тематичне речення → пояснення й приклади → висновок. Один абзац — одна думка.",
        },
        {
          id: "b1-writing-feedback",
          title: "Зворотний зв’язок на тексти",
          details:
            "Перевіряйте тексти в безкоштовному Write & Improve від Cambridge або з викладачем і ведіть список власних типових помилок.",
          links: [EXTERNAL.writeAndImprove],
        },
      ],
    },
    {
      id: "b1-checkpoint",
      kind: "checkpoint",
      title: "Контрольна точка",
      intro: "Переходьте до B2, коли впевнено виконуєте обов’язкові завдання.",
      tasks: [
        {
          id: "b1-checkpoint-self",
          title: "Самооцінка за переліком «Що ви зможете»",
          details: "Позначте, що вже виходить без підготовки, і повторіть модулі, де відчуваєте невпевненість.",
        },
        {
          id: "b1-checkpoint-mock",
          title: "Пробний тест B1 Preliminary",
          details: "Виконайте зразки завдань з усіх частин: читання, письмо, аудіювання й говоріння.",
          links: [EXTERNAL.preliminaryPreparation],
        },
        {
          id: "b1-checkpoint-talk",
          title: "10-хвилинна розмова без підготовки",
          details:
            "Знайома тема на вибір співрозмовника: робота, подорожі, фільм. Мета — говорити без довгих пауз і переходу на українську.",
        },
        {
          id: "b1-checkpoint-exam",
          title: "Складіть B1 Preliminary або IELTS (4.0–5.0)",
          details: "Сертифікат знадобиться для навчання, роботи чи візи; для себе достатньо пробного тесту.",
          links: [EXTERNAL.preliminaryPreparation],
          optional: true,
        },
      ],
    },
  ],
  resources: [
    { ...bcGrammar("граматика B1–B2", "b1-b2"), note: "Пояснення й вправи до тем рівня" },
    { ...bcSkill("listening", "b1"), note: "Аудіо з транскриптами й завданнями" },
    { ...EXTERNAL.sixMinuteEnglish, note: "Шестихвилинні подкасти з транскриптами" },
    { ...EXTERNAL.breakingNewsEnglish, note: "Новини з вправами для різних рівнів" },
    { ...EXTERNAL.writeAndImprove, note: "Безкоштовна перевірка письма з оцінкою за CEFR" },
    { label: "English Grammar in Use (R. Murphy)", note: "Підручник граматики для рівнів B1–B2" },
    { ...SITE.dictionaryB1, note: "Слова B1 з перекладом і прикладами" },
  ],
};
