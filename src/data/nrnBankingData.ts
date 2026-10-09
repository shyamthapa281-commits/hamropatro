/**
 * Data definitions for NRN Banking, Remittance Deposits, and Foreign Employment IPO Quota
 */

export interface IpoIssue {
  id: string;
  companyNameNe: string;
  companyNameEn: string;
  symbol: string;
  sectorNe: string;
  sectorEn: string;
  totalShares: string;
  foreignQuotaShares: string; // 10% reserved for Nepalis abroad
  pricePerShare: number; // e.g. 100
  minimumKitta: number; // 10
  maximumKitta: number; // e.g. 1000
  openingDateBs: string;
  closingDateBs: string;
  status: 'open' | 'upcoming' | 'closed';
  issueManagerNe: string;
  issueManagerEn: string;
  ratingNe: string;
  ratingEn: string;
  descriptionNe: string;
  descriptionEn: string;
  meroshareUrl: string;
}

export interface NrnBankDeposit {
  id: string;
  bankNameNe: string;
  bankNameEn: string;
  bankLogoText: string;
  colorScheme: string;
  remittanceSavingsRate: number; // % p.a.
  fixedDeposit1YrRate: number; // % p.a.
  fixedDeposit2to5YrRate: number; // % p.a.
  fcyDepositRateUSD: number; // USD FD rate %
  extraRemittanceBonus: string; // e.g. "+1.00% to 2.00% extra for remittance"
  onlineAccountUrl: string;
  requirementsNe: string[];
  requirementsEn: string[];
  featuresNe: string[];
  featuresEn: string[];
  branchHotline: string;
}

export interface IpoGuideStep {
  stepNumber: number;
  titleNe: string;
  titleEn: string;
  taglineNe: string;
  taglineEn: string;
  iconName: string;
  detailsNe: string[];
  detailsEn: string[];
  proTipNe?: string;
  proTipEn?: string;
}

