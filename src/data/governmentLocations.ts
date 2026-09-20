export type ServiceCategory = 
  | 'all' 
  | 'police' 
  | 'health' 
  | 'fire' 
  | 'citizen_service' 
  | 'administration' 
  | 'transport' 
  | 'helpline' 
  | 'disaster';

export type ProvinceName = 
  | 'all'
  | 'Bagmati' 
  | 'Gandaki' 
  | 'Koshi' 
  | 'Lumbini' 
  | 'Madhesh' 
  | 'Karnali' 
  | 'Sudurpashchim';

export interface GovernmentHelpCenter {
  id: string;
  nameNe: string;
  nameEn: string;
  category: ServiceCategory;
  province: ProvinceName;
  district: string;
  addressNe: string;
  addressEn: string;
  lat: number;
  lng: number;
  hotline?: string;
  directPhone: string;
  operatingHoursNe: string;
  operatingHoursEn: string;
  is24x7: boolean;
  servicesNe: string[];
  servicesEn: string[];
  descriptionNe: string;
  descriptionEn: string;
  website?: string;
}

export const GOVERNMENT_HELP_CENTERS: GovernmentHelpCenter[] = [
  {
    id: 'singha-durbar',
    nameNe: 'सिंहदरबार (प्रधानमन्त्री तथा मन्त्रिपरिषद्को कार्यालय र हेलो सरकार)',
    nameEn: 'Singha Durbar (Central Secretariat & Hello Sarkar)',
    category: 'administration',
    province: 'Bagmati',
    district: 'काठमाडौँ (Kathmandu)',
    addressNe: 'सिंहदरबार, काठमाडौँ',
    addressEn: 'Singha Durbar, Kathmandu',
    lat: 27.6975,
    lng: 85.3228,
    hotline: '1111',
    directPhone: '01-4200000',
    operatingHoursNe: 'हेलो सरकार: २४ घण्टा (कार्यालय: १०:०० - ५:००)',
    operatingHoursEn: 'Hello Sarkar: 24/7 (Offices: 10:00 - 17:00)',
    is24x7: true,
    servicesNe: [
      'नागरिक गुनासो समाधान (हेलो सरकार ११११)',
      'गृह मन्त्रालय तथा केन्द्रीय विपद् समन्वय',
      'प्रधानमन्त्री तथा मन्त्रिपरिषद् सचिवालय',
      'केन्द्रीय नीति तथा सेवा समन्वय'
    ],
    servicesEn: [
      'Public Grievance Redressal (Hello Sarkar 1111)',
      'Ministry of Home Affairs & National Disaster Coordination',
      'Prime Minister & Council of Ministers Secretariat',
      'National Citizen Services Coordination'
    ],
    descriptionNe: 'नेपाल सरकारको केन्द्रीय प्रशासनिक सचिवालय, जहाँबाट देशभरका नागरिकका गुनासोहरू हेलो सरकार ११११ मार्फत २४ सै घण्टा दर्ता र समाधान गरिन्छ।',
    descriptionEn: 'The central administrative seat of the Government of Nepal, housing the Prime Minister’s Office and 24/7 citizen grievance portal Hello Sarkar 1111.',
    website: 'https://opmcm.gov.np'
  },
  {
    id: 'nepal-police-hq',
    nameNe: 'नेपाल प्रहरी प्रधान कार्यालय (नक्साल)',
    nameEn: 'Nepal Police Headquarters (Naxal)',
    category: 'police',
    province: 'Bagmati',
    district: 'काठमाडौँ (Kathmandu)',
    addressNe: 'नक्साल, काठमाडौँ',
    addressEn: 'Naxal, Kathmandu',
    lat: 27.7176,
    lng: 85.3283,
    hotline: '100',
    directPhone: '01-4412780',
    operatingHoursNe: '२४ घण्टा (२४/७ निरन्तर)',
    operatingHoursEn: '24 Hours (24/7 Non-stop)',
    is24x7: true,
    servicesNe: [
      'आपतकालीन सुरक्षा हटलाइन (१००)',
      'साइबर अपराध ब्युरो (Cyber Bureau)',
      'केन्द्रीय खोजतलास तथा उद्धार कमान्ड',
      'महिला, बालबालिका तथा ज्येष्ठ नागरिक सेवा'
    ],
    servicesEn: [
      'National Police Emergency Hotline (100)',
      'Cyber Crime Bureau',
      'Central Search & Disaster Rescue Command',
      'Women, Children & Senior Citizens Cell'
    ],
    descriptionNe: 'राष्ट्रिय शान्ति सुरक्षा, अपराध नियन्त्रण र आपतकालीन उद्धारको केन्द्रीय कमान्ड मुख्यालय। १०० मा २४ घण्टा निःशुल्क फोन लाग्छ।',
    descriptionEn: 'The central command headquarters of Nepal Police handling national emergency response (100), cyber investigations, and public safety.',
    website: 'https://nepalpolice.gov.np'
  },
  {
    id: 'traffic-police-hq',
    nameNe: 'काठमाडौँ उपत्यका ट्राफिक प्रहरी कार्यालय',
    nameEn: 'Kathmandu Valley Traffic Police Headquarters',
    category: 'police',
    province: 'Bagmati',
    district: 'काठमाडौँ (Kathmandu)',
    addressNe: 'रामशाहपथ / बागबजार, काठमाडौँ',
    addressEn: 'Ramshah Path, Baghbazar, Kathmandu',
    lat: 27.7055,
    lng: 85.3182,
    hotline: '103',
    directPhone: '01-4219641',
    operatingHoursNe: '२४ घण्टा (२४/७ निरन्तर)',
    operatingHoursEn: '24 Hours (24/7 Non-stop)',
    is24x7: true,
    servicesNe: [
      'सडक दुर्घटना तथा आपतकालीन ट्राफिक उद्धार (१०३)',
      'सडक जाम तथा सवारी व्यवस्थापन सूचना',
      'हराएका तथा चोरी भएका सवारी साधन खोजतलास',
      'ट्राफिक कारबाही तथा जरिवाना भुक्तानी जानकारी'
    ],
    servicesEn: [
      'Traffic Emergency & Accident Response (103)',
      'Live Road Traffic & Congestion Info',
      'Lost & Stolen Vehicle Tracking',
      'Traffic Violation Clearance & Verification'
    ],
    descriptionNe: 'उपत्यकाको समग्र सडक सुरक्षा, दुर्घटना उद्धार र ट्राफिक व्यवस्थापनको केन्द्रीय नियन्त्रण कक्ष। १०३ नम्बरमा तत्काल सहायता प्राप्त हुन्छ।',
    descriptionEn: 'Valley traffic emergency coordination hub providing accident response, towing, lost vehicle tracking, and 24/7 road assistance via 103.',
    website: 'https://traffic.nepalpolice.gov.np'
  },
  {
    id: 'passport-dept',
    nameNe: 'राहदानी विभाग (Department of Passport - त्रिपुरेश्वर)',
    nameEn: 'Department of Passport (Tripureshwor)',
    category: 'citizen_service',
    province: 'Bagmati',
    district: 'काठमाडौँ (Kathmandu)',
    addressNe: 'त्रिपुरेश्वर, काठमाडौँ',
    addressEn: 'Tripureshwor, Kathmandu',
    lat: 27.6934,
    lng: 85.3134,
    directPhone: '01-4217122',
    operatingHoursNe: 'आइतबार - शुक्रबार (१०:०० - ५:००)',
    operatingHoursEn: 'Sunday - Friday (10:00 - 17:00)',
    is24x7: false,
    servicesNe: [
      'विद्युतीय राहदानी (e-Passport) आवेदन तथा बायोमेट्रिक',
      'द्रुत सेवा राहदानी वितरण (Urgent 24-48 hr Passport)',
      'हराएको तथा म्याद सकिएको राहदानी नवीकरण',
      'अनलाइन आवेदन प्रमाणीकरण'
    ],
    servicesEn: [
      'e-Passport Application & Biometric Capture',
      'Urgent Express Passport Delivery (24-48 hrs)',
      'Lost / Expired Passport Renewal',
      'Online Application Verification & Helpdesk'
    ],
    descriptionNe: 'नेपाली नागरिकहरूलाई आधुनिक चिप-आधारित विद्युतीय राहदानी (e-Passport) जारी गर्ने मुख्य केन्द्रीय सरकारी कार्यालय।',
    descriptionEn: 'The primary central department responsible for issuing and renewing biometric e-Passports for Nepali citizens worldwide.',
    website: 'https://nepalpassport.gov.np'
  },
  {
    id: 'nid-dept',
    nameNe: 'राष्ट्रिय परिचयपत्र तथा पञ्जीकरण विभाग (DoNIDCR)',
    nameEn: 'Department of National ID & Civil Registration',
    category: 'citizen_service',
    province: 'Bagmati',
    district: 'काठमाडौँ (Kathmandu)',
    addressNe: 'सिंहदरबार, काठमाडौँ',
    addressEn: 'Singha Durbar, Kathmandu',
    lat: 27.6980,
    lng: 85.3245,
    directPhone: '01-4200014',
    operatingHoursNe: 'आइतबार - शुक्रबार (१०:०० - ५:००)',
    operatingHoursEn: 'Sunday - Friday (10:00 - 17:00)',
    is24x7: false,
    servicesNe: [
      'राष्ट्रिय परिचयपत्र (NID Card) बायोमेट्रिक तथा वितरण',
      'जन्म, मृत्यु, विवाह, सम्बन्ध विच्छेद दर्ता व्यवस्थापन',
      'सामाजिक सुरक्षा भत्ता प्रमाणीकरण',
      'नागरिक व्यक्तिगत विवरण डिजिटलाइजेसन'
    ],
    servicesEn: [
      'National Identity Card (NID) Biometrics & Printing',
      'Vital Civil Registration (Birth, Death, Marriage)',
      'Social Security Allowance Data Verification',
      'Citizen Identity Digitization Services'
    ],
    descriptionNe: 'सम्पूर्ण नेपाली नागरिकको आधिकारिक जैविक तथा व्यक्तिगत विवरण समेटी डिजिटल राष्ट्रिय परिचयपत्र (NID) प्रदान गर्ने केन्द्रीय निकाय।',
    descriptionEn: 'Central agency overseeing biometric National ID card issuance, social security linkages, and vital civil event registrations.',
    website: 'https://donidcr.gov.np'
  },
  {
    id: 'dotm-hq',
    nameNe: 'यातायात व्यवस्था विभाग (DoTM मीनभवन)',
    nameEn: 'Department of Transport Management (Minbhawan)',
    category: 'transport',
    province: 'Bagmati',
    district: 'काठमाडौँ (Kathmandu)',
    addressNe: 'मीनभवन, काठमाडौँ',
    addressEn: 'Minbhawan, Kathmandu',
    lat: 27.6836,
    lng: 85.3414,
    directPhone: '01-4107123',
    operatingHoursNe: 'आइतबार - शुक्रबार (१०:०० - ५:००)',
    operatingHoursEn: 'Sunday - Friday (10:00 - 17:00)',
    is24x7: false,
    servicesNe: [
      'स्मार्ट सवारी चालक अनुमतिपत्र (Smart Driving License)',
      'सवारी दर्ता तथा इम्बोस्ड नम्बर प्लेट',
      'सवारी रुट परमिट तथा भाडा दर निर्धारण',
      'अनलाइन लाइसेन्स फाराम तथा नवीकरण सहयोग'
    ],
    servicesEn: [
      'Smart Driving License Issuance & Management',
      'Vehicle Registration & Embossed Number Plates',
      'Inter-Provincial Route Permits & Fare Regulation',
      'Electronic License Verification'
    ],
    descriptionNe: 'नेपालभरका सवारी साधन, चालक अनुमतिपत्र (स्मार्ट लाइसेन्स) र सार्वजनिक यातायातको नियमन गर्ने केन्द्रीय विभाग।',
    descriptionEn: 'The central government department regulating motor vehicles, electronic smart driving licenses, and public transportation routes.',
    website: 'https://dotm.gov.np'
  },
  {
    id: 'bir-hospital',
    nameNe: 'वीर अस्पताल तथा राष्ट्रिय ट्रमा सेन्टर',
    nameEn: 'Bir Hospital & National Trauma Centre',
    category: 'health',
    province: 'Bagmati',
    district: 'काठमाडौँ (Kathmandu)',
    addressNe: 'महाबौद्ध, टुँडिखेल अगाडि, काठमाडौँ',
    addressEn: 'Mahabouddha, Kantipath, Kathmandu',
    lat: 27.7042,
    lng: 85.3138,
    hotline: '102',
    directPhone: '01-4221119',
    operatingHoursNe: 'आकस्मिक कक्ष: २४ घण्टा (OPD: ८:०० - ३:००)',
    operatingHoursEn: 'Emergency Ward: 24/7 (OPD: 08:00 - 15:00)',
    is24x7: true,
    servicesNe: [
      '२४ घण्टे राष्ट्रिय आकस्मिक ट्रमा तथा दुर्घटना उपचार (१०२)',
      'सुलभ तथा निःशुल्क आकस्मिक स्वास्थ्य सेवा',
      'अत्याधुनिक सघन उपचार कक्ष (ICU/CCU)',
      'सरकारी स्वास्थ्य बीमा सेवा केन्द्र'
    ],
    servicesEn: [
      '24/7 National Emergency Trauma & Accident Care (102)',
      'Subsidized & Free Emergency Treatment',
      'Advanced Intensive Care (ICU / CCU)',
      'Government Health Insurance Assistance Desk'
    ],
    descriptionNe: 'नेपालको सबैभन्दा पुरानो तथा ठूलो सरकारी केन्द्रीय अस्पताल, जहाँ राष्ट्रिय ट्रमा सेन्टरसहित २४ सै घण्टा आकस्मिक सेवा उपलब्ध छ।',
    descriptionEn: 'Nepal’s premier public tertiary hospital and National Trauma Centre providing 24/7 life-saving emergency medical treatment.',
    website: 'https://birhospital.gov.np'
  },
  {
    id: 'tuth-hospital',
    nameNe: 'त्रिभुवन विश्वविद्यालय शिक्षण अस्पताल (TUTH शिक्षण अस्पताल महाराजगञ्ज)',
    nameEn: 'Tribhuvan University Teaching Hospital (TUTH Maharajgunj)',
    category: 'health',
    province: 'Bagmati',
    district: 'काठमाडौँ (Kathmandu)',
    addressNe: 'महाराजगञ्ज, काठमाडौँ',
    addressEn: 'Maharajgunj, Kathmandu',
    lat: 27.7362,
    lng: 85.3308,
    directPhone: '01-4412303',
    operatingHoursNe: 'आकस्मिक कक्ष: २४ घण्टा (OPD: ८:३० - ४:००)',
    operatingHoursEn: 'Emergency Ward: 24/7 (OPD: 08:30 - 16:00)',
    is24x7: true,
    servicesNe: [
      '२४ घण्टे आकस्मिक स्वास्थ्य तथा बाल उपचार सेवा',
      'विशेषज्ञ शल्यक्रिया, न्युरो तथा मुटुरोग सेवा',
      'केन्द्रीय रक्त बैंक तथा प्रयोगशाला',
      'सरकारी स्वास्थ्य बीमा दाबी डेस्क'
    ],
    servicesEn: [
      '24/7 Tertiary Emergency & Pediatric Critical Care',
      'Specialized Surgery, Cardiology & Neurology',
      'Comprehensive Blood Bank & Diagnostic Labs',
      'Health Insurance Program Facilitation'
    ],
    descriptionNe: 'देशको अग्रणी शिक्षण अस्पताल, जहाँ २४ सै घण्टा उच्च गुणस्तरको आकस्मिक स्वास्थ्य उपचार र विशेषज्ञ सेवा उपलब्ध छ।',
    descriptionEn: 'Renowned public university teaching hospital offering around-the-clock emergency, trauma, pediatric, and intensive medical care.',
    website: 'https://tuth.org.np'
  },
  {
    id: 'fire-brigade-ktm',
    nameNe: 'जुद्ध बारुणयन्त्र कार्यालय (दमकल सेवा न्यूरोड)',
    nameEn: 'Juddha Fire Brigade (Basantapur / New Road)',
    category: 'fire',
    province: 'Bagmati',
    district: 'काठमाडौँ (Kathmandu)',
    addressNe: 'न्यूरोड गेट अगाडि, काठमाडौँ',
    addressEn: 'New Road Gate, Basantapur, Kathmandu',
    lat: 27.7028,
    lng: 85.3092,
    hotline: '101',
    directPhone: '01-4221177',
    operatingHoursNe: '२४ घण्टा (२४/७ निरन्तर)',
    operatingHoursEn: '24 Hours (24/7 Non-stop)',
    is24x7: true,
    servicesNe: [
      'आगलागी नियन्त्रण तथा दमकल प्रेषण (१०१)',
      'भूकम्प, बाढी तथा भवन भत्किँदा उद्धार',
      'अग्नि सुरक्षा परामर्श तथा प्राविधिक सहयोग',
      'आपतकालीन जल आपूर्ति सहयोग'
    ],
    servicesEn: [
      '24/7 Emergency Fire Fighting & Dispatch (101)',
      'Structural Collapse & Disaster Rescue',
      'Fire Hazard Inspection & Guidance',
      'Emergency Water Supply Support'
    ],
    descriptionNe: 'काठमाडौँ उपत्यकाको मुख्य ऐतिहासिक अग्नि नियन्त्रण केन्द्र। कुनै पनि आगलागी वा विपद् पर्दा १०१ मा तत्काल सम्पर्क गर्न सकिन्छ।',
    descriptionEn: 'The historic central fire brigade station serving the Kathmandu Valley with 24/7 rapid firefighting and disaster rescue dispatch.',
    website: 'https://kathmandu.gov.np'
  },
  {
    id: 'red-cross-blood',
    nameNe: 'नेपाल रेडक्रस सोसाइटी - केन्द्रीय रक्तसञ्चार सेवा',
    nameEn: 'Nepal Red Cross Society - Central Blood Transfusion Service',
    category: 'health',
    province: 'Bagmati',
    district: 'काठमाडौँ (Kathmandu)',
    addressNe: 'प्रदर्शनी मार्ग / सोल्टीमोड, काठमाडौँ',
    addressEn: 'Exhibition Road / Soalteemode, Kathmandu',
    lat: 27.6972,
    lng: 85.2974,
    directPhone: '01-4288485',
    operatingHoursNe: '२४ घण्टा (२४/७ निरन्तर)',
    operatingHoursEn: '24 Hours (24/7 Non-stop)',
    is24x7: true,
    servicesNe: [
      '२४ घण्टे आपतकालीन रगत तथा प्लाज्मा आपूर्ति',
      'रक्तदान कार्यक्रम तथा स्वयंसेवक व्यवस्थापन',
      'दुर्लभ रक्त समूह (Rare Blood Group) खोजतलास',
      'रक्त परीक्षण तथा क्रसम्याच सेवा'
    ],
    servicesEn: [
      '24/7 Emergency Blood & Platelet Supply',
      'Voluntary Blood Donation Management',
      'Rare Blood Group Emergency Search',
      'Blood Screening & Crossmatching Services'
    ],
    descriptionNe: 'नेपालभरका बिरामीका लागि सुरक्षित रगत, प्लाज्मा तथा प्लेटलेट उपलब्ध गराउने राष्ट्रिय केन्द्रीय रक्तसञ्चार केन्द्र।',
    descriptionEn: 'Nepal’s central blood transfusion headquarters ensuring 24/7 emergency blood supply, testing, and donor coordination.',
    website: 'https://nrcs.org'
  },
  {
    id: 'ndrrma-hq',
    nameNe: 'राष्ट्रिय विपद् जोखिम न्यूनीकरण तथा व्यवस्थापन प्राधिकरण (NDRRMA)',
    nameEn: 'National Disaster Risk Reduction & Management Authority',
    category: 'disaster',
    province: 'Bagmati',
    district: 'काठमाडौँ (Kathmandu)',
    addressNe: 'सिंहदरबार, काठमाडौँ',
    addressEn: 'Singha Durbar, Kathmandu',
    lat: 27.6961,
    lng: 85.3217,
    hotline: '1155',
    directPhone: '01-4211244',
    operatingHoursNe: '२४ घण्टा (आपतकालीन सूचना डेस्क)',
    operatingHoursEn: '24 Hours (Emergency Alerts Desk)',
    is24x7: true,
    servicesNe: [
      'बाढी, पहिरो तथा भूकम्प पूर्वसूचना प्रणाली (११५५)',
      'राष्ट्रिय आपतकालीन राहत तथा उद्धार समन्वय',
      'मौसम जोखिम पूर्वानुमान तथा अलर्ट',
      'विपद् पुनर्स्थापना सहायता'
    ],
    servicesEn: [
      'Disaster Early Warning Hotline (1155)',
      'Flood, Landslide & Earthquake Response Coordination',
      'Live Hazard Tracking & Weather Warnings',
      'Disaster Relief Resource Deployment'
    ],
    descriptionNe: 'नेपाल सरकारको विपद् पूर्वतयारी, खोज तथा उद्धार समन्वय गर्ने सर्वोच्च राष्ट्रिय प्राधिकरण। ११५५ मा बाढी तथा पहिरोको जानकारी पाइन्छ।',
    descriptionEn: 'The supreme governmental authority for disaster response, emergency early warnings (1155), and nationwide humanitarian relief.',
    website: 'https://ndrrma.gov.np'
  },
  {
    id: 'women-commission',
    nameNe: 'राष्ट्रिय महिला आयोग (खबर गरौँ ११४५ हटलाइन)',
    nameEn: 'National Women Commission Helpline (1145)',
    category: 'helpline',
    province: 'Bagmati',
    district: 'काठमाडौँ (Kathmandu)',
    addressNe: 'भद्रकाली प्लाजा, काठमाडौँ',
    addressEn: 'Bhadrakali Plaza, Kathmandu',
    lat: 27.6948,
    lng: 85.3195,
    hotline: '1145',
    directPhone: '01-4256701',
    operatingHoursNe: '२४ घण्टा (२४/७ निरन्तर)',
    operatingHoursEn: '24 Hours (24/7 Non-stop)',
    is24x7: true,
    servicesNe: [
      'महिला हिंसा तथा घरेलु दुर्व्यवहार विरुद्ध २४ घण्टे हटलाइन (११४५)',
      'निःशुल्क कानुनी परामर्श तथा सहायता',
      'मनोसामाजिक परामर्श तथा सुरक्षित आवास समन्वय',
      'तत्काल प्रहरी तथा उद्धार समन्वय'
    ],
    servicesEn: [
      '24/7 Domestic Violence & Abuse Hotline (1145)',
      'Free Legal Aid & Court Representation',
      'Psychosocial Counseling & Safe Shelter Referral',
      'Emergency Police Protection Dispatch'
    ],
    descriptionNe: 'महिला अधिकारको संरक्षण, घरेलु हिंसा तथा दुर्व्यवहारमा परेका महिलाहरूको उद्धार र कानुनी उपचारका लागि २४ सै घण्टा समर्पित आयोग।',
    descriptionEn: 'Constitutional body operating the toll-free 24/7 helpline 1145 for women facing gender-based violence or seeking legal assistance.',
    website: 'https://nwc.gov.np'
  },
  {
    id: 'children-helpline',
    nameNe: 'बालबालिका खोजतलास समन्वय केन्द्र (हटलाइन १०४)',
    nameEn: 'Missing Children Search & Rescue Helpline (104)',
    category: 'helpline',
    province: 'Bagmati',
    district: 'ललितपुर (Lalitpur)',
    addressNe: 'हरिहरभवन, ललितपुर',
    addressEn: 'Hariharbhawan, Lalitpur',
    lat: 27.6766,
    lng: 85.3175,
    hotline: '104',
    directPhone: '01-5553334',
    operatingHoursNe: '२४ घण्टा (२४/७ निरन्तर)',
    operatingHoursEn: '24 Hours (24/7 Non-stop)',
    is24x7: true,
    servicesNe: [
      'हराएका बालबालिकाको तत्काल खोजी तथा उद्धार (१०४)',
      'सडक बालबालिका संरक्षण तथा पारिवारिक पुनर्मिलन',
      'बाल श्रम तथा दुर्व्यवहार रोकथाम सहायता',
      'अस्थायी बाल संरक्षण गृह समन्वय'
    ],
    servicesEn: [
      'Missing Children Emergency Hotline (104)',
      'Street Children Protection & Family Reunification',
      'Child Labor & Exploitation Intervention',
      'Safe Transit Shelter Coordination'
    ],
    descriptionNe: 'हराएका, जोखिममा परेका वा बेवारिसे बालबालिकाको खोजतलास, उद्धार तथा पारिवारिक पुनर्मिलनका लागि नेपाल सरकारको २४ घण्टे हटलाइन।',
    descriptionEn: 'Dedicated government emergency service (104) for locating missing children, rescuing vulnerable youth, and family reunification.',
    website: 'https://www.facebook.com/csrc104'
  },
  {
    id: 'dao-kathmandu',
    nameNe: 'जिल्ला प्रशासन कार्यालय काठमाडौँ (DAO Babarmahal)',
    nameEn: 'District Administration Office Kathmandu (Babarmahal)',
    category: 'administration',
    province: 'Bagmati',
    district: 'काठमाडौँ (Kathmandu)',
    addressNe: 'बबरमहल, काठमाडौँ',
    addressEn: 'Babarmahal, Kathmandu',
    lat: 27.6937,
    lng: 85.3262,
    directPhone: '01-4262444',
    operatingHoursNe: 'आइतबार - शुक्रबार (१०:०० - ५:००)',
    operatingHoursEn: 'Sunday - Friday (10:00 - 17:00)',
    is24x7: false,
    servicesNe: [
      'नेपाली नागरिकताको प्रमाणपत्र जारी तथा प्रतिलिपि',
      'नाबालिग परिचयपत्र तथा राहदानी सिफारिस',
      'शान्ति सुरक्षा, हतियार नवीकरण तथा संस्था दर्ता',
      'सार्वजनिक सेवा अनुगमन तथा क्षतिपूर्ति'
    ],
    servicesEn: [
      'Citizenship Certificate Issuance & Duplicates',
      'Minor Identification & Passport Endorsement',
      'District Security, Firearms Licensing & NGO Registration',
      'Public Grievance Redressal & Victim Relief'
    ],
    descriptionNe: 'काठमाडौँ जिल्लाको मुख्य नागरिक सेवा प्रवाह केन्द्र, जहाँबाट नागरिकता, सिफारिस र प्रशासनिक कार्यहरू सम्पन्न हुन्छन्।',
    descriptionEn: 'The primary district authority in Kathmandu for issuing citizenship cards, official recommendations, and maintaining local order.',
    website: 'https://daokathmandu.moha.gov.np'
  },
  {
    id: 'tourist-police-hq',
    nameNe: 'पर्यटक प्रहरी प्रधान कार्यालय (भृकुटीमण्डप)',
    nameEn: 'Tourist Police Headquarters (Bhrikutimandap)',
    category: 'police',
    province: 'Bagmati',
    district: 'काठमाडौँ (Kathmandu)',
    addressNe: 'भृकुटीमण्डप, काठमाडौँ',
    addressEn: 'Bhrikutimandap, Kathmandu',
    lat: 27.7021,
    lng: 85.3168,
    hotline: '1144',
    directPhone: '01-4247041',
    operatingHoursNe: '२४ घण्टा (२४/७ निरन्तर)',
    operatingHoursEn: '24 Hours (24/7 Non-stop)',
    is24x7: true,
    servicesNe: [
      'पर्यटक सुरक्षा तथा आपतकालीन सहायता (११४४)',
      'हराएका कागजात (राहदानी/सामान) खोजी तथा रिपोर्ट',
      'पदयात्रा तथा ट्राभल सुरक्षा परामर्श',
      'पर्यटन ठगी तथा दुर्व्यवहार रोकथाम'
    ],
    servicesEn: [
      'Tourist Safety & Rapid Response Hotline (1144)',
      'Lost Belongings & Passport Police Reporting',
      'Trekking & Travel Safety Advice',
      'Investigation of Tourism-related Fraud'
    ],
    descriptionNe: 'नेपाल भ्रमणमा रहेका आन्तरिक तथा विदेशी पर्यटकहरूको सुरक्षा, सहायता र मार्गदर्शनका लागि २४ सै घण्टा क्रियाशील विशेष प्रहरी एकाइ।',
    descriptionEn: 'Specialized police wing dedicated to protecting and assisting domestic and international tourists across Nepal 24/7.',
    website: 'https://nepalpolice.gov.np'
  },
  {
    id: 'pokhara-hospital',
    nameNe: 'पश्चिमाञ्चल क्षेत्रीय अस्पताल (पोखरा स्वास्थ्य विज्ञान प्रतिष्ठान)',
    nameEn: 'Western Regional Hospital (Pokhara Academy of Health Sciences)',
    category: 'health',
    province: 'Gandaki',
    district: 'कास्की (Kaski / Pokhara)',
    addressNe: 'रामघाट, पोखरा, गण्डकी प्रदेश',
    addressEn: 'Ramghat, Pokhara, Gandaki Province',
    lat: 28.2118,
    lng: 83.9961,
    hotline: '102',
    directPhone: '061-520067',
    operatingHoursNe: 'आकस्मिक कक्ष: २४ घण्टा',
    operatingHoursEn: 'Emergency Care: 24 Hours Non-stop',
    is24x7: true,
    servicesNe: [
      'गण्डकी प्रदेशको २४ घण्टे मुख्य आकस्मिक तथा ट्रमा सेवा',
      'प्रादेशिक रक्त बैंक तथा एम्बुलेन्स समन्वय (१०२)',
      'सघन उपचार कक्ष (ICU/NICU) तथा मातृशिशु सेवा',
      'स्वास्थ्य बीमा कार्यक्रम उपचार'
    ],
    servicesEn: [
      '24/7 Primary Emergency & Trauma Care for Gandaki',
      'Regional Blood Bank & Ambulance Coordination (102)',
      'Intensive Care (ICU/NICU) & Maternity Services',
      'National Health Insurance Program Coverage'
    ],
    descriptionNe: 'गण्डकी प्रदेशको मुख्य सरकारी शिक्षण अस्पताल, जसले पोखरा र आसपासका ११ जिल्लाका नागरिकलाई २४ सै घण्टा आकस्मिक सेवा दिन्छ।',
    descriptionEn: 'The flagship public referral hospital in Gandaki Province, serving Pokhara and 11 surrounding districts with 24/7 emergency care.',
    website: 'https://pahs.gov.np'
  },
  {
    id: 'dao-kaski',
    nameNe: 'जिल्ला प्रशासन कार्यालय कास्की (पोखरा)',
    nameEn: 'District Administration Office Kaski (Pokhara)',
    category: 'administration',
    province: 'Gandaki',
    district: 'कास्की (Kaski / Pokhara)',
    addressNe: 'सहिद चोक, पोखरा, गण्डकी प्रदेश',
    addressEn: 'Sahid Chowk, Pokhara, Gandaki Province',
    lat: 28.2255,
    lng: 83.9912,
    directPhone: '061-520111',
    operatingHoursNe: 'आइतबार - शुक्रबार (१०:०० - ५:००)',
    operatingHoursEn: 'Sunday - Friday (10:00 - 17:00)',
    is24x7: false,
    servicesNe: [
      'नागरिकता प्रमाणपत्र जारी तथा प्रतिलिपि',
      'ई-राहदानी (e-Passport) बायोमेट्रिक तथा वितरण',
      'राष्ट्रिय परिचयपत्र विवरण संकलन',
      'सार्वजनिक शान्ति सुरक्षा र विपद् व्यवस्थापन'
    ],
    servicesEn: [
      'Nepali Citizenship Cards & Duplicate Issuance',
      'e-Passport Biometric Enrollment & Issuance',
      'National ID Data Collection Center',
      'District Security & Disaster Response'
    ],
    descriptionNe: 'कास्की जिल्लाका नागरिकलाई नागरिकता, राहदानी र सरकारी सिफारिस सेवा प्रदान गर्ने पोखराको मुख्य प्रशासनिक कार्यालय।',
    descriptionEn: 'The key public service and civil administration hub in Pokhara for citizenship, passport biometrics, and local governance.',
    website: 'https://daokaski.moha.gov.np'
  },
  {
    id: 'koshi-hospital',
    nameNe: 'कोशी अस्पताल विराटनगर (Koshi Hospital)',
    nameEn: 'Koshi Hospital (Biratnagar)',
    category: 'health',
    province: 'Koshi',
    district: 'मोरङ (Morang / Biratnagar)',
    addressNe: 'रङ्गेली रोड, विराटनगर, कोशी प्रदेश',
    addressEn: 'Rangeli Road, Biratnagar, Koshi Province',
    lat: 26.4525,
    lng: 87.2798,
    hotline: '102',
    directPhone: '021-522144',
    operatingHoursNe: 'आकस्मिक कक्ष: २४ घण्टा',
    operatingHoursEn: 'Emergency Care: 24 Hours Non-stop',
    is24x7: true,
    servicesNe: [
      'कोशी प्रदेशको २४ घण्टे मुख्य आपतकालीन स्वास्थ्य सेवा',
      'क्षेत्रीय ट्रमा सेन्टर तथा शल्यक्रिया',
      'रक्त सञ्चार सेवा तथा एम्बुलेन्स (१०२)',
      'बाल तथा मातृशिशु आकस्मिक कक्ष'
    ],
    servicesEn: [
      '24/7 Primary Emergency & Trauma Services for Koshi',
      'Regional Surgical Units & Trauma Response',
      'Blood Transfusion Center & Ambulance (102)',
      'Pediatric & Maternal Emergency Care'
    ],
    descriptionNe: 'पूर्वी नेपालको सबैभन्दा ठूलो सरकारी अस्पताल, जहाँ २४ सै घण्टा आकस्मिक सेवा, सघन उपचार र निःशुल्क उपचार सेवा उपलब्ध छन्।',
    descriptionEn: 'The largest public tertiary hospital in eastern Nepal, providing round-the-clock emergency medical and trauma care.',
    website: 'https://koshihospital.gov.np'
  },
  {
    id: 'dao-morang',
    nameNe: 'जिल्ला प्रशासन कार्यालय मोरङ (विराटनगर)',
    nameEn: 'District Administration Office Morang (Biratnagar)',
    category: 'administration',
    province: 'Koshi',
    district: 'मोरङ (Morang / Biratnagar)',
    addressNe: 'विराटनगर, कोशी प्रदेश',
    addressEn: 'Biratnagar, Koshi Province',
    lat: 26.4542,
    lng: 87.2711,
    directPhone: '021-524255',
    operatingHoursNe: 'आइतबार - शुक्रबार (१०:०० - ५:००)',
    operatingHoursEn: 'Sunday - Friday (10:00 - 17:00)',
    is24x7: false,
    servicesNe: [
      'नागरिकता प्रमाणपत्र जारी तथा प्रतिलिपि',
      'ई-राहदानी बायोमेट्रिक तथा वितरण',
      'राष्ट्रिय परिचयपत्र दर्ता केन्द्र',
      'जिल्ला शान्ति सुरक्षा तथा विपद् समन्वय'
    ],
    servicesEn: [
      'Citizenship Services & Replacements',
      'e-Passport Biometric Application Processing',
      'National ID Registration Center',
      'District Security & Emergency Coordination'
    ],
    descriptionNe: 'मोरङ जिल्लाको मुख्य नागरिक सेवा तथा प्रशासन केन्द्र, जहाँबाट दैनिक हजारौँ नागरिकले नागरिकता तथा राहदानी सेवा लिन्छन्।',
    descriptionEn: 'Chief administrative facility in Morang, delivering citizen documentation, biometric passports, and public safety services.',
    website: 'https://daomorang.moha.gov.np'
  },
  {
    id: 'lumbini-hospital',
    nameNe: 'लुम्बिनी प्रादेशिक अस्पताल (बुटवल)',
    nameEn: 'Lumbini Provincial Hospital (Butwal)',
    category: 'health',
    province: 'Lumbini',
    district: 'रुपन्देही (Rupandehi / Butwal)',
    addressNe: 'अस्पताल लाइन, बुटवल, लुम्बिनी प्रदेश',
    addressEn: 'Hospital Line, Butwal, Lumbini Province',
    lat: 27.7006,
    lng: 83.4563,
    hotline: '102',
    directPhone: '071-540200',
    operatingHoursNe: 'आकस्मिक कक्ष: २४ घण्टा',
    operatingHoursEn: 'Emergency Care: 24 Hours Non-stop',
    is24x7: true,
    servicesNe: [
      'लुम्बिनी प्रदेशको २४ घण्टे मुख्य आकस्मिक तथा ट्रमा सेवा',
      'सघन उपचार कक्ष (ICU/CCU/NICU)',
      'एम्बुलेन्स सेवा तथा रक्त बैंक (१०२)',
      'सरकारी स्वास्थ्य बीमा सुविधा'
    ],
    servicesEn: [
      '24/7 Primary Regional Emergency & Trauma Care',
      'Intensive Care Units (ICU, CCU, NICU)',
      'Ambulance Network & Blood Bank (102)',
      'Government Health Insurance Scheme Desk'
    ],
    descriptionNe: 'लुम्बिनी प्रदेशको प्रमुख सरकारी अस्पताल, जसले बुटवल र आसपासका तराई तथा पहाडी जिल्लाका बिरामीलाई विशेषज्ञ स्वास्थ्य सेवा दिन्छ।',
    descriptionEn: 'Major public healthcare hub in Lumbini Province offering comprehensive 24/7 emergency, trauma, and medical treatment.',
    website: 'https://lph.gov.np'
  },
  {
    id: 'janakpur-hospital',
    nameNe: 'मधेश स्वास्थ्य विज्ञान प्रतिष्ठान / प्रादेशिक अस्पताल जनकपुर',
    nameEn: 'Janakpur Provincial Hospital (Madhesh Institute)',
    category: 'health',
    province: 'Madhesh',
    district: 'धनुषा (Dhanusha / Janakpur)',
    addressNe: 'रामानन्द चोक, जनकपुरधाम, मधेश प्रदेश',
    addressEn: 'Ramanand Chowk, Janakpurdham, Madhesh Province',
    lat: 26.7288,
    lng: 85.9263,
    hotline: '102',
    directPhone: '041-520033',
    operatingHoursNe: 'आकस्मिक कक्ष: २४ घण्टा',
    operatingHoursEn: 'Emergency Care: 24 Hours Non-stop',
    is24x7: true,
    servicesNe: [
      'मधेश प्रदेशको २४ घण्टे मुख्य आकस्मिक स्वास्थ्य सेवा',
      'प्रसूति तथा बालरोग आकस्मिक कक्ष',
      'क्षेत्रीय एम्बुलेन्स सेवा (१०२)',
      'विपन्न नागरिक निःशुल्क औषधि तथा उपचार'
    ],
    servicesEn: [
      '24/7 Key Emergency Medical Unit for Madhesh',
      'Maternal & Neonatal Critical Care',
      'Regional Ambulance Dispatch (102)',
      'Free Emergency Drugs & Subsidized Treatment'
    ],
    descriptionNe: 'मधेश प्रदेशको राजधानी जनकपुरधाममा अवस्थित मुख्य प्रादेशिक अस्पताल, जहाँ २४ सै घण्टा आकस्मिक बिरामीको उपचार गरिन्छ।',
    descriptionEn: 'Leading provincial healthcare center in Janakpurdham providing 24/7 emergency medical, surgical, and pediatric care.',
    website: 'https://mihs.edu.np'
  },
  {
    id: 'surkhet-hospital',
    nameNe: 'कर्णाली प्रादेशिक अस्पताल (वीरेन्द्रनगर, सुर्खेत)',
    nameEn: 'Karnali Provincial Hospital (Birendranagar, Surkhet)',
    category: 'health',
    province: 'Karnali',
    district: 'सुर्खेत (Surkhet)',
    addressNe: 'वीरेन्द्रनगर, सुर्खेत, कर्णाली प्रदेश',
    addressEn: 'Birendranagar, Surkhet, Karnali Province',
    lat: 28.6019,
    lng: 81.6184,
    hotline: '102',
    directPhone: '083-520200',
    operatingHoursNe: 'आकस्मिक कक्ष: २४ घण्टा',
    operatingHoursEn: 'Emergency Care: 24 Hours Non-stop',
    is24x7: true,
    servicesNe: [
      'कर्णाली प्रदेशको २४ घण्टे केन्द्रीय आकस्मिक स्वास्थ्य सेवा',
      'हवाई उद्धार (Air Ambulance) तथा दुर्गम बिरामी समन्वय',
      'सघन उपचार कक्ष (ICU) तथा रक्त बैंक',
      'मातृशिशु आपतकालीन उपचार'
    ],
    servicesEn: [
      '24/7 Central Emergency Services for Karnali',
      'Air Ambulance & Remote Patient Evacuation Coordination',
      'Intensive Care Unit (ICU) & Blood Bank',
      'Emergency Maternal & Neonatal Care'
    ],
    descriptionNe: 'कर्णाली प्रदेशको सर्वोच्च स्वास्थ्य संस्था, जसले दुर्गम पहाडी तथा हिमाली जिल्लाहरूबाट एयर एम्बुलेन्समार्फत ल्याइएका बिरामीको आपतकालीन उपचार गर्दछ।',
    descriptionEn: 'The apex healthcare facility in Karnali Province handling remote helicopter evacuations and round-the-clock emergency care.',
    website: 'https://kph.gov.np'
  },
  {
    id: 'seti-hospital',
    nameNe: 'सेती प्रादेशिक अस्पताल (धनगढी, कैलाली)',
    nameEn: 'Seti Provincial Hospital (Dhangadhi, Kailali)',
    category: 'health',
    province: 'Sudurpashchim',
    district: 'कैलाली (Kailali / Dhangadhi)',
    addressNe: 'धनगढी, कैलाली, सुदूरपश्चिम प्रदेश',
    addressEn: 'Dhangadhi, Kailali, Sudurpashchim Province',
    lat: 28.7061,
    lng: 80.5902,
    hotline: '102',
    directPhone: '091-521259',
    operatingHoursNe: 'आकस्मिक कक्ष: २४ घण्टा',
    operatingHoursEn: 'Emergency Care: 24 Hours Non-stop',
    is24x7: true,
    servicesNe: [
      'सुदूरपश्चिम प्रदेशको २४ घण्टे मुख्य आकस्मिक तथा ट्रमा केन्द्र',
      'सघन उपचार कक्ष (ICU) तथा एम्बुलेन्स सेवा (१०२)',
      'क्षेत्रीय रक्तसञ्चार केन्द्र',
      'सरकारी स्वास्थ्य बीमा तथा विपन्न नागरिक सेवा'
    ],
    servicesEn: [
      '24/7 Primary Emergency & Trauma Facility for Far-West',
      'Intensive Care (ICU) & Ambulance Dispatch (102)',
      'Regional Blood Transfusion Center',
      'Subsidized Care & Health Insurance Support'
    ],
    descriptionNe: 'सुदूरपश्चिम प्रदेशको मुख्य प्रादेशिक अस्पताल, जसले ९ वटै जिल्लाका नागरिकलाई २४ सै घण्टा आकस्मिक तथा विशेषज्ञ स्वास्थ्य उपचार प्रदान गर्दछ।',
    descriptionEn: 'Flagship provincial medical center in Sudurpashchim delivering around-the-clock emergency, trauma, and maternal care.',
    website: 'https://setihospital.gov.np'
  }
];

