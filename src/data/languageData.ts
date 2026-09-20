export interface PhraseItem {
  id: string;
  category: string;
  nepali: string;
  english: string;
  roman: string;
  formal: 'honorific' | 'polite' | 'informal';
  context?: string;
}

export interface VocabularyCard {
  id: string;
  nepali: string;
  english: string;
  roman: string;
  category: string;
  partOfSpeech: string;
  exampleNe: string;
  exampleEn: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
}

export interface GrammarLesson {
  id: string;
  titleNe: string;
  titleEn: string;
  summaryNe: string;
  summaryEn: string;
  rules: {
    heading: string;
    description: string;
    examples: { ne: string; roman: string; en: string }[];
  }[];
}

export const PHRASE_CATEGORIES = [
  { id: 'all', nameNe: 'सबै वाक्यांश', nameEn: 'All Phrases' },
  { id: 'greetings', nameNe: 'अभिवादन र शिष्टाचार', nameEn: 'Greetings & Politeness' },
  { id: 'travel', nameNe: 'यात्रा र दिशा', nameEn: 'Travel & Directions' },
  { id: 'food', nameNe: 'खाना र रेस्टुरेन्ट', nameEn: 'Dining & Food' },
  { id: 'shopping', nameNe: 'किनमेल र मोलमोलाइ', nameEn: 'Shopping & Bargaining' },
  { id: 'emergency', nameNe: 'आपतकालीन र स्वास्थ्य', nameEn: 'Emergency & Health' },
  { id: 'official', nameNe: 'सरकारी कार्यालय र कागजात', nameEn: 'Official & Government' },
  { id: 'banking', nameNe: 'बैंकिङ र वित्त', nameEn: 'Banking & Money' },
  { id: 'time', nameNe: 'समय र मिति', nameEn: 'Time & Calendar' },
];