export const CURRENT_IPO_ISSUES: IpoIssue[] = [
  {
    id: 'ipo-1',
    companyNameNe: 'माथिल्लो मैलुङ खोला जलविद्युत लिमिटेड',
    companyNameEn: 'Upper Mailung Khola Hydropower Ltd.',
    symbol: 'UMKHL',
    sectorNe: 'जलविद्युत (Hydropower)',
    sectorEn: 'Hydropower',
    totalShares: '१५,००,००० कित्ता',
    foreignQuotaShares: '१,५०,००० कित्ता (१०% सुरक्षित कोटा)',
    pricePerShare: 100,
    minimumKitta: 10,
    maximumKitta: 1000,
    openingDateBs: '२०८१ वैशाख १५',
    closingDateBs: '२०८१ वैशाख २९',
    status: 'open',
    issueManagerNe: 'सानिमा क्यापिटल लिमिटेड',
    issueManagerEn: 'Sanima Capital Limited',
    ratingNe: 'CARE-NP BB+ (औसत जोखिम)',
    ratingEn: 'CARE-NP BB+ (Moderate Risk)',
    descriptionNe: 'वैदेशिक रोजगारीमा रहेका नेपालीहरूका लागि १५०,००० कित्ता आरक्षित। रेमिट्यान्स खाता र C-ASBA मार्फत सजिलै आवेदन दिन सकिने।',
    descriptionEn: '150,000 shares reserved exclusively for Nepalis in foreign employment. Apply online via MeroShare using C-ASBA verified remittance account.',
    meroshareUrl: 'https://meroshare.cdsc.com.np',
  },
  {
    id: 'ipo-2',
    companyNameNe: 'रिलायबल नेपाल लाइफ इन्स्योरेन्स लिमिटेड',
    companyNameEn: 'Reliable Nepal Life Insurance Ltd.',
    symbol: 'RNLI',
    sectorNe: 'जीवन बीमा (Life Insurance)',
    sectorEn: 'Life Insurance',
    totalShares: '१,२०,००,००० कित्ता',
    foreignQuotaShares: '१२,००,००० कित्ता (१०% कोटा)',
    pricePerShare: 257, // Including premium
    minimumKitta: 10,
    maximumKitta: 2000,
    openingDateBs: '२०८१ जेठ ०२',
    closingDateBs: '२०८१ जेठ १६',
    status: 'upcoming',
    issueManagerNe: 'ग्लोबल आइएमई क्यापिटल लिमिटेड',
    issueManagerEn: 'Global IME Capital Limited',
    ratingNe: 'ICRA-NP IPO Grade 3',
    ratingEn: 'ICRA-NP IPO Grade 3',
    descriptionNe: 'प्रिमियम मूल्य (रु १५७ प्रिमियम सहित रु २५७ प्रति कित्ता)। उच्च मुनाफा तथा बलियो वित्तीय अवस्था भएको जीवन बीमा कम्पनी।',
    descriptionEn: 'Issued at premium of Rs 157 per share (Total Rs 257). Financially strong life insurance player with stable dividend track record.',
    meroshareUrl: 'https://meroshare.cdsc.com.np',
  },
  {
    id: 'ipo-3',
    companyNameNe: 'सर्वोत्तम सिमेन्ट लिमिटेड',
    companyNameEn: 'Sarbottam Cement Limited',
    symbol: 'SARBTM',
    sectorNe: 'उत्पादन तथा प्रशोधन (Manufacturing)',
    sectorEn: 'Manufacturing & Processing',
    totalShares: '२७,००,००० कित्ता',
    foreignQuotaShares: '२,६७,००० कित्ता (बुक बिल्डिङ कोटा)',
    pricePerShare: 359,
    minimumKitta: 50,
    maximumKitta: 1000,
    openingDateBs: '२०८१ जेठ १०',
    closingDateBs: '२०८१ जेठ २४',
    status: 'upcoming',
    issueManagerNe: 'नबिल इन्भेष्टमेन्ट बैंकिङ',
    issueManagerEn: 'Nabil Investment Banking',
    ratingNe: 'CARE-NP BBB+ (सुरक्षित)',
    ratingEn: 'CARE-NP BBB+ (Investment Grade)',
    descriptionNe: 'नेपालमा पहिलोपटक बुक बिल्डिङ विधिबाट निष्कासन भएको सिमेन्ट उद्योग। वैदेशिक रोजगारी कोटामा आवेदन दिने सबैलाई न्यूनतम ५० कित्ता पर्ने सम्भावना।',
    descriptionEn: 'First book-building issue in Nepal. High allocation rate expected under Foreign Employment quota with minimum 50 kitta threshold.',
    meroshareUrl: 'https://meroshare.cdsc.com.np',
  },
  {
    id: 'ipo-4',
    companyNameNe: 'सोनापुर मिनरल्स एण्ड आयल लिमिटेड',
    companyNameEn: 'Sonapur Minerals and Oil Ltd.',
    symbol: 'SONA',
    sectorNe: 'उत्पादन (Manufacturing)',
    sectorEn: 'Manufacturing',
    totalShares: '१,०७,००,००० कित्ता',
    foreignQuotaShares: '१०,७०,००० कित्ता',
    pricePerShare: 237,
    minimumKitta: 10,
    maximumKitta: 1500,
    openingDateBs: '२०८० चैत १८',
    closingDateBs: '२०८१ बैशाख ०४',
    status: 'closed',
    issueManagerNe: 'एनआईएमबी एस क्यापिटल',
    issueManagerEn: 'NIMB Ace Capital Limited',
    ratingNe: 'INFRA-NP BBB-',
    ratingEn: 'INFRA-NP BBB-',
    descriptionNe: 'निष्कासन सफलतापूर्वक सम्पन्न भई बाँडफाँड भइसकेको। वैदेशिक रोजगार कोटामा आवेदन दिने सम्पूर्ण आवेदकहरूलाई सेयर बाँडफाँड भएको।',
    descriptionEn: 'Issue closed and allotted. Over 98% of foreign employment quota applicants received full requested allotments.',
    meroshareUrl: 'https://meroshare.cdsc.com.np',
  }
];

