/**
 * Nepali Cultural Festivals & Heritage Data
 * Dynamically calculated for live current BS & AD years (e.g. BS 2083 / AD 2026-2027)
 */
import { FestivalInfo, NepaliDate } from '../types';
import { 
  bsToAd, 
  adToBs, 
  BS_MONTH_NAMES_NE, 
  BS_MONTH_NAMES_EN, 
  toNepaliDigits 
} from '../utils/nepaliCalendar';

export interface FestivalDefinition {
  id: string;
  nameNe: string;
  nameEn: string;
  bsMonth: number; // 1-12 (1 = Baishakh, 6 = Ashwin, etc.)
  bsDay: number;   // 1-32
  bsDayEnd?: number; // for multi-day festivities
  importance: 'major' | 'medium' | 'minor';
  taglineNe: string;
  taglineEn: string;
  descriptionNe: string;
  descriptionEn: string;
  ritualsNe: string[];
  ritualsEn: string[];
  recipeOrHighlightNe?: string;
  recipeOrHighlightEn?: string;
  imageTheme: string;
  seasonNe: string;
  seasonEn: string;
}

export const FESTIVAL_DEFINITIONS: FestivalDefinition[] = [
  {
    id: 'ghatasthapana',
    nameNe: 'घटस्थापना (बडादशैं प्रारम्भ)',
    nameEn: 'Ghatasthapana (Dashain Starts)',
    bsMonth: 6, // Ashwin
    bsDay: 25,  // Ashwin 25 in 2083 (October 11, 2026)
    importance: 'major',
    taglineNe: 'नवरात्र प्रारम्भ, घट स्थापना गरी जौको पवित्र पहेँलो जमरा राख्ने पावन दिन',
    taglineEn: 'The sacred inaugural day of Dashain Navaratri: Kalash ritual and sowing of auspicious golden Jamara',
    descriptionNe: 'घटस्थापना बडादशैंको पहिलो र अत्यन्त महत्वपूर्ण दिन हो। यस दिन बिहानै स्नान गरी पूजाकोठा वा दशैंघरमा विधिपूर्वक माटो वा तामाको कलश (घट) स्थापना गरिन्छ। बालुवा वा माटोमा जौ, गहुँ र मकै छरेर नौ दिनसम्म पूजा गरी विजयादशमीका लागि पवित्र जमरा उमार्ने परम्परा छ। यसै दिनदेखि ९ दिनसम्म शैलपुत्री लगायत नवदुर्गाको विशेष आराधना गरिन्छ।',
    descriptionEn: 'Ghatasthapana marks the grand commencement of Bada Dashain. Devotees invoke Goddess Durga by establishing a sacred brass Kalash filled with holy water and sowing barley seeds in fertile soil to cultivate holy golden sprouts (Jamara) for Vijaya Dashami.',
    ritualsNe: ['बिहानै स्नान गरी दशैंघर वा पूजाकोठा चोख्याउने', 'विधिपूर्वक माटोको वेदी बनाई कलश (घट) स्थापना गर्ने', 'पवित्र बालुवामा जौ-गहुँ छरेर जमरा राख्ने', 'शैलपुत्री देवीको पूजा र दुर्गा सप्तशती (चण्डी) पाठ आरम्भ', '९ दिनसम्म अखण्ड दीप प्रज्वलन'],
    ritualsEn: ['Morning holy purification of prayer room (Dashain Ghar)', 'Ritual Kalash installation with holy water, mango leaves, and coconut', 'Sowing barley seeds in sacred sand beds for golden Jamara', 'Invoking Goddess Shailaputri and chanting Durga Saptashati (Chandi)', 'Lighting perpetual oil lamps (Akhanda Jyoti) for Navaratri'],
    recipeOrHighlightNe: 'ताजा फलफूल, पञ्चामृत, दूध-खीर, र चोखो शाकाहारी नैवेद्य',
    recipeOrHighlightEn: 'Fresh seasonal fruits, holy Panchamrit, milk pudding, and pure sattvic offerings',
    imageTheme: 'from-amber-600 via-rose-700 to-red-700',
    seasonNe: 'शरद ऋतु (Autumn)',
    seasonEn: 'Autumn Season',
  },
  {
    id: 'dashain',
    nameNe: 'बडादशैं (विजयादशमी)',
    nameEn: 'Bada Dashain (Vijaya Dashami)',
    bsMonth: 7, // Kartik
    bsDay: 4,   // Vijaya Dashami main day (Kartik 4 in 2083 / Oct 21, 2026)
    importance: 'major',
    taglineNe: 'नेपालीहरूको महानतम राष्ट्रिय चाड, देवी दुर्गाको विजय उत्सव र मान्यजनको आशीर्वाद',
    taglineEn: 'The grandest 15-day national festival celebrating the victory of Good over Evil with sacred Tika & Jamara',
    descriptionNe: 'दशैं नेपालको सबैभन्दा ठूलो र लामो चाड हो। १५ दिनसम्म मनाइने यो पर्वमा घटस्थापना, फूलपाती, महाअष्टमी, महानवमी र विजयादशमी मुख्य दिन हुन्। मान्यजनको हातबाट रातो टीका, पहेँलो जमरा लगाई आशीर्वाद लिने, नयाँ लुगा लगाउने, लिङ्गे पिङ खेल्ने, चङ्गा उडाउने र परिवारसँग मिष्ठान्न भोजन गर्ने परम्परा छ।',
    descriptionEn: 'Dashain is the supreme celebration in Nepal honoring Goddess Durga. Elders bestow crimson rice Tika, vibrant golden Jamara, and profound blessings on younger generations alongside joy on traditional bamboo swings (Linge Ping).',
    ritualsNe: ['घटस्थापनामा जमरा राख्ने', 'फूलपाती भित्र्याउने र कालरात्रि पूजा', 'विजयादशमीमा मान्यजनबाट रातो टीका र जमरा ग्रहण', 'लिङ्गे पिङ खेल्ने र चङ्गा उडाउने', 'दशैं दक्षिणा र पारिवारिक पुनर्मिलन'],
    ritualsEn: ['Planting holy barley seeds on Ghatasthapana', 'Fulpati royal procession and Kalratri', 'Elder blessings with Tika & Jamara on Vijaya Dashami', 'Riding bamboo swings (Linge Ping) and flying kites', 'Family feasts and Dashain Dakshina'],
    recipeOrHighlightNe: 'खसीको पक्कु, सेलरोटी, आलुदम, काँक्राको अचार, र ताजा दही',
    recipeOrHighlightEn: 'Traditional Goat curry (Pakku), crispy Sel Roti, spiced potato dum, and curd',
    imageTheme: 'from-red-700 via-rose-800 to-amber-700',
    seasonNe: 'शरद ऋतु (Autumn)',
    seasonEn: 'Autumn Season',
  },
  {
    id: 'tihar',
    nameNe: 'तिहार / यमपञ्चक (दीपावली)',
    nameEn: 'Tihar / Deepawali (Festival of Lights)',
    bsMonth: 7, // Kartik
    bsDay: 15,  // Laxmi Puja
    bsDayEnd: 17, // Bhai Tika
    importance: 'major',
    taglineNe: 'उज्यालो, रङ, सयपत्री फूल, दाजुभाइ-दिदीबहिनीको स्नेह र यमराजको आराधना',
    taglineEn: 'Five-day festival of lights, vibrant rangoli, floral garlands, and unbreakable sibling bonds',
    descriptionNe: 'तिहार ५ दिनसम्म मनाइने उल्लासमय चाड हो जसमा काग, कुकुर, गाई, गोवर्धन र दाजुभाइ (भाइटीका) को पूजा गरिन्छ। लक्ष्मी पूजाको साँझ घर-घरमा माटोको दियो, झिलिमिली बत्ती बालेर धनकी देवी लक्ष्मीको स्वागत गरिन्छ। देउसी-भैलो खेलेर टोल-छिमेकमा खुसी बाँडिन्छ।',
    descriptionEn: 'Tihar is a five-day festival celebrating animals (Crow, Dog, Cow, Ox) and the sacred bond between brothers and sisters on Bhai Tika with seven-colored tika and fragrant Makhamali garlands.',
    ritualsNe: ['काग, कुकुर र गाई पूजा', 'लक्ष्मी पूजा र घर उज्यालो बनाउने', 'गोवर्धन पूजा र म्ह पूजा (नेवार परम्परा)', 'सप्तरङ्गी भाइटीका र मखमली माला', 'देउसी-भैलो गायन'],
    ritualsEn: ['Worship of crows, dogs, and sacred cows', 'Goddess Lakshmi Puja with clay oil lamps', 'Mha Puja (Worship of the Self in Newar tradition)', 'Seven-color Bhai Tika and Makhamali garlands', 'Deusi-Bhailo cultural melodies'],
    recipeOrHighlightNe: 'गोलो सेलरोटी, अनरसा, फिनी रोटी, ड्राइ फ्रुट्स र मिठाइहरू',
    recipeOrHighlightEn: 'Crispy ring Sel Roti, Anarsa, multi-layered Fini Roti, and dry fruits',
    imageTheme: 'from-amber-500 via-orange-600 to-red-600',
    seasonNe: 'शरद ऋतु (Autumn)',
    seasonEn: 'Autumn Season',
  },
  {
    id: 'chhath',
    nameNe: 'छठ पर्व (सूर्य षष्ठी)',
    nameEn: 'Chhath Parva (Sun & River Worship)',
    bsMonth: 7, // Kartik
    bsDay: 22,
    importance: 'major',
    taglineNe: 'नदी-तलाउ किनारमा उदाउँदो र अस्ताउँदो सूर्यलाई अर्घ्य दिने पवित्र वैदिक पर्व',
    taglineEn: 'Sacred Vedic ritual offering heartfelt gratitude to the Sun God (Surya) and Chhathi Maiya',
    descriptionNe: 'तराई-मधेशबाट सुरु भई हाल देशव्यापी रूपमा मनाइने छठ पर्व शुद्धता, कठोर संयम र प्रकृतिको उपासनाको प्रतीक हो। ४ दिनसम्म चल्ने यस पर्वमा नहाय-खाय, खरना, अस्ताउँदो सूर्यलाई सन्ध्या अर्घ्य र चौथो दिन उदाउँदो सूर्यलाई बिहानी अर्घ्य दिइन्छ।',
    descriptionEn: 'Chhath is an ancient Vedic festival devoted to the Sun God and Chhathi Maiya for sustaining cosmic energy. Devotees observe strict fasting and pray standing in river waters with offerings.',
    ritualsNe: ['नहाय-खाय र आत्मशुद्धि', 'खरनामा खीर र रोटी अर्पण', 'अस्ताउँदो सूर्यलाई सन्ध्या अर्घ्य (साँझ)', 'उदाउँदो सूर्यलाई उषा अर्घ्य (बिहान)', 'ठेकुवा र भुसुवा प्रसाद अर्पण'],
    ritualsEn: ['Nahay Khay (Purification bath)', 'Kharna prasad with kheer and roti', 'Sanjhiya Arghya to the setting sun', 'Bihaniya Arghya to the rising sun', 'Thekua and Bhusuwa holy offerings'],
    recipeOrHighlightNe: 'घ्युमा बनेको ठेकुवा, भुसुवा, उखु, नरिवल र मौसमका फलफूल',
    recipeOrHighlightEn: 'Authentic wheat-jaggery Thekua, sugarcane sticks, and holy coconuts',
    imageTheme: 'from-orange-500 via-amber-600 to-yellow-600',
    seasonNe: 'हेमन्त ऋतु (Pre-Winter)',
    seasonEn: 'Pre-Winter Season',
  },
  {
    id: 'maghe_sankranti',
    nameNe: 'माघे संक्रान्ति / माघी पर्व',
    nameEn: 'Maghe Sankranti / Maghi Parva',
    bsMonth: 10, // Magh
    bsDay: 1,
    importance: 'medium',
    taglineNe: 'सूर्य धनु राशिबाट मकर राशिमा प्रवेश गर्ने दिन, उत्तरायण प्रारम्भ र थारु नयाँ वर्ष',
    taglineEn: 'Winter solstice transition of the Sun into Capricorn; Tharu New Year & holy river confluence dips',
    descriptionNe: 'माघे संक्रान्तिले जाडो यामको अन्त्य र न्यानो दिनको सुरुवातको संकेत गर्दछ। यस दिन पवित्र देवघाट, त्रिवेणी लगायत नदी संगमहरूमा मकर स्नान गरिन्छ। थारु समुदायमा यसलाई नयाँ वर्षको रूपमा धूमधामका साथ माघी पर्व मनाइन्छ।',
    descriptionEn: 'Marks the winter harvest and sun\'s northward journey (Uttarayan). Celebrated across Nepal with sacred river dips and wholesome warming winter delicacies.',
    ritualsNe: ['नदी संगममा मकर स्नान', 'घिउ, चाकु, तिलको लड्डु र तरुल खाने', 'थारु समुदायको माघी नृत्य र कुल पूजा', 'आमा र छोरीबेटीलाई दक्षिणा'],
    ritualsEn: ['Holy river confluences holy dips', 'Feasting on Ghee, Chaku, Sesame Laddoos, Yam (Tarul)', 'Maghi traditional dances in Tharu communities', 'Blessing daughters with winter gifts'],
    recipeOrHighlightNe: 'तिलको लड्डु, चाकु, घ्यु, पिँडालु, तरुल, र मासको दालको खिचडी',
    recipeOrHighlightEn: 'Sesame Laddoos, molasses Chaku, boiled wild yams, and warm Khichadi',
    imageTheme: 'from-amber-600 via-yellow-600 to-orange-700',
    seasonNe: 'शिशिर ऋतु (Winter)',
    seasonEn: 'Winter Season',
  },
  {
    id: 'maha_shivaratri',
    nameNe: 'महाशिवरात्रि (सेना दिवस)',
    nameEn: 'Maha Shivaratri (The Great Night of Shiva)',
    bsMonth: 11, // Falgun
    bsDay: 13,
    importance: 'major',
    taglineNe: 'पशुपतिनाथ मन्दिरमा लाखौं भक्तजन र साधु-सन्तको आगमन, शिव उपासना र जागरण',
    taglineEn: 'The supreme night of Lord Shiva, cosmic meditation and grand Pashupatinath pilgrimage',
    descriptionNe: 'महाशिवरात्रि हिन्दू धर्मावलम्बीहरूको महान् पर्व हो। काठमाडौंस्थित पशुपतिनाथ मन्दिरमा नेपाल तथा भारतबाट लाखौं भक्तजन, नागा बाबाहरू भेला हुन्छन्। दिनभर उपवास बसी राति चार प्रहरको विशेष शिव पूजा र धुनी बाल्ने चलन छ।',
    descriptionEn: 'Honors Lord Shiva performing the cosmic Tandava dance. Devotees throng the ancient Pashupatinath temple for all-night vigils, chanting, and sacred bonfire (Dhuni).',
    ritualsNe: ['पशुपतिनाथ दर्शन र पवित्र बागमती स्नान', 'दिनभर निर्जला वा फलाहार व्रत', 'चार प्रहरको रुद्राभिषेक पूजा', 'धुनी बाल्ने र भजन कीर्तन', 'शिवजीको प्रसाद ग्रहण'],
    ritualsEn: ['Holy Pashupatinath Darshan and Bagmati river dip', 'Fasting and meditation', 'Four-quarter Rudrabhishek prayer', 'Lighting holy bonfires and singing Shiva Bhajans', 'Distributing holy Prasad'],
    recipeOrHighlightNe: 'दूध-भाङको घोट्टा (ठण्डाई), पञ्चामृत, फलफूल र कन्दमूल',
    recipeOrHighlightEn: 'Traditional Spiced Milk Thandai, Panchamrit, fruits, and dry fruits',
    imageTheme: 'from-indigo-800 via-purple-900 to-slate-900',
    seasonNe: 'शिशिर-वसन्त ऋतु (Late Winter)',
    seasonEn: 'Late Winter',
  },
  {
    id: 'holi',
    nameNe: 'फागु पूर्णिमा (होली)',
    nameEn: 'Fagu Purnima (Holi Festival of Colors)',
    bsMonth: 11, // Falgun
    bsDay: 29,
    bsDayEnd: 30, // Terai celebrates next day
    importance: 'major',
    taglineNe: 'रङ, उमङ्ग, पानीका लोला र वसन्तको स्वागत गर्ने रङ्गीन चाड',
    taglineEn: 'Vibrant festival of spring, organic colored powders, water balloons, and joyful camaraderie',
    descriptionNe: 'होली वसन्त ऋतुको स्वागतमा खेलिने रङहरूको रमाइलो चाड हो। पहाडी जिल्लामा फागुन पूर्णिमाको दिन र तराई-मधेशमा भोलिपल्ट मनाइन्छ। भक्त प्रह्लादको भक्ति र होलिका दहनको सम्झनामा असत्यमाथि सत्यको विजय स्वरूप अबिर र पानीले एकअर्कालाई रङ्गाइन्छ।',
    descriptionEn: 'Holi celebrates the arrival of spring and eternal love. People smear vibrant herbal Gulal powders, throw water balloons (Lolas), sing folk songs, and share delightful sweets.',
    ritualsNe: ['चीर गाड्ने र चीर दहन', 'एकअर्कामा अबिर र रङ दल्ने', 'लोला हान्ने र पिचकारी खेल्ने', 'पारिवारिक र साथीभाइ जमघट', 'सांस्कृतिक होली गीत-सङ्गीत'],
    ritualsEn: ['Installation of Chir at Basantapur and burning ceremony', 'Smearing colorful Gulal and Abeer', 'Water splashing and Pichkari games', 'Gathering with loved ones', 'Singing traditional Holi melodies'],
    recipeOrHighlightNe: 'मालपुवा, गुझिया, दही-बडा, पकौडा र लस्सी',
    recipeOrHighlightEn: 'Sweet Malpua, stuffed Gujiya, Dahi Vada, and refreshing Lassi',
    imageTheme: 'from-pink-600 via-rose-600 to-amber-500',
    seasonNe: 'वसन्त ऋतु (Spring)',
    seasonEn: 'Spring Season',
  },
  {
    id: 'buddha_jayanti',
    nameNe: 'बुद्ध जयन्ती / उभौली पर्व',
    nameEn: 'Buddha Jayanti & Ubhauli Parva',
    bsMonth: 1, // Baishakh
    bsDay: 29,
    importance: 'medium',
    taglineNe: 'शान्तिका अग्रदूत गौतम बुद्धको जन्म, ज्ञान प्राप्ति र महापरिनिर्वाण दिवस',
    taglineEn: 'Triple blessed day celebrating the Birth, Enlightenment, and Mahaparinirvana of Lord Buddha',
    descriptionNe: 'लुम्बिनीमा जन्मनुभएका भगवान बुद्धको त्रि-संयोग दिवसका रूपमा बुद्ध पूर्णिमा मनाइन्छ। स्वयम्भू, बौद्धनाथ र लुम्बिनीमा विश्वभरका बौद्ध धर्मावलम्बीहरू भेला भई शान्ति प्रार्थना र दीप प्रज्वलन गर्दछन्। साथै किरात समुदायले उभौली पर्व मनाउँछन्।',
    descriptionEn: 'Celebrated across Lumbini, Swayambhunath, and Boudhanath Stupas with prayer flags, butter lamps, meditation walks, alongside Kirat Ubhauli Sakela dances.',
    ritualsNe: ['स्वयम्भू, बौद्ध र लुम्बिनी दर्शन', 'विश्व शान्तिका लागि दीप प्रज्वलन', 'बुद्ध वचन र पञ्चशील पालना', 'किरात साकेला शिली नृत्य', 'शान्ति पदयात्रा'],
    ritualsEn: ['Pilgrimage to Lumbini and Stupas', 'Lighting butter lamps for world peace', 'Chanting Buddhist Sutras', 'Kirat indigenous Sakela dance', 'Peace rally and vegetarian feasts'],
    recipeOrHighlightNe: 'खीर, साकाहारी भोजन र शुद्ध फलफूल प्रसाद',
    recipeOrHighlightEn: 'Sacred sweet milk rice pudding (Kheer) and pure vegetarian feasts',
    imageTheme: 'from-amber-600 via-yellow-500 to-emerald-600',
    seasonNe: 'ग्रीष्म ऋतु (Summer)',
    seasonEn: 'Early Summer',
  },
  {
    id: 'teej',
    nameNe: 'हरितालिका तीज (ऋषि पञ्चमी)',
    nameEn: 'Haritalika Teej',
    bsMonth: 5, // Bhadra
    bsDay: 20,
    importance: 'major',
    taglineNe: 'नेपाली महिलाहरूको सौभाग्य, समर्पण, दर खाने र शिव-पार्वती उपासनाको चाड',
    taglineEn: 'Celebration of marital bliss, sisterhood, vibrant red attire, and Lord Shiva & Parvati devotion',
    descriptionNe: 'तीज नेपाली महिलाहरूको विशेष सांस्कृतिक पर्व हो। अघिल्लो रात ‘दर’ खाएर भोलिपल्ट निर्जला व्रत बसी पशुपतिनाथ लगायत शिव मन्दिरमा पूजा गरिन्छ। रातो साडी, पोते र चुरामा सजिएर महिलाहरू दिनभर तीजका मौलिक गीतमा नाच्ने गर्दछन्।',
    descriptionEn: 'A festival where women wear crimson red saris, green pote, and glass bangles, observing devotional fasting for family happiness, dancing to heartfelt folk songs.',
    ritualsNe: ['अघिल्लो रात दर खाने', 'शिव मन्दिरमा निर्जला व्रत र पूजा', 'तीजका मौलिक भाकामा नाचगान', 'माइती र दिदीबहिनीको मिलन', 'ऋषि पञ्चमीमा ३६५ दतिउनले स्नान'],
    ritualsEn: ['Midnight Dar feast with rich delicacies', 'Devotional fasting and Shiva puja', 'Dancing to traditional Teej folk tunes', 'Sisterhood and motherly homecomings', 'Rishi Panchami cleansing ritual with Datiwan'],
    recipeOrHighlightNe: 'घ्युमा भुटेको खीर, लट्टे, दर, अनरसा, काँक्राको रायता',
    recipeOrHighlightEn: 'Rich sweet Dar kheer, roasted latte, cucumber raita, and spiced sweets',
    imageTheme: 'from-red-600 via-rose-700 to-pink-700',
    seasonNe: 'वर्षा ऋतु (Monsoon)',
    seasonEn: 'Monsoon Season',
  },
  {
    id: 'matatirtha',
    nameNe: 'मातातीर्थ औंसी (आमाको मुख हेर्ने दिन)',
    nameEn: 'Mata Tirtha Aaunsi (Nepali Mother\'s Day)',
    bsMonth: 1, // Baishakh
    bsDay: 25,
    importance: 'major',
    taglineNe: 'जन्म दिने आमाप्रति अनन्त श्रद्धा, भक्ति, मिष्ठान्न भोजन र कृतज्ञता अर्पण गर्ने पवित्र दिन',
    taglineEn: 'Heartfelt homage to mothers with sweet delicacies, gifts, and holy dip at Mata Tirtha pond',
    descriptionNe: 'मातातीर्थ औंसी (आमाको मुख हेर्ने दिन) नेपाली समाजमा आमाको अतुलनीय ममता, स्नेह र त्यागको कदर गर्ने अत्यन्त भावुक तथा पवित्र पर्व हो। यस दिन छोराछोरीहरूले आफ्नी आमालाई मनपर्ने फलफूल, मिठाई, लुगा उपहार दिई ढोग गरेर आशीर्वाद लिन्छन्। आमा नहुनेहरू काठमाडौंको थानकोट नजिकै मातातीर्थ कुण्डमा गई श्राद्ध, तर्पण र स्नान गरी आमाको मोक्षको कामना गर्दछन्।',
    descriptionEn: 'Mata Tirtha Aunsi is Nepal\'s sacred Mother\'s Day. Children honor living mothers with gifts, sweets, and heartfelt blessings. Devotees whose mothers have passed away visit the sacred Mata Tirtha pond in Kathmandu for holy dips and memorial rituals (Tarpan/Shraddha).',
    ritualsNe: ['आमाको गोडा धोएर ढोग्ने र आशीर्वाद ग्रहण', 'आमालाई मनपर्ने मिठाई, फलफूल र नयाँ वस्त्र उपहार', 'काठमाडौंको मातातीर्थ कुण्डमा पवित्र स्नान र तर्पण', 'पारिवारिक स्नेह मिलन र आमाको सम्मान'],
    ritualsEn: ['Touching mother\'s feet for blessings', 'Gifting mother favorite sweets, fruits, and traditional garments', 'Holy bath and memorial shraddha at Mata Tirtha Pond', 'Heartwarming family gathering celebrating motherhood'],
    recipeOrHighlightNe: 'आमाको रोजाइका मिष्ठान्न परिकार, मालपुवा, खीर, र रसवरी',
    recipeOrHighlightEn: 'Mother’s favorite festive foods, sweet milk kheer, malpua, and fresh seasonal fruits',
    imageTheme: 'from-rose-600 via-pink-700 to-red-600',
    seasonNe: 'ग्रीष्म ऋतु (Early Summer)',
    seasonEn: 'Early Summer',
  },
  {
    id: 'kushe_aunsi',
    nameNe: 'कुशे औंसी (बुवाको मुख हेर्ने दिन)',
    nameEn: 'Kushe Aaunsi (Nepali Father\'s Day)',
    bsMonth: 5, // Bhadra
    bsDay: 17,
    importance: 'major',
    taglineNe: 'बुवाप्रति आदर-सत्कार, घरमा कुश भित्र्याउने र पितृ स्मरण गर्ने पावन पर्व',
    taglineEn: 'Honoring fathers with reverence, bringing holy Kush grass home, and holy dips at Gokarna',
    descriptionNe: 'कुशे औंसीका दिन छोराछोरीले बुवालाई मिठा परिकार खुवाएर ढोग गरी बुवाको मुख हेर्ने गर्दछन्। साथै घर-घरमा ब्राह्मणद्वारा मन्त्रोच्चारित पवित्र कुश भित्र्याइन्छ। बुवा नहुनेहरू काठमाडौंको गोकर्णेश्वर महादेव मन्दिर र उत्तरगयामा गई पिण्डदान तथा तर्पण गर्दछन्।',
    descriptionEn: 'Children honor fathers with delicious feasts and respects. Priests also deliver holy Kush grass to households. Those whose fathers have passed away visit Gokarneshwor temple for holy shraddha.',
    ritualsNe: ['बुवालाई मिष्ठान्न खुवाएर आशीर्वाद लिने', 'पवित्र कुश घरमा भित्र्याउने', 'गोकर्णेश्वर मन्दिरमा पितृ तर्पण र पिण्डदान', 'पारिवारिक भोज र उपहार'],
    ritualsEn: ['Touching father\'s feet and presenting sweets', 'Bringing sanctified Kush grass into homes', 'Memorial rituals at Gokarneshwor Mahadev', 'Family reunion and gifts'],
    recipeOrHighlightNe: 'मिठाई, दही-पेडा, सेलरोटी, र फलफूल',
    recipeOrHighlightEn: 'Nepali traditional sweets, Peda, Sel Roti, and seasonal fruits',
    imageTheme: 'from-amber-600 via-orange-700 to-yellow-600',
    seasonNe: 'वर्षा ऋतु (Monsoon)',
    seasonEn: 'Monsoon Season',
  },
  {
    id: 'janai_purnima',
    nameNe: 'जनै पूर्णिमा / रक्षाबन्धन (क्वाँटी खाने दिन)',
    nameEn: 'Janai Purnima / Raksha Bandhan / Kwati Punhi',
    bsMonth: 5, // Bhadra
    bsDay: 3,
    importance: 'major',
    taglineNe: 'पवित्र जनै फेर्ने, हातमा रक्षासूत्र बाँध्ने र टुसा उम्रेको गेडागुडी (क्वाँटी) खाने दिन',
    taglineEn: 'Sacred thread renewal, Raksha Bandhan bracelet ceremony, and nutrient-dense sprouted Kwati soup',
    descriptionNe: 'जनै पूर्णिमाका दिन वैदिक विधि अनुसार पुरोहितबाट मन्त्रोच्चारित डोरो बाँधिन्छ र तागाधारीहरूले पुरानो जनै फेर्छन्। तराईमा दिदीबहिनीले दाजुभाइलाई राखी बाँध्छन्। नेवार समुदायमा गुँपुन्ही र ९ थरी गेडागुडी मिसाइएको पोषिलो क्वाँटी खाने विशेष चलन छ। गोसाइँकुण्ड र पाटनको कुम्भेश्वरमा विशेष मेला लाग्दछ।',
    descriptionEn: 'Celebrated with changing the sacred thread (Janai), tying protective threads (Doro), sister-brother Rakhi in Terai, and feasting on sprouted nine-bean hot soup (Kwati).',
    ritualsNe: ['सप्तऋषि तर्पण र नयाँ जनै फेर्ने', 'हातमा रक्षासूत्र (डोरो) बाँध्ने', 'दाजुभाइलाई राखी बाँध्ने', 'गोसाइँकुण्ड र कुम्भेश्वर मेला', 'क्वाँटी पकाउने र खाने'],
    ritualsEn: ['Sacred thread transformation and Rishitarpan', 'Tying holy Raksha thread on wrists', 'Raksha Bandhan with siblings', 'Holy pilgrimage to Gosaikunda', 'Savoring hot spiced Kwati soup'],
    recipeOrHighlightNe: 'तातो नौ प्रकारका गेडागुडीको क्वाँटी, घिउ र भात',
    recipeOrHighlightEn: 'Rich 9-bean sprouted Kwati soup with clarified butter and steaming rice',
    imageTheme: 'from-amber-700 via-orange-800 to-rose-700',
    seasonNe: 'वर्षा ऋतु (Monsoon)',
    seasonEn: 'Monsoon Season',
  },
  {
    id: 'krishna_janmashtami',
    nameNe: 'श्रीकृष्ण जन्माष्टमी',
    nameEn: 'Shree Krishna Janmashtami',
    bsMonth: 5, // Bhadra
    bsDay: 10,
    importance: 'medium',
    taglineNe: 'भगवान श्रीकृष्णको पावन जन्मोत्सव, मध्यरातको पूजा र पाटन कृष्ण मन्दिरमा मेला',
    taglineEn: 'Celebration of Lord Krishna’s divine birth, midnight vigils, and pilgrimage to Patan Krishna Temple',
    descriptionNe: 'भाद्र कृष्ण अष्टमीका दिन भगवान विष्णुका आठौं अवतार श्रीकृष्णको जन्म भएको विश्वास गरिन्छ। भक्तजनहरू दिनभर उपवास बसी मध्यरातमा कृष्ण जन्मको पूजा गर्छन्। ललितपुरको पाटनस्थित ऐतिहासिक ढुङ्गे कृष्ण मन्दिरमा देश-विदेशका हजारौं भक्तजनको घुइँचो लाग्दछ।',
    descriptionEn: 'Commemorates the auspicious birth of Lord Krishna. Devotees fast, chant the Bhagavad Gita, and visit the iconic 17th-century stone Krishna Temple in Patan Durbar Square.',
    ritualsNe: ['दिनभर व्रत र भजन-कीर्तन', 'पाटन कृष्ण मन्दिर दर्शन', 'मध्यरातमा कृष्ण जन्म पूजा र अभिषेक', 'झूला झुलाउने र मक्खन अर्पण'],
    ritualsEn: ['Daylong devotional fasting and Kirtan', 'Pilgrimage to Patan stone Krishna Temple', 'Midnight birth puja and Abhishekam', 'Offering fresh butter and sweet fruits'],
    recipeOrHighlightNe: 'माखन-मिश्री, पञ्चामृत, फलफूल र सुकामेवा',
    recipeOrHighlightEn: 'Fresh butter with rock sugar (Makhan Mishri), Panchamrit, and sweet fruits',
    imageTheme: 'from-blue-700 via-indigo-800 to-teal-800',
    seasonNe: 'वर्षा ऋतु (Monsoon)',
    seasonEn: 'Monsoon Season',
  },
  {
    id: 'indra_jatra',
    nameNe: 'इन्द्रजात्रा / कुमारी जात्रा (येँयाः)',
    nameEn: 'Indra Jatra & Kumari Jatra (Yenya)',
    bsMonth: 5, // Bhadra
    bsDay: 29,
    importance: 'major',
    taglineNe: 'काठमाडौंको भव्य जात्रा, जीवित देवी श्री कुमारीको रथयात्रा र लाखे-पुलुकिसि नाच',
    taglineEn: 'Kathmandu\'s historic week-long festival featuring the Living Goddess Kumari chariot procession and Lakhey dance',
    descriptionNe: 'इन्द्रजात्रा वर्षा र सहकालका देवता इन्द्रको सम्मानमा काठमाडौं वसन्तपुर दरबार क्षेत्रमा मनाइने ऐतिहासिक जात्रा हो। काष्ठमण्डप अगाडि लिङ्गो (योसिं) ठड्याएपछि सुरु हुने यो जात्रामा जीवित देवी कुमारी, गणेश र भैरवको रथ तानिन्छ। सडकभरि लाखे नाच, पुलुकिसि (हात्ती) र समय्बजि वितरण गरिन्छ।',
    descriptionEn: 'The most colorful and ancient street carnival of Kathmandu. Marked by the raising of the sacred wooden pole at Basantapur, chariot pull of Living Goddess Kumari, and vibrant masked Lakhey dances.',
    ritualsNe: ['वसन्तपुरमा इन्द्रध्वज लिङ्गो ठड्याउने', 'जीवित देवी कुमारीको भव्य रथयात्रा', 'लाखे, महाकाली र पुलुकिसि नाच', 'श्वेत भैरवबाट हाकुऐला (रक्सी) प्रसाद वितरण', 'समय्बजि भोज'],
    ritualsEn: ['Erecting the sacred Indradhoj pole at Basantapur', 'Chariot procession of Living Goddess Kumari', 'Energetic masked Lakhey and elephant dances', 'Holy distribution of liquor from Sweta Bhairab mask', 'Traditional Newari Samay Baji feast'],
    recipeOrHighlightNe: 'परम्परागत नेवारी समय्बजि, च्युरा, छोयला, वः, र ऐला',
    recipeOrHighlightEn: 'Authentic Newari Samay Baji plate with beaten rice, spiced meat Chhoyla, and Wo cakes',
    imageTheme: 'from-red-800 via-rose-900 to-amber-800',
    seasonNe: 'वर्षा ऋतु (Late Monsoon)',
    seasonEn: 'Late Monsoon',
  },
  {
    id: 'udhauli',
    nameNe: 'उधौली पर्व / योमरी पुन्हि (ज्यापू दिवस)',
    nameEn: 'Udhauli Parva & Yomari Punhi',
    bsMonth: 8, // Mangsir
    bsDay: 29,
    importance: 'medium',
    taglineNe: 'नयाँ अन्नबाली भित्र्याएको खुसी, किरात समुदायको साकेला र नेवारहरूको योमरी उत्सव',
    taglineEn: 'Harvest thanksgiving festival featuring Kirat Sakela dance and Newari sweet steamed Yomari',
    descriptionNe: 'मंसिर पूर्णिमाका दिन किरात समुदायले प्रकृतिको पूजा गर्दै जाडो छल्न तल (उधौली) झर्ने अवसरमा साकेला शिली नाच्छन्। नेवार समुदायमा नयाँ धानको चामलको पिठोबाट मीठो चाकु र खुवा भरेर बाफमा पकाइने स्वादिष्ट ‘योमरी’ बनाएर योमरी पुन्हि मनाइन्छ।',
    descriptionEn: 'Celebrated on the full moon day of Mangsir. Kirat communities perform joyful Sakela dance thanking Mother Earth, while Newar families steam sweet rice dumplings (Yomari) filled with molasses and sesame.',
    ritualsNe: ['किरात साकेला शिली सामूहिक नृत्य', 'अन्नदाता प्रकृतिको कुल पूजा', 'योमरी पकाउने र धनकी देवी लक्ष्मीलाई चढाउने', 'ज्यापू दिवस सांस्कृतिक झाँकी'],
    ritualsEn: ['Kirat community Sakela dance in traditional attire', 'Harvest worship and nature thanksgiving', 'Steaming sweet Yomari dumplings', 'Jyapu Day cultural parade in Kathmandu Valley'],
    recipeOrHighlightNe: 'तातो चाकु र तिल भरिएको बाफिलो योमरी, खुवा योमरी',
    recipeOrHighlightEn: 'Steaming hot sweet Yomari dumplings stuffed with molasses, sesame, and khoya',
    imageTheme: 'from-amber-600 via-orange-700 to-red-800',
    seasonNe: 'हेमन्त ऋतु (Winter)',
    seasonEn: 'Winter Season',
  },
  {
    id: 'tamu_lhosar',
    nameNe: 'तमु ल्होसार (गुरुङ समुदाय)',
    nameEn: 'Tamu Lhosar (Gurung New Year)',
    bsMonth: 9, // Poush
    bsDay: 15,
    importance: 'medium',
    taglineNe: 'गुरुङ समुदायको नयाँ वर्ष, वर्ग फेरिने दिन र टुँडिखेलमा सांस्कृतिक उत्सव',
    taglineEn: 'Gurung New Year marking the change of zodiac animal year with vibrant cultural attire at Tundikhel',
    descriptionNe: 'तमु ल्होसार गुरुङ समुदायको महान् राष्ट्रिय चाड हो। पुस १५ मा पुरानो वर्ष (ल्हो) बिदा गरी नयाँ वर्षको स्वागत गरिन्छ। यस दिन परम्परागत घाँटु, सोरठी नृत्य प्रस्तुत गरिन्छ र काठमाडौंको टुँडिखेलमा भव्य सांस्कृतिक मेला लाग्दछ।',
    descriptionEn: 'Celebrates the Gurung community’s New Year based on the lunar calendar cycle. Families gather in ancestral attire, enjoy community feasts, and attend celebrations at Tundikhel.',
    ritualsNe: ['नयाँ वर्षको शुभकामना र लामा पूजा', 'गुरुङ परम्परागत भेषभूषा र गरगहना', 'टुँडिखेलमा सांस्कृतिक मेला र झाँकी', 'घटु र सोरठी लोकनृत्य'],
    ritualsEn: ['Monastery blessings and Lama rituals', 'Wearing traditional Gurung Bakkhu and ornaments', 'Grand cultural gathering at Kathmandu Tundikhel', 'Folk Ghatu and Sorathi musical dances'],
    recipeOrHighlightNe: 'सेलरोटी, मासुको परिकार, तरुल, र घरेलु पेय',
    recipeOrHighlightEn: 'Traditional crispy Sel Roti, roasted meat, winter yams, and homemade wine',
    imageTheme: 'from-emerald-700 via-teal-800 to-amber-700',
    seasonNe: 'शिशिर ऋतु (Winter)',
    seasonEn: 'Winter Season',
  },
  {
    id: 'chaite_dashain',
    nameNe: 'चैते दशैं तथा श्रीरामनवमी',
    nameEn: 'Chaite Dashain & Shree Ram Navami',
    bsMonth: 12, // Chaitra
    bsDay: 25,
    importance: 'medium',
    taglineNe: 'वसन्त ऋतुमा मनाइने सानो दशैं र मर्यादा पुरुषोत्तम भगवान रामको जन्मोत्सव',
    taglineEn: 'Spring celebration of Goddess Durga and birthday of Lord Rama with pilgrimages to Janakpurdham',
    descriptionNe: 'चैत्र शुक्ल अष्टमी र नवमीका दिन चैते दशैं र रामनवमी मनाइन्छ। शक्तिपीठहरूमा भगवती दुर्गाको पूजा गरिन्छ र जनकपुरस्थित जानकी मन्दिर तथा काठमाडौंको बत्तीसपुतली राम मन्दिरमा भव्य मेला लाग्दछ।',
    descriptionEn: 'Observed during the spring month of Chaitra honoring Goddess Durga and Lord Rama. Janakpur’s Janaki Temple witnesses thousands of pilgrims chanting devotional prayers.',
    ritualsNe: ['शक्तिपीठहरूमा दुर्गा भवानी पूजा', 'रामनवमीमा जनकपुरधाम जानकी मन्दिर दर्शन', 'रामायण पाठ र भजन कीर्तन', 'पारिवारिक भोज र शुभकामना आदानप्रदान'],
    ritualsEn: ['Goddess Durga rituals at Shaktipeeths', 'Pilgrimage to Janaki Mandir in Janakpur', 'Chanting Ramayana verses', 'Festive family lunches'],
    recipeOrHighlightNe: 'पुरी, हलुवा, खीर, चनेको तरकारी र फलफूल',
    recipeOrHighlightEn: 'Puri, semolina halwa, sweet milk kheer, and spiced chickpeas',
    imageTheme: 'from-amber-600 via-rose-700 to-red-800',
    seasonNe: 'वसन्त ऋतु (Spring)',
    seasonEn: 'Spring Season',
  },
];