export const PHRASES_DATA: PhraseItem[] = [
  // Greetings
  {
    id: 'p1',
    category: 'greetings',
    nepali: 'नमस्ते / नमस्कार !',
    english: 'Hello / Greetings (I bow to the divine in you)',
    roman: 'Namaste / Namaskar!',
    formal: 'honorific',
    context: 'Universal greeting across Nepal used at any time of day',
  },
  {
    id: 'p2',
    category: 'greetings',
    nepali: 'तपाईंलाई कस्तो छ?',
    english: 'How are you? (Polite)',
    roman: 'Tapailai kasto chha?',
    formal: 'polite',
    context: 'Used when speaking respectfully to adults or strangers',
  },
  {
    id: 'p3',
    category: 'greetings',
    nepali: 'हजुरलाई कस्तो छ?',
    english: 'How are you? (High Honorific)',
    roman: 'Hajurlai kasto chha?',
    formal: 'honorific',
    context: 'Highest respect for elders, teachers, or VIP guests',
  },
  {
    id: 'p4',
    category: 'greetings',
    nepali: 'मलाई सञ्चै छ, धन्यवाद।',
    english: "I am fine, thank you.",
    roman: 'Malai sanchai chha, dhanyabad.',
    formal: 'polite',
    context: 'Standard positive response',
  },
  {
    id: 'p5',
    category: 'greetings',
    nepali: 'तपाईंको शुभ नाम के हो?',
    english: 'What is your good name?',
    roman: 'Tapainko shuva naam ke ho?',
    formal: 'honorific',
    context: 'Polite way to inquire someone’s name',
  },
  {
    id: 'p6',
    category: 'greetings',
    nepali: 'मेरो नाम श्याम हो।',
    english: 'My name is Shyam.',
    roman: 'Mero naam Shyam ho.',
    formal: 'polite',
  },
  {
    id: 'p7',
    category: 'greetings',
    nepali: 'फेरि भेटौँला !',
    english: 'See you again / Goodbye!',
    roman: 'Pheri bhetaula!',
    formal: 'polite',
  },

  // Travel & Directions
  {
    id: 'p8',
    category: 'travel',
    nepali: 'बसपार्क कता पर्छ?',
    english: 'Where is the bus park located?',
    roman: 'Bus park kata parchha?',
    formal: 'polite',
  },
  {
    id: 'p9',
    category: 'travel',
    nepali: 'काठमाडौँ जाने गाडी कति बजे छुट्छ?',
    english: 'What time does the vehicle to Kathmandu depart?',
    roman: 'Kathmandu jane gaadi kati baje chhutchha?',
    formal: 'polite',
  },
  {
    id: 'p10',
    category: 'travel',
    nepali: 'कृपया मलाई यहाँ ओरालिदिनुहोस्।',
    english: 'Please drop me off here.',
    roman: 'Kripaya malai yahan oralidunuhos.',
    formal: 'honorific',
  },
  {
    id: 'p11',
    category: 'travel',
    nepali: 'सिधा जानुहोस्, अनि दायाँ मोडिनुहोस्।',
    english: 'Go straight, and then turn right.',
    roman: 'Sidha jaanuhos, ani daayan modinuhos.',
    formal: 'polite',
  },

  // Food & Dining
  {
    id: 'p12',
    category: 'food',
    nepali: 'खाना धेरै मीठो छ !',
    english: 'The food is very delicious!',
    roman: 'Khana dherai meetho chha!',
    formal: 'polite',
  },
  {
    id: 'p13',
    category: 'food',
    nepali: 'एक प्लेट मःम र चिया दिनुहोस्।',
    english: 'Please give me one plate of momo and tea.',
    roman: 'Ek plate momo ra chiya dinuhos.',
    formal: 'polite',
  },
  {
    id: 'p14',
    category: 'food',
    nepali: 'पिरो अलिकति कम गरिदिनुहोला।',
    english: 'Please make it less spicy.',
    roman: 'Piro alikati kam garidinuhola.',
    formal: 'honorific',
  },
  {
    id: 'p15',
    category: 'food',
    nepali: 'बिल कति भयो?',
    english: 'How much is the bill?',
    roman: 'Bill kati bhayo?',
    formal: 'polite',
  },

  // Shopping & Bargaining
  {
    id: 'p16',
    category: 'shopping',
    nepali: 'यसको मूल्य कति हो?',
    english: 'How much does this cost?',
    roman: 'Yesko mulya kati ho?',
    formal: 'polite',
  },
  {
    id: 'p17',
    category: 'shopping',
    nepali: 'अलि धेरै महँगो भयो, मिलाएर दिनुस् न।',
    english: 'It is a bit too expensive, please give a fair discount.',
    roman: 'Ali dherai mahango bhayo, milayera dinus na.',
    formal: 'polite',
  },
  {
    id: 'p18',
    category: 'shopping',
    nepali: 'के क्युआर (QR) / अनलाइन भुक्तानी चल्छ?',
    english: 'Do you accept QR code / online mobile payment?',
    roman: 'Ke QR / online bhuktani chalchha?',
    formal: 'polite',
  },

  // Emergency & Health
  {
    id: 'p19',
    category: 'emergency',
    nepali: 'कृपया मलाई मद्दत गर्नुहोस् !',
    english: 'Please help me!',
    roman: 'Kripaya malai maddat garnuhos!',
    formal: 'polite',
  },
  {
    id: 'p20',
    category: 'emergency',
    nepali: 'नजिकैको अस्पताल कता छ?',
    english: 'Where is the nearest hospital?',
    roman: 'Najikaiko aspatal kata chha?',
    formal: 'polite',
  },
  {
    id: 'p21',
    category: 'emergency',
    nepali: 'मेरो टाउको / पेट धेरै दुखिरहेको छ।',
    english: 'My head / stomach is aching severely.',
    roman: 'Mero tauko / pet dherai dukhirheko chha.',
    formal: 'polite',
  },

  // Official & Government
  {
    id: 'p22',
    category: 'official',
    nepali: 'नागरिकता र राष्ट्रिय परिचयपत्रको लागि कहाँ सम्पर्क गर्ने?',
    english: 'Where should I contact for citizenship and National ID card?',
    roman: 'Nagarikta ra Rashtriya Parichayapatrako laagi kahan samparka garne?',
    formal: 'honorific',
  },
  {
    id: 'p23',
    category: 'official',
    nepali: 'यो फाराम कसरी भर्ने हो बताइदिनुहुन्छ कि?',
    english: 'Could you kindly guide me on how to fill out this form?',
    roman: 'Yo pharam kasari bharne ho bataidinuhunchha ki?',
    formal: 'honorific',
  },

  // Banking
  {
    id: 'p24',
    category: 'banking',
    nepali: 'म नयाँ बैंक खाता खोल्न चाहन्छु।',
    english: 'I would like to open a new bank account.',
    roman: 'Ma naya bank khata kholna chahanchhu.',
    formal: 'polite',
  },
  {
    id: 'p25',
    category: 'banking',
    nepali: 'एटीएम (ATM) मेशिन कता छ?',
    english: 'Where is the ATM machine?',
    roman: 'ATM machine kata chha?',
    formal: 'polite',
  },
];