export const NRN_COMMERCIAL_BANKS: NrnBankDeposit[] = [
  {
    id: 'nabil',
    bankNameNe: 'नबिल बैंक लिमिटेड',
    bankNameEn: 'Nabil Bank Limited',
    bankLogoText: 'NABIL',
    colorScheme: 'from-emerald-700 to-teal-900',
    remittanceSavingsRate: 5.65,
    fixedDeposit1YrRate: 7.60,
    fixedDeposit2to5YrRate: 8.10,
    fcyDepositRateUSD: 5.25,
    extraRemittanceBonus: '+१.००% थप ब्याजदर रेमिट्यान्स खातामा',
    onlineAccountUrl: 'https://www.nabilbank.com/individual/remittance-account',
    requirementsNe: [
      'राहदानी (Passport) र भिसा प्रतिलिपि',
      'वैदेशिक रोजगार श्रम स्वीकृति (Labour Permit) वा NRN कार्ड',
      'नेपाली नागरिकताको प्रमाणपत्र',
      'हालसालै खिचिएको डिजिटल फोटो तथा हस्ताक्षर'
    ],
    requirementsEn: [
      'Valid Passport and Visa Copy',
      'Foreign Labour Permit (Shram) or NRN Card',
      'Nepali Citizenship Certificate',
      'Recent Digital Photo & Signature'
    ],
    featuresNe: [
      'भिडियो KYC मार्फत विदेशबाटै तुरुन्त खाता सक्रिय',
      'MeroShare र Demat खाताको निःशुल्क सुविधा',
      'C-ASBA दर्ता नम्बर (CRN) २४ घण्टामै इमेलमा उपलब्ध',
      'अनलाइन मोबाइल बैंकिङ र अन्तर्राष्ट्रिय रेमिट्यान्स ट्र्याकर'
    ],
    featuresEn: [
      'Video KYC verification from abroad',
      'Integrated Free MeroShare & Demat account',
      'CRN issued within 24 hours via email',
      'High-speed mobile banking with remittance tracker'
    ],
    branchHotline: '+977-1-4227181 / customercare@nabilbank.com',
  },
  {
    id: 'global-ime',
    bankNameNe: 'ग्लोबल आइएमई बैंक लिमिटेड',
    bankNameEn: 'Global IME Bank Limited',
    bankLogoText: 'GLOBAL',
    colorScheme: 'from-blue-700 to-indigo-900',
    remittanceSavingsRate: 5.75,
    fixedDeposit1YrRate: 7.75,
    fixedDeposit2to5YrRate: 8.25,
    fcyDepositRateUSD: 5.50,
    extraRemittanceBonus: '+१.२५% थप ब्याजदर मुद्दती निक्षेपमा',
    onlineAccountUrl: 'https://globalimebank.com/remittance-services',
    requirementsNe: [
      'विदेशको कार्य सम्झौता (Work Contract) वा कम्पनी आईडी',
      'श्रम स्वीकृति (DOFE Shram Swikriti) प्रमाणपत्र',
      'नेपाली नागरिकता र २ प्रति पासपोर्ट साइज फोटो',
      'नेपालमा रहेका हकवाला (Nominee) को परिचयपत्र'
    ],
    requirementsEn: [
      'Foreign Work Contract or Company ID',
      'Labour Permit (DOFE Shram Swikriti) Certificate',
      'Nepali Citizenship and Nominee ID details',
      'Clear digital selfie for e-KYC'
    ],
    featuresNe: [
      'अष्ट्रेलिया, बेलायत, अमेरिका र खाडी मुलुकमा स्थानीय प्रतिनिधि कार्यालय',
      'ग्लोबल आइएमई क्यापिटलबाट सजिलो अनलाइन डिम्याट',
      '१०% वैदेशिक रोजगार कोटामा IPO भर्न तत्काल CRN प्रमाणीकरण',
      'डलर, पाउण्ड, अष्ट्रेलियन डलर र युरो खाता खोल्न सकिने'
    ],
    featuresEn: [
      'Representative desks in Australia, UK, USA & Gulf',
      'Direct Demat linking with Global IME Capital',
      'Instant CRN approval for 10% IPO quota eligibility',
      'Multi-currency deposits (USD, AUD, GBP, EUR, NPR)'
    ],
    branchHotline: '+977-1-5970600 / info@gibl.com.np',
  },
  {
    id: 'nic-asia',
    bankNameNe: 'एनआईसी एशिया बैंक लिमिटेड',
    bankNameEn: 'NIC Asia Bank Limited',
    bankLogoText: 'NIC ASIA',
    colorScheme: 'from-red-700 to-rose-950',
    remittanceSavingsRate: 5.80,
    fixedDeposit1YrRate: 7.80,
    fixedDeposit2to5YrRate: 8.35,
    fcyDepositRateUSD: 5.40,
    extraRemittanceBonus: '+१.५०% सम्म अतिरिक्त प्रिमियम ब्याज',
    onlineAccountUrl: 'https://www.nicasiabank.com/iserve',
    requirementsNe: [
      'राहदानी, विदेशी भिसा तथा श्रम इजाजतपत्र',
      'नेपाली नागरिकता प्रमाणपत्र प्रतिलिपि',
      'नेपाल पठाएको पछिल्लो रेमिट्यान्स भौचर (वैकल्पिक)',
      'इमेल र मोबाइल नम्बर'
    ],
    requirementsEn: [
      'Passport, Valid Visa & Labour Permit',
      'Citizenship Certificate copy',
      'Latest Remittance Slip / Transaction Receipt',
      'Email address and mobile contact'
    ],
    featuresNe: [
      'iServe डिजिटल पोर्टलबाट ५ मिनेटमै अनलाइन खाता आवेदन',
      'वार्षिक निशुल्क डेविट कार्ड र इन्टरनेट बैंकिङ',
      'मुद्दती रसिदमा ९०% सम्म कर्जा सुविधा',
      'एनआईसी एशिया क्यापिटलबाट डिम्याट सेवा'
    ],
    featuresEn: [
      '5-minute paperless application via iServe portal',
      'Free internet & mobile banking activation',
      'Up to 90% loan against Fixed Deposit receipt',
      'Direct Demat integration with NIC Asia Capital'
    ],
    branchHotline: '+977-1-5970101 / feedback@nicasiabank.com',
  },
  {
    id: 'everest',
    bankNameNe: 'एभरेष्ट बैंक लिमिटेड',
    bankNameEn: 'Everest Bank Limited',
    bankLogoText: 'EBL',
    colorScheme: 'from-amber-600 to-stone-900',
    remittanceSavingsRate: 5.50,
    fixedDeposit1YrRate: 7.50,
    fixedDeposit2to5YrRate: 8.00,
    fcyDepositRateUSD: 5.15,
    extraRemittanceBonus: '+१.००% रेमिट्यान्स मुद्दती बोनस',
    onlineAccountUrl: 'https://everestbankltd.com',
    requirementsNe: [
      'पासपोर्ट, विदेशको वर्क भिसा र श्रम स्वीकृति',
      'नागरिकता प्रमाणपत्र र फोटो',
      'इच्छुक हकवालाको विवरण'
    ],
    requirementsEn: [
      'Passport, Work Visa & Shram Swikriti',
      'Citizenship and photo verification',
      'Family Nominee documentation'
    ],
    featuresNe: [
      'पञ्जाब नेशनल बैंक (भारत) सँग प्रत्यक्ष सहकार्य',
      'भारत तथा खाडीमा रहेका नेपालीहरूका लागि विशेष रेमिट्यान्स प्याकेज',
      'विश्वसनीय र लामो इतिहास बोकेको बैंक',
      'सरल C-ASBA र MeroShare सेवा'
    ],
    featuresEn: [
      'Direct tie-up with Punjab National Bank (India)',
      'Tailored remittance corridor for India & Middle East',
      'High safety index and dividend continuity',
      'Hassle-free C-ASBA verification'
    ],
    branchHotline: '+977-1-4443377 / ebl@ebl.com.np',
  },
];