export const SERVICE_CATEGORIES: { id: ServiceCategory; nameNe: string; nameEn: string; color: string }[] = [
  { id: 'all', nameNe: 'सबै सेवा केन्द्रहरू (All)', nameEn: 'All Help Centers', color: '#B91C1C' },
  { id: 'police', nameNe: 'प्रहरी तथा सुरक्षा (१०० / १०३)', nameEn: 'Police & Security', color: '#1D4ED8' },
  { id: 'health', nameNe: 'अस्पताल तथा रगत बैंक (१०२)', nameEn: 'Hospitals & Blood Bank', color: '#059669' },
  { id: 'fire', nameNe: 'दमकल तथा उद्धार (१०१)', nameEn: 'Fire Brigade (101)', color: '#EA580C' },
  { id: 'citizen_service', nameNe: 'राहदानी र परिचयपत्र (Passports & NID)', nameEn: 'Passports & Citizen IDs', color: '#7C3AED' },
  { id: 'administration', nameNe: 'प्रशासन तथा हेलो सरकार (११११)', nameEn: 'Admin & Hello Sarkar', color: '#B91C1C' },
  { id: 'transport', nameNe: 'यातायात तथा लाइसेन्स (DoTM)', nameEn: 'Transport & License', color: '#D97706' },
  { id: 'helpline', nameNe: 'महिला र बालबालिका हटलाइन (११४५/१०४)', nameEn: 'Helplines (1145 / 104)', color: '#DB2777' },
  { id: 'disaster', nameNe: 'विपद् जोखिम व्यवस्थापन (११५५)', nameEn: 'Disaster Alerts (1155)', color: '#DC2626' }
];

