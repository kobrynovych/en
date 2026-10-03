# Content Sources

- Council of Europe CEFR global scale: https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale
- Open Language Profiles CEFR-J vocabulary profile: https://github.com/openlanguageprofiles/olp-en-cefrj
- English Vocabulary Profile reference: https://englishprofile.org/?menu=english-vocabulary-profile
- Cambridge A2 Key vocabulary list: https://www.cambridgeenglish.org/images/506886-a2-key-2020-vocabulary-list.pdf
- Cambridge B1 Preliminary vocabulary list: https://www.cambridgeenglish.org/Images/506887-b1-preliminary-vocabulary-list.pdf
- American Oxford 3000: https://www.oxfordlearnersdictionaries.com/external/pdf/wordlists/oxford-3000-5000/American_Oxford_3000.pdf
- Oxford 5000 by CEFR level (second opinion for irregular verb levels): https://www.oxfordlearnersdictionaries.com/about/wordlists/oxford3000-5000
- ipa-dict (American English IPA): https://github.com/open-dict-data/ipa-dict

The generated dictionary imports CEFR-J A1-B2 entries as the base vocabulary ("gook" is left out as an ethnic slur). Enrichment files add Ukrainian translations, IPA, examples, spelling variants, and human-curated categories without changing UI code.

- `content/enrichment/auto-a1-b1.jsonl`: A1-B1, machine translation and template examples (`npm run content:enrich`).
- `content/enrichment/curated-b2.jsonl`: B2, Ukrainian translations, usage notes and five example sentences per word written with AI assistance (Claude) for this project; review and correct them like any other enrichment pack.