export const IPO_GUIDE_STEPS: IpoGuideStep[] = [
  {
    stepNumber: 1,
    titleNe: 'रेमिट्यान्स बचत खाता खोल्नुहोस् (Remittance Account)',
    titleEn: 'Open a Verified Remittance Savings Account',
    taglineNe: 'वैदेशिक रोजगार कोटाको मुख्य आधार',
    taglineEn: 'The primary foundation for the 10% quota',
    iconName: 'Building2',
    detailsNe: [
      "नेपालको कुनै पनि 'क' वर्गको वाणिज्य बैंकमा अनलाइन भिडियो KYC मार्फत 'रेमिट्यान्स बचत खाता' खोल्नुहोस्।",
      'आवेदन दिंदा आफ्नो राहदानी, भिसा, र श्रम स्वीकृति (Labour Permit/Shram) अनिवार्य रूपमा अपलोड गर्नुहोस्।',
      'खाता खुलिसकेपछि वैधानिक माध्यम (Remittance Channel) बाट कम्तीमा रु ५०,००० वा न्यूनतम तोकिएको रकम नेपाल पठाउनुहोस्।'
    ],
    detailsEn: [
      'Open a "Remittance Savings Account" in any licensed Class-A commercial bank in Nepal via Online Video-KYC.',
      'Upload your passport, valid foreign work visa, and official Labour Permit (Shram) during registration.',
      'Deposit funds through formal remittance banking channels (IME, Remitly, Wise, Prabhu, etc.) to prove foreign earnings.'
    ],
    proTipNe: 'साधारण बचत खाता नभई अनिवार्य रूपमा "रेमिट्यान्स बचत खाता" नै हुनुपर्दछ, अन्यथा C-ASBA मा कोटा छुट पाइने छैन।',
    proTipEn: 'Ensure the account type is categorized strictly as "Remittance Savings" and not a generic savings account.'
  },
  {
    stepNumber: 2,
    titleNe: 'डिम्याट (Demat) र मेरोसेयर (MeroShare) खाता लिनुहोस्',
    titleEn: 'Get Your Demat Account & MeroShare Login',
    taglineNe: 'सेयर सुरक्षित राख्ने डिजिटल खाता',
    taglineEn: 'Your digital vault for holding shares',
    iconName: 'CreditCard',
    detailsNe: [
      'तपाईंको बैंकसँग आबद्ध रहेको क्यापिटल (Merchant Capital) मार्फत अनलाइन डिम्याट खाता खोल्नुहोस्।',
      'डिम्याट खुलिसकेपछि १६ अंकको BOID (Beneficiary Owner ID) प्राप्त हुनेछ।',
      'साथै मेरोसेयर (MeroShare) को प्रयोगकर्ता नाम (Username) र पासवर्ड इमेलमा प्राप्त गर्नुहोस्।'
    ],
    detailsEn: [
      'Apply online for a Demat account through the merchant capital affiliated with your chosen bank.',
      'You will receive a 16-digit BOID (Beneficiary Owner ID) number.',
      'MeroShare online portal credentials (Username & Temporary Password) will be emailed directly to you.'
    ],
    proTipNe: 'डिम्याट र मेरोसेयरको वार्षिक नवीकरण शुल्क रु १५० मात्र हुन्छ। यसलाई eSewa वा Khalti बाट सजिलै तिर्न सकिन्छ।',
    proTipEn: 'Annual renewal is only Rs 150, which can be renewed remotely from anywhere in the world.'
  },
  {
    stepNumber: 3,
    titleNe: 'C-ASBA र CRN नम्बर दर्ता गर्नुहोस् (C-ASBA & CRN)',
    titleEn: 'Register C-ASBA and Obtain CRN Number',
    taglineNe: 'बैंकबाट पैसा रोक्का गरी सेयर भर्ने अनुमति',
    taglineEn: 'Banking authorization for applying in IPOs',
    iconName: 'ShieldCheck',
    detailsNe: [
      'आफ्नो बैंकको अनलाइन पोर्टल वा इमेल मार्फत C-ASBA दर्ता फाराम (CRN Request) पठाउनुहोस्।',
      'बैंकले तपाईंको श्रम स्वीकृति र रेमिट्यान्स प्रमाण रुजु गरी ८ वा ९ अंकको CRN (C-ASBA Registration Number) जारी गर्दछ।',
      'बैंकले सिस्टममा तपाईंको प्रोफाइललाई "वैदेशिक रोजगारी कोटा (Foreign Employment Quota)" मा प्रमाणित (Verify) गरिदिन्छ।'
    ],
    detailsEn: [
      'Request your CRN (C-ASBA Registration Number) through your bank’s online banking portal or email helpdesk.',
      'The bank verifies your Labour Permit validity and tags your CRN as "Foreign Employment Quota Eligible".',
      'This CRN is required every time you submit an IPO application via MeroShare.'
    ],
    proTipNe: 'श्रम स्वीकृतिको म्याद सकिनु भन्दा पहिले नै CRN प्रमाणित गराउनुहोस् ताकि कुनै पनि IPO नछुटोस्।',
    proTipEn: 'Keep your Labour Permit renewed on the DOFE portal to avoid CRN verification lapses.'
  },
  {
    stepNumber: 4,
    titleNe: 'मेरोसेयरमा गएर १०% कोटामा आवेदन दिनुहोस् (Apply on MeroShare)',
    titleEn: 'Apply Under 10% Reserved Quota on MeroShare',
    taglineNe: 'झन्डै १००% सेयर पर्ने उच्च सम्भावना',
    taglineEn: 'Nearly 100% allocation probability',
    iconName: 'Sparkles',
    detailsNe: [
      'मेरोसेयर (meroshare.cdsc.com.np) मा लगइन गर्नुहोस् र "Asba" मेनुमा जानुहोस्।',
      'जारी भइरहेको IPO मा "Apply for Issue" क्लिक गर्नुहोस्।',
      'फारम भर्दा Category मा "Foreign Employment (वैदेशिक रोजगारीमा रहेका नेपाली)" छान्नुहोस् र आफ्नो CRN हालेर Submit गर्नुहोस्।'
    ],
    detailsEn: [
      'Log into MeroShare (meroshare.cdsc.com.np) and navigate to the "Asba" menu.',
      'Click "Apply for Issue" on the open IPO under the Foreign Employment category.',
      'Enter your desired kitta (normally 10 to 50 kitta), input your CRN number, and confirm via 4-digit transaction PIN.'
    ],
    proTipNe: 'साधारण जनतालाई गोलाप्रथाबाट ५% मात्र पर्नेमा वैदेशिक रोजगार कोटामा प्रायः सबै आवेदकलाई न्यूनतम १० देखि ५० कित्तासम्म सेयर पर्दछ!',
    proTipEn: 'While general public IPOs have a ~5% lottery chance, the Foreign Employment quota often guarantees 100% allotment!'
  }
];

