import { GUIDE_PHOTOS } from '../assets/guideImages';

export interface ArticleSection {
  titleEn: string;
  titleNe: string;
  contentEn: string;
  contentNe: string;
  bulletPointsEn?: string[];
  bulletPointsNe?: string[];
  imageUrl?: string;
  imageCaptionEn?: string;
  imageCaptionNe?: string;
}

export interface EditorialArticle {
  id: string;
  slug: string;
  titleEn: string;
  titleNe: string;
  excerptEn: string;
  excerptNe: string;
  categoryEn: string;
  categoryNe: string;
  author: {
    nameEn: string;
    nameNe: string;
    roleEn: string;
    roleNe: string;
  };
  publishDate: string;
  readTimeMin: number;
  featuredImage: string;
  tagsEn: string[];
  tagsNe: string[];
  sections: ArticleSection[];
  keyTakeawaysEn: string[];
  keyTakeawaysNe: string[];
  faqs: {
    questionEn: string;
    questionNe: string;
    answerEn: string;
    answerNe: string;
  }[];
}

export const EDITORIAL_ARTICLES: EditorialArticle[] = [
  {
    id: 'art-bikram-sambat-history',
    slug: 'guide-to-bikram-sambat-calendar',
    titleEn: 'The Ultimate Guide to Nepali Bikram Sambat (BS): History, Astronomy, and Differences from Gregorian (AD)',
    titleNe: 'नेपाली बिक्रम संवत् (BS) को विस्तृत दिग्दर्शन: इतिहास, खगोलशास्त्र र इस्वी संवत् (AD) सँगको भिन्नता',
    excerptEn: 'Explore the celestial foundations and historical evolution of Bikram Sambat, the official calendar of Nepal, positioned 56.7 years ahead of the Gregorian calendar.',
    excerptNe: 'नेपालको राष्ट्रिय तथा आधिकारिक क्यालेन्डर बिक्रम संवत्‌को खगोलीय आधार, ५६.७ वर्षको अन्तर, र ऐतिहासिक विकासक्रमको विस्तृत जानकारी।',
    categoryEn: 'Calendar & Astronomy',
    categoryNe: 'क्यालेन्डर र खगोल',
    author: {
      nameEn: 'Shyam Thapa & Editorial Board',
      nameNe: 'श्याम थापा तथा सम्पादकीय मण्डल',
      roleEn: 'Editor-in-Chief & Vedic Research',
      roleNe: 'प्रधान सम्पादक एवं वैदिक अनुसन्धान',
    },
    publishDate: '2026-03-15',
    readTimeMin: 7,
    featuredImage: GUIDE_PHOTOS.bikramSambat,
    tagsEn: ['Bikram Sambat', 'Nepali Calendar', 'Solar Calendar', 'Astronomy', 'Nepal History'],
    tagsNe: ['बिक्रम संवत्', 'नेपाली पात्रो', 'सौर गणना', 'खगोलशास्त्र', 'नेपालको इतिहास'],
    sections: [
      {
        titleEn: 'Historical Origin and King Vikramaditya',
        titleNe: 'ऐतिहासिक उत्पत्ति र राजा विक्रमादित्य',
        contentEn: 'The Bikram Sambat (BS) calendar traces its chronological origin to 57 BCE, credited to the historic monarch King Vikramaditya following his victory over the Saka invaders. In Nepal, the calendar has enjoyed unbroken spiritual and administrative relevance for millennia. It was formalized as Nepal\'s official civil calendar during the reign of Prime Minister Chandra Shumsher Rana in 1901 CE (1958 BS), unifying public governance, religious observances, and civic records under an astronomical system meticulously attuned to the seasons of the Himalayas.',
        contentNe: 'बिक्रम संवत् (BS) को प्रारम्भ इस्वी पूर्व ५७ मा राजा विक्रमादित्यको शासनकालबाट भएको मानिन्छ। शकहरूमाथि विजय प्राप्त गरेपछि यो संवत् सुरु गरिएको इतिहास छ। नेपालमा यसको प्रयोग परापूर्व कालदेखि धार्मिक तथा सामाजिक रूपमा हुँदै आएको थियो। वि.सं. १९५८ (सन् १९०१) मा तत्कालीन राणा प्रधानमन्त्री चन्द्र शमशेरले यसलाई नेपालको आधिकारिक सरकारी तथा राष्ट्रिय पात्रोका रूपमा मान्यता दिएका थिए।',
        bulletPointsEn: [
          'Founded in 57 BCE, putting it roughly 56.7 years ahead of the Gregorian AD era.',
          'Adopted officially by the Government of Nepal in 1901 CE / 1958 BS.',
          'Synchronized with the solar sidereal ingress (Sankranti) across the 12 Zodiac signs.',
        ],
        bulletPointsNe: [
          'इस्वी सन्‌भन्दा करिब ५६.७ वर्ष जेठो रहेको प्राचीन सौर-चान्द्र क्यालेन्डर।',
          'वि.सं. १९५८ मा नेपाल सरकारको आधिकारिक राष्ट्रिय क्यालेन्डरका रूपमा स्वीकृत।',
          'सूर्यको १२ राशिको संक्रान्तिसँग आधारित वैज्ञानिक गणना प्रणाली।',
        ],
      },
      {
        titleEn: 'Solar Sidereal Basis: Why Nepali Months Vary Between 29 and 32 Days',
        titleNe: 'सौर गणना: नेपाली महिना किन २९ देखि ३२ दिनसम्मका हुन्छन्?',
        contentEn: 'Unlike the artificial 30- and 31-day lengths standardized in the Roman-derived Gregorian calendar, the Bikram Sambat month lengths are strictly dictated by true planetary astrophysics. A Bikram Sambat month begins precisely when the Sun transitions from one zodiac constellation (Rashi) to the next—an astronomical event termed Sankranti. Because the Earth moves along an elliptical orbit around the Sun, its angular velocity varies according to Kepler\'s laws of planetary motion. During the winter perihelion, the Sun appears to move faster across constellations (resulting in shorter months like Poush and Magh with 29 or 30 days). In the summer aphelion, the Sun moves more slowly (resulting in longer months like Baishakh, Jestha, and Asar with 31 or 32 days).',
        contentNe: 'इस्वी क्यालेन्डरमा महिनाका दिनहरू मानवनिर्मित नियम अनुसार ३० वा ३१ दिनका बनाइएका हुन्छन्। तर बिक्रम संवत्‌मा महिनाको अवधि सूर्यको वास्तविक खगोलीय गतिमा निर्भर हुन्छ। जब सूर्य एक राशिबाट अर्को राशिमा प्रवेश गर्दछ, त्यस क्षणलाई संक्रान्ति भनिन्छ र नयाँ महिना सुरु हुन्छ। पृथ्वीको अण्डाकार कक्षीय गतिको कारण सूर्यको गति ऋतु अनुसार फरक हुन्छ। त्यसैले वैशाख, जेठ, असार जस्ता महिनाहरू ३१ वा ३२ दिनका हुन्छन् भने पुस, माघ महिना २९ वा ३० दिनका हुन पुग्छन्।',
      },
      {
        titleEn: 'Dual Harmony: The Solar Grid and Lunar Tithis',
        titleNe: 'सौर र चान्द्रको समन्वय: गते र तिथिको सम्बन्ध',
        contentEn: 'A unique architectural strength of the Nepali calendar is its seamless synthesis of the solar civil date (Gatey) and the lunar phase (Tithi). Civil activities, tax deadlines, business invoices, and government office schedules run on the Solar Gatey. Simultaneously, cultural festivals, fasting days (Ekadashi, Purnima, Amavasya), and temple pujas adhere to lunar Tithis calculated from the precise angular distance between the Sun and the Moon (each 12-degree arc marking one Tithi). This dual architecture allows modern society to operate with calendar predictability while preserving deep ecological and cosmological roots.',
        contentNe: 'नेपाली पात्रोको प्रमुख विशेषता भनेको सौर दिन (गते) र चान्द्र समय (तिथि) को अचुक समन्वय हो। सरकारी कामकाज, बैंक तथा व्यापारिक कारोबार गतेको आधारमा चल्छ भने हाम्रा चाडपर्व, पूजापाठ, एकादशी, पूर्णिमा र औंसी तिथिका आधारमा मनाइन्छ। चन्द्रमा र सूर्य बीचको १२ डिग्रीको कोणीय अन्तरलाई एक तिथि भनिन्छ। यसले गर्दा आधुनिक जीवन र प्राचीन सांस्कृतिक परम्परा सँगसँगै अघि बढ्न सकेका छन्।',
      },
    ],
    keyTakeawaysEn: [
      'Bikram Sambat is an astronomical solar-sidereal calendar, officially recognized in Nepal since 1958 BS (1901 CE).',
      'It is 56.7 years ahead of the Gregorian calendar; the Nepali New Year commences on 1st Baishakh (mid-April).',
      'Month lengths (29 to 32 days) reflect real Keplerian orbital mechanics of Earth around the Sun.',
      'Harmoniously balances solar civil dates (Gatey) for modern administration with lunar Tithis for festivals.',
    ],
    keyTakeawaysNe: [
      'बिक्रम संवत् वैज्ञानिक खगोलशास्त्रमा आधारित नेपालको राष्ट्रिय तथा आधिकारिक पात्रो हो।',
      'यो इस्वी सन्‌भन्दा ५६.७ वर्ष अगाडि छ र नयाँ वर्ष वैशाख १ गतेबाट सुरु हुन्छ।',
      'महिनाका दिनहरू सूर्यको संक्रान्ति र पृथ्वीको अण्डाकार कक्षीय गतिमा प्रत्यक्ष आधारित हुन्छन्।',
      'प्रशासनिक कामको लागि गते र धार्मिक चाडपर्वका लागि तिथिको अनुपम संगम यसमा पाइन्छ।',
    ],
    faqs: [
      {
        questionEn: 'Why is Bikram Sambat 57 years ahead of the Gregorian Calendar?',
        questionNe: 'बिक्रम संवत् इस्वी सन्‌भन्दा किन ५७ वर्ष अगाडि छ?',
        answerEn: 'Because King Vikramaditya founded the calendar in 57 BCE after his victory, marking the epoch 57 years before the Dionysian epoch designated as Year 1 AD.',
        answerNe: 'राजा विक्रमादित्यले इस्वी पूर्व ५७ मा आफ्नो विजयको स्मरणमा यो संवत् स्थापना गरेका हुनाले यो इस्वी सन्‌भन्दा करिब ५६.७ वर्ष जेठो छ।',
      },
      {
        questionEn: 'How are Nepali festival dates determined?',
        questionNe: 'नेपाली चाडपर्वका मिति कसरी निर्धारण हुन्छन्?',
        answerEn: 'Most traditional festivals (Dashain, Tihar, Shivaratri, Buddha Jayanti) are fixed according to lunar Tithis and planetary alignments recorded in the Panchanga, while national holidays like New Year and Constitution Day follow the solar Gatey.',
        answerNe: 'दशैं, तिहार, शिवरात्रि जस्ता अधिकांश धार्मिक चाडपर्वहरू पञ्चाङ्गको चन्द्र तिथिका आधारमा तय हुन्छन् भने नयाँ वर्ष र राष्ट्रिय दिवसहरू सौर गते अनुसार मनाइन्छन्।',
      },
    ],
  },
  {
    id: 'art-understanding-panchanga',
    slug: 'demystifying-panchanga-five-pillars',
    titleEn: 'Demystifying Vedic Panchanga: The Five Cosmic Limbs of Ancient Timekeeping',
    titleNe: 'वैदिक पञ्चाङ्गका पाँच अङ्ग: तिथि, वार, नक्षत्र, योग र करणको रहस्य',
    excerptEn: 'Learn how the five fundamental astronomical limbs of Vedic Panchanga govern celestial harmony, seasonal health, and daily auspicious rhythms.',
    excerptNe: 'वैदिक पञ्चाङ्गका पाँच आधारभूत खगोलीय अङ्गहरूले कसरी समय, स्वास्थ्य र दैनिक शुभ साइतको निर्धारण गर्छन् भन्ने शास्त्रीय विवेचना।',
    categoryEn: 'Vedic Astronomy',
    categoryNe: 'वैदिक खगोल',
    author: {
      nameEn: 'Vedic Studies Division',
      nameNe: 'वैदिक अध्ययन तथा अनुसन्धान',
      roleEn: 'Astronomical Research',
      roleNe: 'खगोलीय अनुसन्धान मण्डल',
    },
    publishDate: '2026-03-20',
    readTimeMin: 8,
    featuredImage: GUIDE_PHOTOS.vedicPanchanga,
    tagsEn: ['Panchanga', 'Tithi', 'Nakshatra', 'Yoga', 'Karana', 'Muhurat'],
    tagsNe: ['पञ्चाङ्ग', 'तिथि', 'नक्षत्र', 'योग', 'करण', 'मुहूर्त'],
    sections: [
      {
        titleEn: 'The Five Limbs (Pancha-Anga) Explained',
        titleNe: 'पञ्चाङ्गका पाँच अङ्गको परिचय',
        imageUrl: GUIDE_PHOTOS.vedicPanchanga,
        imageCaptionEn: 'Ancient Vedic Astronomical Manuscript with Sanskrit calculations, Brass Astrolabe, and sacred ritual offerings',
        imageCaptionNe: 'प्राचीन वैदिक पञ्चाङ्ग पाण्डुलिपि, खगोलीय यन्त्र र शास्त्रीय गणना पद्धति',
        contentEn: 'The word Panchanga originates from the Sanskrit roots "Pancha" (five) and "Anga" (limbs). It represents a multi-dimensional astronomical matrix developed by ancient Vedic astronomers including Aryabhata, Varahamihira, and Bhaskara. The five limbs analyze different mathematical facets of the relationship between Earth, the Sun, and the Moon.',
        contentNe: 'पञ्चाङ्ग संस्कृत शब्द "पञ्च" (पाँच) र "अङ्ग" (अवयव) मिलेर बनेको हो। यसले सूर्य र चन्द्रमाको पृथ्वीसँगको पारस्परिक गतिको वैज्ञानिक हिसाब निकाल्दछ। आर्यभट्ट र वराहमिहिर जस्ता प्राचीन वैज्ञानिकहरूले विकास गरेको यो पद्धतिले समयलाई पाँच खगोलीय कोणबाट मापन गर्दछ।',
        bulletPointsEn: [
          '1. Tithi (Lunar Phase): Angular separation of Moon from Sun in multiples of 12 degrees.',
          '2. Vaar (Solar Day): The seven weekdays governed by planetary rulers (Sun to Saturn).',
          '3. Nakshatra (Lunar Mansion): The 27 stellar constellations along the ecliptic path.',
          '4. Yoga (Angular Sum): The combined longitudinal motions of Sun and Moon (total 27 Yogas).',
          '5. Karana (Half-Tithi): Sub-divisions of 6 degrees governing focused actions and transactions.',
        ],
        bulletPointsNe: [
          '१. तिथि: सूर्य र चन्द्रमा बीचको १२-१२ डिग्रीको कोणीय दूरी (प्रतिपदादेखि पूर्णिमा/औंसीसम्म)।',
          '२. वार: सौर्य दिनहरू (आइतबारदेखि शनिबारसम्म), जसको स्वामित्व सात प्रमुख ग्रहहरूमा रहन्छ।',
          '३. नक्षत्र: चन्द्रमाले परिक्रमा गर्ने आकाशको २७ वटा तारापुञ्ज समूह (अश्विनीदेखि रेवतीसम्म)।',
          '४. योग: सूर्य र चन्द्रमाको देशान्तर कोणको योगफलबाट बन्ने २७ वटा योग (विष्कुम्भदेखि वैधृतिसम्म)।',
          '५. करण: एक तिथिको आधा भाग (६ डिग्री) जसले कामको सफलता र प्रवृत्तिको संकेत गर्दछ।',
        ],
      },
      {
        titleEn: 'Calculating Auspicious Timing (Muhurat) and Avoiding Inauspicious Periods',
        titleNe: 'शुभ मुहूर्त र अशुभ समय (राहुकाल, यमघण्ट) को पहिचान',
        contentEn: 'In daily life, the Panchanga guides individuals toward favorable outcomes by mapping natural electromagnetic and gravitational peak intervals. For example, Abhijit Muhurat—a roughly 48-minute window centered around astronomical midday—is universally regarded as auspicious for launching projects or traveling. Conversely, Rahu Kaal—an approximate 90-minute period every day governed by the ascending lunar node—is traditionally avoided for signing contracts or making major asset investments.',
        contentNe: 'दैनिक जीवनमा पञ्चाङ्गले मानिसहरूलाई प्रकृति र ब्रह्माण्डको अनुकूल समय छनोट गर्न मद्दत गर्दछ। उदाहरणका लागि, हरेक दिनको मध्याह्नमा पर्ने अभिजित् मुहूर्तलाई कुनै पनि शुभ कार्य, नयाँ लगानी वा यात्रा सुरु गर्न उत्तम मानिन्छ। यसको विपरीत, दैनिक ९० मिनेटको राहुकालमा महत्त्वपूर्ण सम्झौता वा नयाँ कारोबार नगर्ने सल्लाह दिइन्छ।',
      },
    ],
    keyTakeawaysEn: [
      'Panchanga computes 5 astronomical parameters: Tithi, Vaar, Nakshatra, Yoga, and Karana.',
      'Enables daily precision for auspicious ventures (Muhurat) and biological rhythms.',
      'Abhijit Muhurat provides daily favorable windows, while Rahu Kaal marks periods for contemplation.',
    ],
    keyTakeawaysNe: [
      'पञ्चाङ्गले समयको ५ खगोलीय आयाम (तिथि, वार, नक्षत्र, योग, करण) को सूक्ष्म विश्लेषण गर्दछ।',
      'यसले दैनिक जीवनमा शुभ कार्यको मुहूर्त छनोट गर्न र मानसिक एकाग्रता बढाउन मद्दत गर्दछ।',
      'दैनिक रूपमा अभिजित् मुहूर्त शुभ कार्यका लागि र राहुकाल सावधानीका लागि प्रयोग गरिन्छ।',
    ],
    faqs: [
      {
        questionEn: 'Can Panchanga calculations be verified by modern NASA planetary ephemeris?',
        questionNe: 'के पञ्चाङ्गको गणनालाई आधुनिक नासा (NASA) को खगोल गणनासँग दाँज्न सकिन्छ?',
        answerEn: 'Yes. Modern algorithmic Panchanga calculations utilize the Swiss Ephemeris and JPL DE430/DE440 planetary coordinates, confirming the exact mathematical positions of the Sun and Moon to sub-arcsecond accuracy.',
        answerNe: 'हो, आजको आधुनिक डिजिटल पञ्चाङ्गले नासाको JPL र स्विस एफिमरिसको खगोलीय तथ्याङ्क प्रयोग गर्दछ, जसले गर्दा सूर्य र चन्द्रमाको स्थिति सेकेन्डको सूक्ष्मतासम्म प्रमाणित हुन्छ।',
      },
    ],
  },
  {
    id: 'art-festivals-nepal-culture',
    slug: 'grand-festivals-of-nepal-dashain-tihar',
    titleEn: 'Grand Festivals of Nepal: Dashain, Tihar, Chhath, and Seasonal Celebrations',
    titleNe: 'नेपालका महान् चाडपर्वहरू: बडादशैं, तिहार, छठ तथा सांस्कृतिक उत्सवहरूको महिमा',
    excerptEn: 'A cultural journey into Nepal’s grandest festivals: the ten days of Dashain victory, the festival of lights Tihar, and the sun worship of Chhath.',
    excerptNe: 'नेपाली समाजका महान् पर्वहरू बडादशैं, यमपञ्चक (तिहार), छठ तथा ऋतुकालीन उत्सवहरूको सांस्कृतिक, पारिवारिक र आध्यात्मिक महत्त्व।',
    categoryEn: 'Culture & Festivals',
    categoryNe: 'संस्कृति र चाडपर्व',
    author: {
      nameEn: 'Cultural Heritage Research Team',
      nameNe: 'सांस्कृतिक सम्पदा अनुसन्धान टोली',
      roleEn: 'Cultural Anthropologists',
      roleNe: 'सांस्कृतिक अनुसन्धाता',
    },
    publishDate: '2026-02-10',
    readTimeMin: 9,
    featuredImage: GUIDE_PHOTOS.nepalFestivals,
    tagsEn: ['Dashain', 'Tihar', 'Chhath', 'Nepali Festivals', 'Vijaya Dashami', 'Bhai Tika'],
    tagsNe: ['बडादशैं', 'तिहार', 'छठ', 'नेपाली चाडपर्व', 'विजयादशमी', 'भाइटीका'],
    sections: [
      {
        titleEn: 'Dashain (Bijaya Dashami): The Triumph of Light Over Darkness',
        titleNe: 'बडादशैं (विजयादशमी): सत्यको विजय र पारिवारिक पुनर्मिलन',
        imageUrl: GUIDE_PHOTOS.dashainTika,
        imageCaptionEn: 'Vijaya Dashami: Elder bestowing red Tika and holy golden Jamara with heartfelt blessings',
        imageCaptionNe: 'विजयादशमी: मान्यजनबाट रातो टीका र पहेँलो जमरा लगाई समृद्धिको आशीर्वाद ग्रहण',
        contentEn: 'Dashain is the longest and most revered festival in Nepal, celebrated over 15 days during the bright lunar fortnight of Ashwin. Commencing with Ghatasthapana (planting barley seeds for Jamara), the festival honors Goddess Durga’s divine victory over the demon Mahishasura. Key rituals include Fulpati, Maha Ashtami (Kalaratri), and Maha Navami, culminating on Vijaya Dashami when elders bestow red Tika (rice, yogurt, and vermilion) and sacred yellow Jamara upon younger family members, blessing them with prosperity, longevity, and moral rectitude.',
        contentNe: 'बडादशैं नेपालीहरूको सबैभन्दा ठूलो र लामो चाड हो, जुन आश्विन शुक्ल प्रतिपदा (घटस्थापना) देखि कोजाग्रत पूर्णिमासम्म १५ दिन मनाइन्छ। घटस्थापनामा जमरा राखी सुरु हुने यस पर्वमा फूलपाती, महाअष्टमी, महानवमी र विजयादशमी मुख्य दिन हुन्। मान्यजनको हातबाट रातो टीका र पहेँलो जमरा लगाई सुख, शान्ति र समृद्धिको आशीर्वाद ग्रहण गर्ने यो पर्व पारिवारिक पुनर्मिलनको अनुपम प्रतीक हो।',
      },
      {
        titleEn: 'Tihar (Deepawali & Yamapanchak): Honoring Co-existence and Sibling Bonds',
        titleNe: 'तिहार (यमपञ्चक): प्रकृति, पशुपक्षी र दाजुभाइ-दिदीबहिनीको पवित्र सम्बन्ध',
        imageUrl: GUIDE_PHOTOS.tiharRangoli,
        imageCaptionEn: 'Tihar Yamapanchak: Illuminated Rangoli artwork with clay Diya lamps in courtyard',
        imageCaptionNe: 'तिहार यमपञ्चक: आँगनमा कोरिएको रङ्गोली, सयपत्री माला र माटोको पालाको झिलिमिली बत्ती',
        contentEn: 'Celebrated in Kartik, the five-day Yamapanchak festival reflects deep ecological harmony. The first three days honor animals integral to existence—Kag Tihar (crows as messengers), Kukur Tihar (dogs as guardians of justice), and Gai Tihar (cows as nurturers). The third evening transforms every household into an illuminated sanctuary for Laxmi Puja, welcoming the Goddess of wealth. The festival concludes with Bhai Tika, where sisters offer seven-colored Tika, Makhamali garlands, and walnut-cracking blessings to safeguard their brothers from Yamaraj (the God of death).',
        contentNe: 'कार्तिक कृष्ण त्रयोदशीदेखि सुरु हुने यमपञ्चक (तिहार) ले मानिस, प्रकृति र जीवजन्तु बीचको सहअस्तित्वलाई उजागर गर्दछ। काग तिहार, कुकुर तिहार, गाई तिहार हुँदै लक्ष्मीपूजाको साँझ दीप प्रज्वलन गरी धनधान्यकी देवीको आराधना गरिन्छ। गोवर्धन पूजापछि आउने भाइटीकामा दिदीबहिनीले दाजुभाइलाई सप्तरङ्गी टीका र मखमली माला लगाएर दीर्घायुको कामना गर्दछन्।',
      },
      {
        titleEn: 'Chhath Parva: Pure Devotion to the Solar Energy Source',
        titleNe: 'छठ पर्व: प्रत्यक्ष देवता सूर्य र षष्ठी देवीको उपासना',
        imageUrl: GUIDE_PHOTOS.chhathPuja,
        imageCaptionEn: 'Chhath Parva: Devotees offering holy Arghya with bamboo soop and prasad in river waters',
        imageCaptionNe: 'छठ पर्व: पवित्र नदीमा उदाउँदो सूर्यलाई बाँसको ढाकी र सुपुलीबाट अर्घ्य अर्पण',
        contentEn: 'Celebrated with rigorous fasting, cleanliness, and non-violence across the Terai and now celebrated nationwide, Chhath is dedicated to Lord Surya (the Sun) and Chhathi Maiya. Devotees stand in rivers and ponds to offer Arghya to the setting sun (Sanjhiya Arghya) and rising sun (Bhorwa Arghya), acknowledging the celestial provider of light, agriculture, and life vitality.',
        contentNe: 'तराई-मधेशबाट सुरु भएर अहिले विश्वभरका नेपालीले श्रद्धापूर्वक मनाउने छठ पर्व प्रत्यक्ष देखिने देवता सूर्यको उपासना हो। नहाय-खाय र खरनापछि अस्ताउँदो र उदाउँदो सूर्यलाई नदी र पोखरीको पवित्र जलमा उभिएर ठेकुवा, भुसुवा र फलफूलको अर्घ्य दिइन्छ। यसले समाजमा समानता, स्वच्छता र प्रकृतिप्रति कृतज्ञताको सन्देश दिन्छ।',
      },
    ],
    keyTakeawaysEn: [
      'Nepali festivals blend spiritual philosophy, agricultural harvest cycles, and family reunification.',
      'Dashain reinforces ethical victory and intergenerational respect with Tika and Jamara.',
      'Tihar pays tribute to nature, domestic animals, sister-brother loyalty, and prosperity.',
      'Chhath honors the Sun God as the direct life-sustaining astronomical force.',
    ],
    keyTakeawaysNe: [
      'नेपाली चाडपर्वहरूले आध्यात्मिक चेतना, कृषि चक्र र पारिवारिक एकतालाई जोड्दछन्।',
      'दशैंले सत्यको विजय र जेष्ठ नागरिकप्रतिको आदरभाव सिकाउँछ।',
      'तिहारले पशुपक्षी, प्रकृति, धन र दाजुभाइ-दिदीबहिनीको अटुट सम्बन्धलाई सम्मान गर्दछ।',
      'छठ पर्वले सौर्य ऊर्जा र वातावरणीय शुद्धताको महत्वलाई उजागर गर्दछ।',
    ],
    faqs: [
      {
        questionEn: 'What is the significance of Jamara in Dashain?',
        questionNe: 'दशैंमा जमराको महत्व के हो?',
        answerEn: 'Jamara consists of sacred tender sprouts grown in pristine dark conditions from barley and maize seeds over nine days. Rich in chlorophyl and vital minerals, it symbolizes agricultural regeneration, divine purity, and vitality.',
        answerNe: 'घटस्थापनाका दिन बालुवा वा माटोमा छरिएको जौ वा मकैको बिउ ९ दिनसम्म अँध्यारो कोठामा हुर्काएर जमरा बनाइन्छ। यो नयाँ अन्नको उब्जनी, शुद्धता र प्राकृतिक औषधीय शक्तिको प्रतीक मानिन्छ।',
      },
    ],
  },
  {
    id: 'art-vedic-astrology-kundali',
    slug: 'vedic-astrology-janma-kundali-gun-milan',
    titleEn: 'Vedic Astrology & Janma Kundali: Understanding the 12 Houses and 36 Gun Milan',
    titleNe: 'वैदिक ज्योतिष शास्त्र: जन्म कुण्डलीका १२ भाव र ३६ गुण मिलानको रहस्य',
    excerptEn: 'Demystifying how ancient Jyotish interprets planetary positions across twelve houses, and how 36 Gun Milan evaluates marriage compatibility.',
    excerptNe: 'जन्म समयको आधारमा बन्ने १२ भावको कुण्डली, नवग्रहको प्रभाव, र वैवाहिक जीवनका लागि ३६ गुण मिलानको शास्त्रीय आधार।',
    categoryEn: 'Astrology & Kundali',
    categoryNe: 'ज्योतिष र कुण्डली',
    author: {
      nameEn: 'Pt. Shyam Thapa & Astrological Council',
      nameNe: 'पं. श्याम थापा तथा ज्योतिष अनुसन्धान मण्डल',
      roleEn: 'Vedic Astrologer & Mathematician',
      roleNe: 'वैदिक ज्योतिषी तथा गणितज्ञ',
    },
    publishDate: '2026-01-25',
    readTimeMin: 8,
    featuredImage: GUIDE_PHOTOS.vedicAstrology,
    tagsEn: ['Vedic Astrology', 'Kundali', 'Gun Milan', '12 Bhavas', 'Rashifal', 'Horoscope'],
    tagsNe: ['वैदिक ज्योतिष', 'जन्म कुण्डली', 'गुण मिलान', '१२ भाव', 'राशिफल', 'दशा पद्धति'],
    sections: [
      {
        titleEn: 'The Geometry of the Janma Kundali (Birth Chart)',
        titleNe: 'जन्म कुण्डलीको १२ भावको संरचना',
        imageUrl: GUIDE_PHOTOS.vedicAstrology,
        imageCaptionEn: 'Classical 12 Houses Vedic Janma Kundali Chart with Navaratna Gemstones and Sanskrit Texts',
        imageCaptionNe: '१२ भावको जन्म कुण्डली, नवग्रह रत्न तथा प्राचीन पराशर ज्योतिष ग्रन्थ',
        contentEn: 'A Vedic birth chart (Janma Kundali) captures the exact snapshot of the cosmos at the moment of an individual’s birth. The sky is divided into 12 houses (Bhavas), each governing specific facets of life: 1st house (Tanu/Self, health, vitality), 2nd house (Dhana/Wealth, speech), 4th house (Sukha/Home, mother), 7th house (Kalatra/Spouse, partnerships), and 10th house (Karma/Career, public legacy). The Ascendant (Lagna)—the zodiac constellation rising on the eastern horizon at birth—establishes the foundational orientation of the chart.',
        contentNe: 'जन्म कुण्डली भनेको व्यक्तिको जन्म हुँदा आकाशमा रहेका ग्रह र नक्षत्रहरूको वास्तविक नक्शा हो। यसमा १२ वटा कोठा (भाव) हुन्छन्: पहिलो भावले शरीर र स्वभाव, दोस्रोले धन र बोली, चौथोले सुख र माता, सातौंले जीवनसाथी, र दशौंले कर्म तथा पेशालाई जनाउँछ। जन्म समयमा पूर्व क्षितिजमा उदाउँदै गरेको राशिलाई लग्न भनिन्छ, जसले जीवनको दिशा निर्धारण गर्दछ।',
      },
      {
        titleEn: 'The 36 Gun Milan (Ashtakoot) Marriage Compatibility System',
        titleNe: '३६ गुण मिलान (अष्टकूट) को वैज्ञानिक विश्लेषण',
        contentEn: 'The Ashtakoot system assesses psychological, emotional, and biological resonance between two individuals across 8 key parameters totaling 36 points (Gunas):',
        contentNe: 'विवाहका लागि केटा र केटीको कुण्डली मिलान गर्दा चन्द्र नक्षत्रको आधारमा ८ वटा कुट (अष्टकूट) मार्फत कुल ३६ गुणको गणना गरिन्छ:',
        bulletPointsEn: [
          'Varna (1 point): Spiritual alignment and intellectual temperament.',
          'Vashya (2 points): Mutual dominance and attraction.',
          'Tara (3 points): Destiny resonance, health, and mutual longevity.',
          'Yoni (4 points): Physical harmony and intimacy compatibility.',
          'Graha Maitri (5 points): Mental affinity and mutual communication between Moon signs.',
          'Gana (6 points): Psychological temperament (Deva, Manushya, Rakshasa).',
          'Bhakoot (7 points): Emotional growth, family harmony, and financial prosperity.',
          'Nadi (8 points): Genetic health, physiological compatibility, and healthy progeny.',
        ],
        bulletPointsNe: [
          'वर्ण (१ गुण): आध्यात्मिक र बौद्धिक दृष्टिकोणको मेल।',
          'वश्य (२ गुण): पारस्परिक आकर्षण र प्रभाव।',
          'तारा (३ गुण): भाग्य, स्वास्थ्य र आयुको अनुकूलता।',
          'योनि (४ गुण): शारीरिक र मनोवैज्ञानिक सामञ्जस्य।',
          'ग्रह मैत्री (५ गुण): मानसिक मित्रता र चन्द्र राशिको तालमेल।',
          'गण (६ गुण): स्वभाव र जीवनशैली (देव, मनुष्य, राक्षस)।',
          'भकूट (७ गुण): भावनात्मक सम्बन्ध, सन्तान र आर्थिक प्रगति।',
          'नाडी (८ गुण): जैविक स्वास्थ्य, वंशाणुगत गुण र सन्ततिको सुरक्षा।',
        ],
      },
    ],
    keyTakeawaysEn: [
      'The 12 Bhavas represent universal human domains from physical embodiment to spiritual liberation.',
      '36 Gun Milan evaluates 8 holistic psychological and biological parameters (Ashtakoot).',
      'A score of 18 or above out of 36 is traditionally deemed favorable for long-term marital harmony.',
    ],
    keyTakeawaysNe: [
      'कुण्डलीका १२ भावले मानव जीवनका सम्पूर्ण भौतिक तथा आध्यात्मिक पक्षलाई दर्शाउँछन्।',
      'अष्टकूट पद्धतिले मानसिक, भावनात्मक र शारीरिक पक्षलाई ८ वर्गमा ३६ अंक दिएर जाँच्दछ।',
      '३६ मध्ये १८ वा सोभन्दा बढी गुण आएमा दाम्पत्य जीवनका लागि शुभ मानिन्छ।',
    ],
    faqs: [
      {
        questionEn: 'What happens if Nadi Dosha is present in Gun Milan?',
        questionNe: 'गुण मिलानमा नाडी दोष देखिएमा के हुन्छ?',
        answerEn: 'When both individuals share the identical Nadi (Adi, Madhya, or Antya), traditional texts highlight potential genetic vulnerabilities. However, exceptions (Nadi Dosha Nivaran) exist if the bride and groom possess different constellations or different Moon signs.',
        answerNe: 'दुवैको एउटै नाडी (आदि, मध्य, वा अन्त्य) भएमा नाडी दोष मानिन्छ। तर नक्षत्रका पाउ वा राशि स्वामी फरक भएमा नाडी दोष स्वतः निष्प्रभावी हुने शास्त्रीय नियम छ।',
      },
    ],
  },
  {
    id: 'art-ayurvedic-ritucharya',
    slug: 'ayurvedic-ritucharya-seasonal-health-living',
    titleEn: 'Ayurvedic Ritucharya: Ancient Wisdom for Seasonal Health and Immunity',
    titleNe: 'आयुर्वेदिक ऋतुचर्या: ६ ऋतु अनुसार खानपान, योग र स्वस्थ जीवनशैली',
    excerptEn: 'Discover the ancient Ayurvedic science of aligning diet, daily routines, and yoga with nature’s six seasonal transitions to sustain robust immunity.',
    excerptNe: 'नेपाल र हिमालय क्षेत्रका ६ ऋतु अनुसार शरीरका त्रिदोष (वात, पित्त, कफ) लाई सन्तुलनमा राख्ने वैज्ञानिक दिनचर्या र आहार विहार।',
    categoryEn: 'Health & Ayurveda',
    categoryNe: 'स्वास्थ्य र आयुर्वेद',
    author: {
      nameEn: 'Ayurvedic Wellness Collective',
      nameNe: 'आयुर्वेदिक स्वास्थ्य मण्डल',
      roleEn: 'Holistic Health Practitioners',
      roleNe: 'आयुर्वेद तथा योग अनुसन्धान',
    },
    publishDate: '2026-01-15',
    readTimeMin: 7,
    featuredImage: GUIDE_PHOTOS.ayurvedaRitucharya,
    tagsEn: ['Ayurveda', 'Ritucharya', 'Doshas', 'Seasonal Health', 'Yoga', 'Dinacharya'],
    tagsNe: ['आयुर्वेद', 'ऋतुचर्या', 'त्रिदोष', 'दिनचर्या', 'योग', 'मौसमी स्वास्थ्य'],
    sections: [
      {
        titleEn: 'The Six Ritus (Seasons) of the Vedic Calendar',
        titleNe: 'वैदिक क्यालेन्डरका ६ ऋतुहरू',
        imageUrl: GUIDE_PHOTOS.ayurvedaRitucharya,
        imageCaptionEn: 'Authentic Himalayan Ayurvedic Herbs, Brass Mortar & Pestle, Pure Honey, and Fresh Tulsi',
        imageCaptionNe: 'हिमाली आयुर्वेदिक जडीबुटी, तामाको पात्र, शुद्ध मह र पवित्र तुलसी',
        contentEn: 'Ayurveda divides the annual cycle into two solar solstitial movements (Adana Kaala / Northern movement and Visarga Kaala / Southern movement), which encompass six distinct seasons (Ritus): Shishira (Late Winter), Vasanta (Spring), Grishma (Summer), Varsha (Monsoon), Sharad (Autumn), and Hemanta (Early Winter). Each season stimulates or aggravates specific biological energies (Vata, Pitta, Kapha) within human physiology.',
        contentNe: 'आयुर्वेदमा वर्षलाई दुई अयन (उत्तरायण र दक्षिणायन) र ६ वटा ऋतुमा विभाजन गरिएको छ: शिशिर (माघ-फागुन), वसन्त (चैत-वैशाख), ग्रीष्म (जेठ-असार), वर्षा (साउन-भदौ), शरद (असोज-कात्तिक), र हेमन्त (मंसिर-पुस)। ऋतु परिवर्तनसँगै हाम्रो शरीरमा वात, पित्त र कफको अवस्था बदलिन्छ।',
      },
      {
        titleEn: 'Daily Guidelines for Optimal Health (Dinacharya)',
        titleNe: 'स्वस्थ जीवनका लागि दैनिक दिनचर्या',
        contentEn: 'Adopting consistent circadian habits enhances cellular repair and immune vigor. Awakening during Brahma Muhurat (roughly 90 minutes before sunrise), drinking warm copper-infused water (Ushapan), practicing gentle Jala Neti, performing 10-15 minutes of Pranayama (Anulom Vilom & Kapalabhati), and honoring the seasonal Ritucharya protects the digestive fire (Agni) from sluggishness and disease.',
        contentNe: 'ब्रह्म मुहूर्तमा उठ्ने, बिहान मनतातो पानी पिउने, १०-१५ मिनेट प्राणायाम र सूर्य नमस्कार गर्ने, र मौसमी ताजा फलफूल तथा तरकारी खाने बानीले शरीरको पाचन अग्नि (अग्नि) बलियो बनाउँछ र रोग प्रतिरोधात्मक क्षमता उच्च राख्दछ।',
      },
    ],
    keyTakeawaysEn: [
      'Ritucharya harmonizes human biology with the Earth’s natural seasonal shifts.',
      'Balancing Vata, Pitta, and Kapha through diet prevents seasonal sickness.',
      'Brahma Muhurat rising and mindful nutrition form the core pillars of Ayurvedic longevity.',
    ],
    keyTakeawaysNe: [
      'ऋतुचर्याले मानव शरीरलाई प्रकृतिको मौसमी चक्रसँग एकाकार बनाउँछ।',
      'ऋतु अनुसारको खानपानले वात, पित्त र कफलाई सन्तुलित राखी रोग लाग्न दिँदैन।',
      'बिहानीको समयमा उठ्नु र ताजा पोषणयुक्त आहार लिनु नै दीर्घायुको रहस्य हो।',
    ],
    faqs: [
      {
        questionEn: 'What is the best diet for the Vasanta (Spring) season?',
        questionNe: 'वसन्त ऋतुमा कस्तो खानपान उत्तम हुन्छ?',
        answerEn: 'During spring, accumulated winter Kapha liquefies, making digestion sluggish. Light, dry, warm foods with bitter and pungent spices (ginger, black pepper, turmeric, honey, and barley) are ideal, while heavy oily sweets should be minimized.',
        answerNe: 'वसन्त ऋतुमा शरीरमा कफ जम्ने हुँदा हल्का, सुक्खा र तातो खाना खानुपर्छ। अदुवा, मरिच, बेसार, मह, र जौको प्रयोग लाभदायक हुन्छ भने धेरै चिल्लो र गुलियो कम गर्नुपर्छ।',
      },
    ],
  },
  {
    id: 'art-shubha-sait-muhurat',
    slug: 'finding-auspicious-muhurat-shubha-sait',
    titleEn: 'Finding the Right Muhurat (Shubha Sait): Auspicious Timing for Life’s Milestones',
    titleNe: 'शुभ साइत र मुहूर्त: विवाह, गृहप्रवेश, पास्नी तथा ब्रतबन्धका लागि उत्तम समय',
    excerptEn: 'Learn how classical Jyotish calculates favorable planetary windows (Muhurat) for weddings, housewarmings, child naming, and vehicle purchases.',
    excerptNe: 'विवाह, गृहप्रवेश, ब्रतबन्ध, पास्नी, र नयाँ सवारी साधन खरिदका लागि शास्त्रसम्मत शुभ साइत निकाल्ने वैज्ञानिक आधारहरू।',
    categoryEn: 'Rituals & Timing',
    categoryNe: 'संस्कार र साइत',
    author: {
      nameEn: 'Vedic Consultation Team',
      nameNe: 'वैदिक अनुष्ठान तथा परामर्श मण्डल',
      roleEn: 'Ritual Specialists',
      roleNe: 'अनुष्ठान विशेषज्ञ',
    },
    publishDate: '2026-01-05',
    readTimeMin: 6,
    featuredImage: GUIDE_PHOTOS.shubhaMuhurat,
    tagsEn: ['Muhurat', 'Shubha Sait', 'Bibaha Sait', 'Griha Pravesh', 'Pasni', 'Panchanga'],
    tagsNe: ['मुहूर्त', 'शुभ साइत', 'विवाह साइत', 'गृहप्रवेश', 'पास्नी', 'ब्रतबन्ध'],
    sections: [
      {
        titleEn: 'The Philosophy Behind Auspicious Timing (Muhurat)',
        titleNe: 'शुभ साइतको महत्व र दर्शन',
        imageUrl: GUIDE_PHOTOS.shubhaMuhurat,
        imageCaptionEn: 'Sacred Vedic Vivaha & Griha Pravesh ceremony with Havan Kund, Mango Kalash, and Priest Recitation',
        imageCaptionNe: 'शुभ साइत तथा संस्कारका लागि वैदिक मण्डप, अग्नि कुण्ड, कलश र पूजा सामग्री',
        contentEn: 'A Muhurat is a designated interval of time (traditionally 48 minutes) where planetary rays, lunar mansions, and universal energetic forces align favorably for a specific human intention. Just as a sailor hoists sails when winds are favorable, initiating an endeavor at an auspicious Muhurat minimizes friction and unlocks cosmic cooperation.',
        contentNe: 'मुहूर्त भनेको ४८ मिनेटको त्यस्तो समय खण्ड हो जहाँ ग्रह, नक्षत्र र प्रकृतिको सकारात्मक ऊर्जा कुनै विशेष कार्यको लागि सबैभन्दा बढी अनुकूल हुन्छ। अनुकूल हावा चल्दा डुङ्गा छिटो र सुरक्षित गन्तव्यमा पुगे जस्तै शुभ मुहूर्तमा सुरु गरिएको काममा बाधा कम आउँछ।',
      },
      {
        titleEn: 'Core Sanskar Muhurats in Nepali Culture',
        titleNe: 'नेपाली समाजका प्रमुख संस्कार र साइत',
        contentEn: 'Key milestones require tailored Panchanga alignments: Vivaha (Marriage) requires Jupiter and Venus purity (Guru-Shukra Astha avoidance); Griha Pravesh (Housewarming) requires fixed ascendants (Sthira Lagna) like Taurus or Leo; and Pasni (First Rice Feeding) aligns with favorable Moon waxing phases and bright tithis.',
        contentNe: 'नेपाली समाजमा १६ संस्कारमध्ये विवाह, ब्रतबन्ध, पास्नी र गृहप्रवेशमा विशेष साइत हेरिन्छ। विवाहमा बृहस्पति र शुक्रको शुद्धता (अस्त नभएको अवस्था), गृहप्रवेशमा स्थिर लग्न (वृष, सिंह, वृश्चिक, कुम्भ), र पास्नीमा शुक्ल पक्षका शुभ तिथिहरू रोजिन्छन्।',
      },
    ],
    keyTakeawaysEn: [
      'A Muhurat selects optimal planetary alignments to catalyze success and peace.',
      'Different life events require distinct planetary considerations (e.g. Venus for marriage, Mars for property).',
      'Avoiding inauspicious astrological windows like Rahu Kaal and eclipses ensures harmony.',
    ],
    keyTakeawaysNe: [
      'मुहूर्तले कामको प्रकृति अनुसार अनुकूल ग्रह र नक्षत्रको ऊर्जा छनोट गर्दछ।',
      'विवाह, गृहप्रवेश, ब्रतबन्ध र पास्नीका लागि फरक-फरक खगोलीय मापदण्ड हुन्छन्।',
      'राहुकाल, भद्रा, र ग्रहण जस्ता समयलाई पन्छाएर काम थाल्दा सफलता मिल्दछ।',
    ],
    faqs: [
      {
        questionEn: 'Can an auspicious Muhurat cancel out birth chart defects?',
        questionNe: 'के शुभ साइतले कुण्डलीका सामान्य दोषलाई कम गर्न सक्छ?',
        answerEn: 'Classical texts state that an exceptionally pure Abhijit Muhurat or well-selected Lagna strengthens the venture and substantially neutralizes minor planetary transit afflictions.',
        answerNe: 'शास्त्र अनुसार अभिजित् मुहूर्त वा बलियो लग्नमा सुरु गरिएको कार्यले जन्म कुण्डलीका सामान्य गोचर दोषलाई धेरै हदसम्म कम गर्न मद्दत पुर्‍याउँछ।',
      },
    ],
  },
];