export const PROVINCES: { id: ProvinceName; nameNe: string; nameEn: string; centerLat: number; centerLng: number; zoom: number }[] = [
  { id: 'all', nameNe: 'सम्पूर्ण नेपाल (All Nepal)', nameEn: 'All Nepal', centerLat: 28.3949, centerLng: 84.1240, zoom: 7 },
  { id: 'Bagmati', nameNe: 'बागमती प्रदेश (काठमाडौँ उपत्यका)', nameEn: 'Bagmati (Kathmandu Valley)', centerLat: 27.7050, centerLng: 85.3200, zoom: 12 },
  { id: 'Gandaki', nameNe: 'गण्डकी प्रदेश (पोखरा)', nameEn: 'Gandaki (Pokhara)', centerLat: 28.2150, centerLng: 83.9950, zoom: 12 },
  { id: 'Koshi', nameNe: 'कोशी प्रदेश (विराटनगर)', nameEn: 'Koshi (Biratnagar)', centerLat: 26.4550, centerLng: 87.2750, zoom: 12 },
  { id: 'Lumbini', nameNe: 'लुम्बिनी प्रदेश (बुटवल)', nameEn: 'Lumbini (Butwal)', centerLat: 27.7006, centerLng: 83.4563, zoom: 12 },
  { id: 'Madhesh', nameNe: 'मधेश प्रदेश (जनकपुर)', nameEn: 'Madhesh (Janakpur)', centerLat: 26.7288, centerLng: 85.9263, zoom: 12 },
  { id: 'Karnali', nameNe: 'कर्णाली प्रदेश (सुर्खेत)', nameEn: 'Karnali (Surkhet)', centerLat: 28.6019, centerLng: 81.6184, zoom: 12 },
  { id: 'Sudurpashchim', nameNe: 'सुदूरपश्चिम प्रदेश (धनगढी)', nameEn: 'Sudurpashchim (Dhangadhi)', centerLat: 28.7061, centerLng: 80.5902, zoom: 12 }
];
