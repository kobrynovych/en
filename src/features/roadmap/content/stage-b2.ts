import type { RoadmapStage } from "../types";
import { bcGrammar, bcSkill, EXTERNAL } from "./links";

export const STAGE_B2: RoadmapStage = {
  id: "b2",
  code: "B2",
  title: "Вище середнього",
  cefrName: "Vantage",
  tagline: "Вільна розмова, аргументація, фільми й фахові тексти",
  summary:
    "Ви розумієте основні ідеї складних текстів на конкретні й абстрактні теми, зокрема фахові обговорення у своїй галузі. Спілкуєтеся настільки вільно й спонтанно, що регулярна розмова з носіями мови не напружує жодну зі сторін. Пишете чіткі детальні тексти на широке коло тем і пояснюєте свою позицію, зважуючи переваги й недоліки різних варіантів.",
  stageHours: "≈ 150–200 год",
  totalHours: "≈ 500–600 год",
  pace: "≈ 22–29 тижнів по 7 год на тиждень",
  vocabulary: "≈ 3500–4500 слів і фраз загалом; добірка B2 з Oxford 3000/5000",
  certification: "Пробні завдання B2 First; офіційний іспит — за бажанням",
  learningPath: [
    "Точність: повторіть слабкі теми B1, опрацюйте складні часові зв’язки, модальні форми й пасив. Пояснюйте причини та наслідки.",
    "Аргументація: умовні речення, wish, підрядні речення, колокації та стиль. Порівняйте варіанти й захистіть рішення в дискусії.",
    "Самостійність: зіставте джерела, підготуйте звіт, лист і есе. Виконайте підсумкові завдання з чотирьох навичок та отримайте відгук.",
  ],
  outcomes: [
    {
      skill: "interaction",
      items: [
        "Активно берете участь у розмові, чітко висловлюєте думки й природно чергуєтеся репліками.",
        "Оцінюєте переваги й недоліки та разом ухвалюєте рішення у формальній чи неформальній дискусії.",
        "Телефоном з’ясовуєте детальну інформацію й перепитуєте, щоб переконатися, що все зрозуміли.",
      ],
    },
    {
      skill: "production",
      items: [
        "Даєте чіткі детальні описи на широке коло тем зі своєї сфери інтересів.",
        "Будуєте логічну аргументацію з прикладами й критично висвітлюєте актуальне питання.",
        "Підсумовуєте інформацію з кількох джерел, переказуєте сюжет фільму чи книги.",
      ],
    },
    {
      skill: "listening",
      items: [
        "Розумієте основні ідеї складного мовлення на конкретні й абстрактні теми.",
        "Розумієте новини, документальні фільми, інтерв’ю, ток-шоу та більшість фільмів стандартною мовою.",
      ],
    },
    {
      skill: "reading",
      items: [
        "Читаєте значною мірою самостійно, вибірково користуючись словником.",
        "Розумієте статті, огляди й звіти, у яких автор висловлює певну позицію.",
      ],
    },
    {
      skill: "writing",
      items: [
        "Пишете розгорнуті тексти на актуальні теми, чіткі детальні описи й рецензії.",
        "Пишете листи з новинами, поглядами й почуттями, а також стандартні офіційні листи.",
      ],
    },
    {
      skill: "strategies",
      items: [
        "Виграєте час фразами на кшталт «That's a difficult question…», щоб сформулювати думку.",
        "Помічаєте й виправляєте власні помилки, свідомо стежите за своїми типовими помилками.",
      ],
    },
  ],
  functions: [
    "Критика й рецензування",
    "Розвиток аргументації",
    "Думка та її обґрунтування",
    "Згода й незгода",
    "Припущення",
    "Реакція: інтерес, співчуття, здивування",
    "Запрошення співрозмовника висловитися",
    "Узагальнення й оцінка інформації",
  ],
  topics: ["Мистецтво", "Книги й література", "Освіта", "Кіно", "Медіа", "Суспільство", "Довкілля", "Технології та наука", "Робота й професійне спілкування", "Актуальні події"],
  pitfalls: [
    {
      wrong: "If I would have known, I would have come.",
      right: "If I had known, I would have come.",
      note: "У третьому умовному після if — Past Perfect, а не would have.",
    },
    {
      wrong: "I wish I would be taller.",
      right: "I wish I were taller.",
      note: "wish про теперішній стан — з Past Simple (were / was). wish + would виражає бажану зміну поведінки чи ситуації: I wish it would stop raining.",
    },
    {
      wrong: "Despite of the rain, we went out.",
      right: "Despite the rain, we went out.",
      note: "despite вживаємо без of, а in spite of — з of.",
    },
    {
      wrong: "We discussed about the problem.",
      right: "We discussed the problem.",
      note: "discuss, enter, marry, answer, lack вживаються без прийменника.",
    },
    {
      wrong: "Explain me this rule.",
      right: "Explain this rule to me.",
      note: "Після explain, describe, suggest адресата вводимо через to.",
    },
    {
      wrong: "My brother, that lives in Canada, is a doctor.",
      right: "My brother, who lives in Canada, is a doctor.",
      note: "У неозначувальних підрядних реченнях (додаткова інформація в комах) that не вживаємо.",
    },
  ],
  modules: [
    {
      id: "b2-grammar",
      kind: "grammar",
      title: "Граматика",
      intro:
        "Теми B2 з опорою на British Council / EAQUALS Core Inventory: часові зв’язки, змішані умовні, wish, припущення про минуле й поширені форми пасиву. Поглиблюйте їх через мовлення та тексти.",
      tasks: [
        {
          id: "b2-grammar-future-perfect",
          title: "Future Continuous і Future Perfect",
          details:
            "Future Continuous — процес у певний момент майбутнього, Future Perfect — дія, завершена до цього моменту, Future Perfect Continuous — тривалість до моменту в майбутньому.",
          examples: [
            "This time next year I'll be working in Japan.",
            "By 2030 I will have finished university.",
            "By June I'll have been working here for ten years.",
          ],
          links: [bcGrammar("future continuous and future perfect", "b1-b2/future-continuous-future-perfect")],
        },
        {
          id: "b2-grammar-narrative",
          title: "Розповідні часи й Past Perfect Continuous",
          details:
            "Для яскравих історій поєднуйте Past Simple, Past Continuous, Past Perfect і Past Perfect Continuous — тривалу дію до певного моменту в минулому.",
          examples: ["I was exhausted — I'd been working for twelve hours.", "Had they been waiting long?"],
        },
        {
          id: "b2-grammar-mixed-conditionals",
          title: "Змішані умовні речення",
          details: "Умова в минулому з результатом у теперішньому — і навпаки.",
          examples: ["If I had studied medicine, I would be a doctor now.", "If I weren't so shy, I would have spoken to her."],
          links: [bcGrammar("third and mixed conditionals", "b1-b2/conditionals-third-mixed")],
        },
        {
          id: "b2-grammar-wish",
          title: "wish і if only",
          details:
            "Жаль про теперішнє (wish + Past Simple), про минуле (wish + Past Perfect), роздратування через чужу поведінку (wish + would).",
          examples: ["I wish I knew the answer.", "I wish I had listened to you.", "I wish you would stop talking."],
          links: [bcGrammar("wish and if only", "b1-b2/wishes-wish-if-only")],
        },
        {
          id: "b2-grammar-past-deduction",
          title: "Модальні дієслова про минуле",
          details:
            "must have / can't have / might have — припущення про минуле; needn't have — зробили, хоча потреби не було.",
          examples: [
            "He must have missed the bus.",
            "She can't have forgotten — I reminded her twice.",
            "You needn't have bought flowers.",
          ],
          links: [bcGrammar("deductions about the past", "b1-b2/modals-deductions-about-past")],
        },
        {
          id: "b2-grammar-passive",
          title: "Складніші форми пасиву й have / get something done",
          details:
            "Пасив у складних часах, безособові конструкції (It is said that…, He is believed to…) і каузатив have / get something done.",
          examples: ["The house is being painted.", "I had my hair cut yesterday.", "It is said that the castle is haunted."],
          links: [bcGrammar("passives", "b1-b2/passives")],
        },
        {
          id: "b2-grammar-relative",
          title: "Неозначувальні підрядні речення",
          details: "Додаткова інформація в комах із who, which, whose; that у таких реченнях не вживається.",
          examples: ["My brother, who lives in Canada, is a doctor.", "The museum, which opened in 2010, is free."],
          links: [bcGrammar("non-defining relative clauses", "b1-b2/relative-clauses-non-defining-relative-clauses")],
        },
        {
          id: "b2-grammar-reporting",
          title: "Непряма мова: дієслова-репортери",
          details: "suggest, advise, warn, deny, admit, promise, refuse, remind — у кожного своя конструкція.",
          examples: ["She advised me to rest.", "He denied taking the money.", "They suggested going by train."],
          links: [bcGrammar("reporting verbs", "b1-b2/reported-speech-reporting-verbs")],
        },
        {
          id: "b2-grammar-habits",
          title: "would, used to, be / get used to",
          details:
            "would і used to — звички в минулому (would — лише для дій, не для станів); be used to — звик, get used to — звикаю.",
          examples: [
            "When I was a child, we would go fishing every summer.",
            "I'm used to getting up early.",
            "You'll soon get used to the noise.",
          ],
          links: [bcGrammar("used to, would and past simple", "b1-b2-grammar/past-habits-used-to-would-past-simple")],
        },
        {
          id: "b2-grammar-verb-meaning",
          title: "-ing чи to-інфінітив зі зміною значення",
          details:
            "stop, remember, forget, try, regret: I stopped smoking (кинув палити) — I stopped to smoke (зупинився, щоб закурити).",
          examples: ["I remember locking the door.", "Remember to lock the door.", "Try turning it off and on again."],
          links: [bcGrammar("-ing or infinitive: change of meaning", "b1-b2/verbs-followed-ing-or-infinitive-change-meaning")],
        },
        {
          id: "b2-grammar-linkers",
          title: "Зв’язки для аргументації",
          details:
            "although / despite / in spite of, whereas, nevertheless, consequently, therefore, moreover, on the other hand, in conclusion.",
          examples: ["Despite the rain, we had a great time.", "The forecast is good. Nevertheless, take a jacket."],
          links: [bcGrammar("although, despite and others", "b1-b2/contrasting-ideas-although-despite-others")],
        },
        {
          id: "b2-grammar-adjectives",
          title: "Градуйовані й неградуйовані прикметники",
          details:
            "very cold, але absolutely freezing; порядок прикметників (a lovely old wooden table); прислівники ступеня fairly, rather, extremely.",
          examples: ["The film was absolutely brilliant.", "It's a lovely old wooden table."],
          links: [bcGrammar("gradable and non-gradable adjectives", "b1-b2/adjectives-gradable-non-gradable")],
        },
        {
          id: "b2-grammar-certainty",
          title: "Ступені ймовірності",
          details: "be bound to, be likely / unlikely to, be about to, be due to.",
          examples: ["It's bound to rain this weekend.", "Prices are likely to rise.", "The train is about to leave."],
          links: [bcGrammar("degrees of certainty", "b1-b2/future-degrees-certainty")],
        },
        {
          id: "b2-grammar-phrasal",
          title: "Фразові дієслова: просунутий рівень",
          details:
            "put up with, come across, look into, bring up, turn out, carry on; місце займенника: turn it down, а не turn down it.",
          examples: ["I can't put up with this noise.", "It turned out to be a great idea.", "Could you turn it down, please?"],
        },
        {
          id: "b2-grammar-emphasis",
          title: "Емфатичні конструкції",
          details: "What I need is…, It was John who…, The thing is… — щоб виділити головне в мовленні.",
          examples: ["What I really need is a holiday.", "It was my sister who told me."],
          optional: true,
        },
      ],
    },
    {
      id: "b2-vocabulary",
      kind: "vocabulary",
      title: "Лексика й теми",
      intro: "На B2 важлива точність: колокації, ідіоми, словотвір, перефразування й доречний стиль.",
      tasks: [
        {
          id: "b2-vocabulary-oxford",
          title: "Слова рівня B2 з Oxford 3000 і 5000",
          details:
            "Словник сайту охоплює рівні A1–B1, тому слова B2 беріть зі списків Oxford 3000 і Oxford 5000 та додавайте в картки.",
          links: [EXTERNAL.oxfordWordlists, EXTERNAL.anki],
        },
        {
          id: "b2-vocabulary-collocations",
          title: "Колокації та сталі вирази",
          details: "a heated debate, bitterly disappointed, highly unlikely, meet a deadline, raise awareness.",
          examples: ["We need to meet the deadline.", "It's highly unlikely."],
        },
        {
          id: "b2-vocabulary-idioms",
          title: "Ідіоми й розмовна мова",
          details: "Найуживаніші ідіоми та розмовні вирази: not my cup of tea, break the ice, once in a blue moon, chill out.",
          examples: ["Horror films aren't my cup of tea.", "Let's just chill out for an hour."],
          links: [EXTERNAL.englishWeSpeak],
        },
        {
          id: "b2-vocabulary-word-formation",
          title: "Словотвір рівня B2",
          details:
            "Іменники, прикметники й дієслова від одного кореня та заперечні префікси: decide → decision, decisive, indecisive.",
          examples: ["decide – decision – decisive", "rely – reliable – unreliable"],
        },
        {
          id: "b2-vocabulary-paraphrase",
          title: "Синоніми й перефразування",
          details:
            "Уміння сказати те саме іншими словами — ключова навичка B2 (завдання key word transformation у B2 First).",
          examples: ["It's not worth waiting. — There's no point in waiting."],
        },
        {
          id: "b2-vocabulary-abstract",
          title: "Абстрактні теми",
          details: "Суспільство, довкілля, технології, мистецтво, медіа, наука: обговорюйте причини, наслідки й рішення.",
          examples: ["Climate change is one of the biggest challenges of our time."],
        },
        {
          id: "b2-vocabulary-register",
          title: "Формальна й неформальна лексика",
          details: "get → obtain / receive, need → require, ask → enquire, find out → discover. Обирайте стиль під ситуацію.",
          examples: ["Please let me know. — Please inform me.", "I need help. — I require assistance."],
        },
      ],
    },
    {
      id: "b2-pronunciation",
      kind: "pronunciation",
      title: "Вимова",
      tasks: [
        {
          id: "b2-pronunciation-connected",
          title: "Зв’язне мовлення: випадіння й уподібнення звуків",
          details:
            "У швидкому мовленні звуки зникають і змінюються: next day /neks deɪ/, handbag /ˈhæmbæɡ/, did you /ˈdɪdʒə/. Розпізнавати це — ключ до розуміння носіїв.",
          examples: ["next day", "handbag", "Did you see it?"],
        },
        {
          id: "b2-pronunciation-emphasis",
          title: "Логічний наголос",
          details: "Наголос змінює зміст: I didn't say HE stole it — I didn't SAY he stole it.",
          examples: ["I didn't say he stole it.", "I'd like the red one, not the blue one."],
        },
        {
          id: "b2-pronunciation-rhythm",
          title: "Ритм англійської мови",
          details:
            "Наголошені склади звучать приблизно рівномірно, а ненаголошені між ними стискаються. Тренуйте ритм на коротких фразах і віршах.",
        },
        {
          id: "b2-pronunciation-model",
          title: "Модель вимови й зрозумілість",
          details:
            "Оберіть зручні аудіозразки для тренування. Працюйте над зрозумілістю, наголосом та інтонацією; акцент може зберігатися. Попросіть партнера переказати ваші ключові думки й уточніть фрази, які було складно зрозуміти.",
          links: [EXTERNAL.englishWithLucy, EXTERNAL.rachelsEnglish],
        },
      ],
    },
    {
      id: "b2-listening",
      kind: "listening",
      title: "Аудіювання",
      tasks: [
        {
          id: "b2-listening-native",
          title: "Подкасти й відео для носіїв",
          details: "Новини, інтерв’ю, ток-шоу, документальні фільми на цікаві вам теми — без спрощень.",
          links: [EXTERNAL.tedTalks, EXTERNAL.lukesPodcast, EXTERNAL.allEarsEnglish],
        },
        {
          id: "b2-listening-films",
          title: "Фільми й серіали: від субтитрів до перегляду без них",
          details: "Нові фільми дивіться з англійськими субтитрами, а знайомі серіали — вже без них.",
        },
        {
          id: "b2-listening-accents",
          title: "Різні акценти",
          details:
            "Британський, американський, австралійський, а також англійська неносіїв — у реальному житті ви почуєте всі. YouGlish покаже, як слово звучить у різних людей.",
          links: [EXTERNAL.youglish],
        },
        {
          id: "b2-listening-lectures",
          title: "Лекції й дискусії з конспектом",
          details: "Оберіть структурований виступ на відносно знайому тему. Запишіть основну тезу, хід аргументації та приклади; після першого прослуховування перевірте складні місця за транскриптом.",
          links: [bcSkill("listening", "b2")],
        },
        {
          id: "b2-listening-attitude",
          title: "Позиція мовця й деталі аргументів",
          details: "У новому інтерв’ю або дискусії визначте, з чим співрозмовники погоджуються, де сумніваються та якими словами пояснюють позицію. Наведіть фрагмент, який підтверджує кожен висновок.",
          links: [bcSkill("listening", "b2")],
        },
      ],
    },
    {
      id: "b2-reading",
      kind: "reading",
      title: "Читання",
      tasks: [
        {
          id: "b2-reading-fiction",
          title: "Художня література в оригіналі",
          details:
            "Прочитайте щонайменше дві сучасні книги в оригіналі. Для початку підходять підліткова проза й детективи з нескладною мовою.",
        },
        {
          id: "b2-reading-press",
          title: "Якісна преса",
          details:
            "3–4 статті на тиждень з великих англомовних медіа чи фахових видань. Визначайте головну думку, аргументи й тон автора.",
          links: [bcSkill("reading", "b2")],
        },
        {
          id: "b2-reading-opinion",
          title: "Тексти з позицією автора",
          details: "Колонки, рецензії, відгуки: відрізняйте факти від думок і шукайте аргументи «за» й «проти».",
        },
        {
          id: "b2-reading-work",
          title: "Фахові тексти, інструкції й звіти",
          details: "Прочитайте текст зі своєї галузі, знайдіть висновки, умови та потрібні дії. Складні місця перечитайте зі словником. Поясніть колезі, що важливо саме для його завдання.",
          links: [bcSkill("reading", "b2")],
        },
        {
          id: "b2-reading-extensive",
          title: "Читання без перекладу кожного слова",
          details:
            "Виписуйте лише слова, що заважають розумінню або трапляються кілька разів. Здогадуйтеся про значення з контексту.",
        },
      ],
    },
    {
      id: "b2-speaking",
      kind: "speaking",
      title: "Говоріння",
      tasks: [
        {
          id: "b2-speaking-discussion",
          title: "Дискусія й спільне рішення",
          details: "Обговоріть кілька варіантів, зважте переваги й недоліки та дійдіть згоди — як у B2 First (Part 3).",
          examples: ["Shall we start with this option?", "I'd go for the second one, because it's cheaper.", "So, have we agreed?"],
        },
        {
          id: "b2-speaking-photos",
          title: "Порівняння двох фото (1 хвилина)",
          details: "Порівнюйте й робіть припущення: They might be…, It looks as if…, Whereas in the first photo…",
          examples: [
            "It looks as if they're waiting for someone.",
            "Whereas in the first photo people are relaxed, in the second they seem stressed.",
          ],
        },
        {
          id: "b2-speaking-strategies",
          title: "Фрази для керування розмовою",
          details: "Виграти час, уточнити, запросити до розмови: That's a difficult question…, What I mean is…, What do you reckon?",
          examples: ["That's a difficult question. Let me think.", "What do you reckon?", "Going back to what you said…"],
        },
        {
          id: "b2-speaking-summary",
          title: "Переказ і підсумок",
          details: "Зіставте дві статті чи інтерв’ю на одну тему. За 2–3 хвилини поясніть головне партнерові: спільне, відмінності та важливі деталі. Відділіть позиції авторів від своєї оцінки.",
        },
        {
          id: "b2-speaking-debate",
          title: "Аргументація «за» і «проти»",
          details: "One reason why…, Another argument for / against… is…, On balance, I believe…",
          examples: ["One reason why I disagree is the cost.", "On balance, I believe it's a good idea."],
        },
        {
          id: "b2-speaking-online",
          title: "Онлайн-дискусія та спільне рішення",
          details: "У навчальному чаті або відеорозмові обговоріть два рішення, відреагуйте на аргумент партнера й підсумуйте домовленість. Якщо репліку зрозуміли неоднозначно, уточніть зміст і перефразуйте свою думку.",
          examples: ["If I understand you correctly, your main concern is the cost. Is that right?"],
        },
        {
          id: "b2-speaking-mistakes",
          title: "Журнал власних помилок",
          details:
            "Записуйте свої розмови, виписуйте типові помилки й свідомо стежте за ними в наступних розмовах.",
        },
        {
          id: "b2-speaking-practice",
          title: "Розмовна практика 2–3 рази на тиждень",
          details: "Регулярні розмови з викладачем, партнером або в клубі: технології, освіта, суспільство. Просіть відгук про зрозумілість, аргументацію та взаємодію; партнеру не обов’язково бути носієм мови.",
          links: [bcSkill("speaking", "b2"), EXTERNAL.italki],
        },
      ],
    },
    {
      id: "b2-writing",
      kind: "writing",
      title: "Письмо",
      tasks: [
        {
          id: "b2-writing-essay",
          title: "Есе з аргументацією (140–190 слів)",
          details: "У B2 First (Part 1) розкрийте дві задані ідеї та додайте власну третю. Дайте відповідь на запитання, обґрунтуйте позицію й організуйте текст в абзаци зі вступом і висновком.",
        },
        {
          id: "b2-writing-genres",
          title: "Стаття, огляд, звіт і лист",
          details: "Жанри B2 First (Part 2): у кожного своя структура, стиль і мета.",
        },
        {
          id: "b2-writing-formal",
          title: "Офіційний лист і скарга",
          details: "Формальний регістр, ввічливі формули й чітка мета листа.",
          examples: ["I am writing to complain about the service.", "I would be grateful if you could reply soon."],
        },
        {
          id: "b2-writing-cohesion",
          title: "Зв’язність і стиль",
          details: "Абзаци, зв’язки, займенники замість повторів, різноманітна лексика.",
        },
        {
          id: "b2-writing-editing",
          title: "Редагування за чек-листом",
          details:
            "Спочатку перевірте виконання завдання, адресата, стиль, структуру та аргументи; потім — лексику, граматику й пунктуацію. Отримайте відгук, перепишіть текст і порівняйте версії. Автоматичний відгук варто доповнювати людським.",
          links: [bcSkill("writing", "b2"), EXTERNAL.writeAndImprove],
        },
      ],
    },
    {
      id: "b2-checkpoint",
      kind: "checkpoint",
      title: "Контрольна точка",
      intro: "Фінальна перевірка: оцініть всі чотири навички на нових завданнях і отримайте зовнішній відгук на говоріння та письмо. Успіх в одному тесті чи перегляд фільму не підтверджує весь рівень. Повторіть перевірку після роботи над слабкими місцями.",
      tasks: [
        {
          id: "b2-checkpoint-self",
          title: "Самооцінка за переліком «Що ви зможете»",
          details: "Позначте, що вже виходить без підготовки, і повторіть модулі, де відчуваєте невпевненість.",
        },
        {
          id: "b2-checkpoint-mock",
          title: "Пробний тест B2 First",
          details:
            "Виконайте всі частини за інструкціями зразка. Читання, Use of English і слухання перевірте за ключами, письмо й говоріння — за критеріями з викладачем. Орієнтир B2 на Cambridge English Scale — 160. Бали поблизу межі потребують додаткової перевірки; пробний результат не гарантує результату іспиту.",
          links: [EXTERNAL.firstPreparation, EXTERNAL.cambridgeScores],
        },
        {
          id: "b2-checkpoint-film",
          title: "Фрагмент фільму без субтитрів і переказ",
          details: "Оберіть новий уривок зі зрозумілим стандартним мовленням. Перекажіть зміст і позиції персонажів, потім перевірте деталі із субтитрами. Складний сленг чи незнайомий акцент можуть потребувати додаткової практики.",
          optional: true,
        },
        {
          id: "b2-checkpoint-discussion",
          title: "Обговорення з аргументами й уточненнями",
          details: "За 10–15 хвилин порівняйте два рішення, поясніть переваги й недоліки, відреагуйте на заперечення та підсумуйте спільний вибір. Попросіть відгук про зв’язність, діапазон мови, зрозумілість і взаємодію. Окремі помилки допустимі.",
          links: [EXTERNAL.firstPreparation],
        },
        {
          id: "b2-checkpoint-write",
          title: "Два тексти B2 з оцінюванням і редагуванням",
          details: "Напишіть есе та лист, огляд або звіт по 140–190 слів у форматі B2 First. За критеріями Cambridge перевірте зміст, комунікативне завдання, організацію й мову. Отримайте відгук, виправте слабкі місця та збережіть обидві версії.",
          links: [EXTERNAL.firstPreparation, EXTERNAL.writeAndImprove],
        },
        {
          id: "b2-checkpoint-exam",
          title: "Складіть B2 First, якщо потрібен сертифікат",
          details: "Оберіть іспит за вимогами організації, якій потрібен результат, і перевірте необхідні бали за навичками. Сертифікат — окрема мета; для завершення навчального плану реєстрація на іспит не потрібна.",
          links: [EXTERNAL.firstPreparation],
          optional: true,
        },
      ],
    },
  ],
  resources: [
    { ...bcGrammar("граматика B1–B2", "b1-b2"), note: "Пояснення й вправи до тем рівня" },
    { ...bcSkill("listening", "b2"), note: "Складніші аудіо з транскриптами" },
    { ...EXTERNAL.oxfordWordlists, note: "Списки слів з рівнями CEFR" },
    { ...EXTERNAL.tedTalks, note: "Виступи з субтитрами й транскриптами" },
    { ...EXTERNAL.youglish, note: "Будь-яке слово в реальних відео" },
    { ...EXTERNAL.writeAndImprove, note: "Перевірка есе й листів з оцінкою за CEFR" },
    { ...EXTERNAL.firstPreparation, note: "Офіційні зразки іспиту B2 First" },
  ],
};
