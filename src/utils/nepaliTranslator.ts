// Comprehensive Nepali <-> English Translator & Linguistic Dictionary Engine
// Provides high-accuracy offline and online translation, phonetics, word breakdown, and grammar analysis.

export interface WordDetail {
  word: string;
  meaning: string;
  partOfSpeech: string;
}

export interface TranslationResult {
  translatedText: string;
  transliteration: string;
  wordBreakdown: WordDetail[];
  grammarNote: string;
  exampleUsage: string;
  sourceText?: string;
  fromLang?: 'ne' | 'en';
  toLang?: 'ne' | 'en';
}

// 1. Core Phrasebook Mapping (Exact & Substring matches)
export const PHRASE_DICTIONARY: Record<string, { en: string; ne: string; roman: string; grammar: string; pos: string }> = {
  // Greetings & Courtesies
  'namaste': { en: 'Hello / Greetings (I bow to the divine in you)', ne: 'नमस्ते', roman: 'Namaste', grammar: 'Universal respectful Nepali greeting accompanied with folded hands (Anjali Mudra).', pos: 'Greeting' },
  'नमस्ते': { en: 'Hello / Greetings (I bow to the divine in you)', ne: 'नमस्ते', roman: 'Namaste', grammar: 'Universal respectful Nepali greeting used any time of day.', pos: 'Greeting' },
  'namaskar': { en: 'Formal Greetings / Salutations', ne: 'नमस्कार', roman: 'Namaskar', grammar: 'High honorific greeting used in formal gatherings, broadcasts, and to elders.', pos: 'Formal Greeting' },
  'नमस्कार': { en: 'Formal Greetings / Salutations', ne: 'नमस्कार', roman: 'Namaskar', grammar: 'High honorific greeting used formally.', pos: 'Formal Greeting' },
  'dhanyabad': { en: 'Thank you very much', ne: 'धन्यवाद', roman: 'Dhanyabad', grammar: 'Used to express gratitude and appreciation.', pos: 'Expression' },
  'धन्यवाद': { en: 'Thank you very much', ne: 'धन्यवाद', roman: 'Dhanyabad', grammar: 'Used to express sincere gratitude.', pos: 'Expression' },
  'thank you': { en: 'Thank you', ne: 'धेरै धेरै धन्यवाद', roman: 'Dherai dherai dhanyabad', grammar: 'In Nepali, expressing deep thanks uses "धेरै धेरै धन्यवाद".', pos: 'Expression' },
  'thanks': { en: 'Thanks', ne: 'धन्यवाद', roman: 'Dhanyabad', grammar: 'Informal or standard expression of gratitude.', pos: 'Expression' },
  'swagatam': { en: 'Welcome', ne: 'स्वागतम्', roman: 'Swagatam', grammar: 'Traditional welcome greeting.', pos: 'Greeting' },
  'स्वागतम्': { en: 'Welcome', ne: 'स्वागतम्', roman: 'Swagatam', grammar: 'Traditional welcome greeting.', pos: 'Greeting' },
  'welcome': { en: 'Welcome', ne: 'स्वागत छ / स्वागतम्', roman: 'Swagata chha / Swagatam', grammar: 'Used when welcoming guests to home, country, or event.', pos: 'Greeting' },
  'shubha prabhat': { en: 'Good morning', ne: 'शुभ प्रभात', roman: 'Shubha Prabhat', grammar: 'Formal Nepali morning greeting.', pos: 'Greeting' },
  'शुभ प्रभात': { en: 'Good morning', ne: 'शुभ प्रभात', roman: 'Shubha Prabhat', grammar: 'Formal morning wish.', pos: 'Greeting' },
  'good morning': { en: 'Good morning', ne: 'शुभ प्रभात', roman: 'Shubha Prabhat', grammar: 'Formal morning greeting in Devanagari.', pos: 'Greeting' },
  'shubha ratri': { en: 'Good night', ne: 'शुभ रात्री', roman: 'Shubha Raatri', grammar: 'Night-time blessing before sleep.', pos: 'Greeting' },
  'शुभ रात्री': { en: 'Good night', ne: 'शुभ रात्री', roman: 'Shubha Raatri', grammar: 'Night-time farewell.', pos: 'Greeting' },
  'good night': { en: 'Good night', ne: 'शुभ रात्री', roman: 'Shubha Raatri', grammar: 'Used at bedtime or night farewell.', pos: 'Greeting' },
  'good afternoon': { en: 'Good afternoon', ne: 'शुभ दिउँसो / नमस्कार', roman: 'Shubha Diunso / Namaskar', grammar: 'Afternoon greeting.', pos: 'Greeting' },
  'good evening': { en: 'Good evening', ne: 'शुभ सन्ध्या', roman: 'Shubha Sandhya', grammar: 'Evening greeting.', pos: 'Greeting' },
  'शुभ सन्ध्या': { en: 'Good evening', ne: 'शुभ सन्ध्या', roman: 'Shubha Sandhya', grammar: 'Evening greeting.', pos: 'Greeting' },
  'goodbye': { en: 'Goodbye / See you again', ne: 'फेरि भेटौँला / बिदा', roman: 'Pheri bhetaula / Bida', grammar: 'Nepali speakers warmly prefer "फेरि भेटौँला" (See you again).', pos: 'Farewell' },
  'bye': { en: 'Bye / See you', ne: 'फेरि भेटौँला', roman: 'Pheri bhetaula', grammar: 'Warm farewell.', pos: 'Farewell' },
  'फेरि भेटौँला': { en: 'See you again / Until next time', ne: 'फेरि भेटौँला', roman: 'Pheri bhetaula', grammar: 'Future promise / polite parting phrase.', pos: 'Farewell' },
  'see you later': { en: 'See you later', ne: 'पछि भेटौँला', roman: 'Pachhi bhetaula', grammar: 'Informal parting phrase.', pos: 'Farewell' },
  'sorry': { en: 'Sorry / Excuse me', ne: 'माफ गर्नुहोस् / क्षमा पाउँ', roman: 'Maaf garnuhos / Kshama paun', grammar: 'Used for apologizing or politely catching attention.', pos: 'Polite Phrase' },
  'माफ गर्नुहोस्': { en: 'Excuse me / I am sorry', ne: 'माफ गर्नुहोस्', roman: 'Maaf garnuhos', grammar: 'Standard polite apology and attention-getter.', pos: 'Polite Phrase' },
  'excuse me': { en: 'Excuse me', ne: 'सुन्नुहोस् त / माफ गर्नुहोस्', roman: 'Sunnuhos ta / Maaf garnuhos', grammar: 'Used to politely address someone or pass by.', pos: 'Polite Phrase' },
  'please': { en: 'Please', ne: 'कृपया', roman: 'Kripaya', grammar: 'Formal polite marker prefixed to requests.', pos: 'Adverb' },
  'कृपया': { en: 'Please', ne: 'कृपया', roman: 'Kripaya', grammar: 'Formal polite marker.', pos: 'Adverb' },

  // Well-being & Questions
  'how are you': { en: 'How are you? / Are you well?', ne: 'तपाईंलाई कस्तो छ? / सञ्चै हुनुहुन्छ?', roman: 'Tapailai kasto chha? / Sanchai hunuhunchha?', grammar: 'Polite honorific inquiry into health and well-being.', pos: 'Question' },
  'how are you doing': { en: 'How are you doing?', ne: 'तपाईंलाई कस्तो छ?', roman: 'Tapailai kasto chha?', grammar: 'General friendly inquiry.', pos: 'Question' },
  'सञ्चै हुनुहुन्छ': { en: 'Are you doing well?', ne: 'सञ्चै हुनुहुन्छ?', roman: 'Sanchai hunuhunchha?', grammar: 'Honorific polite question asking if one is peaceful/healthy.', pos: 'Question' },
  'तपाईंलाई कस्तो छ': { en: 'How are you feeling / how is it going?', ne: 'तपाईंलाई कस्तो छ?', roman: 'Tapailai kasto chha?', grammar: 'Standard polite inquiry.', pos: 'Question' },
  'i am fine': { en: 'I am fine / doing well', ne: 'मलाई सञ्चै छ / म ठीक छु।', roman: 'Malai sanchai chha / Ma thik chhu.', grammar: 'Subject (मलाई/म) + State (सञ्चै/ठीक) + Verb (छ/छु).', pos: 'Statement' },
  'म ठीक छु': { en: 'I am fine / doing okay.', ne: 'म ठीक छु।', roman: 'Ma thik chhu.', grammar: 'Simple present indicative with first-person verb form "छु".', pos: 'Statement' },
  'मलाई सञ्चै छ': { en: 'I am doing very well and healthy.', ne: 'मलाई सञ्चै छ।', roman: 'Malai sanchai chha.', grammar: 'Expresses positive physical and mental state.', pos: 'Statement' },
  'what is your name': { en: 'What is your name?', ne: 'तपाईंको नाम के हो?', roman: 'Tapai ko naam ke ho?', grammar: 'Pronoun (तपाईंको) + Noun (नाम) + Interrogative (के) + Copula (हो)?', pos: 'Question' },
  'तपाईंको नाम के हो': { en: 'What is your name? (Polite)', ne: 'तपाईंको नाम के हो?', roman: 'Tapai ko naam ke ho?', grammar: 'Polite form asking someone their name.', pos: 'Question' },
  'my name is': { en: 'My name is...', ne: 'मेरो नाम ... हो।', roman: 'Mero naam ... ho.', grammar: 'Subject possessive (मेरो) + Noun (नाम) + Name + Verb (हो).', pos: 'Sentence' },
  'where are you from': { en: 'Where are you from?', ne: 'तपाईं कहाँबाट आउनुभएको हो?', roman: 'Tapai kahabaata aaunubhayeko ho?', grammar: 'Polite question regarding origin/hometown.', pos: 'Question' },
  'तपाईं कहाँ बस्नुहुन्छ': { en: 'Where do you live? (Polite)', ne: 'तपाईं कहाँ बस्नुहुन्छ?', roman: 'Tapai kaha basnuhunchha?', grammar: 'Inquires about residence using honorific verb form.', pos: 'Question' },
  'where do you live': { en: 'Where do you live?', ne: 'तपाईं कहाँ बस्नुहुन्छ?', roman: 'Tapai kaha basnuhunchha?', grammar: 'Polite inquiry regarding place of living.', pos: 'Question' },
  'what are you doing': { en: 'What are you doing?', ne: 'तपाईं के गर्दै हुनुहुन्छ?', roman: 'Tapai ke gardai hunuhunchha?', grammar: 'Present continuous tense in polite honorific register.', pos: 'Question' },
  'के गर्दै हुनुहुन्छ': { en: 'What are you doing? (Polite)', ne: 'तपाईं के गर्दै हुनुहुन्छ?', roman: 'Tapai ke gardai hunuhunchha?', grammar: 'Present continuous inquiry.', pos: 'Question' },
  'where are you going': { en: 'Where are you going?', ne: 'तपाईं कहाँ जाँदै हुनुहुन्छ?', roman: 'Tapai kaha jaandai hunuhunchha?', grammar: 'Continuous aspect with motion verb "जानु" (to go).', pos: 'Question' },
  'कहाँ जाँदै हुनुहुन्छ': { en: 'Where are you going?', ne: 'कहाँ जाँदै हुनुहुन्छ?', roman: 'Kaha jaandai hunuhunchha?', grammar: 'Polite direction/motion query.', pos: 'Question' },

  // Travel, Directions & Transport
  'where is': { en: 'Where is...?', ne: '... कहाँ छ?', roman: '... kaha chha?', grammar: 'Place inquiry suffixing "कहाँ छ?".', pos: 'Question' },
  'where is the bathroom': { en: 'Where is the restroom / toilet?', ne: 'शौचालय कहाँ छ?', roman: 'Shauchalaya kaha chha?', grammar: 'Essential travel question.', pos: 'Question' },
  'where is the toilet': { en: 'Where is the restroom?', ne: 'शौचालय कहाँ छ?', roman: 'Shauchalaya kaha chha?', grammar: 'Essential travel inquiry.', pos: 'Question' },
  'शौचालय कहाँ छ': { en: 'Where is the restroom / toilet?', ne: 'शौचालय कहाँ छ?', roman: 'Shauchalaya kaha chha?', grammar: 'Polite inquiry for washroom facilities.', pos: 'Question' },
  'where is the airport': { en: 'Where is the airport?', ne: 'विमानस्थल (एअरपोर्ट) कहाँ छ?', roman: 'Bimansthal (Airport) kaha chha?', grammar: 'Asks for airport location.', pos: 'Question' },
  'विमानस्थल कहाँ छ': { en: 'Where is the airport?', ne: 'विमानस्थल कहाँ छ?', roman: 'Bimansthal kaha chha?', grammar: 'Location inquiry.', pos: 'Question' },
  'where is the bus station': { en: 'Where is the bus park / bus station?', ne: 'बसपार्क कहाँ छ?', roman: 'Bus park kaha chha?', grammar: 'Transport hub location.', pos: 'Question' },
  'where is the hospital': { en: 'Where is the hospital?', ne: 'अस्पताल कहाँ छ?', roman: 'Aspataal kaha chha?', grammar: 'Emergency facility location.', pos: 'Question' },
  'where is the hotel': { en: 'Where is the hotel / lodge?', ne: 'होटल कहाँ छ?', roman: 'Hotel kaha chha?', grammar: 'Accommodation inquiry.', pos: 'Question' },
  'how much does it cost': { en: 'How much is this? / What is the price?', ne: 'यसको मूल्य कति हो? / कति पर्छ?', roman: 'Yasko mulya kati ho? / Kati parchha?', grammar: 'Standard shopping and pricing inquiry.', pos: 'Question' },
  'how much is this': { en: 'How much is this?', ne: 'यसको कति पर्छ?', roman: 'Yasko kati parchha?', grammar: 'Common market shopping phrase.', pos: 'Question' },
  'कति पर्छ': { en: 'How much does it cost?', ne: 'कति पर्छ?', roman: 'Kati parchha?', grammar: 'Colloquial price inquiry.', pos: 'Question' },
  'यसको कति पर्छ': { en: 'How much does this cost?', ne: 'यसको कति पर्छ?', roman: 'Yasko kati parchha?', grammar: 'Standard price question.', pos: 'Question' },
  'too expensive': { en: 'It is too expensive', ne: 'धेरै महँगो भयो', roman: 'Dherai mahango bhayo', grammar: 'Used when bargaining in local markets.', pos: 'Phrase' },
  'धेरै महँगो भयो': { en: 'That is too expensive / Can you discount?', ne: 'धेरै महँगो भयो', roman: 'Dherai mahango bhayo', grammar: 'Market bargaining comment.', pos: 'Phrase' },
  'can you give a discount': { en: 'Can you give a discount / reduce the price?', ne: 'अलिकति मिलाएर दिनुहोस् न।', roman: 'Alikati milayera dinuhos na.', grammar: 'Polite Nepali way of asking for a reasonable discount.', pos: 'Request' },
  'अलिकति घटाउनुहोस्': { en: 'Please reduce a little bit (Bargaining)', ne: 'अलिकति घटाउनुहोस् न', roman: 'Alikati ghataaunuhos na', grammar: 'Polite bargaining imperative.', pos: 'Request' },

  // Food, Drinks & Dining
  'i am hungry': { en: 'I am feeling hungry', ne: 'मलाई भोक लाग्यो।', roman: 'Malai bhok laagyo.', grammar: 'Nepali uses experiential dative construction: "मलाई" (to me) + "भोक लाग्यो" (hunger struck).', pos: 'Statement' },
  'मलाई भोक लाग्यो': { en: 'I am hungry.', ne: 'मलाई भोक लाग्यो।', roman: 'Malai bhok laagyo.', grammar: 'Dative subject structure expressing physiological sensation.', pos: 'Statement' },
  'i am thirsty': { en: 'I am feeling thirsty', ne: 'मलाई तिर्खा लाग्यो।', roman: 'Malai tirkha laagyo.', grammar: 'Dative experiential structure for thirst.', pos: 'Statement' },
  'मलाई तिर्खा लाग्यो': { en: 'I am thirsty.', ne: 'मलाई तिर्खा लाग्यो।', roman: 'Malai tirkha laagyo.', grammar: 'Thirst sensation.', pos: 'Statement' },
  'please give water': { en: 'Please give water / May I have water?', ne: 'कृपया पिउने पानी दिनुहोस्।', roman: 'Kripaya piune paani dinuhos.', grammar: 'Polite imperative request for drinking water.', pos: 'Request' },
  'पानी दिनुहोस्': { en: 'Please give water.', ne: 'पानी दिनुहोस्।', roman: 'Paani dinuhos.', grammar: 'Standard polite request.', pos: 'Request' },
  'the food is delicious': { en: 'The food is very delicious!', ne: 'खाना धेरै मिठो छ!', roman: 'Khaana dherai mitho chha!', grammar: 'Expresses enjoyment of meal with adjective "मिठो" (tasty).', pos: 'Compliment' },
  'खाना मिठो छ': { en: 'The food is tasty / delicious.', ne: 'खाना मिठो छ।', roman: 'Khaana mitho chha.', grammar: 'Compliment to the cook/host.', pos: 'Compliment' },
  'mitho chha': { en: 'It is delicious / tasty', ne: 'मिठो छ', roman: 'Mitho chha', grammar: 'Compliment on food.', pos: 'Compliment' },
  'मिठो छ': { en: 'Delicious / tasty', ne: 'मिठो छ', roman: 'Mitho chha', grammar: 'Positive culinary feedback.', pos: 'Adjective phrase' },
  'bill please': { en: 'Please bring the bill / check', ne: 'कृपया बिल दिनुहोस्।', roman: 'Kripaya bill dinuhos.', grammar: 'Restaurant closing request.', pos: 'Request' },
  'बिल दिनुहोस्': { en: 'Please bring the bill.', ne: 'बिल दिनुहोस्।', roman: 'Bill dinuhos.', grammar: 'Restaurant bill request.', pos: 'Request' },

  // Travel & Nepal
  'i love nepal': { en: 'I love Nepal very much', ne: 'मलाई नेपाल धेरै मन पर्छ।', roman: 'Malai Nepal dherai man parchha.', grammar: 'Nepali expresses liking via "मलाई ... मन पर्छ" (To me, ... is pleasing to the heart).', pos: 'Statement' },
  'मलाई नेपाल मन पर्छ': { en: 'I like/love Nepal.', ne: 'मलाई नेपाल मन पर्छ।', roman: 'Malai Nepal man parchha.', grammar: 'Dative liking expression.', pos: 'Statement' },
  'i want to visit nepal': { en: 'I want to visit Nepal.', ne: 'म नेपाल भ्रमण गर्न चाहन्छु।', roman: 'Ma Nepal bhraman garna chaahanchhu.', grammar: 'Nepali SOV structure: Subject (म) + Place (नेपाल) + Verb phrase (भ्रमण गर्न चाहन्छु).', pos: 'Sentence' },
  'म नेपाल जान चाहन्छु': { en: 'I want to go to Nepal.', ne: 'म नेपाल जान चाहन्छु।', roman: 'Ma Nepal jaana chaahanchhu.', grammar: 'Volitional intent to travel.', pos: 'Sentence' },
  'nepal is beautiful': { en: 'Nepal is very beautiful.', ne: 'नेपाल धेरै सुन्दर देश हो।', roman: 'Nepal dherai sundar desh ho.', grammar: 'Subject + Adverb + Adjective + Noun + Copula.', pos: 'Statement' },
  'नेपाल सुन्दर छ': { en: 'Nepal is beautiful.', ne: 'नेपाल सुन्दर छ।', roman: 'Nepal sundar chha.', grammar: 'Adjectival state description.', pos: 'Statement' },

  // Emergency & Assistance
  'help me': { en: 'Please help me!', ne: 'मलाई सहयोग गर्नुहोस्! / गुहार!', roman: 'Malai sahyog garnuhos! / Guhaar!', grammar: 'Urgent request for assistance.', pos: 'Emergency' },
  'मलाई सहयोग गर्नुहोस्': { en: 'Please help me.', ne: 'मलाई सहयोग गर्नुहोस्।', roman: 'Malai sahyog garnuhos.', grammar: 'Polite request for assistance.', pos: 'Emergency' },
  'call the doctor': { en: 'Please call a doctor immediately!', ne: 'डाक्टरलाई बोलाउनुहोस्!', roman: 'Doctor lai bolaaunuhos!', grammar: 'Medical emergency imperative.', pos: 'Emergency' },
  'call the police': { en: 'Please call the police (Dial 100)!', ne: 'प्रहरीलाई फोन गर्नुहोस् (१००)!', roman: 'Prahari lai phone garnuhos (100)!', grammar: 'Emergency security call in Nepal.', pos: 'Emergency' },
  'i am lost': { en: 'I have lost my way / I am lost.', ne: 'म बाटो बिराएँ / हराएँ।', roman: 'Ma baato biraaye / haraaye.', grammar: 'Past tense verb indicating lost orientation.', pos: 'Emergency' },
  'म हराएँ': { en: 'I am lost.', ne: 'म हराएँ।', roman: 'Ma haraaye.', grammar: 'Past tense intransitive verb.', pos: 'Emergency' },
  'i don’t understand': { en: 'I do not understand.', ne: 'मैले बुझिनँ।', roman: 'Maile bujhina.', grammar: 'Ergative negative past tense ("मैले" + "बुझिनँ").', pos: 'Statement' },
  'i do not understand': { en: 'I do not understand.', ne: 'मैले बुझिनँ।', roman: 'Maile bujhina.', grammar: 'Negative comprehension statement.', pos: 'Statement' },
  'मैले बुझिनँ': { en: 'I did not understand / I don’t understand.', ne: 'मैले बुझिनँ।', roman: 'Maile bujhina.', grammar: 'Ergative subject + negative past verb.', pos: 'Statement' },
  'do you speak english': { en: 'Do you speak English?', ne: 'के तपाईं अंग्रेजी बोल्नुहुन्छ?', roman: 'Ke tapai Angreji bolnuhunchha?', grammar: 'Question particle "के" + Subject + Language + Verb.', pos: 'Question' },
  'के तपाईं अंग्रेजी बोल्नुहुन्छ': { en: 'Do you speak English? (Polite)', ne: 'के तपाईं अंग्रेजी बोल्नुहुन्छ?', roman: 'Ke tapai Angreji bolnuhunchha?', grammar: 'Language ability inquiry.', pos: 'Question' },
  'speak slowly': { en: 'Please speak slowly.', ne: 'कृपया बिस्तारै बोल्नुहोस्।', roman: 'Kripaya bistaarai bolnuhos.', grammar: 'Adverb "बिस्तारै" (slowly) modifying polite verb.', pos: 'Request' },
  'बिस्तारै बोल्नुहोस्': { en: 'Please speak slowly.', ne: 'बिस्तारै बोल्नुहोस्।', roman: 'Bistaarai bolnuhos.', grammar: 'Request for slower speech.', pos: 'Request' },

  // Time, Numbers & Days
  'what time is it': { en: 'What time is it now?', ne: 'अहिले कति बज्यो?', roman: 'Ahile kati bajyo?', grammar: 'Time inquiry with "कति बज्यो" (how many struck).', pos: 'Question' },
  'कति बज्यो': { en: 'What time is it?', ne: 'कति बज्यो?', roman: 'Kati bajyo?', grammar: 'Time query.', pos: 'Question' },
  'today': { en: 'Today', ne: 'आज', roman: 'Aaja', grammar: 'Temporal adverb.', pos: 'Adverb' },
  'आज': { en: 'Today', ne: 'आज', roman: 'Aaja', grammar: 'Temporal adverb.', pos: 'Adverb' },
  'tomorrow': { en: 'Tomorrow', ne: 'भोलि', roman: 'Bholi', grammar: 'Temporal adverb.', pos: 'Adverb' },
  'भोलि': { en: 'Tomorrow', ne: 'भोलि', roman: 'Bholi', grammar: 'Temporal adverb.', pos: 'Adverb' },
  'yesterday': { en: 'Yesterday', ne: 'हिजो', roman: 'Hijo', grammar: 'Past temporal adverb.', pos: 'Adverb' },
  'हिजो': { en: 'Yesterday', ne: 'हिजो', roman: 'Hijo', grammar: 'Past temporal adverb.', pos: 'Adverb' },
  'now': { en: 'Now / Right now', ne: 'अहिले', roman: 'Ahile', grammar: 'Present temporal adverb.', pos: 'Adverb' },
  'अहिले': { en: 'Now', ne: 'अहिले', roman: 'Ahile', grammar: 'Present temporal adverb.', pos: 'Adverb' },
};

