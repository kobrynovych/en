export type CefrLevel = "A1" | "A2" | "B1";

export interface IrregularVerbEntry {
  /** Base (infinitive) form, e.g. "be" */
  base: string;
  /** One or more Past Simple forms, e.g. ["was", "were"] or ["went"] */
  pastSimple: string[];
  /** One or more Past Participle forms, e.g. ["been"] or ["gone"] */
  pastParticiple: string[];
  /** Ukrainian translation displayed in the last column */
  translationUk: string;
  /** CEFR level — determines badge colour and filter behaviour */
  cefr: CefrLevel;
  /**
   * Optional note about special pronunciation rules. Shown as an ℹ tooltip
   * next to the verb's base form in the table.
   * E.g. for "read": past forms are spelled the same but pronounced /rɛd/.
   */
  pronunciationNote?: string;
  /**
   * Override the spoken word for past simple when it differs from how TTS
   * would read the written form in isolation (e.g. "read" should be spoken
   * as "red" in past tense context).
   * Map from written form → phonetic hint to pass to SpeakButton.
   */
  speakOverride?: Record<string, string>;
}

export const IRREGULAR_VERBS: IrregularVerbEntry[] = (
  [
  // ── A1 (30 verbs) ──────────────────────────────────────────────────────────
  { base: "be",         pastSimple: ["was", "were"],   pastParticiple: ["been"],           translationUk: "бути",                 cefr: "A1" },
  { base: "become",     pastSimple: ["became"],         pastParticiple: ["become"],          translationUk: "ставати",              cefr: "A1" },
  { base: "begin",      pastSimple: ["began"],          pastParticiple: ["begun"],           translationUk: "починати",             cefr: "A1" },
  { base: "break",      pastSimple: ["broke"],          pastParticiple: ["broken"],          translationUk: "ламати",               cefr: "A1" },
  { base: "bring",      pastSimple: ["brought"],        pastParticiple: ["brought"],         translationUk: "приносити",            cefr: "A1" },
  { base: "buy",        pastSimple: ["bought"],         pastParticiple: ["bought"],          translationUk: "купувати",             cefr: "A1" },
  { base: "come",       pastSimple: ["came"],           pastParticiple: ["come"],            translationUk: "приходити",            cefr: "A1" },
  { base: "do",         pastSimple: ["did"],            pastParticiple: ["done"],            translationUk: "робити",               cefr: "A1" },
  { base: "drink",      pastSimple: ["drank"],          pastParticiple: ["drunk"],           translationUk: "пити",                 cefr: "A1" },
  { base: "drive",      pastSimple: ["drove"],          pastParticiple: ["driven"],          translationUk: "їхати (керувати)",     cefr: "A1" },
  { base: "eat",        pastSimple: ["ate"],            pastParticiple: ["eaten"],           translationUk: "їсти",                 cefr: "A1" },
  { base: "find",       pastSimple: ["found"],          pastParticiple: ["found"],           translationUk: "знаходити",            cefr: "A1" },
  { base: "get",        pastSimple: ["got"],            pastParticiple: ["got", "gotten"],   translationUk: "отримувати; ставати",  cefr: "A1" },
  { base: "give",       pastSimple: ["gave"],           pastParticiple: ["given"],           translationUk: "давати",               cefr: "A1" },
  { base: "go",         pastSimple: ["went"],           pastParticiple: ["gone"],            translationUk: "іти; їхати",           cefr: "A1" },
  { base: "have",       pastSimple: ["had"],            pastParticiple: ["had"],             translationUk: "мати",                 cefr: "A1" },
  { base: "know",       pastSimple: ["knew"],           pastParticiple: ["known"],           translationUk: "знати",                cefr: "A1" },
  { base: "leave",      pastSimple: ["left"],           pastParticiple: ["left"],            translationUk: "залишати; їхати",      cefr: "A1" },
  { base: "make",       pastSimple: ["made"],           pastParticiple: ["made"],            translationUk: "робити; виготовляти",  cefr: "A1" },
  { base: "read",       pastSimple: ["read"],           pastParticiple: ["read"],            translationUk: "читати",               cefr: "A1",
    pronunciationNote: "Базова форма вимовляється /riːd/, але Past Simple і Past Participle — однакового написання «read» — вимовляються /rɛd/ (як «red»).",
    speakOverride: { "read": "red" } },
  { base: "run",        pastSimple: ["ran"],            pastParticiple: ["run"],             translationUk: "бігти",                cefr: "A1" },
  { base: "say",        pastSimple: ["said"],           pastParticiple: ["said"],            translationUk: "говорити; казати",     cefr: "A1" },
  { base: "see",        pastSimple: ["saw"],            pastParticiple: ["seen"],            translationUk: "бачити",               cefr: "A1" },
  { base: "speak",      pastSimple: ["spoke"],          pastParticiple: ["spoken"],          translationUk: "говорити; розмовляти", cefr: "A1" },
  { base: "take",       pastSimple: ["took"],           pastParticiple: ["taken"],           translationUk: "брати",                cefr: "A1" },
  { base: "tell",       pastSimple: ["told"],           pastParticiple: ["told"],            translationUk: "розповідати; казати",  cefr: "A1" },
  { base: "think",      pastSimple: ["thought"],        pastParticiple: ["thought"],         translationUk: "думати",               cefr: "A1" },
  { base: "understand", pastSimple: ["understood"],     pastParticiple: ["understood"],      translationUk: "розуміти",             cefr: "A1" },
  { base: "wear",       pastSimple: ["wore"],           pastParticiple: ["worn"],            translationUk: "носити (одяг)",        cefr: "A1" },
  { base: "write",      pastSimple: ["wrote"],          pastParticiple: ["written"],         translationUk: "писати",               cefr: "A1" },

  // ── A2 (45 verbs) ──────────────────────────────────────────────────────────
  { base: "bite",       pastSimple: ["bit"],            pastParticiple: ["bitten"],          translationUk: "кусати",               cefr: "A2" },
  { base: "blow",       pastSimple: ["blew"],           pastParticiple: ["blown"],           translationUk: "дути",                 cefr: "A2" },
  { base: "build",      pastSimple: ["built"],          pastParticiple: ["built"],           translationUk: "будувати",             cefr: "A2" },
  { base: "burn",       pastSimple: ["burned", "burnt"], pastParticiple: ["burned", "burnt"], translationUk: "горіти; спалювати",   cefr: "A2" },
  { base: "catch",      pastSimple: ["caught"],         pastParticiple: ["caught"],          translationUk: "ловити",               cefr: "A2" },
  { base: "choose",     pastSimple: ["chose"],          pastParticiple: ["chosen"],          translationUk: "вибирати",             cefr: "A2" },
  { base: "cut",        pastSimple: ["cut"],            pastParticiple: ["cut"],             translationUk: "різати",               cefr: "A2" },
  { base: "draw",       pastSimple: ["drew"],           pastParticiple: ["drawn"],           translationUk: "малювати",             cefr: "A2" },
  { base: "fall",       pastSimple: ["fell"],           pastParticiple: ["fallen"],          translationUk: "падати",               cefr: "A2" },
  { base: "feel",       pastSimple: ["felt"],           pastParticiple: ["felt"],            translationUk: "відчувати",            cefr: "A2" },
  { base: "fight",      pastSimple: ["fought"],         pastParticiple: ["fought"],          translationUk: "битися; боротися",     cefr: "A2" },
  { base: "fly",        pastSimple: ["flew"],           pastParticiple: ["flown"],           translationUk: "літати",               cefr: "A2" },
  { base: "forget",     pastSimple: ["forgot"],         pastParticiple: ["forgotten"],       translationUk: "забувати",             cefr: "A2" },
  { base: "grow",       pastSimple: ["grew"],           pastParticiple: ["grown"],           translationUk: "рости; вирощувати",    cefr: "A2" },
  { base: "hang",       pastSimple: ["hung"],           pastParticiple: ["hung"],            translationUk: "вішати",               cefr: "A2" },
  { base: "hear",       pastSimple: ["heard"],          pastParticiple: ["heard"],           translationUk: "чути",                 cefr: "A2" },
  { base: "hide",       pastSimple: ["hid"],            pastParticiple: ["hidden"],          translationUk: "ховати; ховатися",     cefr: "A2" },
  { base: "hit",        pastSimple: ["hit"],            pastParticiple: ["hit"],             translationUk: "вдаряти",              cefr: "A2" },
  { base: "hold",       pastSimple: ["held"],           pastParticiple: ["held"],            translationUk: "тримати",              cefr: "A2" },
  { base: "keep",       pastSimple: ["kept"],           pastParticiple: ["kept"],            translationUk: "зберігати; тримати",   cefr: "A2" },
  { base: "lay",        pastSimple: ["laid"],           pastParticiple: ["laid"],            translationUk: "класти; накривати",    cefr: "A2" },
  { base: "learn",      pastSimple: ["learned", "learnt"], pastParticiple: ["learned", "learnt"], translationUk: "вчити(ся)",      cefr: "A2" },
  { base: "let",        pastSimple: ["let"],            pastParticiple: ["let"],             translationUk: "дозволяти; давати",    cefr: "A2" },
  { base: "light",      pastSimple: ["lit", "lighted"], pastParticiple: ["lit", "lighted"],  translationUk: "запалювати; освітлювати", cefr: "A2" },
  { base: "lose",       pastSimple: ["lost"],           pastParticiple: ["lost"],            translationUk: "втрачати; програвати", cefr: "A2" },
  { base: "meet",       pastSimple: ["met"],            pastParticiple: ["met"],             translationUk: "зустрічати",           cefr: "A2" },
  { base: "pay",        pastSimple: ["paid"],           pastParticiple: ["paid"],            translationUk: "платити",              cefr: "A2" },
  { base: "put",        pastSimple: ["put"],            pastParticiple: ["put"],             translationUk: "класти; ставити",      cefr: "A2" },
  { base: "send",       pastSimple: ["sent"],           pastParticiple: ["sent"],            translationUk: "посилати; надсилати",  cefr: "A2" },
  { base: "shake",      pastSimple: ["shook"],          pastParticiple: ["shaken"],          translationUk: "трясти; потискати",    cefr: "A2" },
  { base: "shine",      pastSimple: ["shone", "shined"], pastParticiple: ["shone", "shined"], translationUk: "світити; блищати",   cefr: "A2" },
  { base: "shoot",      pastSimple: ["shot"],           pastParticiple: ["shot"],            translationUk: "стріляти",             cefr: "A2" },
  { base: "show",       pastSimple: ["showed"],         pastParticiple: ["shown", "showed"], translationUk: "показувати",           cefr: "A2" },
  { base: "shut",       pastSimple: ["shut"],           pastParticiple: ["shut"],            translationUk: "зачиняти",             cefr: "A2" },
  { base: "sing",       pastSimple: ["sang"],           pastParticiple: ["sung"],            translationUk: "співати",              cefr: "A2" },
  { base: "sit",        pastSimple: ["sat"],            pastParticiple: ["sat"],             translationUk: "сидіти",               cefr: "A2" },
  { base: "sleep",      pastSimple: ["slept"],          pastParticiple: ["slept"],           translationUk: "спати",                cefr: "A2" },
  { base: "stand",      pastSimple: ["stood"],          pastParticiple: ["stood"],           translationUk: "стояти",               cefr: "A2" },
  { base: "steal",      pastSimple: ["stole"],          pastParticiple: ["stolen"],          translationUk: "красти",               cefr: "A2" },
  { base: "sweep",      pastSimple: ["swept"],          pastParticiple: ["swept"],           translationUk: "мести",                cefr: "A2" },
  { base: "swim",       pastSimple: ["swam"],           pastParticiple: ["swum"],            translationUk: "плавати",              cefr: "A2" },
  { base: "teach",      pastSimple: ["taught"],         pastParticiple: ["taught"],          translationUk: "навчати",              cefr: "A2" },
  { base: "throw",      pastSimple: ["threw"],          pastParticiple: ["thrown"],          translationUk: "кидати",               cefr: "A2" },
  { base: "wake",       pastSimple: ["woke"],           pastParticiple: ["woken"],           translationUk: "прокидатися; будити",  cefr: "A2" },
  { base: "win",        pastSimple: ["won"],            pastParticiple: ["won"],             translationUk: "перемагати",           cefr: "A2" },

  // ── B1 (60 verbs) ──────────────────────────────────────────────────────────
  { base: "arise",      pastSimple: ["arose"],          pastParticiple: ["arisen"],          translationUk: "виникати",             cefr: "B1" },
  { base: "bear",       pastSimple: ["bore"],           pastParticiple: ["born", "borne"],   translationUk: "нести; переносити",    cefr: "B1" },
  { base: "bend",       pastSimple: ["bent"],           pastParticiple: ["bent"],            translationUk: "гнути; нахилятися",    cefr: "B1" },
  { base: "bet",        pastSimple: ["bet"],            pastParticiple: ["bet"],             translationUk: "битися об заклад",     cefr: "B1" },
  { base: "bid",        pastSimple: ["bid"],            pastParticiple: ["bid"],             translationUk: "пропонувати ціну",     cefr: "B1" },
  { base: "bind",       pastSimple: ["bound"],          pastParticiple: ["bound"],           translationUk: "зв'язувати",           cefr: "B1" },
  { base: "bleed",      pastSimple: ["bled"],           pastParticiple: ["bled"],            translationUk: "кровоточити",          cefr: "B1" },
  { base: "bow",        pastSimple: ["bowed"],          pastParticiple: ["bowed"],           translationUk: "кланятися",            cefr: "B1" },
  { base: "breed",      pastSimple: ["bred"],           pastParticiple: ["bred"],            translationUk: "розводити; розмножуватися", cefr: "B1" },
  { base: "burst",      pastSimple: ["burst"],          pastParticiple: ["burst"],           translationUk: "вибухати; лопатися",   cefr: "B1" },
  { base: "cast",       pastSimple: ["cast"],           pastParticiple: ["cast"],            translationUk: "кидати; відливати",    cefr: "B1" },
  { base: "cling",      pastSimple: ["clung"],          pastParticiple: ["clung"],           translationUk: "чіплятися; прилипати", cefr: "B1" },
  { base: "creep",      pastSimple: ["crept"],          pastParticiple: ["crept"],           translationUk: "повзти; красти(ся)",   cefr: "B1" },
  { base: "deal",       pastSimple: ["dealt"],          pastParticiple: ["dealt"],           translationUk: "мати справу; роздавати", cefr: "B1" },
  { base: "dig",        pastSimple: ["dug"],            pastParticiple: ["dug"],             translationUk: "копати",               cefr: "B1" },
  { base: "flee",       pastSimple: ["fled"],           pastParticiple: ["fled"],            translationUk: "тікати",               cefr: "B1" },
  { base: "fling",      pastSimple: ["flung"],          pastParticiple: ["flung"],           translationUk: "кидати; жбурляти",     cefr: "B1" },
  { base: "forbid",     pastSimple: ["forbade"],        pastParticiple: ["forbidden"],       translationUk: "забороняти",           cefr: "B1" },
  { base: "forgive",    pastSimple: ["forgave"],        pastParticiple: ["forgiven"],        translationUk: "прощати",              cefr: "B1" },
  { base: "freeze",     pastSimple: ["froze"],          pastParticiple: ["frozen"],          translationUk: "замерзати; морозити",  cefr: "B1" },
  { base: "grind",      pastSimple: ["ground"],         pastParticiple: ["ground"],          translationUk: "молоти; розтирати",    cefr: "B1" },
  { base: "leap",       pastSimple: ["leaped", "leapt"], pastParticiple: ["leaped", "leapt"], translationUk: "стрибати",            cefr: "B1" },
  { base: "lend",       pastSimple: ["lent"],           pastParticiple: ["lent"],            translationUk: "позичати (комусь)",    cefr: "B1" },
  { base: "mean",       pastSimple: ["meant"],          pastParticiple: ["meant"],           translationUk: "означати; мати на увазі", cefr: "B1" },
  { base: "mislead",    pastSimple: ["misled"],         pastParticiple: ["misled"],          translationUk: "вводити в оману",      cefr: "B1" },
  { base: "overcome",   pastSimple: ["overcame"],       pastParticiple: ["overcome"],        translationUk: "долати; перемагати",   cefr: "B1" },
  { base: "rid",        pastSimple: ["rid"],            pastParticiple: ["rid"],             translationUk: "позбавляти(ся)",       cefr: "B1" },
  { base: "ring",       pastSimple: ["rang"],           pastParticiple: ["rung"],            translationUk: "дзвонити",             cefr: "B1" },
  { base: "rise",       pastSimple: ["rose"],           pastParticiple: ["risen"],           translationUk: "підніматися; сходити", cefr: "B1" },
  { base: "seek",       pastSimple: ["sought"],         pastParticiple: ["sought"],          translationUk: "шукати",               cefr: "B1" },
  { base: "sell",       pastSimple: ["sold"],           pastParticiple: ["sold"],            translationUk: "продавати",            cefr: "B1" },
  { base: "set",        pastSimple: ["set"],            pastParticiple: ["set"],             translationUk: "встановлювати; класти", cefr: "B1" },
  { base: "shed",       pastSimple: ["shed"],           pastParticiple: ["shed"],            translationUk: "проливати; скидати",   cefr: "B1" },
  { base: "shrink",     pastSimple: ["shrank"],         pastParticiple: ["shrunk"],          translationUk: "стискатися; усідатися", cefr: "B1" },
  { base: "slide",      pastSimple: ["slid"],           pastParticiple: ["slid"],            translationUk: "ковзати",              cefr: "B1" },
  { base: "smell",      pastSimple: ["smelled", "smelt"], pastParticiple: ["smelled", "smelt"], translationUk: "нюхати; пахнути",  cefr: "B1" },
  { base: "sow",        pastSimple: ["sowed"],          pastParticiple: ["sown", "sowed"],   translationUk: "сіяти",                cefr: "B1" },
  { base: "spell",      pastSimple: ["spelled", "spelt"], pastParticiple: ["spelled", "spelt"], translationUk: "писати по буквах", cefr: "B1" },
  { base: "spend",      pastSimple: ["spent"],          pastParticiple: ["spent"],           translationUk: "витрачати; проводити (час)", cefr: "B1" },
  { base: "spill",      pastSimple: ["spilled", "spilt"], pastParticiple: ["spilled", "spilt"], translationUk: "розливати; просипати", cefr: "B1" },
  { base: "split",      pastSimple: ["split"],          pastParticiple: ["split"],           translationUk: "розколювати; ділити",  cefr: "B1" },
  { base: "spread",     pastSimple: ["spread"],         pastParticiple: ["spread"],          translationUk: "поширювати; розкладати", cefr: "B1" },
  { base: "spring",     pastSimple: ["sprang"],         pastParticiple: ["sprung"],          translationUk: "стрибати; виникати",   cefr: "B1" },
  { base: "sting",      pastSimple: ["stung"],          pastParticiple: ["stung"],           translationUk: "жалити; пекти",        cefr: "B1" },
  { base: "stink",      pastSimple: ["stank"],          pastParticiple: ["stunk"],           translationUk: "смердіти",             cefr: "B1" },
  { base: "stride",     pastSimple: ["strode"],         pastParticiple: ["stridden"],        translationUk: "крокувати",            cefr: "B1" },
  { base: "strike",     pastSimple: ["struck"],         pastParticiple: ["struck"],          translationUk: "ударяти; страйкувати", cefr: "B1" },
  { base: "swear",      pastSimple: ["swore"],          pastParticiple: ["sworn"],           translationUk: "клястися; лаятися",    cefr: "B1" },
  { base: "swell",      pastSimple: ["swelled"],        pastParticiple: ["swollen", "swelled"], translationUk: "набрякати; збільшуватися", cefr: "B1" },
  { base: "swing",      pastSimple: ["swung"],          pastParticiple: ["swung"],           translationUk: "гойдатися; розмахувати", cefr: "B1" },
  { base: "tear",       pastSimple: ["tore"],           pastParticiple: ["torn"],            translationUk: "рвати",                cefr: "B1" },
  { base: "tread",      pastSimple: ["trod"],           pastParticiple: ["trodden", "trod"], translationUk: "ступати; топтати",     cefr: "B1" },
  { base: "undergo",    pastSimple: ["underwent"],      pastParticiple: ["undergone"],       translationUk: "зазнавати; проходити", cefr: "B1" },
  { base: "upset",      pastSimple: ["upset"],          pastParticiple: ["upset"],           translationUk: "засмучувати; перекидати", cefr: "B1" },
  { base: "weave",      pastSimple: ["wove"],           pastParticiple: ["woven"],           translationUk: "ткати; плести",        cefr: "B1" },
  { base: "weep",       pastSimple: ["wept"],           pastParticiple: ["wept"],            translationUk: "плакати",              cefr: "B1" },
  { base: "wind",       pastSimple: ["wound"],          pastParticiple: ["wound"],           translationUk: "крутити; намотувати",  cefr: "B1",
    pronunciationNote: "У значенні «намотувати/закручувати» основа вимовляється /waɪnd/, а «wound» — /wuːnd/ (не плутати з «wound» = рана, яке теж /wuːnd/)." },
  { base: "withdraw",   pastSimple: ["withdrew"],       pastParticiple: ["withdrawn"],       translationUk: "знімати; відкликати",  cefr: "B1" },
  { base: "wring",      pastSimple: ["wrung"],          pastParticiple: ["wrung"],           translationUk: "вичавлювати; виламувати", cefr: "B1" },

  // ── Extra B1 verbs to reach ≥150 total ─────────────────────────────────────
  { base: "foresee",    pastSimple: ["foresaw"],        pastParticiple: ["foreseen"],        translationUk: "передбачати",          cefr: "B1" },
  { base: "kneel",      pastSimple: ["knelt", "kneeled"], pastParticiple: ["knelt", "kneeled"], translationUk: "ставати навколішки", cefr: "B1" },
  { base: "knit",       pastSimple: ["knit", "knitted"], pastParticiple: ["knit", "knitted"], translationUk: "в'язати",             cefr: "B1" },
  { base: "lead",       pastSimple: ["led"],            pastParticiple: ["led"],             translationUk: "вести; керувати",      cefr: "B1" },
  { base: "outdo",      pastSimple: ["outdid"],         pastParticiple: ["outdone"],         translationUk: "перевершувати",        cefr: "B1" },
  { base: "outrun",     pastSimple: ["outran"],         pastParticiple: ["outrun"],          translationUk: "обганяти",             cefr: "B1" },
  { base: "rebuild",    pastSimple: ["rebuilt"],        pastParticiple: ["rebuilt"],         translationUk: "перебудовувати",       cefr: "B1" },
  { base: "redo",       pastSimple: ["redid"],          pastParticiple: ["redone"],          translationUk: "переробляти",          cefr: "B1" },
  { base: "retell",     pastSimple: ["retold"],         pastParticiple: ["retold"],          translationUk: "переказувати",         cefr: "B1" },
  { base: "rewrite",    pastSimple: ["rewrote"],        pastParticiple: ["rewritten"],       translationUk: "переписувати",         cefr: "B1" },
  { base: "speed",      pastSimple: ["sped", "speeded"], pastParticiple: ["sped", "speeded"], translationUk: "мчати; прискорюватися", cefr: "B1" },
  { base: "spin",       pastSimple: ["spun"],           pastParticiple: ["spun"],            translationUk: "прясти; крутитися",    cefr: "B1" },
  { base: "stick",      pastSimple: ["stuck"],          pastParticiple: ["stuck"],           translationUk: "приклеювати; застрягати", cefr: "B1" },
  { base: "string",     pastSimple: ["strung"],         pastParticiple: ["strung"],          translationUk: "нанизувати; натягувати", cefr: "B1" },
  { base: "undo",       pastSimple: ["undid"],          pastParticiple: ["undone"],          translationUk: "скасовувати; розв'язувати", cefr: "B1" },
  { base: "withstand",  pastSimple: ["withstood"],      pastParticiple: ["withstood"],       translationUk: "витримувати; протистояти", cefr: "B1" },
  ] as IrregularVerbEntry[]
).sort((a, b) => a.base.localeCompare(b.base));