export const NRN_FAQS = [
  {
    qNe: 'वैदेशिक रोजगार कोटामा IPO भर्न कति रकम रेमिट्यान्स पठाएको हुनुपर्छ?',
    qEn: 'How much remittance must be sent to qualify for the foreign employment IPO quota?',
    aNe: 'नेपाल धितोपत्र बोर्ड (SEBON) को नियम अनुसार पछिल्लो ६ महिनाभित्र विप्रेषण (Remittance) खातामा वैधानिक माध्यमबाट कम्तीमा रु ५०,००० रकम जम्मा भएको हुनुपर्दछ।',
    aEn: 'According to SEBON guidelines, you must have remitted at least NPR 50,000 into your designated remittance account through official banking channels within the past 6 months.'
  },
  {
    qNe: 'के NRN कार्ड भएका वा स्थायी बासिन्दा (PR/Citizen) ले पनि यो कोटा पाउँछन्?',
    qEn: 'Can permanent residents (PR) or foreign citizens with NRN cards apply under this quota?',
    aNe: '१०% विशेष आरक्षण कोटा नेपाल सरकारको श्रम स्वीकृति (DOFE Shram) लिएर वैदेशिक रोजगारीमा गएका नेपाली नागरिकहरूका लागि हो। विदेशी नागरिकता वा PR भएका NRN हरूले भने साधारण सार्वजनिक निष्कासन (General Quota) तथा विशेष NRN विदेशी मुद्रा खातामार्फत लगानी गर्न सक्दछन्।',
    aEn: 'The 10% quota is specifically for Nepali citizens working abroad on valid Government Labour Permits (Shram). Permanent residents or foreign passport holders can invest through regular IPOs or specialized NRN foreign currency investment channels.'
  },
  {
    qNe: 'मुद्दती निक्षेप (Fixed Deposit) को आर्जित ब्याज विदेश फिर्ता लैजान पाइन्छ (Repatriation)?',
    qEn: 'Can interest earned on NRN foreign currency deposits be repatriated abroad?',
    aNe: 'हो! नेपाल राष्ट्र बैंकको निर्देशिका अनुसार परिवर्त्य विदेशी मुद्रा (USD, AUD, EUR, GBP) मा खोलिएको NRN मुद्दती खाताको साँवा र ब्याज दुवै बिना कुनै झन्झट विदेश फिर्ता लैजान सकिन्छ।',
    aEn: 'Yes! Under Nepal Rastra Bank regulations, both principal and interest earned on foreign currency (FCY) NRN deposits can be fully repatriated abroad in convertible currency.'
  },
  {
    qNe: 'नेपालमा सेयर बिक्री गरेपछि लाग्ने पूँजीगत लाभकर (CGT) कति हो?',
    qEn: 'What is the Capital Gains Tax (CGT) on selling shares in Nepal?',
    aNe: 'नेपालमा १ वर्षभन्दा बढी समय सेयर होल्ड गरेर बिक्री गर्दा ५% र १ वर्षभन्दा कम समय होल्ड गरेर बिक्री गर्दा ७.५% पूँजीगत लाभकर (Capital Gains Tax) लाग्दछ। यो ब्रोकरमार्फत स्वतः कट्टी हुन्छ।',
    aEn: 'Shares held for more than 1 year attract 5% CGT on net profit, while shares held for less than 1 year attract 7.5% CGT. The tax is automatically deducted at settlement by the broker.'
  }
];