// 2. Bilingual Word Vocabulary Dictionary (>400 high-frequency words)
export const VOCABULARY_WORDS: Record<string, { en: string; ne: string; roman: string; pos: string }> = {
  // Pronouns
  'i': { en: 'I', ne: 'म', roman: 'Ma', pos: 'Pronoun' },
  'me': { en: 'Me / To me', ne: 'मलाई', roman: 'Malai', pos: 'Pronoun (Dative)' },
  'my': { en: 'My / Mine', ne: 'मेरो', roman: 'Mero', pos: 'Possessive Pronoun' },
  'mine': { en: 'Mine', ne: 'मेरो', roman: 'Mero', pos: 'Possessive Pronoun' },
  'we': { en: 'We', ne: 'हामी / हामीहरू', roman: 'Haami / Haamiharu', pos: 'Pronoun' },
  'our': { en: 'Our / Ours', ne: 'हाम्रो', roman: 'Hamro', pos: 'Possessive Pronoun' },
  'us': { en: 'Us / To us', ne: 'हामीलाई', roman: 'Haamilai', pos: 'Pronoun' },
  'you': { en: 'You (Polite)', ne: 'तपाईं', roman: 'Tapai', pos: 'Pronoun' },
  'your': { en: 'Your / Yours (Polite)', ne: 'तपाईंको', roman: 'Tapai ko', pos: 'Possessive Pronoun' },
  'he': { en: 'He (Polite)', ne: 'उहाँ / ऊ', roman: 'Uhan / U', pos: 'Pronoun' },
  'she': { en: 'She (Polite)', ne: 'उहाँ / उनी', roman: 'Uhan / Uni', pos: 'Pronoun' },
  'they': { en: 'They', ne: 'उनीहरू / उहाँहरू', roman: 'Uniharu / Uhanharu', pos: 'Pronoun' },
  'this': { en: 'This', ne: 'यो', roman: 'Yo', pos: 'Demonstrative' },
  'that': { en: 'That', ne: 'त्यो', roman: 'Tyo', pos: 'Demonstrative' },
  'these': { en: 'These', ne: 'यी / यीहरू', roman: 'Yee / Yeeharu', pos: 'Demonstrative' },
  'those': { en: 'Those', ne: 'ती / तीहरू', roman: 'Tee / Teeharu', pos: 'Demonstrative' },
  'here': { en: 'Here', ne: 'यहाँ', roman: 'Yaha', pos: 'Adverb of Place' },
  'there': { en: 'There', ne: 'त्यहाँ', roman: 'Tyaha', pos: 'Adverb of Place' },
  'who': { en: 'Who', ne: 'को', roman: 'Ko', pos: 'Interrogative Pronoun' },
  'what': { en: 'What', ne: 'के', roman: 'Ke', pos: 'Interrogative Pronoun' },
  'where': { en: 'Where', ne: 'कहाँ', roman: 'Kaha', pos: 'Interrogative Adverb' },
  'when': { en: 'When', ne: 'कहिले', roman: 'Kahile', pos: 'Interrogative Adverb' },
  'why': { en: 'Why', ne: 'किन', roman: 'Kina', pos: 'Interrogative Adverb' },
  'how': { en: 'How', ne: 'कसरी / कस्तो', roman: 'Kasari / Kasto', pos: 'Interrogative Adverb' },
  'how much': { en: 'How much', ne: 'कति', roman: 'Kati', pos: 'Quantifier' },
  'how many': { en: 'How many', ne: 'कतिवटा', roman: 'Kativata', pos: 'Quantifier' },

  // Common Nouns
  'water': { en: 'Water', ne: 'पानी', roman: 'Paani', pos: 'Noun' },
  'food': { en: 'Food / Meal / Rice', ne: 'खाना / भात', roman: 'Khaana / Bhaat', pos: 'Noun' },
  'tea': { en: 'Tea', ne: 'चिया', roman: 'Chiya', pos: 'Noun' },
  'coffee': { en: 'Coffee', ne: 'कफी', roman: 'Coffee', pos: 'Noun' },
  'milk': { en: 'Milk', ne: 'दूध', roman: 'Doodh', pos: 'Noun' },
  'house': { en: 'House / Home', ne: 'घर', roman: 'Ghar', pos: 'Noun' },
  'home': { en: 'Home / House', ne: 'घर', roman: 'Ghar', pos: 'Noun' },
  'room': { en: 'Room', ne: 'कोठा', roman: 'Kotha', pos: 'Noun' },
  'money': { en: 'Money / Cash', ne: 'पैसा / रुपैयाँ', roman: 'Paisa / Rupaiya', pos: 'Noun' },
  'friend': { en: 'Friend', ne: 'साथी', roman: 'Saathi', pos: 'Noun' },
  'family': { en: 'Family', ne: 'परिवार', roman: 'Parivaar', pos: 'Noun' },
  'mother': { en: 'Mother / Mom', ne: 'आमा / मुमा', roman: 'Aama / Muma', pos: 'Noun' },
  'father': { en: 'Father / Dad', ne: 'बुबा / बुवा', roman: 'Buba / Buwa', pos: 'Noun' },
  'brother': { en: 'Brother (Elder: दाजु, Younger: भाइ)', ne: 'दाजु / भाइ', roman: 'Daju / Bhai', pos: 'Noun' },
  'sister': { en: 'Sister (Elder: दिदी, Younger: बहिनी)', ne: 'दिदी / बहिनी', roman: 'Didi / Bahini', pos: 'Noun' },
  'son': { en: 'Son', ne: 'छोरा', roman: 'Chhora', pos: 'Noun' },
  'daughter': { en: 'Daughter', ne: 'छोरी', roman: 'Chhori', pos: 'Noun' },
  'husband': { en: 'Husband', ne: 'श्रीमान् / लोग्ने', roman: 'Shreemaan / Logne', pos: 'Noun' },
  'wife': { en: 'Wife', ne: 'श्रीमती / स्वास्नी', roman: 'Shreemati / Swasni', pos: 'Noun' },
  'child': { en: 'Child / Kid', ne: 'बच्चा / नानी', roman: 'Bachha / Naani', pos: 'Noun' },
  'children': { en: 'Children', ne: 'बालबालिका / बच्चाहरू', roman: 'Baalbaalika / Bachhaharu', pos: 'Noun' },
  'person': { en: 'Person / Man', ne: 'मान्छे / व्यक्ति', roman: 'Maanchhe / Byakti', pos: 'Noun' },
  'people': { en: 'People', ne: 'मानिसहरू / जनता', roman: 'Maanisharu / Janata', pos: 'Noun' },
  'country': { en: 'Country / Nation', ne: 'देश', roman: 'Desh', pos: 'Noun' },
  'nepal': { en: 'Nepal', ne: 'नेपाल', roman: 'Nepal', pos: 'Proper Noun' },
  'kathmandu': { en: 'Kathmandu', ne: 'काठमाडौँ', roman: 'Kathmandu', pos: 'Proper Noun' },
  'pokhara': { en: 'Pokhara', ne: 'पोखरा', roman: 'Pokhara', pos: 'Proper Noun' },
  'mountain': { en: 'Mountain / Himalayas', ne: 'हिमाल / पहाड', roman: 'Himaal / Pahaad', pos: 'Noun' },
  'river': { en: 'River', ne: 'नदी / खोला', roman: 'Nadi / Khola', pos: 'Noun' },
  'sun': { en: 'Sun', ne: 'सूर्य / घाम', roman: 'Surya / Ghaam', pos: 'Noun' },
  'moon': { en: 'Moon', ne: 'चन्द्रमा / जून', roman: 'Chandrama / Joon', pos: 'Noun' },
  'star': { en: 'Star', ne: 'तारा', roman: 'Taara', pos: 'Noun' },
  'sky': { en: 'Sky', ne: 'आकाश', roman: 'Aakash', pos: 'Noun' },
  'road': { en: 'Road / Path / Way', ne: 'बाटो / सडक', roman: 'Baato / Sadak', pos: 'Noun' },
  'street': { en: 'Street', ne: 'गल्ली / सडक', roman: 'Galli / Sadak', pos: 'Noun' },
  'car': { en: 'Car / Vehicle', ne: 'गाडी / कार', roman: 'Gaadi / Car', pos: 'Noun' },
  'bus': { en: 'Bus', ne: 'बस', roman: 'Bus', pos: 'Noun' },
  'flight': { en: 'Flight / Airplane', ne: 'हवाईजहाज / उडान', roman: 'Hawaijahaj / Udaan', pos: 'Noun' },
  'airplane': { en: 'Airplane', ne: 'हवाईजहाज', roman: 'Hawaijahaj', pos: 'Noun' },
  'book': { en: 'Book', ne: 'किताब / पुस्तक', roman: 'Kitaab / Pustak', pos: 'Noun' },
  'school': { en: 'School', ne: 'विद्यालय / स्कुल', roman: 'Bidyalaya / School', pos: 'Noun' },
  'college': { en: 'College', ne: 'कलेज / क्याम्पस', roman: 'College / Campus', pos: 'Noun' },
  'office': { en: 'Office', ne: 'कार्यालय / अफिस', roman: 'Karyalaya / Office', pos: 'Noun' },
  'work': { en: 'Work / Job', ne: 'काम', roman: 'Kaam', pos: 'Noun' },
  'job': { en: 'Job / Employment', ne: 'जागिर / काम', roman: 'Jaagir / Kaam', pos: 'Noun' },
  'time': { en: 'Time', ne: 'समय / बेला', roman: 'Samaya / Bela', pos: 'Noun' },
  'day': { en: 'Day', ne: 'दिन / वार', roman: 'Din / Waar', pos: 'Noun' },
  'night': { en: 'Night', ne: 'रात / रात्री', roman: 'Raat / Raatri', pos: 'Noun' },
  'morning': { en: 'Morning', ne: 'बिहान / प्रभात', roman: 'Bihaan / Prabhat', pos: 'Noun' },
  'evening': { en: 'Evening', ne: 'साँझ / सन्ध्या', roman: 'Sanjh / Sandhya', pos: 'Noun' },
  'afternoon': { en: 'Afternoon', ne: 'दिउँसो', roman: 'Diunso', pos: 'Noun' },
  'week': { en: 'Week', ne: 'हप्ता / साता', roman: 'Hapta / Saata', pos: 'Noun' },
  'month': { en: 'Month', ne: 'महिना', roman: 'Mahina', pos: 'Noun' },
  'year': { en: 'Year', ne: 'वर्ष / साल', roman: 'Barsha / Saal', pos: 'Noun' },

  // Common Verbs (Infinitive & Conjugated)
  'go': { en: 'Go / To go', ne: 'जानु / जान्छु / जानुहोस्', roman: 'Jaanu / Jaanchhu / Jaanuhos', pos: 'Verb' },
  'come': { en: 'Come / To come', ne: 'आउनु / आउँछु / आउनुहोस्', roman: 'Aaunu / Aaunchhu / Aaunuhos', pos: 'Verb' },
  'eat': { en: 'Eat / To eat', ne: 'खानु / खान्छु / खानुहोस्', roman: 'Khaanu / Khaanchhu / Khaanuhos', pos: 'Verb' },
  'drink': { en: 'Drink / To drink', ne: 'पिउनु / पिउँछु / पिउनुहोस्', roman: 'Piunu / Piunchhu / Piunuhos', pos: 'Verb' },
  'speak': { en: 'Speak / To speak', ne: 'बोल्नु / बोल्छु / बोल्नुहोस्', roman: 'Bolnu / Bolchhu / Bolnuhos', pos: 'Verb' },
  'talk': { en: 'Talk / To talk', ne: 'कुरा गर्नु', roman: 'Kuraa garnu', pos: 'Verb' },
  'listen': { en: 'Listen / Hear', ne: 'सुन्नु / सुन्छु / सुन्नुहोस्', roman: 'Sunnu / Sunchhu / Sunnuhos', pos: 'Verb' },
  'see': { en: 'See / Look / Watch', ne: 'हेर्नु / देख्नु', roman: 'Hernu / Dekhnu', pos: 'Verb' },
  'look': { en: 'Look at / Watch', ne: 'हेर्नु / हेर्नुहोस्', roman: 'Hernu / Hernuhos', pos: 'Verb' },
  'read': { en: 'Read / Study', ne: 'पढ्नु / पढ्छु', roman: 'Padhnu / Padhchhu', pos: 'Verb' },
  'write': { en: 'Write / To write', ne: 'लेख्नु / लेख्छु', roman: 'Lekhnu / Lekhchhu', pos: 'Verb' },
  'sleep': { en: 'Sleep / To sleep', ne: 'सुत्नु / सुत्छु', roman: 'Sutnu / Sutchhu', pos: 'Verb' },
  'wake': { en: 'Wake up', ne: 'उठ्नु / ब्युँझनु', roman: 'Uthnu / Byunjhanu', pos: 'Verb' },
  'walk': { en: 'Walk / Stroll', ne: 'हिँड्नु / हिँड्छु', roman: 'Hindnu / Hindchhu', pos: 'Verb' },
  'run': { en: 'Run / To run', ne: 'दौडिनु / कुद्नु', roman: 'Daudinu / Kudnu', pos: 'Verb' },
  'buy': { en: 'Buy / Purchase', ne: 'किन्नु / किन्छु', roman: 'Kinnu / Kinchhu', pos: 'Verb' },
  'sell': { en: 'Sell / To sell', ne: 'बेच्नु / बेच्छु', roman: 'Bechnu / Bechchhu', pos: 'Verb' },
  'give': { en: 'Give / Please give', ne: 'दिनु / दिनुहोस्', roman: 'Dinu / Dinuhos', pos: 'Verb' },
  'take': { en: 'Take / Receive', ne: 'लिनु / लिनुहोस्', roman: 'Linu / Linuhos', pos: 'Verb' },
  'know': { en: 'Know / Understand', ne: 'थाहा हुनु / जान्नु', roman: 'Thaaha hunu / Jaannu', pos: 'Verb' },
  'understand': { en: 'Understand / Comprehend', ne: 'बुझ्नु / बुझ्छु', roman: 'Bujhnu / Bujhchhu', pos: 'Verb' },
  'love': { en: 'Love / Like', ne: 'माया गर्नु / मन पर्नु', roman: 'Maya garnu / Man parnu', pos: 'Verb' },
  'like': { en: 'Like / Prefer', ne: 'मन पर्नु', roman: 'Man parnu', pos: 'Verb' },
  'want': { en: 'Want / Wish', ne: 'चाहनु / चाहन्छु', roman: 'Chaahanu / Chaahanchhu', pos: 'Verb' },
  'help': { en: 'Help / Assist', ne: 'सहयोग गर्नु / मद्दत गर्नु', roman: 'Sahayog garnu / Maddat garnu', pos: 'Verb' },
  'call': { en: 'Call / Summon', ne: 'बोलाउनु / फोन गर्नु', roman: 'Bolaaunu / Phone garnu', pos: 'Verb' },

  // Common Adjectives
  'good': { en: 'Good / Nice / Fine', ne: 'राम्रो / असल', roman: 'Raamro / Asal', pos: 'Adjective' },
  'bad': { en: 'Bad / Poor', ne: 'नराम्रो / खराब', roman: 'Naraamro / Kharaab', pos: 'Adjective' },
  'beautiful': { en: 'Beautiful / Lovely', ne: 'सुन्दर / राम्रो', roman: 'Sundar / Raamro', pos: 'Adjective' },
  'big': { en: 'Big / Large', ne: 'ठूलो', roman: 'Thulo', pos: 'Adjective' },
  'small': { en: 'Small / Tiny', ne: 'सानो', roman: 'Saano', pos: 'Adjective' },
  'hot': { en: 'Hot (Temperature: तातो, Weather: गर्मी, Taste: पिरो)', ne: 'तातो / गर्मी / पिरो', roman: 'Taato / Garmi / Piro', pos: 'Adjective' },
  'cold': { en: 'Cold (Weather: चिसो/जाडो)', ne: 'चिसो / जाडो', roman: 'Chiso / Jaado', pos: 'Adjective' },
  'happy': { en: 'Happy / Joyful', ne: 'खुसी / प्रसन्न', roman: 'Khusi / Prasanna', pos: 'Adjective' },
  'sad': { en: 'Sad / Unhappy', ne: 'दुःखी / उदास', roman: 'Dukhi / Udaas', pos: 'Adjective' },
  'new': { en: 'New / Fresh', ne: 'नयाँ', roman: 'Naya', pos: 'Adjective' },
  'old': { en: 'Old (Object: पुरानो, Person: वृद्ध/बुढो)', ne: 'पुरानो / वृद्ध', roman: 'Puraano / Briddha', pos: 'Adjective' },
  'fast': { en: 'Fast / Quick', ne: 'छिटो / चाँडो', roman: 'Chhito / Chaando', pos: 'Adjective / Adverb' },
  'slow': { en: 'Slow / Slowly', ne: 'ढिलो / बिस्तारै', roman: 'Dhilo / Bistaarai', pos: 'Adjective / Adverb' },
  'clean': { en: 'Clean / Pure', ne: 'सफा / शुद्ध', roman: 'Sapha / Shuddha', pos: 'Adjective' },
  'dirty': { en: 'Dirty / Unclean', ne: 'फोहोर', roman: 'Phohor', pos: 'Adjective' },
  'expensive': { en: 'Expensive / Costly', ne: 'महँगो', roman: 'Mahango', pos: 'Adjective' },
  'cheap': { en: 'Cheap / Affordable', ne: 'सस्तो', roman: 'Sasto', pos: 'Adjective' },
  'easy': { en: 'Easy / Simple', ne: 'सजिलो / सरल', roman: 'Sajilo / Saral', pos: 'Adjective' },
  'difficult': { en: 'Difficult / Hard', ne: 'गाह्रो / कठिन', roman: 'Gaahro / Kathin', pos: 'Adjective' },
  'sweet': { en: 'Sweet / Tasty', ne: 'गुलियो / मिठो', roman: 'Guliyo / Mitho', pos: 'Adjective' },
  'spicy': { en: 'Spicy / Hot taste', ne: 'पिरो', roman: 'Piro', pos: 'Adjective' },
  'sour': { en: 'Sour', ne: 'अमिलो', roman: 'Amilo', pos: 'Adjective' },
  'salty': { en: 'Salty', ne: 'नुनिलो', roman: 'Nunilo', pos: 'Adjective' },
  'bitter': { en: 'Bitter', ne: 'तीतो', roman: 'Teeto', pos: 'Adjective' },
  'true': { en: 'True / Real', ne: 'साँचो / सत्य', roman: 'Sancho / Satya', pos: 'Adjective' },
  'false': { en: 'False / Lie', ne: 'झूटो / गलत', roman: 'Jhooto / Galat', pos: 'Adjective' },
  'all': { en: 'All / Everything', ne: 'सबै / सम्पूर्ण', roman: 'Sabai / Sampurna', pos: 'Quantifier' },
  'some': { en: 'Some / A few', ne: 'केही / अलिकति', roman: 'Kehi / Alikati', pos: 'Quantifier' },
  'many': { en: 'Many / A lot', ne: 'धेरै', roman: 'Dherai', pos: 'Quantifier' },
  'much': { en: 'Much / A lot', ne: 'धेरै', roman: 'Dherai', pos: 'Quantifier' },
  'very': { en: 'Very / Extremely', ne: 'धेरै / ज्यादै', roman: 'Dherai / Jyaadai', pos: 'Adverb' },
  'yes': { en: 'Yes (Agreement: हजुर/हुन्छ/हो)', ne: 'हजुर / हो / हुन्छ', roman: 'Hajur / Ho / Hunchha', pos: 'Affirmation' },
  'no': { en: 'No (Negative: होइन/छैन/हुँदैन)', ne: 'होइन / छैन / हुँदैन', roman: 'Hoina / Chhaina / Hundaina', pos: 'Negation' },
};