/**
 * Format Gregorian date to standard display string
 */
function formatAdDate(d: Date): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/**
 * Format multi-day Gregorian date range
 */
function formatAdDateRange(start: Date, end: Date): string {
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (start.getMonth() === end.getMonth()) {
    return `${shortMonths[start.getMonth()]} ${start.getDate()}-${end.getDate()}, ${start.getFullYear()}`;
  }
  return `${shortMonths[start.getMonth()]} ${start.getDate()} - ${shortMonths[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
}

/**
 * Year-specific date coordinates for major lunar festivals in Bikram Sambat (2080-2084 BS)
 */
export const FESTIVAL_YEAR_DATES: Record<number, Record<string, { bsMonth: number; bsDay: number; bsDayEnd?: number }>> = {
  // 2083 BS (2026-2027 AD)
  2083: {
    ghatasthapana: { bsMonth: 6, bsDay: 25 }, // Ashwin 25 (Oct 11, 2026)
    dashain: { bsMonth: 7, bsDay: 4 },        // Vijaya Dashami: Kartik 4 (Oct 21, 2026)
    tihar: { bsMonth: 7, bsDay: 22, bsDayEnd: 25 }, // Laxmi Puja (Kartik 22) - Bhai Tika (Kartik 25)
    chhath: { bsMonth: 7, bsDay: 29 },       // Kartik 29 (Nov 15, 2026)
    teej: { bsMonth: 5, bsDay: 29 },         // Bhadra 29 (Sep 14, 2026)
    janai_purnima: { bsMonth: 5, bsDay: 12 },// Bhadra 12 (Aug 28, 2026)
    krishna_janmashtami: { bsMonth: 5, bsDay: 19 }, // Bhadra 19 (Sep 4, 2026)
    kushe_aunsi: { bsMonth: 5, bsDay: 25 },  // Bhadra 25 (Sep 10, 2026)
    indra_jatra: { bsMonth: 6, bsDay: 9 },   // Ashwin 9 (Sep 25, 2026)
    matatirtha: { bsMonth: 1, bsDay: 4 },    // Baishakh 4 (Apr 17, 2026)
    buddha_jayanti: { bsMonth: 1, bsDay: 18 }, // Baishakh 18 (May 1, 2026)
    maghe_sankranti: { bsMonth: 10, bsDay: 1 },
    shivaratri: { bsMonth: 11, bsDay: 22 },  // Falgun 22 (Mar 6, 2027)
    holi: { bsMonth: 12, bsDay: 7, bsDayEnd: 8 }, // Chaitra 7-8 (Mar 21-22, 2027)
    tamu_lhosar: { bsMonth: 9, bsDay: 15 },
    sonam_lhosar: { bsMonth: 10, bsDay: 24 },
    gyalpo_lhosar: { bsMonth: 11, bsDay: 24 },
    saraswati_puja: { bsMonth: 10, bsDay: 28 },
    udhauli_yomari: { bsMonth: 9, bsDay: 9 },
  },
  // 2082 BS (2025-2026 AD)
  2082: {
    ghatasthapana: { bsMonth: 6, bsDay: 6 },
    dashain: { bsMonth: 6, bsDay: 16 },
    tihar: { bsMonth: 7, bsDay: 3, bsDayEnd: 6 },
    chhath: { bsMonth: 7, bsDay: 10 },
    teej: { bsMonth: 5, bsDay: 10 },
    janai_purnima: { bsMonth: 4, bsDay: 24 },
    krishna_janmashtami: { bsMonth: 4, bsDay: 31 },
    kushe_aunsi: { bsMonth: 5, bsDay: 7 },
    indra_jatra: { bsMonth: 5, bsDay: 20 },
    matatirtha: { bsMonth: 1, bsDay: 14 },
    buddha_jayanti: { bsMonth: 1, bsDay: 29 },
    maghe_sankranti: { bsMonth: 10, bsDay: 1 },
    shivaratri: { bsMonth: 11, bsDay: 4 },
    holi: { bsMonth: 11, bsDay: 19, bsDayEnd: 20 },
    tamu_lhosar: { bsMonth: 9, bsDay: 15 },
    sonam_lhosar: { bsMonth: 10, bsDay: 6 },
    saraswati_puja: { bsMonth: 10, bsDay: 10 },
    udhauli_yomari: { bsMonth: 8, bsDay: 18 },
  },
  // 2081 BS (2024-2025 AD)
  2081: {
    ghatasthapana: { bsMonth: 6, bsDay: 17 },
    dashain: { bsMonth: 6, bsDay: 27 },
    tihar: { bsMonth: 7, bsDay: 15, bsDayEnd: 18 },
    chhath: { bsMonth: 7, bsDay: 22 },
    teej: { bsMonth: 5, bsDay: 21 },
    janai_purnima: { bsMonth: 5, bsDay: 3 },
    krishna_janmashtami: { bsMonth: 5, bsDay: 10 },
    kushe_aunsi: { bsMonth: 5, bsDay: 17 },
    indra_jatra: { bsMonth: 5, bsDay: 31 },
    matatirtha: { bsMonth: 1, bsDay: 26 },
    buddha_jayanti: { bsMonth: 2, bsDay: 10 },
    maghe_sankranti: { bsMonth: 10, bsDay: 1 },
    shivaratri: { bsMonth: 11, bsDay: 14 },
    holi: { bsMonth: 11, bsDay: 29, bsDayEnd: 30 },
    tamu_lhosar: { bsMonth: 9, bsDay: 15 },
    sonam_lhosar: { bsMonth: 10, bsDay: 16 },
    gyalpo_lhosar: { bsMonth: 11, bsDay: 16 },
    saraswati_puja: { bsMonth: 10, bsDay: 21 },
    udhauli_yomari: { bsMonth: 8, bsDay: 30 },
  },
  // 2084 BS (2027-2028 AD)
  2084: {
    ghatasthapana: { bsMonth: 6, bsDay: 14 },
    dashain: { bsMonth: 6, bsDay: 24 },
    tihar: { bsMonth: 7, bsDay: 13, bsDayEnd: 16 },
    chhath: { bsMonth: 7, bsDay: 20 },
    teej: { bsMonth: 5, bsDay: 18 },
    janai_purnima: { bsMonth: 5, bsDay: 1 },
    krishna_janmashtami: { bsMonth: 5, bsDay: 8 },
    kushe_aunsi: { bsMonth: 5, bsDay: 14 },
    indra_jatra: { bsMonth: 5, bsDay: 29 },
    matatirtha: { bsMonth: 1, bsDay: 23 },
    buddha_jayanti: { bsMonth: 2, bsDay: 6 },
    maghe_sankranti: { bsMonth: 10, bsDay: 1 },
    shivaratri: { bsMonth: 11, bsDay: 12 },
    holi: { bsMonth: 11, bsDay: 27, bsDayEnd: 28 },
    tamu_lhosar: { bsMonth: 9, bsDay: 15 },
    sonam_lhosar: { bsMonth: 10, bsDay: 25 },
    saraswati_puja: { bsMonth: 11, bsDay: 1 },
    udhauli_yomari: { bsMonth: 8, bsDay: 28 },
  },
};

export function getFestivalDates(defId: string, year: number): { bsMonth: number; bsDay: number; bsDayEnd?: number } {
  if (FESTIVAL_YEAR_DATES[year]?.[defId]) {
    return FESTIVAL_YEAR_DATES[year][defId];
  }
  const defaultDef = FESTIVAL_DEFINITIONS.find(d => d.id === defId);
  return {
    bsMonth: defaultDef?.bsMonth || 1,
    bsDay: defaultDef?.bsDay || 1,
    bsDayEnd: defaultDef?.bsDayEnd,
  };
}

/**
 * Dynamically generate live festival information with genuine dates,
 * current live Bikram Sambat year, accurate Gregorian AD year, and exact live countdown.
 */
export function getLiveFestivals(currentBsDate?: NepaliDate): FestivalInfo[] {
  const todayBs = currentBsDate || adToBs(new Date());
  
  // Current live reference date in AD normalized to midnight
  const todayAd = bsToAd(todayBs.year, todayBs.month, todayBs.day);
  todayAd.setHours(0, 0, 0, 0);

  return FESTIVAL_DEFINITIONS.map((def) => {
    const datesThisYear = getFestivalDates(def.id, todayBs.year);
    const festAdThisYear = bsToAd(todayBs.year, datesThisYear.bsMonth, datesThisYear.bsDay);
    festAdThisYear.setHours(0, 0, 0, 0);

    const diffMs = festAdThisYear.getTime() - todayAd.getTime();
    const diffDaysThisYear = Math.round(diffMs / (1000 * 60 * 60 * 24));

    let targetYear = todayBs.year;
    let targetDates = datesThisYear;
    let daysRemaining = diffDaysThisYear;
    let isPassedThisYear = false;
    let effectiveAdDate = festAdThisYear;

    if (diffDaysThisYear < 0) {
      // Festival has already passed in the current BS year.
      // Next celebration will occur in the upcoming BS year (todayBs.year + 1).
      isPassedThisYear = true;
      targetYear = todayBs.year + 1;
      targetDates = getFestivalDates(def.id, targetYear);
      const festAdNextYear = bsToAd(targetYear, targetDates.bsMonth, targetDates.bsDay);
      festAdNextYear.setHours(0, 0, 0, 0);
      daysRemaining = Math.round((festAdNextYear.getTime() - todayAd.getTime()) / (1000 * 60 * 60 * 24));
      effectiveAdDate = festAdNextYear;
    }

    // Build Nepali BS Date string
    const monthNameNe = BS_MONTH_NAMES_NE[targetDates.bsMonth - 1] || '';
    const dayStrNe = targetDates.bsDayEnd 
      ? `${toNepaliDigits(targetDates.bsDay)}-${toNepaliDigits(targetDates.bsDayEnd)}`
      : toNepaliDigits(targetDates.bsDay);
    const bsDate = `${toNepaliDigits(targetYear)} ${monthNameNe} ${dayStrNe} गते`;

    // Build Gregorian AD Date string
    let adDate = '';
    if (targetDates.bsDayEnd) {
      const endAd = bsToAd(targetYear, targetDates.bsMonth, targetDates.bsDayEnd);
      adDate = formatAdDateRange(effectiveAdDate, endAd);
    } else {
      adDate = formatAdDate(effectiveAdDate);
    }

    // Status Badges
    let statusBadgeNe = '';
    let statusBadgeEn = '';
    if (daysRemaining === 0) {
      statusBadgeNe = 'आज परेको छ 🎉';
      statusBadgeEn = 'Celebrating Today 🎉';
    } else if (!isPassedThisYear) {
      statusBadgeNe = `${toNepaliDigits(daysRemaining)} दिन बाँकी`;
      statusBadgeEn = `${daysRemaining} days left`;
    } else {
      statusBadgeNe = `यस वर्ष सम्पन्न • आगामी: ${toNepaliDigits(daysRemaining)} दिन बाँकी`;
      statusBadgeEn = `Celebrated this year • Next: ${daysRemaining} days`;
    }

    return {
      id: def.id,
      nameNe: def.nameNe,
      nameEn: def.nameEn,
      bsDate,
      adDate,
      daysRemaining,
      importance: def.importance,
      taglineNe: def.taglineNe,
      taglineEn: def.taglineEn,
      descriptionNe: def.descriptionNe,
      descriptionEn: def.descriptionEn,
      ritualsNe: def.ritualsNe,
      ritualsEn: def.ritualsEn,
      recipeOrHighlightNe: def.recipeOrHighlightNe,
      recipeOrHighlightEn: def.recipeOrHighlightEn,
      imageTheme: def.imageTheme,
      isPassedThisYear,
      statusBadgeNe,
      statusBadgeEn,
      yearBs: targetYear,
      seasonNe: def.seasonNe,
      seasonEn: def.seasonEn,
    };
  });
}

/**
 * Fallback static instance initialized with current live calendar calculations
 */
export const MAJOR_FESTIVALS: FestivalInfo[] = getLiveFestivals();
