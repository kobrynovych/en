import type { RoadmapStage } from "../types";
import { bcGrammar, bcSkill, EXTERNAL, SITE } from "./links";

export const STAGE_A1: RoadmapStage = {
  id: "a1",
  code: "A1",
  title: "Початковий",
  cefrName: "Breakthrough",
  tagline: "Прості фрази про себе, родину, покупки й щоденні справи",
  summary:
    "Ви розумієте та вживаєте знайомі повсякденні вирази й найпростіші фрази для конкретних потреб. Можете представитися й представити інших, запитати та відповісти про особисте: де людина живе, кого знає, що має. Спілкуєтеся на простому рівні, якщо співрозмовник говорить повільно, чітко й готовий допомогти.",
  stageHours: "≈ 70 год",
  totalHours: "≈ 90–100 год",
  pace: "≈ 10 тижнів по 7 год на тиждень",
  vocabulary: "≈ 700–1000 слів і фраз загалом; добірка A1 з Oxford 3000",
  certification: "Завдання з чотирьох навичок; онлайн-тест як додатковий орієнтир",
  learningPath: [
    "Я та моє оточення: to be, займенники, артиклі, have got, there is / are. Представте себе й опишіть кімнату.",
    "Мій день: Present Simple / Continuous, запитання, can, час і кількість. Замовте їжу та домовтеся про просту зустріч.",
    "Учора й завтра: Past Simple, going to, порівняння. Напишіть коротке повідомлення й виконайте контрольні завдання.",
  ],
  outcomes: [
    {
      skill: "interaction",
      items: [
        "Вітаєтеся, прощаєтеся й питаєте, як справи.",
        "Ставите й відповідаєте на прості особисті запитання (What's your name? How old are you?), якщо співрозмовник говорить повільно й допомагає.",
      ],
    },
    {
      skill: "production",
      items: [
        "Дуже просто розповідаєте про себе, родину й місце, де живете.",
        "Називаєте адресу, номер телефону, національність, вік і хобі.",
      ],
    },
    {
      skill: "listening",
      items: [
        "Розумієте прості слова й фрази на кшталт excuse me, sorry, thank you.",
        "Розумієте дні тижня, місяці, час, дати, числа й ціни.",
      ],
    },
    {
      skill: "reading",
      items: [
        "Впізнаєте знайомі слова на вивісках: station, car park, no parking.",
        "Розумієте прості анкети та дуже прості речення, особливо з картинками.",
      ],
    },
    {
      skill: "writing",
      items: [
        "Пишете прості речення про себе: де живете й чим займаєтеся.",
        "Заповнюєте анкету: ім’я, прізвище, дата народження, громадянство.",
      ],
    },
    {
      skill: "strategies",
      items: ["Налагоджуєте контакт простими словами й жестами.", "Кажете, що не зрозуміли, і просите повторити."],
    },
  ],
  functions: [
    "Привітання",
    "Особиста інформація",
    "Звички й розпорядок дня",
    "Як пройти (напрямки)",
    "Котра година",
    "Числа",
    "Ціни",
  ],
  topics: ["Сім’я", "Дім", "Одяг і погода", "Їжа", "Хобі та дозвілля", "Відпочинок", "Покупки", "Робота й професії"],
  pitfalls: [
    {
      wrong: "She a doctor.",
      right: "She is a doctor.",
      note: "В українській «є» зазвичай пропускаємо, а в англійській дієслово to be обов’язкове.",
    },
    {
      wrong: "He work in a bank.",
      right: "He works in a bank.",
      note: "У Present Simple з he / she / it до дієслова додаємо -s або -es.",
    },
    {
      wrong: "You like coffee?",
      right: "Do you like coffee?",
      note: "Запитання в Present Simple будуємо з допоміжним do / does, а не лише інтонацією.",
    },
    {
      wrong: "I have dog.",
      right: "I have a dog.",
      note: "Злічуваний іменник в однині не вживається «голим»: потрібен a / an, the або my, this тощо.",
    },
    {
      wrong: "I don't know nothing.",
      right: "I don't know anything.",
      note: "В англійському реченні лише одне заперечення — на відміну від українського «нічого не знаю».",
    },
    {
      wrong: "People is friendly.",
      right: "People are friendly.",
      note: "People — це множина (люди), тому дієслово теж у множині.",
    },
  ],
  modules: [
    {
      id: "a1-grammar",
      kind: "grammar",
      title: "Граматика",
      intro:
        "Теми A1 за British Council / EAQUALS Core Inventory. Відмічайте тему, коли вживаєте її у власних реченнях, а не лише впізнаєте правило.",
      tasks: [
        {
          id: "a1-grammar-to-be",
          title: "Дієслово to be: am / is / are",
          details:
            "Ствердження, заперечення й запитання: I am, you are, he is; скорочення I'm, isn't, aren't. На відміну від української, дієслово-зв’язку не можна пропускати.",
          examples: ["I'm a student.", "She isn't at home.", "Are you from Ukraine? — Yes, I am."],
          links: [bcGrammar("to be", "a1-a2/present-simple-be")],
        },
        {
          id: "a1-grammar-pronouns",
          title: "Займенники й присвійний відмінок 's",
          details:
            "Підмет: I, you, he, she, it, we, they; додаток: me, you, him, her, it, us, them. Перед іменником — my, your, his, her, its, our, their; 's позначає власника: Anna's bag. Не плутайте its та it's (it is).",
          examples: ["This is my brother. His name is Max.", "It's Kate's phone.", "Their house is big."],
          links: [bcGrammar("possessive 's", "a1-a2/possessive-s")],
        },
        {
          id: "a1-grammar-articles",
          title: "Артиклі a / an / the і множина іменників",
          details:
            "a / an — один з багатьох, the — конкретний, уже відомий предмет. a / an обираємо за звуком: a university, an hour. Множина: -s / -es і винятки man – men, child – children, person – people.",
          examples: ["I have an apple.", "The apple is red.", "Two children and three women."],
          links: [bcGrammar("articles", "a1-a2-grammar/articles-a-an-the")],
        },
        {
          id: "a1-grammar-demonstratives",
          title: "this / that / these / those і прикметники",
          details:
            "this / these — поруч, that / those — далі. Прикметник стоїть перед іменником і не змінюється: a big house — big houses. Підсилення: very, really.",
          examples: ["This is my laptop.", "Those shoes are cheap.", "It's a really good film."],
        },
        {
          id: "a1-grammar-there-is",
          title: "There is / There are",
          details:
            "Кажемо, що щось десь є або розташоване: There's a bank near the station. У запитаннях і запереченнях — any.",
          examples: ["There's a café near my house.", "There are two bedrooms.", "Is there a bus stop here?"],
          links: [bcGrammar("there is / there are", "a1-a2/using-there-there-are")],
        },
        {
          id: "a1-grammar-have-got",
          title: "have і have got",
          details:
            "Володіння й родинні зв’язки: I have a sister = I've got a sister. Have got частіше звучить у британській розмовній мові.",
          examples: ["I've got two brothers.", "Do you have a car?", "She hasn't got a dog."],
          links: [bcGrammar("have got", "a1-a2/present-simple-have-got")],
        },
        {
          id: "a1-grammar-present-simple",
          title: "Present Simple",
          details:
            "Звички, розклади й факти. У третій особі однини додаємо -s: she works. Запитання й заперечення — з do / does: Do you work? She doesn't eat meat.",
          examples: ["I get up at seven.", "My sister works in a hospital.", "Does the shop open on Sunday?"],
          links: [bcGrammar("present simple", "a1-a2/present-simple")],
        },
        {
          id: "a1-grammar-frequency",
          title: "Прислівники частотності",
          details: "always, usually, often, sometimes, never. Стоять перед основним дієсловом, але після to be.",
          examples: ["I usually walk to work.", "She is never late.", "We sometimes eat out."],
        },
        {
          id: "a1-grammar-present-continuous",
          title: "Present Continuous",
          details:
            "Дія, що відбувається зараз: am / is / are + -ing. Порівняйте: I read every day (звичка) і I'm reading now (саме зараз).",
          examples: ["I'm cooking dinner right now.", "What are you doing?", "It's raining."],
        },
        {
          id: "a1-grammar-can",
          title: "can / can't і could для прохань",
          details:
            "Уміння й можливість (I can swim), дозвіл і ввічливі прохання (Can / Could I…?). Після can дієслово вживаємо без to.",
          examples: ["I can speak a little English.", "She can't drive.", "Could I use your phone?"],
        },
        {
          id: "a1-grammar-imperatives",
          title: "Наказовий спосіб і Let's",
          details: "Інструкції, прохання й поради: Open the window. Don't worry! Пропозиція зробити щось разом: Let's go!",
          examples: ["Turn left at the bank.", "Don't be late!", "Let's have a break."],
        },
        {
          id: "a1-grammar-questions",
          title: "Запитання з питальними словами",
          details:
            "what, where, when, who, why, how, how old, how much / how many. Порядок слів: питальне слово + допоміжне дієслово + підмет + дієслово.",
          examples: ["Where do you live?", "What time is it?", "How old is your son?"],
          links: [bcGrammar("question forms", "a1-a2/question-forms")],
        },
        {
          id: "a1-grammar-prepositions",
          title: "Прийменники місця й часу: in / on / at",
          details: "Місце: in the room, on the table, at the bus stop. Час: at five o'clock, on Monday, in May, in 2025.",
          examples: ["The keys are on the table.", "See you on Friday at six.", "I was born in 1995."],
          links: [
            bcGrammar("prepositions of place", "a1-a2/prepositions-place"),
            bcGrammar("prepositions of time", "a1-a2-grammar/prepositions-of-time-at-in-on"),
          ],
        },
        {
          id: "a1-grammar-countable",
          title: "Злічувані й незлічувані, some / any",
          details:
            "Незлічувані іменники (water, money, bread, information) не мають множини й не вживаються з a / an. How many — для злічуваних, how much — для незлічуваних; some у ствердженнях, any — у запитаннях і запереченнях.",
          examples: ["How many apples do we need?", "How much is it?", "Is there any milk?"],
          links: [bcGrammar("countable and uncountable nouns", "a1-a2/nouns-countable-uncountable")],
        },
        {
          id: "a1-grammar-like-ing",
          title: "like / love / hate + -ing і would like",
          details: "Загальні вподобання: I like swimming. Ввічливе бажання тут і зараз: I'd like a coffee, please.",
          examples: ["I love reading.", "He hates getting up early.", "I'd like a cup of tea, please."],
        },
        {
          id: "a1-grammar-past-be",
          title: "Past Simple: was / were",
          details: "Минулий час дієслова to be: I / he / she / it was, you / we / they were.",
          examples: ["I was at home yesterday.", "Were you at school?", "The film wasn't very good."],
        },
        {
          id: "a1-grammar-past-simple",
          title: "Past Simple: правильні й неправильні дієслова",
          details:
            "Правильні дієслова отримують -ed (worked, played), неправильні треба вивчити (went, saw, had, did). Запитання й заперечення — з did і першою формою: Did you go? I didn't see.",
          examples: ["I watched a film last night.", "We went to the sea in July.", "Did you see Tom? — No, I didn't."],
          links: [SITE.irregularVerbs],
        },
        {
          id: "a1-grammar-going-to",
          title: "be going to для планів",
          details: "Наміри на майбутнє: am / is / are going to + дієслово.",
          examples: ["I'm going to visit my parents on Sunday.", "Are you going to study this weekend?"],
        },
        {
          id: "a1-grammar-comparatives",
          title: "Ступені порівняння прикметників",
          details:
            "Короткі прикметники: big – bigger – the biggest; довгі: interesting – more interesting – the most interesting; винятки: good – better – the best, bad – worse – the worst.",
          examples: ["My brother is taller than me.", "This is the best pizza in town."],
          links: [bcGrammar("comparative adjectives", "a1-a2/comparative-adjectives")],
        },
        {
          id: "a1-grammar-linkers",
          title: "Сполучники and, but, because, or",
          details: "Поєднуйте короткі речення в довші — так мовлення звучить природніше.",
          examples: ["I like tea, but I don't like coffee.", "I'm tired because I worked late."],
        },
      ],
    },
    {
      id: "a1-vocabulary",
      kind: "vocabulary",
      title: "Лексика й теми",
      intro: "Лексичні теми A1 за Core Inventory. Вчіть слова фразами й одразу додавайте в інтервальне повторення.",
      tasks: [
        {
          id: "a1-vocabulary-dictionary",
          title: "Пройдіть словник A1 на сайті",
          details:
            "Добирайте слова A1 до поточної теми з перекладом, аудіо й прикладами. Для кожного складіть власну фразу та перевірте, чи можете згадати його без підказки. Обсяг словника сайту не є вимогою для переходу на A2.",
          links: [SITE.dictionaryA1, SITE.flashcards, SITE.review],
        },
        {
          id: "a1-vocabulary-personal",
          title: "Особисті дані, сім’я, професії",
          details: "name, surname, address, age, married, parents, brother, daughter; teacher, doctor, engineer, manager.",
          examples: ["I'm married with two children.", "What do you do? — I'm an engineer."],
        },
        {
          id: "a1-vocabulary-countries",
          title: "Країни й національності",
          details:
            "Ukraine – Ukrainian, Poland – Polish, Germany – German. Назви країн, національностей і мов пишуться з великої літери.",
          examples: ["I'm Ukrainian.", "She's from Poland, but she lives in Spain."],
        },
        {
          id: "a1-vocabulary-food",
          title: "Їжа й напої",
          details: "Продукти, страви, напої та фрази для кафе: a bottle of water, a cup of coffee, a piece of cake.",
          examples: ["I have a cup of tea every morning.", "Can I have the menu, please?"],
        },
        {
          id: "a1-vocabulary-town",
          title: "Місто, магазини й покупки",
          details:
            "bank, pharmacy, supermarket, post office, bus stop; ціни й розміри: How much is it? Can I try it on?",
          examples: ["Is there a pharmacy near here?", "How much are these jeans?"],
        },
        {
          id: "a1-vocabulary-daily",
          title: "Час і розпорядок дня",
          details:
            "What's the time? It's half past seven / a quarter to eight; get up, have breakfast, go to work, go to bed.",
          examples: ["It's a quarter past nine.", "I usually go to bed at eleven."],
        },
        {
          id: "a1-vocabulary-verbs",
          title: "Базові дієслова",
          details:
            "be, have, do, go, come, get, make, take, like, want, need, know, live, work, study, buy, eat, drink — основа більшості речень.",
          examples: ["I need to buy some bread.", "We live in a small flat."],
        },
        {
          id: "a1-vocabulary-home-clothes",
          title: "Дім, одяг, погода й частини тіла",
          details: "Кімнати, базові меблі, повсякденний одяг, погода та частини тіла: bedroom, table, coat, shoes, sunny, cold, head, hand. Опишіть кімнату й скажіть, що вдягнете сьогодні.",
          examples: ["My coat is on the chair.", "It's cold today. I need a warm jacket."],
        },
        {
          id: "a1-vocabulary-hobbies",
          title: "Хобі та вільний час",
          details: "play football, go swimming, listen to music, watch films, read books, travel.",
          examples: ["In my free time I play the guitar.", "Do you like travelling?"],
        },
      ],
    },
    {
      id: "a1-pronunciation",
      kind: "pronunciation",
      title: "Вимова",
      tasks: [
        {
          id: "a1-pronunciation-vowels",
          title: "Довгі й короткі голосні",
          details: "Відрізняються і якість, і тривалість голосного: ship /ɪ/ – sheep /iː/, live – leave, full /ʊ/ – fool /uː/. Порівнюйте з аудіо, а не лише розтягуйте звук.",
          examples: ["ship – sheep", "live – leave", "full – fool"],
        },
        {
          id: "a1-pronunciation-s",
          title: "Закінчення -s: /s/, /z/, /ɪz/",
          details: "Після глухих — /s/ (works), після дзвінких і голосних — /z/ (plays), після шиплячих і свистячих — /ɪz/ (watches).",
          examples: ["works, cats", "plays, dogs", "watches, buses"],
        },
        {
          id: "a1-pronunciation-ed",
          title: "Закінчення -ed: /t/, /d/, /ɪd/",
          details: "/t/ після глухих (worked), /d/ після дзвінких (played), /ɪd/ після t і d (wanted, needed).",
          examples: ["worked, stopped", "played, lived", "wanted, needed"],
        },
        {
          id: "a1-pronunciation-stress",
          title: "Наголос у словах",
          details:
            "Неправильний наголос заважає зрозуміти навіть просте слово. У словнику наголошений склад позначено знаком ˈ: ˈteacher, beˈgin, hoˈtel, comˈputer.",
          examples: ["teacher", "begin", "hotel", "computer"],
        },
        {
          id: "a1-pronunciation-intonation",
          title: "Інтонація запитань",
          details:
            "У запитаннях yes / no голос зазвичай іде вгору (Are you ready? ↗), у запитаннях з what, where, when — униз (Where do you live? ↘).",
          examples: ["Are you ready?", "Where do you live?"],
        },
      ],
    },
    {
      id: "a1-listening",
      kind: "listening",
      title: "Аудіювання",
      tasks: [
        {
          id: "a1-listening-numbers",
          title: "Числа, ціни, час і дати на слух",
          details: "Слухайте оголошення, діалоги в магазині й розклади. Записуйте почуті числа й звіряйтеся з транскриптом.",
          links: [bcSkill("listening", "a1")],
        },
        {
          id: "a1-listening-daily",
          title: "10–15 хвилин аудіо щодня",
          details:
            "Короткі повільні діалоги для початківців: спершу без тексту, потім із транскриптом, потім знову без нього.",
          links: [bcSkill("listening", "a1"), EXTERNAL.bbcLearningEnglish],
        },
        {
          id: "a1-listening-shadowing",
          title: "Повторення за диктором (shadowing)",
          details:
            "Вмикайте коротку фразу, ставте на паузу й повторюйте з тією самою інтонацією. Так одночасно тренуються слух і вимова.",
          links: [SITE.reading],
        },
      ],
    },
    {
      id: "a1-reading",
      kind: "reading",
      title: "Читання",
      tasks: [
        {
          id: "a1-reading-signs",
          title: "Вивіски, меню, оголошення",
          details: "Короткі тексти з реального життя: Open / Closed, Push / Pull, Exit, No parking, Out of order.",
          examples: ["Push", "Out of order", "No parking"],
        },
        {
          id: "a1-reading-texts",
          title: "10 коротких текстів рівня A1",
          details:
            "Тексти про людей, місця й розпорядок дня. Не перекладайте кожне слово: спершу зрозумійте загальний зміст, потім деталі.",
          links: [bcSkill("reading", "a1"), EXTERNAL.newsInLevels],
        },
        {
          id: "a1-reading-graded",
          title: "Перша адаптована книга (Starter / Level 1)",
          details:
            "Серії Oxford Bookworms, Penguin Readers і Cambridge English Readers мають книги для початківців обсягом кілька тисяч слів. Одна книга на рівень — чудовий перший досвід.",
        },
      ],
    },
    {
      id: "a1-speaking",
      kind: "speaking",
      title: "Говоріння",
      tasks: [
        {
          id: "a1-speaking-intro",
          title: "Розповідь про себе (1 хвилина)",
          details:
            "Ім’я, вік, місто, сім’я, робота чи навчання, хобі. Підготуйте текст, а потім розкажіть без нього й запишіть себе.",
          examples: ["My name is Ira. I'm from Kharkiv. I work in an IT company. In my free time I like cooking."],
        },
        {
          id: "a1-speaking-questions",
          title: "Діалог-знайомство: 10 базових запитань",
          details: "Навчіться ставити й відповідати на запитання про ім’я, країну, роботу, сім’ю та вподобання.",
          examples: [
            "Where are you from?",
            "What do you do?",
            "Have you got any brothers or sisters?",
            "What do you like doing at the weekend?",
          ],
        },
        {
          id: "a1-speaking-shop",
          title: "Рольова гра: кафе й магазин",
          details: "Замовлення, запитання про ціну, оплата.",
          examples: ["Can I have a coffee, please?", "How much is it? — It's three pounds fifty.", "Can I pay by card?"],
        },
        {
          id: "a1-speaking-directions",
          title: "Як пройти: запитати й пояснити дорогу",
          details: "Excuse me, where is…? Go straight on, turn left / right, it's next to / opposite…",
          examples: ["Excuse me, where is the station?", "Go straight on and turn left.", "It's opposite the bank."],
        },
        {
          id: "a1-speaking-relay",
          title: "Передайте час і місце зустрічі",
          details: "Прочитайте просте запрошення й повідомте партнерові, де та коли зустріч. Можна підглядати; головне — правильно передати місце й час.",
          examples: ["The meeting is at four, at the café."],
        },
        {
          id: "a1-speaking-record",
          title: "Щотижневий самозапис",
          details:
            "Раз на тиждень запишіть коротку розповідь і розіграйте діалог із партнером чи викладачем. Попросіть назвати одну зрозумілу й одну складну фразу. Самозапис доповнює практику взаємодії.",
          links: [bcSkill("speaking", "a1")],
        },
      ],
    },
    {
      id: "a1-writing",
      kind: "writing",
      title: "Письмо",
      tasks: [
        {
          id: "a1-writing-form",
          title: "Анкета з особистими даними",
          details:
            "Ім’я, прізвище, адреса, дата народження, громадянство. Зверніть увагу: у британському форматі дата — день/місяць/рік, в американському — місяць/день/рік.",
        },
        {
          id: "a1-writing-about-me",
          title: "5–7 речень про себе",
          details: "Використовуйте and, but, because, щоб поєднувати речення.",
          examples: ["I live in Dnipro with my family.", "I like my job because it's interesting."],
        },
        {
          id: "a1-writing-message",
          title: "Коротке повідомлення або листівка (20–30 слів)",
          details: "Привітання, де ви, що робите, прощання. Потренуйте також коротку відповідь у чаті: подякуйте й дайте відповідь на просте запитання; можна користуватися зразком.",
          links: [bcSkill("writing", "a1")],
          examples: ["Hi Tom! I'm in Odesa. The weather is great and the sea is warm. See you soon! Anna"],
        },
      ],
    },
    {
      id: "a1-checkpoint",
      kind: "checkpoint",
      title: "Контрольна точка",
      intro: "Перевірте всі чотири навички. На A1 нормальні короткі фрази, паузи, повторення й допомога співрозмовника. Повторіть завдання на іншому матеріалі через кілька днів. Числа нижче — тренувальні орієнтири цієї карти.",
      tasks: [
        {
          id: "a1-checkpoint-self",
          title: "Самооцінка за переліком «Що ви зможете»",
          details: "Для кожного вміння з початку рівня наведіть власний приклад. Збережіть короткий текст і запис розмови; позначте, що виходить самостійно, а що — лише зі зразком.",
        },
        {
          id: "a1-checkpoint-test",
          title: "Додаткова діагностика A1",
          details:
            "Збережіть результат онлайн-тесту й перевірте перелік оцінених навичок. Він доповнює практичні завдання нижче; окремий тест слів чи граматики не підтверджує весь рівень.",
          links: [EXTERNAL.efset, EXTERNAL.cambridgeTest],
          optional: true,
        },
        {
          id: "a1-checkpoint-words",
          title: "Міні-тести словника A1 на 80%+",
          details: "Перевірте слова A1 у режимі тестів і повторіть ті, у яких помиляєтеся.",
          links: [SITE.tests],
        },
        {
          id: "a1-checkpoint-talk",
          title: "Коротка розповідь і діалог про себе",
          details:
            "Розкажіть про свій день приблизно хвилину, дайте відповіді на п’ять простих запитань і поставте свої. Партнер може говорити повільно й повторювати. Перевірте, чи він зрозумів головні факти.",
        },
        {
          id: "a1-checkpoint-listen",
          title: "Аудіювання: зрозумійте короткий діалог A1",
          details: "Прослухайте новий повільний діалог двічі без тексту. Визначте, хто говорить, про що йдеться, і дві деталі. Потім перевірте за транскриптом та повторіть складний фрагмент.",
          links: [bcSkill("listening", "a1")],
        },
        {
          id: "a1-checkpoint-read",
          title: "Читання: знайдіть інформацію в повідомленні",
          details: "У новому короткому тексті A1 знайдіть ім’я, місце й час або ціну. Можна перечитати; спершу спробуйте без перекладача всього тексту, потім перевірте відповіді.",
          links: [bcSkill("reading", "a1")],
        },
        {
          id: "a1-checkpoint-write",
          title: "Письмо: анкета й повідомлення на 20–30 слів",
          details: "Заповніть анкету й напишіть другові, де ви та що робите. Перевірте великі літери, крапки й форми to be. Попросіть партнера сказати, яку інформацію він зрозумів; виправте неясні місця.",
          links: [bcSkill("writing", "a1")],
        },
      ],
    },
  ],
  resources: [
    { ...bcGrammar("граматика A1–A2", "a1-a2"), note: "Пояснення й вправи до кожної теми рівня" },
    { ...bcSkill("listening", "a1"), note: "Короткі аудіо з транскриптами й завданнями" },
    { ...EXTERNAL.bbcLearningEnglish, note: "Безкоштовні курси, відео й подкасти" },
    { label: "Essential Grammar in Use (R. Murphy)", note: "Класичний підручник граматики для рівнів A1–B1" },
    { ...SITE.dictionaryA1, note: "Слова A1 з перекладом, IPA й прикладами" },
    { ...SITE.irregularVerbs, note: "Три форми дієслів з озвученням" },
    { ...SITE.review, note: "Інтервальне повторення вивчених слів" },
  ],
};