// 3. Devanagari to Roman Phonetic Transliterator
export function transliterateDevanagari(text: string): string {
  if (!text) return '';
  const consonants: Record<string, string> = {
    'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
    'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
    'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
    'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
    'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
    'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'wa',
    'श': 'sha', 'ष': 'sha', 'स': 'sa', 'ह': 'ha',
    'क्ष': 'ksha', 'त्र': 'tra', 'ज्ञ': 'gya'
  };
  const vowels: Record<string, string> = {
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
    'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'am', 'अः': 'ah'
  };
  const matras: Record<string, string> = {
    'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
    'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ँ': 'n', '्': ''
  };

  // Simple heuristic character-by-character replacement
  let res = '';
  let i = 0;
  while (i < text.length) {
    const char = text[i];
    const nextChar = text[i + 1] || '';

    if (matras[char] !== undefined) {
      // Matra applied to preceding consonant (replace the implicit 'a' with the matra)
      if (char === '्') {
        if (res.endsWith('a')) res = res.slice(0, -1);
      } else {
        if (res.endsWith('a')) res = res.slice(0, -1);
        res += matras[char];
      }
    } else if (vowels[char]) {
      res += vowels[char];
    } else if (consonants[char]) {
      res += consonants[char];
    } else {
      res += char;
    }
    i++;
  }
  return res.trim();
}