export interface QuotaChecklistItem {
  id: string;
  stepNumber: number;
  titleNe: string;
  titleEn: string;
  requirementNe: string;
  requirementEn: string;
  verificationTipNe: string;
  verificationTipEn: string;
  status: 'mandatory' | 'critical' | 'online';
}

export const QUOTA_QUALIFICATION_CHECKLIST: QuotaChecklistItem[] = [
  {
    id: 'shram',
    stepNumber: 1,
    titleNe: 'वैध श्रम स्वीकृति (DOFE Labour Permit)',
    titleEn: 'Valid DOFE Labour Permit',
    requirementNe: 'वैदेशिक रोजगार विभाग (DOFE) बाट जारी भएको कम्तीमा ६ महिना म्याद बाँकी रहेको श्रम स्वीकृति।',
    requirementEn: 'Valid Government Labour Approval issued by Department of Foreign Employment with at least active status.',
    verificationTipNe: 'DOFE को FEIMS पोर्टलमा गएर पासपोर्ट नम्बर हाली आफ्नो श्रम स्वीकृतिको अवस्था जाँच गर्नुहोस्।',
    verificationTipEn: 'Verify your status online at dofe.gov.np FEIMS portal by entering your passport number.',
    status: 'mandatory',
  },
  {
    id: 'remit_account',
    stepNumber: 2,
    titleNe: 'रेमिट्यान्स बचत खाता (Remittance Savings Account)',
    titleEn: 'Dedicated Remittance Savings Account',
    requirementNe: "नेपालको 'क' वर्गको वाणिज्य बैंकमा आफ्नो नाममा खोलिएको विशेष रेमिट्यान्स बचत वा मुद्दती खाता।",
    requirementEn: 'Special remittance savings account opened in an "A" Class commercial bank in Nepal under your name.',
    verificationTipNe: 'बैंकको खाता शीर्षकमा "Remittance" शब्द उल्लेख भएको सुनिश्चित गर्नुहोस्।',
    verificationTipEn: 'Confirm with your bank that the account product type is designated as Remittance Savings.',
    status: 'mandatory',
  },
  {
    id: 'remit_deposit',
    stepNumber: 3,
    titleNe: 'न्यूनतम रु ५०,००० विप्रेषण दाखिला (SEBON Remittance Rule)',
    titleEn: 'Minimum NPR 50,000 Remittance Transfer',
    requirementNe: 'पछिल्लो ६ महिनाभित्र वैधानिक बैंकिङ माध्यमबाट उक्त खातामा कम्तीमा रु ५०,००० रकम दाखिला भएको प्रमाण।',
    requirementEn: 'Proof of at least NPR 50,000 transferred via legal banking / remit channels into the account within past 6 months.',
    verificationTipNe: 'रेमिट कम्पनी (उदा: Prabhu, IME, Western Union, बैंक स्विफ्ट) को ट्रान्सफर स्लिप वा स्टेटमेन्ट सुरक्षित राख्नुहोस्।',
    verificationTipEn: 'Keep digital remit transfer receipts from exchange houses or direct SWIFT/wire transfers.',
    status: 'critical',
  },
  {
    id: 'casba_crn',
    stepNumber: 4,
    titleNe: 'वैदेशिक रोजगार C-ASBA र CRN दर्ता',
    titleEn: 'Foreign Employment Tagged C-ASBA / CRN',
    requirementNe: 'बैंकले C-ASBA प्रणालीमा तपाईंको CRN नम्बरलाई "Foreign Employment Quota" मा प्रमाणित गरिदिएको हुनुपर्छ।',
    requirementEn: 'Your bank must specifically tag your CRN registration as eligible for Foreign Employment Quota in the C-ASBA portal.',
    verificationTipNe: 'बैंकलाई इमेल वा पोर्टलबाट श्रम स्वीकृति र रेमिट भौचर पठाएर कोटा ट्यागिङ पुष्टि गराउनुहोस्।',
    verificationTipEn: 'Email your bank branch or use internet banking to ensure your CRN is tagged as Foreign Employment eligible.',
    status: 'critical',
  },
  {
    id: 'meroshare',
    stepNumber: 5,
    titleNe: 'मेरोसेयर (MeroShare) खाता सक्रियता',
    titleEn: 'Active MeroShare Demat Portal',
    requirementNe: 'CDSC को मेरोसेयर (meroshare.cdsc.com.np) मा लगइन गरी Asba मेनुबाट सिधै कोटामा १० देखि ५० कित्ता आवेदन दिनुहोस्।',
    requirementEn: 'Log in to MeroShare (meroshare.cdsc.com.np) and apply directly under the Foreign Employment category.',
    verificationTipNe: 'आवेदन गर्दा Category मा "Foreign Employment" छान्नुहोस् र ४-अंकको पिन हाली कन्फर्म गर्नुहोस्।',
    verificationTipEn: 'Select category "Foreign Employment" during application and confirm with your 4-digit transaction PIN.',
    status: 'online',
  },
];