export const VOCABULARY_LIST: VocabularyCard[] = [
  {
    id: 'v1',
    nepali: 'सत्कार / आतिथ्य',
    english: 'Hospitality',
    roman: 'Satkar / Aatithya',
    category: 'culture',
    partOfSpeech: 'Noun',
    exampleNe: 'नेपाली संस्कृतिमा पाहुनालाई भगवान मानिन्छ।',
    exampleEn: 'In Nepali culture, guests are revered like deities.',
  },
  {
    id: 'v2',
    nepali: 'पञ्चाङ्ग',
    english: 'Almanac / Vedic Astronomical Calendar',
    roman: 'Panchanga',
    category: 'culture',
    partOfSpeech: 'Noun',
    exampleNe: 'हाम्रो पात्रोले शुद्ध पञ्चाङ्ग गणना गर्दछ।',
    exampleEn: 'Hamro Patro calculates pure Vedic astronomical timing.',
  },
  {
    id: 'v3',
    nepali: 'शुभकामना',
    english: 'Best Wishes / Greetings',
    roman: 'Shubhakamana',
    category: 'daily',
    partOfSpeech: 'Noun',
    exampleNe: 'दशैँ र तिहारको हार्दिक शुभकामना !',
    exampleEn: 'Warm best wishes on Dashain and Tihar!',
  },
  {
    id: 'v4',
    nepali: 'अभिवादन',
    english: 'Salutation / Greeting',
    roman: 'Abhivadan',
    category: 'daily',
    partOfSpeech: 'Noun',
    exampleNe: 'सबैलाई मेरो सादर अभिवादन।',
    exampleEn: 'My respectful greetings to everyone.',
  },
  {
    id: 'v5',
    nepali: 'सहकार्य',
    english: 'Collaboration / Cooperation',
    roman: 'Sahakarya',
    category: 'official',
    partOfSpeech: 'Noun',
    exampleNe: 'विकासको लागि सबैको सहकार्य आवश्यक छ।',
    exampleEn: 'Cooperation of all is essential for progress.',
  },
  {
    id: 'v6',
    nepali: 'अन्तरक्रिया',
    english: 'Interaction',
    roman: 'Antarkriya',
    category: 'official',
    partOfSpeech: 'Noun',
    exampleNe: 'कार्यक्रममा राम्रो अन्तरक्रिया भयो।',
    exampleEn: 'There was fruitful interaction during the event.',
  },
  {
    id: 'v7',
    nepali: 'प्रशंसा',
    english: 'Appreciation / Praise',
    roman: 'Prashansa',
    category: 'daily',
    partOfSpeech: 'Noun',
    exampleNe: 'तपाईंको मिहिनेतको प्रशंसा गर्दछु।',
    exampleEn: 'I appreciate your hard work.',
  },
  {
    id: 'v8',
    nepali: 'स्वावलम्बी',
    english: 'Self-reliant / Independent',
    roman: 'Swawalambi',
    category: 'advanced',
    partOfSpeech: 'Adjective',
    exampleNe: 'हामी आत्मनिर्भर र स्वावलम्बी बन्नुपर्छ।',
    exampleEn: 'We must become self-reliant and independent.',
  },
];

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  {
    id: 'g1',
    titleNe: '१. वाक्य संरचना (Word Order: SOV vs SVO)',
    titleEn: '1. Sentence Order: Nepali SOV vs English SVO',
    summaryNe: 'नेपाली भाषामा कर्ता + कर्म + क्रिया (SOV) हुन्छ, जबकि अंग्रेजीमा कर्ता + क्रिया + कर्म (SVO) हुन्छ।',
    summaryEn: 'Nepali strictly follows Subject + Object + Verb (SOV), whereas English follows Subject + Verb + Object (SVO).',
    rules: [
      {
        heading: 'मूल संरचना (Basic Rule)',
        description: 'In English you say: "I (Subject) eat (Verb) rice (Object)". In Nepali, the verb always moves to the very end: "म (Subject) भात (Object) खान्छु (Verb)".',
        examples: [
          { ne: 'म भात खान्छु।', roman: 'Ma bhat khanchhu.', en: 'I eat rice. (I rice eat)' },
          { ne: 'उहाँ पुस्तक पढ्नुहुन्छ।', roman: 'Uhan pustak padhnuhunchha.', en: 'He/She reads a book. (He book reads)' },
          { ne: 'हामी काठमाडौँ जान्छौँ।', roman: 'Hami Kathmandu janchhau.', en: 'We are going to Kathmandu.' },
        ],
      },
    ],
  },
  {
    id: 'g2',
    titleNe: '२. आदरार्थी तहहरू (Honorific Tiers: हजुर / तपाईं / तिमी / तँ)',
    titleEn: '2. Nepali Honorific Tiers & Respect Levels',
    summaryNe: 'नेपाली भाषामा उमेर, सम्बन्ध र मर्यादा अनुसार ४ वटा आदर तहहरू हुन्छन्।',
    summaryEn: 'Nepali has 4 levels of respect for 2nd person (You) that determine the verb conjugation.',
    rules: [
      {
        heading: '४ तहहरू (The 4 Tiers)',
        description: '1. हजुर (Hajur) - Highest Honorific for elders, dignitaries, and parents.\n2. तपाईं (Tapai) - Polite Formal for respected peers, colleagues, strangers.\n3. तिमी (Timi) - Familiar/Informal for close friends, younger siblings.\n4. तँ (Tan) - Extremely intimate or coarse (use with caution).',
        examples: [
          { ne: 'हजुर आउनुहोस्।', roman: 'Hajur aaunuhos.', en: 'Please come in. (Highest respect)' },
          { ne: 'तपाईं बस्नुहोस्।', roman: 'Tapai basnuhos.', en: 'Please have a seat. (Polite)' },
          { ne: 'तिमी आऊ।', roman: 'Timi aau.', en: 'Come here. (Friendly / Younger)' },
        ],
      },
    ],
  },
  {
    id: 'g3',
    titleNe: '३. काल र क्रियापद (Tenses: Present, Past, Future)',
    titleEn: '3. Major Verb Conjugations across Tenses',
    summaryNe: 'वर्तमान, भूत र भविष्य कालमा क्रियापदको रूप परिवर्तन।',
    summaryEn: 'How common Nepali root verbs (खानु, जानु, गर्नु) conjugate across 3 primary tenses.',
    rules: [
      {
        heading: 'जानु (To Go) क्रियापद तालिका',
        description: 'Root verb: जानु (Jaanu)',
        examples: [
          { ne: 'म जान्छु (Present)', roman: 'Ma janchhu', en: 'I go / I am going' },
          { ne: 'म गएँ (Past)', roman: 'Ma gaye', en: 'I went' },
          { ne: 'म जानेछु (Future)', roman: 'Ma janechhu', en: 'I will go' },
        ],
      },
    ],
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How do you say "How are you?" in polite formal Nepali?',
    options: ['Tapailai kasto chha?', 'Tero naam k ho?', 'Ma bhat khanchhu', 'Kata jane ho?'],
    correctIndex: 0,
    explanation: '"तपाईंलाई कस्तो छ?" (Tapailai kasto chha?) is the standard polite greeting for asking someone how they are.',
    category: 'greetings',
  },
  {
    id: 'q2',
    question: 'What is the correct sentence order in Nepali grammar?',
    options: [
      'Subject + Object + Verb (SOV)',
      'Subject + Verb + Object (SVO)',
      'Verb + Subject + Object (VSO)',
      'Object + Verb + Subject (OVS)',
    ],
    correctIndex: 0,
    explanation: 'Unlike English (SVO), Nepali always places the verb at the end of the sentence (SOV: म पुस्तक पढ्छु).',
    category: 'grammar',
  },
  {
    id: 'q3',
    question: 'What does the phrase "यसको मूल्य कति हो?" (Yesko mulya kati ho?) mean in English?',
    options: ['What is the time?', 'How much does this cost?', 'Where is the bus park?', 'What is your name?'],
    correctIndex: 1,
    explanation: '"यसको मूल्य कति हो?" is used in markets and shops to ask for the price of an item.',
    category: 'shopping',
  },
  {
    id: 'q4',
    question: 'Which word represents the highest tier of honorific respect for "You" in Nepali?',
    options: ['तिमी (Timi)', 'हजुर (Hajur)', 'तँ (Tan)', 'उनी (Uni)'],
    correctIndex: 1,
    explanation: '"हजुर" (Hajur) is the supreme honorific pronoun used for elders, parents, and respected guests.',
    category: 'grammar',
  },
  {
    id: 'q5',
    question: 'What is the Nepali meaning of "Hospitality"?',
    options: ['अभिवादन (Abhivadan)', 'सत्कार / आतिथ्य (Satkar / Aatithya)', 'शुभकामना (Shubhakamana)', 'सहकार्य (Sahakarya)'],
    correctIndex: 1,
    explanation: '"सत्कार" (Satkar) and "आतिथ्य" (Aatithya) mean welcoming and hospitality.',
    category: 'vocabulary',
  },
];