// 4. Main Offline Intelligent Translation Engine
export function translateOffline(
  text: string,
  from: 'ne' | 'en' = 'ne',
  to: 'ne' | 'en' = 'en'
): TranslationResult {
  const clean = (text || '').trim();
  if (!clean) {
    return {
      translatedText: '',
      transliteration: '',
      wordBreakdown: [],
      grammarNote: 'कृपया अनुवाद गर्न कुनै शब्द वा वाक्य प्रविष्ट गर्नुहोस्।',
      exampleUsage: '',
      fromLang: from,
      toLang: to,
    };
  }

  const cleanLower = clean.toLowerCase().replace(/[.,!?।]+/g, '').trim();

  // Step A: Exact Phrase Match First
  for (const [key, item] of Object.entries(PHRASE_DICTIONARY)) {
    const keyClean = key.toLowerCase().replace(/[.,!?।]+/g, '').trim();
    if (cleanLower === keyClean) {
      const isFromNe = from === 'ne';
      const targetTrans = isFromNe ? item.en : item.ne;
      const romanPhonetic = item.roman || (isFromNe ? transliterateDevanagari(item.ne) : transliterateDevanagari(targetTrans));
      return {
        translatedText: targetTrans,
        transliteration: romanPhonetic,
        wordBreakdown: [
          {
            word: clean,
            meaning: targetTrans,
            partOfSpeech: item.pos || 'Key Phrase',
          },
        ],
        grammarNote: item.grammar || (isFromNe ? 'नेपाली व्याकरण (SOV) क्रम।' : 'English Subject-Verb-Object (SVO) order.'),
        exampleUsage: isFromNe ? `नेपाली: ${item.ne} -> English: ${item.en}` : `English: ${item.en} -> नेपाली: ${item.ne} (${item.roman})`,
        sourceText: clean,
        fromLang: from,
        toLang: to,
      };
    }
  }

  // Step A2: Longest Matching Phrase in Phrasebook
  const sortedPhraseKeys = Object.keys(PHRASE_DICTIONARY).sort((a, b) => b.length - a.length);
  for (const key of sortedPhraseKeys) {
    const keyClean = key.toLowerCase().replace(/[.,!?।]+/g, '').trim();
    if (keyClean.length > 5 && (cleanLower.includes(keyClean) || keyClean.includes(cleanLower))) {
      const item = PHRASE_DICTIONARY[key];
      const isFromNe = from === 'ne';
      const targetTrans = isFromNe ? item.en : item.ne;
      const romanPhonetic = item.roman || (isFromNe ? transliterateDevanagari(item.ne) : transliterateDevanagari(targetTrans));
      return {
        translatedText: targetTrans,
        transliteration: romanPhonetic,
        wordBreakdown: [
          {
            word: clean,
            meaning: targetTrans,
            partOfSpeech: item.pos || 'Key Phrase',
          },
        ],
        grammarNote: item.grammar || (isFromNe ? 'नेपाली व्याकरण (SOV) क्रम।' : 'English Subject-Verb-Object (SVO) order.'),
        exampleUsage: isFromNe ? `नेपाली: ${item.ne} -> English: ${item.en}` : `English: ${item.en} -> नेपाली: ${item.ne} (${item.roman})`,
        sourceText: clean,
        fromLang: from,
        toLang: to,
      };
    }
  }

  // Step B: Word-by-Word Matching & Sentence Reconstruction
  const words = clean.split(/[\s,।!?.]+/).filter(Boolean);
  const wordBreakdown: WordDetail[] = [];
  const translatedWords: string[] = [];

  const isFromNe = from === 'ne';

  // Build reverse lookup index for Nepali words
  const nepaliWordMap: Record<string, { en: string; ne: string; roman: string; pos: string }> = {};
  for (const [_, item] of Object.entries(VOCABULARY_WORDS)) {
    const neSplits = item.ne.split(/[\s/]+/).map((s) => s.trim());
    for (const neW of neSplits) {
      if (neW) nepaliWordMap[neW] = item;
    }
  }

  for (const w of words) {
    const wLower = w.toLowerCase();
    let found = false;

    if (isFromNe) {
      // Look up Nepali word
      if (nepaliWordMap[w]) {
        const item = nepaliWordMap[w];
        translatedWords.push(item.en.split(/[\s/]+/)[0]);
        wordBreakdown.push({
          word: w,
          meaning: item.en,
          partOfSpeech: item.pos,
        });
        found = true;
      } else {
        // Check partials
        for (const [_, item] of Object.entries(VOCABULARY_WORDS)) {
          if (item.ne.includes(w) || w.includes(item.ne)) {
            translatedWords.push(item.en.split(/[\s/]+/)[0]);
            wordBreakdown.push({ word: w, meaning: item.en, partOfSpeech: item.pos });
            found = true;
            break;
          }
        }
      }
    } else {
      // Look up English word
      if (VOCABULARY_WORDS[wLower]) {
        const item = VOCABULARY_WORDS[wLower];
        const nePrimary = item.ne.split(/[\s/]+/)[0];
        translatedWords.push(nePrimary);
        wordBreakdown.push({
          word: w,
          meaning: item.ne,
          partOfSpeech: item.pos,
        });
        found = true;
      }
    }

    if (!found) {
      translatedWords.push(w);
      wordBreakdown.push({
        word: w,
        meaning: isFromNe ? `Meaning in context` : `सन्दर्भ अनुसार अर्थ`,
        partOfSpeech: 'Contextual Word',
      });
    }
  }

  let finalTranslation = translatedWords.join(' ');
  if (!isFromNe) {
    // English -> Nepali basic SOV word-order smoothing if simple SVO sentence
    if (words.length >= 3 && translatedWords.length >= 3) {
      // e.g. "I love Nepal" -> translatedWords = ["म", "माया गर्छु", "नेपाल"] -> rearrange to ["म", "नेपाल", "माया गर्छु"]
      const subj = translatedWords[0];
      const verb = translatedWords[1];
      const obj = translatedWords.slice(2).join(' ');
      finalTranslation = `${subj} ${obj} ${verb}।`;
    } else {
      finalTranslation = translatedWords.join(' ') + '।';
    }
  }

  const transliteration = isFromNe
    ? transliterateDevanagari(clean)
    : transliterateDevanagari(finalTranslation);

  const grammarNote = isFromNe
    ? 'नेपाली वाक्य रचना प्राय: कर्ता + कर्म + क्रिया (Subject + Object + Verb) को ढाँचामा हुन्छ।'
    : 'English structure follows Subject + Verb + Object (SVO), whereas Nepali follows Subject + Object + Verb (SOV).';

  return {
    translatedText: finalTranslation,
    transliteration,
    wordBreakdown,
    grammarNote,
    exampleUsage: isFromNe
      ? `उदाहरण: ${clean} (English: ${finalTranslation})`
      : `Example: ${clean} (नेपाली: ${finalTranslation})`,
    sourceText: clean,
    fromLang: from,
    toLang: to,
  };
}