export interface BankPortalDirect {
  id: string;
  nameNe: string;
  nameEn: string;
  schemeNe: string;
  schemeEn: string;
  fdRate: string;
  fcyCurrencies: string[];
  videoKycTime: string;
  portalUrl: string;
  featuresNe: string[];
  featuresEn: string[];
}

export const NRN_BANK_PORTALS: BankPortalDirect[] = [
  {
    id: 'nabil',
    nameNe: 'नबिल बैंक लिमिटेड',
    nameEn: 'Nabil Bank Ltd.',
    schemeNe: 'नबिल ग्लोबल NRN बचत तथा मुद्दती खाता',
    schemeEn: 'Nabil Global NRN Remittance Account',
    fdRate: '८.५०% - ९.५०%',
    fcyCurrencies: ['USD', 'AUD', 'EUR', 'GBP'],
    videoKycTime: '२४ घण्टाभित्र अनलाइन सक्रिय',
    portalUrl: 'https://nabilbank.com',
    featuresNe: ['१००% अनलाइन खाता र भिडियो KYC', 'अनलाइन CRN र मेरोसेयर सुविधा', 'अतिरिक्त +१.२५% रेमिट ब्याज'],
    featuresEn: ['100% online Video-KYC account', 'Instant digital CRN & MeroShare', '+1.25% extra remittance yield'],
  },
  {
    id: 'global',
    nameNe: 'ग्लोबल आइएमई बैंक लिमिटेड',
    nameEn: 'Global IME Bank Ltd.',
    schemeNe: 'जननी रेमिट्यान्स बचत खाता',
    schemeEn: 'Janani Remittance Account',
    fdRate: '८.७५% - ९.७५%',
    fcyCurrencies: ['USD', 'AUD', 'CAD', 'GBP', 'EUR', 'AED'],
    videoKycTime: '२४ देखि ४८ घण्टा',
    portalUrl: 'https://globalimebank.com',
    featuresNe: ['विश्वभरबाट सजिलो रेमिट सेवा', 'निशुल्क डेबिट कार्ड तथा इन्टरनेट बैंकिङ', 'वैदेशिक रोजगार कोटा C-ASBA द्रुत प्रमाणिकरण'],
    featuresEn: ['Global network for easy remits', 'Free digital banking & debit card', 'Fast-track Foreign Employment CRN tagging'],
  },
  {
    id: 'nic',
    nameNe: 'एनआईसी एशिया बैंक लिमिटेड',
    nameEn: 'NIC Asia Bank Ltd.',
    schemeNe: 'सर्वश्रेष्ठ रेमिट्यान्स बचत तथा मुद्दती',
    schemeEn: 'Sarbashrestha Remittance Account',
    fdRate: '८.६०% - ९.६०%',
    fcyCurrencies: ['USD', 'AUD', 'EUR', 'GBP'],
    videoKycTime: 'तुरुन्त अनलाइन आवेदन',
    portalUrl: 'https://nicasiabank.com',
    featuresNe: ['उच्चतम बिमा सुरक्षण सुविधा', 'मोबाइल बैंकिङबाट सिधै मुद्दती नवीकरण', 'विदेशबाटै निःशुल्क CRN नम्बर'],
    featuresEn: ['High insurance coverage package', 'Mobile banking FD management', 'Free online CRN generation'],
  },
  {
    id: 'sanima',
    nameNe: 'सानिमा बैंक लिमिटेड',
    nameEn: 'Sanima Bank Ltd.',
    schemeNe: 'सानिमा रेमिट्यान्स मुद्दती खाता',
    schemeEn: 'Sanima Remittance Fixed Deposit',
    fdRate: '८.५०% - ९.२५%',
    fcyCurrencies: ['USD', 'AUD', 'EUR'],
    videoKycTime: '२४ घण्टा',
    portalUrl: 'https://sanimabank.com',
    featuresNe: ['सानिमा क्यापिटलमार्फत तुरुन्त डिम्याट', 'पारदर्शी ब्याजदर र सहज फिर्ता (Repatriation)', 'मध्यपूर्व र कोरियामा विशेष सञ्जाल'],
    featuresEn: ['Instant Demat via Sanima Capital', 'Seamless FCY interest repatriation', 'Extensive Middle East & Korea network'],
  },
  {
    id: 'everest',
    nameNe: 'एभरेष्ट बैंक लिमिटेड',
    nameEn: 'Everest Bank Ltd.',
    schemeNe: 'एभरेष्ट रेमिट्यान्स बचत तथा मुद्दती',
    schemeEn: 'Everest Remittance Bachat',
    fdRate: '८.४०% - ९.२०%',
    fcyCurrencies: ['USD', 'INR', 'EUR', 'GBP'],
    videoKycTime: 'अनलाइन भिडियो KYC उपलब्ध',
    portalUrl: 'https://everestbankltd.com',
    featuresNe: ['पञ्जाब नेशनल बैंक (PNB) सँग बलियो साझेदारी', 'भारत र खाडी मुलुकबाट सरल विप्रेषण', 'सुरक्षित सरकारी मुद्दती सरह भरपर्दो'],
    featuresEn: ['Strong tie-up with PNB India', 'Direct remittances from India & Gulf', 'High financial stability & trust'],
  },
  {
    id: 'nimb',
    nameNe: 'नेपाल इन्भेष्टमेण्ट मेगा बैंक',
    nameEn: 'Nepal Investment Mega Bank Ltd.',
    schemeNe: 'प्रवास रेमिट्यान्स खाता',
    schemeEn: 'Prabas Remittance Savings',
    fdRate: '८.५५% - ९.३५%',
    fcyCurrencies: ['USD', 'AUD', 'EUR'],
    videoKycTime: '४८ घण्टा',
    portalUrl: 'https://nimb.com.np',
    featuresNe: ['ठूलो पूँजी आधार भएको बलियो बैंक', 'विदेशी मुद्रा मुद्दतीमा विशेष प्रिमियम', 'मेगा क्यापिटलमार्फत डिम्याट सेवा'],
    featuresEn: ['Solid capital base & safety', 'Special FCY deposit premium', 'Integrated Demat via Mega Capital'],
  },
];

