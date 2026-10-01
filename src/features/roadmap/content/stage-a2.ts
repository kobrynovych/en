import type { RoadmapStage } from "../types";
import { bcGrammar, bcSkill, EXTERNAL, SITE } from "./links";

export const STAGE_A2: RoadmapStage = {
  id: "a2",
  code: "A2",
  title: "Елементарний",
  cefrName: "Waystage",
  tagline: "Минулі події, плани, подорожі й прості розмови про повсякдення",
  summary:
    "Ви розумієте речення й часто вживані вирази на близькі теми: сім’я, покупки, місцевість, робота. Спілкуєтеся в простих звичних ситуаціях, де потрібен прямий обмін інформацією. Простими словами описуєте своє минуле, оточення й нагальні потреби.",
  stageHours: "≈ 90–100 год",
  totalHours: "≈ 180–200 год",
  pace: "≈ 13–15 тижнів по 7 год на тиждень",
  vocabulary: "≈ 1500–2000 слів і фраз загалом; добірки A1–A2",
  certification: "Пробні завдання A2 Key; офіційний іспит — за бажанням",
  learningPath: [
    "Минулий досвід: повторіть A1, поєднайте Past Simple / Continuous і почніть Present Perfect. Розкажіть про поїздку.",
    "Плани й побутові рішення: майбутні форми, модальні дієслова, порівняння та кількість. Розіграйте бронювання й домовленість.",
    "Зв’язна розповідь: умовні речення, дієслівні конструкції й часові зв’язки. Напишіть повідомлення та історію; перевірте чотири навички.",
  ],
  outcomes: [
    {
      skill: "interaction",
      items: [
        "Питаєте, як людина почувається, і розповідаєте про своє самопочуття.",
        "Ставите й відповідаєте на прості запитання про дім, роботу, вільний час, вподобання та минулі події.",
        "Запрошуєте, приймаєте або ввічливо відхиляєте запрошення, вибачаєтеся й приймаєте вибачення.",
      ],
    },
    {
      skill: "production",
      items: [
        "Описуєте себе, родину й інших людей, освіту, роботу, хобі та житло.",
        "Розповідаєте, як провели вихідні чи відпустку, і ділитеся планами.",
      ],
    },
    {
      skill: "listening",
      items: [
        "Розумієте прості розмови про сім’ю, хобі й повсякдення, якщо говорять повільно й чітко.",
        "Розумієте короткі оголошення на вокзалі чи в аеропорту та прогноз погоди.",
      ],
    },
    {
      skill: "reading",
      items: [
        "Знаходите потрібну інформацію в рекламі, розкладах, меню й на сайтах.",
        "Розумієте короткі прості новини й повідомлення від друзів.",
      ],
    },
    {
      skill: "writing",
      items: [
        "Пишете коротке повідомлення: запрошення, перенесення зустрічі, новини для друга.",
        "Пишете простий опис людей і подій, заповнюєте анкету про освіту й роботу.",
      ],
    },
    {
      skill: "strategies",
      items: [
        "Починаєте, підтримуєте й завершуєте коротку розмову.",
        "Пояснюєте, що саме не зрозуміли, і просите сказати простіше.",
      ],
    },
  ],
  functions: [
    "Звички й розпорядок",
    "Розповідь про минулий досвід",
    "Опис людей, місць і речей",
    "Обов’язок і необхідність",
    "Прохання",
    "Пропозиції",
  ],
  topics: ["Освіта", "Хобі та дозвілля", "Подорожі й відпустка", "Покупки й послуги", "Робота", "Здоров’я", "Дім і погода"],
  pitfalls: [
    {
      wrong: "I have seen him yesterday.",
      right: "I saw him yesterday.",
      note: "Якщо названо точний час у минулому (yesterday, last week, in 2020), потрібен Past Simple, а не Present Perfect.",
    },
    {
      wrong: "If it will rain, we will stay at home.",
      right: "If it rains, we will stay at home.",
      note: "Після if і when у значенні майбутнього вживаємо Present Simple.",
    },
    {
      wrong: "I did a mistake.",
      right: "I made a mistake.",
      note: "make і do не перекладаються однозначно як «робити» — вчіть сталі сполучення: make a mistake, do homework.",
    },
    {
      wrong: "I'm boring at the lesson.",
      right: "I'm bored at the lesson.",
      note: "-ed описує ваші почуття (bored — мені нудно), -ing — те, що їх викликає (boring — нудний).",
    },
    {
      wrong: "It depends from the weather.",
      right: "It depends on the weather.",
      note: "Прийменники не збігаються з українськими: depend on, listen to, married to, arrive in / at.",
    },
    {
      wrong: "Where you went?",
      right: "Where did you go?",
      note: "У запитаннях Past Simple потрібне did, а основне дієслово повертається в першу форму.",
    },
    {
      wrong: "I'm agree with you.",
      right: "I agree with you.",
      note: "agree — це дієслово, а не прикметник, тому am не потрібне.",
    },
  ],
  modules: [
    {
      id: "a2-grammar",
      kind: "grammar",
      title: "Граматика",
      intro: "Теми A2 за British Council / EAQUALS Core Inventory: минуле, досвід, майбутнє й модальні дієслова.",
      tasks: [
        {
          id: "a2-grammar-pronouns",
          title: "Неозначені, присвійні та зворотні займенники",
          details: "someone / anyone / no one, something / anything / nothing, everyone / everything; mine / yours / hers замість повтору іменника; myself / yourself для дії на себе. Відпрацюйте їх у коротких побутових діалогах.",
          examples: ["Is anyone at home?", "This bag is mine.", "I made it myself."],
        },
        {
          id: "a2-grammar-present-states",
          title: "Present Simple / Continuous і дієслова стану",
          details: "Порівняйте звичку й тимчасову дію. know, want, need, like зазвичай уживаються у Simple, коли описують стан. Ствердження, запитання й заперечення тренуйте разом.",
          examples: ["I usually work at home, but today I'm working in a café.", "I need help. Do you know the answer?"],
        },
        {
          id: "a2-grammar-past",
          title: "Past Simple впевнено, запитання про минуле",
          details:
            "Розповіді про минулі події та запитання з what, where, when, who. Вивчіть неправильні дієслова рівнів A1 і A2.",
          examples: ["Where did you go on holiday?", "We stayed in a small hotel.", "Who did you meet there?"],
          links: [SITE.irregularVerbs],
        },
        {
          id: "a2-grammar-past-continuous",
          title: "Past Continuous і Past Simple",
          details:
            "Past Continuous описує тло або тривалу дію, Past Simple — подію, що її перервала. Сполучники when і while.",
          examples: ["I was cooking when the phone rang.", "While we were walking, it started to rain."],
          links: [bcGrammar("past continuous and past simple", "a1-a2/past-continuous-past-simple")],
        },
        {
          id: "a2-grammar-present-perfect",
          title: "Present Perfect: досвід і результат",
          details:
            "have / has + третя форма дієслова. Досвід без точного часу (ever, never), результат, важливий зараз (I've lost my keys), just, already, yet.",
          examples: ["Have you ever been to London?", "I've never tried sushi.", "She has just finished her work."],
        },
        {
          id: "a2-grammar-future",
          title: "Майбутнє: will, going to, Present Continuous",
          details:
            "will — спонтанні рішення, обіцянки, прогнози; be going to — наміри й очевидні прогнози; Present Continuous — домовленості на конкретний час.",
          examples: ["I'll help you with your bags.", "I'm going to learn to drive.", "I'm meeting Anna on Friday."],
          links: [bcGrammar("future forms", "b1-b2/future-forms-will-be-going-present-continuous")],
        },
        {
          id: "a2-grammar-comparison",
          title: "Порівняння: than, the most, as … as",
          details: "Вищий ступінь з than, найвищий — з the, рівність — as … as, нерівність — not as … as.",
          examples: [
            "Kyiv is bigger than Lviv.",
            "It's the most expensive hotel in the city.",
            "My car isn't as fast as yours.",
          ],
        },
        {
          id: "a2-grammar-modals",
          title: "Модальні: have to, must, should, can / could",
          details:
            "Обов’язок (have to, must), порада (should), можливість і прохання (can, could). Увага: don't have to — «не обов’язково», а mustn't — «не можна».",
          examples: ["I have to get up early tomorrow.", "You should see a doctor.", "You mustn't park here."],
        },
        {
          id: "a2-grammar-articles",
          title: "Артиклі: the чи без артикля",
          details:
            "Без артикля говоримо про щось загалом (I like music), з the — про конкретне (The music was too loud). Сталі вирази без артикля: at home, by bus, go to school.",
          examples: ["Life is beautiful.", "The life of a doctor is hard.", "I go to work by bus."],
          links: [bcGrammar("the or no article", "a1-a2-grammar/articles-the-or-no-article")],
        },
        {
          id: "a2-grammar-quantifiers",
          title: "much / many, a lot of, a few / a little",
          details: "many і a few — зі злічуваними, much і a little — з незлічуваними, a lot of — з обома.",
          examples: ["I haven't got much time.", "There are a lot of people here.", "Can I have a little sugar?"],
          links: [bcGrammar("few, a few, little", "a1-a2-grammar/quantifiers-few-a-few-little-a-bit")],
        },
        {
          id: "a2-grammar-verb-patterns",
          title: "Герундій та інфінітив",
          details:
            "Після enjoy, finish, mind — -ing; після want, decide, hope, would like — to + дієслово. Інфінітив мети: I came here to study.",
          examples: ["I enjoy cooking.", "She decided to leave.", "I went to the shop to buy some bread."],
          links: [
            bcGrammar("-ing or infinitive", "a1-a2/verbs-followed-ing-or-infinitive"),
            bcGrammar("infinitive of purpose", "a1-a2/infinitive-purpose"),
          ],
        },
        {
          id: "a2-grammar-conditionals",
          title: "Нульовий і перший умовні",
          details:
            "Zero conditional — загальні істини (If you heat ice, it melts). First conditional — реальна умова в майбутньому (If it rains, we'll stay at home).",
          examples: ["If you heat ice, it melts.", "If you hurry, you'll catch the bus."],
          links: [bcGrammar("zero, first and second conditionals", "b1-b2/conditionals-zero-first-second")],
        },
        {
          id: "a2-grammar-phrasal",
          title: "Найуживаніші фразові дієслова",
          details:
            "get up, wake up, turn on / off, put on, take off, look for, give up, find out. Вчіть їх як окремі слова з прикладами.",
          examples: ["Turn off the light, please.", "I'm looking for my keys.", "Put on your coat."],
        },
        {
          id: "a2-grammar-adverbs",
          title: "Прислівники й порядок слів",
          details:
            "Утворення прислівників: quick – quickly, careful – carefully, good – well. Обставини в кінці речення: спершу місце, потім час.",
          examples: ["She speaks English very well.", "Drive carefully!", "I met him at the station yesterday."],
        },
        {
          id: "a2-grammar-prepositions",
          title: "Прийменники руху, місця й часу",
          details: "into, out of, across, through, along, up, down; at the weekend, in the morning, on time / in time.",
          examples: ["Walk across the bridge.", "The cat jumped out of the box.", "See you at the weekend."],
        },
        {
          id: "a2-grammar-ed-ing",
          title: "Прикметники на -ed та -ing",
          details: "-ed — почуття людини, -ing — характеристика того, що ці почуття викликає.",
          examples: ["I'm bored.", "This film is boring.", "She was surprised by the news."],
          links: [bcGrammar("-ed and -ing adjectives", "a1-a2/adjectives-ending-ed-ing")],
        },
        {
          id: "a2-grammar-linkers",
          title: "Зв’язки: first, then, after that, finally, so",
          details: "Розповідайте історії послідовно й пояснюйте причини та наслідки.",
          examples: ["First we went to the museum. Then we had lunch.", "It was late, so we took a taxi."],
        },
      ],
    },
    {
      id: "a2-vocabulary",
      kind: "vocabulary",
      title: "Лексика й теми",
      intro: "Теми A2 за Core Inventory: люди, почуття, подорожі, послуги, навчання й робота.",
      tasks: [
        {
          id: "a2-vocabulary-dictionary",
          title: "Пройдіть словник A2 на сайті",
          details:
            "Близько 1 400 слів рівня A2. Регулярно запускайте повторення: слова, до яких не повертаєтеся, забуваються за кілька тижнів.",
          links: [SITE.dictionaryA2, SITE.review],
        },
        {
          id: "a2-vocabulary-people",
          title: "Зовнішність, характер, почуття",
          details: "tall, slim, curly hair; friendly, shy, lazy, generous; tired, worried, excited.",
          examples: ["What does she look like? — She's tall with long dark hair.", "What's he like? — He's friendly and funny."],
        },
        {
          id: "a2-vocabulary-travel",
          title: "Подорожі й послуги",
          details: "book a ticket, check in, platform, return ticket, luggage, reception, reservation.",
          examples: ["A return ticket to Kyiv, please.", "I've got a reservation for two nights."],
        },
        {
          id: "a2-vocabulary-home",
          title: "Дім, місто й погода",
          details: "Кімнати й меблі, місця в місті, погода й пори року.",
          examples: ["There's a sofa in the living room.", "It's cold and windy today."],
        },
        {
          id: "a2-vocabulary-work-study",
          title: "Робота й навчання",
          details: "Професії, робоче місце, шкільні предмети, іспити: get a job, pass an exam, take a course.",
          examples: ["She passed all her exams.", "I work for a big company."],
        },
        {
          id: "a2-vocabulary-health",
          title: "Здоров’я й самопочуття",
          details: "Частини тіла, симптоми, візит до лікаря, аптека.",
          examples: ["I've got a headache.", "My back hurts.", "You should stay in bed."],
        },
        {
          id: "a2-vocabulary-collocations",
          title: "Базові колокації: make / do, have / take",
          details:
            "make a mistake, make friends; do homework, do the shopping; have a shower, have lunch; take a photo, take a bus.",
          examples: ["Can you take a photo of us?", "I usually do the shopping on Saturday."],
        },
      ],
    },
    {
      id: "a2-pronunciation",
      kind: "pronunciation",
      title: "Вимова",
      tasks: [
        {
          id: "a2-pronunciation-schwa",
          title: "Шва /ə/ — найчастіший звук англійської",
          details: "Ненаголошені голосні часто звучать як коротке нейтральне /ə/: about, teacher, banana, today.",
          examples: ["about", "banana", "teacher", "today"],
        },
        {
          id: "a2-pronunciation-weak-forms",
          title: "Слабкі форми службових слів",
          details:
            "У швидкому мовленні was, can, to, of, and, for звучать коротко: /wəz/, /kən/, /tə/, /əv/, /ən/, /fə/.",
          examples: ["I was at home.", "I can swim.", "a cup of tea", "fish and chips"],
        },
        {
          id: "a2-pronunciation-sentence-stress",
          title: "Наголос у реченні",
          details:
            "Наголошуємо змістові слова (іменники, дієслова, прикметники), а службові вимовляємо слабше: I WANT to GO to the CINEMA.",
          examples: ["I want to go to the cinema.", "What do you want to do?"],
        },
        {
          id: "a2-pronunciation-contractions",
          title: "Скорочення",
          details:
            "I'm, you're, don't, can't, won't, I'll, I've звучать природніше за повні форми. Не плутайте won't /wəʊnt/ і want /wɒnt/.",
          examples: ["I'll call you later.", "I won't be late.", "I want a coffee."],
        },
      ],
    },
    {
      id: "a2-listening",
      kind: "listening",
      title: "Аудіювання",
      tasks: [
        {
          id: "a2-listening-everyday",
          title: "Діалоги про повсякдення",
          details:
            "Слухайте кожен запис тричі: на загальний зміст, на деталі, з транскриптом. Намагайтеся розуміти без перекладу.",
          links: [bcSkill("listening", "a2")],
        },
        {
          id: "a2-listening-announcements",
          title: "Оголошення й прогнози погоди",
          details: "Тренуйте розуміння ключової інформації: час, номер платформи, зміни в розкладі, погода на завтра.",
        },
        {
          id: "a2-listening-video",
          title: "Відео з англійськими субтитрами",
          details:
            "Короткі відео на знайомі теми з англійськими (не українськими!) субтитрами — 15–20 хвилин щодня.",
          links: [EXTERNAL.bbcYoutube],
        },
        {
          id: "a2-listening-songs",
          title: "Пісні з текстом",
          details: "Заповнюйте пропущені слова в текстах пісень — легкий і приємний спосіб тренувати слух.",
          links: [EXTERNAL.lyricsTraining],
          optional: true,
        },
      ],
    },
    {
      id: "a2-reading",
      kind: "reading",
      title: "Читання",
      tasks: [
        {
          id: "a2-reading-practical",
          title: "Практичні тексти: розклади, реклама, сайти",
          details: "Навчіться швидко знаходити конкретну інформацію (scanning): ціну, час, адресу, умови.",
          links: [bcSkill("reading", "a2")],
        },
        {
          id: "a2-reading-graded",
          title: "2–3 адаптовані книги рівня A2",
          details:
            "Oxford Bookworms Stage 1–2, Penguin Readers Level 2 чи подібні серії. Рівень підібрано правильно, якщо ви знаєте майже всі слова й читаєте без словника.",
        },
        {
          id: "a2-reading-news",
          title: "Прості новини",
          details: "Адаптовані новини найнижчих рівнів: коротко, з аудіо та поясненням слів.",
          links: [EXTERNAL.newsInLevels, EXTERNAL.breakingNewsEnglish],
        },
        {
          id: "a2-reading-messages",
          title: "Особисті листи й повідомлення",
          details: "Розумійте, що пише друг: новини, запрошення, прохання — і відповідайте на них письмово.",
        },
      ],
    },
    {
      id: "a2-speaking",
      kind: "speaking",
      title: "Говоріння",
      tasks: [
        {
          id: "a2-speaking-weekend",
          title: "Розповідь про вихідні чи відпустку (2 хвилини)",
          details: "Використовуйте Past Simple і зв’язки first, then, after that, finally.",
          examples: ["Last weekend I visited my grandparents. First we had lunch, then we went for a walk."],
        },
        {
          id: "a2-speaking-describe",
          title: "Опис людини, місця, предмета",
          details: "Зовнішність і характер, яким є місто, для чого потрібна річ.",
          examples: ["She's tall and slim with short hair.", "It's a small town near the mountains."],
        },
        {
          id: "a2-speaking-invitations",
          title: "Запрошення, пропозиції, відмова",
          details: "Would you like to…? Why don't we…? How about…? — Sounds great! / Sorry, I can't. I'm busy.",
          examples: [
            "Would you like to come to my party?",
            "Why don't we go to the cinema?",
            "I'm sorry, I can't. I have to work.",
          ],
        },
        {
          id: "a2-speaking-travel",
          title: "Ситуації в подорожі",
          details: "Рольові діалоги: квиток, готель, ресторан, аптека, лікар.",
          examples: ["I'd like to check in, please.", "Could you recommend a good restaurant?"],
        },
        {
          id: "a2-speaking-plans",
          title: "Плани й домовленості",
          details: "going to і Present Continuous для розповіді про майбутнє.",
          examples: ["I'm going to start a new course in September.", "What are you doing tonight?"],
        },
        {
          id: "a2-speaking-relay",
          title: "Передайте практичну інформацію",
          details: "Прочитайте коротке оголошення про зміну розкладу й поясніть партнерові, що змінилося. Збережіть правильні час, місце та дію; за потреби перечитайте.",
          examples: ["The shop closes at six today, so we need to go earlier."],
        },
        {
          id: "a2-speaking-partner",
          title: "Перші розмови з живим співрозмовником",
          details:
            "Викладач, розмовний клуб або мовний обмін — хоча б 30 хвилин на тиждень. Готуйте теми й запитання заздалегідь.",
          links: [bcSkill("speaking", "a2"), EXTERNAL.italki, EXTERNAL.tandem],
        },
      ],
    },
    {
      id: "a2-writing",
      kind: "writing",
      title: "Письмо",
      tasks: [
        {
          id: "a2-writing-note",
          title: "Коротке повідомлення з трьома пунктами (25+ слів)",
          details: "Практика формату A2 Key: дайте відповідь на всі три пункти завдання. У чаті домовтеся про зустріч і відреагуйте на зміну часу; перечитайте повідомлення й уточніть незрозуміле.",
          links: [bcSkill("writing", "a2")],
          examples: ["Hi Sam, I'm sorry I can't come on Saturday. My mum is ill. Can we meet on Sunday instead? Love, Kate"],
        },
        {
          id: "a2-writing-story",
          title: "Історія за картинками (35+ слів)",
          details: "Опишіть послідовність подій у Past Simple, поєднуючи речення зв’язками.",
        },
        {
          id: "a2-writing-description",
          title: "Опис людини або міста (60–80 слів)",
          details: "Використовуйте прикметники, there is / there are та порівняння.",
        },
        {
          id: "a2-writing-diary",
          title: "Щоденник: 3–5 речень щодня",
          details: "Що ви робили сьогодні — у Past Simple. Коротке регулярне письмо закріплює граматику.",
          optional: true,
        },
      ],
    },
    {
      id: "a2-checkpoint",
      kind: "checkpoint",
      title: "Контрольна точка",
      intro: "Оцініть читання, слухання, письмо й діалог окремо. Простих зв’язаних речень достатньо; паузи й прохання повторити допустимі. Після виправлень спробуйте нове схоже завдання.",
      tasks: [
        {
          id: "a2-checkpoint-self",
          title: "Самооцінка за переліком «Що ви зможете»",
          details: "Позначте, що вже виходить без підготовки, і повторіть модулі, де відчуваєте невпевненість.",
        },
        {
          id: "a2-checkpoint-mock",
          title: "Пробний тест A2 Key",
          details: "Пройдіть усі частини за інструкціями зразка. Читання й слухання перевірте за ключами, письмо й говоріння — за критеріями з відгуком викладача. Для офіційних пробних матеріалів A2 Key орієнтир A2 на Cambridge English Scale — 120; це не відсотки. Збережіть окремі результати навичок.",
          links: [EXTERNAL.keyPreparation, EXTERNAL.cambridgeScores],
        },
        {
          id: "a2-checkpoint-talk",
          title: "5-хвилинна розмова про минуле й плани",
          details: "Обговоріть вихідні й плани, поставте власні запитання та домовтеся про зустріч. Можна перепитувати й робити паузи. Успіх — ви обмінялися потрібною інформацією та погодили деталі.",
        },
        {
          id: "a2-checkpoint-write",
          title: "Повідомлення й коротка історія з перевіркою",
          details: "Напишіть повідомлення від 25 слів і історію за картинками від 35 слів у форматі A2 Key. Перевірте всі пункти, послідовність подій і зрозумілість; після відгуку переробіть текст.",
          links: [EXTERNAL.keyPreparation, bcSkill("writing", "a2")],
        },
        {
          id: "a2-checkpoint-exam",
          title: "Складіть іспит A2 Key (KET)",
          details: "Офіційний сертифікат не обов’язковий, але добре мотивує й фіксує результат.",
          links: [EXTERNAL.keyPreparation],
          optional: true,
        },
      ],
    },
  ],
  resources: [
    { ...bcGrammar("граматика A1–A2", "a1-a2"), note: "Пояснення й вправи до тем рівня" },
    { ...bcSkill("listening", "a2"), note: "Аудіо з транскриптами й завданнями" },
    { ...bcSkill("reading", "a2"), note: "Тексти рівня A2 з вправами" },
    { ...EXTERNAL.newsInLevels, note: "Новини, адаптовані під рівень" },
    { ...EXTERNAL.keyPreparation, note: "Офіційні безкоштовні зразки іспиту" },
    { ...SITE.dictionaryA2, note: "Слова A2 з перекладом і прикладами" },
    { ...SITE.tests, note: "Перевірка слів у тестах" },
  ],
};
