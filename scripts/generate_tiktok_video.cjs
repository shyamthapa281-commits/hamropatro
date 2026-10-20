const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORK_DIR = '/tmp/video_work';
const FONT_BOLD = '/tmp/fonts/Mukta-Bold.ttf';
const FONT_REG = '/tmp/fonts/Mukta-Regular.ttf';
const FONT_XBOLD = '/tmp/fonts/Mukta-ExtraBold.ttf';

if (!fs.existsSync(WORK_DIR)) {
  fs.mkdirSync(WORK_DIR, { recursive: true });
}

console.log('Rendering Scene 1: Hook & Brand Intro...');
execSync(`convert -size 720x1280 gradient:"#7f1d1d-#18181b" \\
  -fill "#fef08a" -draw "roundrectangle 160,110 560,165 28,28" \\
  -font "${FONT_BOLD}" -fill "#78350f" -pointsize 26 -gravity north -annotate +0+122 "✦ नयाँ डिजिटल नेपाली पात्रो ✦" \\
  -font "${FONT_XBOLD}" -fill "#ffffff" -pointsize 68 -gravity north -annotate +0+200 "शुभ पात्रो" \\
  -font "${FONT_BOLD}" -fill "#fbbf24" -pointsize 30 -gravity north -annotate +0+280 "SHUBHA PATRO" \\
  -font "${FONT_REG}" -fill "#fca5a5" -pointsize 28 -gravity north -annotate +0+325 "नेपालीको आफ्नै आधुनिक पात्रो र पञ्चाङ्ग" \\
  -fill "#27272a" -draw "roundrectangle 50,380 670,1030 24,24" \\
  -fill "#3f3f46" -draw "roundrectangle 70,410 650,510 16,16" \\
  -font "${FONT_BOLD}" -fill "#facc15" -pointsize 32 -gravity north -annotate +0+425 "📅 बिक्रम संवत् पञ्चाङ्ग र चाडपर्व" \\
  -font "${FONT_REG}" -fill "#e4e4e7" -pointsize 22 -gravity north -annotate +0+468 "एकादशी, औंशी, पूर्णिमा, विवाह र व्रतबन्धका शुभ साइत" \\
  -fill "#3f3f46" -draw "roundrectangle 70,530 650,630 16,16" \\
  -font "${FONT_BOLD}" -fill "#38bdf8" -pointsize 32 -gravity north -annotate +0+545 "🔮 कुण्डली, गुण मिलान र राशिफल" \\
  -font "${FONT_REG}" -fill "#e4e4e7" -pointsize 22 -gravity north -annotate +0+588 "दैनिक राशिफल, विवाह गुण मिलान र स्वप्न फल" \\
  -fill "#3f3f46" -draw "roundrectangle 70,650 650,750 16,16" \\
  -font "${FONT_BOLD}" -fill "#4ade80" -pointsize 32 -gravity north -annotate +0+665 "💵 राष्ट्र बैंक विदेशी विनिमय दर" \\
  -font "${FONT_REG}" -fill "#e4e4e7" -pointsize 22 -gravity north -annotate +0+708 "डलर, रियाल, दिर्हामसहित दैनिक ताजा भाउ" \\
  -fill "#3f3f46" -draw "roundrectangle 70,770 650,870 16,16" \\
  -font "${FONT_BOLD}" -fill "#f59e0b" -pointsize 32 -gravity north -annotate +0+785 "🪙 सुनचाँदी दर र १०८ जप माला" \\
  -font "${FONT_REG}" -fill "#e4e4e7" -pointsize 22 -gravity north -annotate +0+828 "FENEGOSIDA आधिकारिक भाउ र डिजिटल रुद्राक्ष माला" \\
  -fill "#3f3f46" -draw "roundrectangle 70,890 650,990 16,16" \\
  -font "${FONT_BOLD}" -fill "#e879f9" -pointsize 32 -gravity north -annotate +0+905 "⚡ कुनै एप डाउनलोड गर्नै नपर्ने" \\
  -font "${FONT_REG}" -fill "#e4e4e7" -pointsize 22 -gravity north -annotate +0+948 "मोबाइलको ब्राउजरबाटै एक सेकेन्डमा खुल्ने" \\
  -fill "#dc2626" -draw "roundrectangle 80,1070 640,1180 32,32" \\
  -font "${FONT_XBOLD}" -fill "#ffffff" -pointsize 42 -gravity north -annotate +0+1095 "👉 shubhapatro.com" \\
  -font "${FONT_REG}" -fill "#fef08a" -pointsize 22 -gravity north -annotate +0+1145 "अहिले नै ब्राउजरमा खोल्नुहोस्" \\
  ${WORK_DIR}/scene1.png`);

console.log('Rendering Scene 2: Gun Milan & Kundali...');
execSync(`convert -size 720x1280 gradient:"#311042-#0f172a" \\
  -fill "#f3e8ff" -draw "roundrectangle 140,90 580,145 28,28" \\
  -font "${FONT_BOLD}" -fill "#6b21a8" -pointsize 26 -gravity north -annotate +0+102 "🔮 सम्बन्ध र विवाह जोखाना" \\
  -font "${FONT_XBOLD}" -fill "#ffffff" -pointsize 54 -gravity north -annotate +0+170 "विवाह गुण मिलान" \\
  -font "${FONT_REG}" -fill "#d8b4fe" -pointsize 26 -gravity north -annotate +0+235 "तपाइँ र तपाइँको पार्टनरको गुण कति मिल्छ?" \\
  -fill "#1e1b4b" -draw "roundrectangle 50,290 670,1020 24,24" \\
  -fill "#312e81" -draw "roundrectangle 80,320 640,410 18,18" \\
  -font "${FONT_BOLD}" -fill "#fbcfe8" -pointsize 28 -gravity north -annotate +0+340 "वर: रोहन (मेष राशि, अश्विनी)" \\
  -font "${FONT_BOLD}" -fill "#fbcfe8" -pointsize 28 -gravity north -annotate +0+370 "वधु: पूजा (सिंह राशि, मघा)" \\
  -fill "#166534" -draw "roundrectangle 160,440 560,610 30,30" \\
  -font "${FONT_XBOLD}" -fill "#fef08a" -pointsize 64 -gravity north -annotate +0+460 "३१ / ३६" \\
  -font "${FONT_BOLD}" -fill "#ffffff" -pointsize 32 -gravity north -annotate +0+540 "⭐ अति उत्तम मिलान ⭐" \\
  -fill "#2e1065" -draw "roundrectangle 80,640 640,980 16,16" \\
  -font "${FONT_BOLD}" -fill "#facc15" -pointsize 28 -gravity north -annotate +0+660 "अष्टकूट विवरण (Eight Kutas)" \\
  -font "${FONT_REG}" -fill "#ffffff" -pointsize 24 -gravity north -annotate +0+710 "वर्ण: १/१  •  वश्य: २/२  •  तारा: ३/३" \\
  -font "${FONT_REG}" -fill "#ffffff" -pointsize 24 -gravity north -annotate +0+760 "योनि: ४/४  •  ग्रह मैत्री: ५/५  •  गण: ६/६" \\
  -font "${FONT_REG}" -fill "#ffffff" -pointsize 24 -gravity north -annotate +0+810 "भकूट: ७/७  •  नाडी दोष: छैन (३/८)" \\
  -font "${FONT_BOLD}" -fill "#4ade80" -pointsize 26 -gravity north -annotate +0+870 "विवाहका लागि अत्यन्तै शुभ एवं फलदायी!" \\
  -font "${FONT_REG}" -fill "#cbd5e1" -pointsize 22 -gravity north -annotate +0+920 "अब पण्डितकहाँ धाउनु पर्दैन, घरमै बसेर हेर्नुहोस्" \\
  -fill "#9333ea" -draw "roundrectangle 80,1070 640,1180 32,32" \\
  -font "${FONT_XBOLD}" -fill "#ffffff" -pointsize 40 -gravity north -annotate +0+1095 "👉 shubhapatro.com" \\
  -font "${FONT_REG}" -fill "#fef08a" -pointsize 22 -gravity north -annotate +0+1145 "निःशुल्क गुण मिलान चेक गर्नुहोस्" \\
  ${WORK_DIR}/scene2.png`);

console.log('Rendering Scene 3: Nepal Rastra Bank Forex Rates...');
execSync(`convert -size 720x1280 gradient:"#064e3b-#0f172a" \\
  -fill "#dcfce7" -draw "roundrectangle 130,90 590,145 28,28" \\
  -font "${FONT_BOLD}" -fill "#14532d" -pointsize 26 -gravity north -annotate +0+102 "💵 विदेशबाट पैसा पठाउँदा" \\
  -font "${FONT_XBOLD}" -fill "#ffffff" -pointsize 50 -gravity north -annotate +0+170 "नेपाल राष्ट्र बैंक विनिमय दर" \\
  -font "${FONT_REG}" -fill "#86efac" -pointsize 26 -gravity north -annotate +0+235 "दैनिक १००%% आधिकारिक विदेशी मुद्राको भाउ" \\
  -fill "#022c22" -draw "roundrectangle 50,290 670,1020 24,24" \\
  -fill "#065f46" -draw "roundrectangle 70,320 650,420 16,16" \\
  -font "${FONT_BOLD}" -fill "#fef08a" -pointsize 32 -gravity north -annotate +0+340 "🇺🇸 USD (अमेरिकी डलर)" \\
  -font "${FONT_REG}" -fill "#ffffff" -pointsize 26 -gravity north -annotate +0+380 "खरिद: रु १३४.८०  |  बिक्री: रु १३५.४०" \\
  -fill "#065f46" -draw "roundrectangle 70,440 650,540 16,16" \\
  -font "${FONT_BOLD}" -fill "#fef08a" -pointsize 32 -gravity north -annotate +0+460 "🇦🇺 AUD (अस्ट्रेलियन डलर)" \\
  -font "${FONT_REG}" -fill "#ffffff" -pointsize 26 -gravity north -annotate +0+500 "खरिद: रु ८९.६०  |  बिक्री: रु ९०.००" \\
  -fill "#065f46" -draw "roundrectangle 70,560 650,660 16,16" \\
  -font "${FONT_BOLD}" -fill "#fef08a" -pointsize 32 -gravity north -annotate +0+580 "🇶🇦 QAR (कतारी रियाल) / 🇦🇪 AED" \\
  -font "${FONT_REG}" -fill "#ffffff" -pointsize 26 -gravity north -annotate +0+620 "खरिद: रु ३६.९०  |  बिक्री: रु ३७.१०" \\
  -fill "#065f46" -draw "roundrectangle 70,680 650,780 16,16" \\
  -font "${FONT_BOLD}" -fill "#fef08a" -pointsize 32 -gravity north -annotate +0+700 "🇨🇦 CAD (क्यानेडियन डलर)" \\
  -font "${FONT_REG}" -fill "#ffffff" -pointsize 26 -gravity north -annotate +0+740 "खरिद: रु ९८.२०  |  बिक्री: रु ९८.८०" \\
  -fill "#14532d" -draw "roundrectangle 70,810 650,990 18,18" \\
  -font "${FONT_BOLD}" -fill "#facc15" -pointsize 28 -gravity north -annotate +0+830 "⚡ स्मार्ट रेमिट्यान्स क्याल्कुलेटर" \\
  -font "${FONT_REG}" -fill "#ffffff" -pointsize 24 -gravity north -annotate +0+880 "१,००० डलर वा रियाल = नेपाली कति रुपैयाँ?" \\
  -font "${FONT_REG}" -fill "#86efac" -pointsize 24 -gravity north -annotate +0+925 "बैंकले काट्ने हिडन चार्ज बिना सिधै हिसाब गर्नुहोस्" \\
  -fill "#059669" -draw "roundrectangle 80,1070 640,1180 32,32" \\
  -font "${FONT_XBOLD}" -fill "#ffffff" -pointsize 40 -gravity north -annotate +0+1095 "👉 shubhapatro.com" \\
  -font "${FONT_REG}" -fill "#fef08a" -pointsize 22 -gravity north -annotate +0+1145 "दैनिक विदेशी मुद्रा भाउ हेर्नुहोस्" \\
  ${WORK_DIR}/scene3.png`);

console.log('Rendering Scene 4: Gold, Silver, Rashifal & Swapna Shastra...');
execSync(`convert -size 720x1280 gradient:"#78350f-#18181b" \\
  -fill "#fef3c7" -draw "roundrectangle 130,90 590,145 28,28" \\
  -font "${FONT_BOLD}" -fill "#78350f" -pointsize 26 -gravity north -annotate +0+102 "🪙 सुनचाँदी, राशिफल र सपना" \\
  -font "${FONT_XBOLD}" -fill "#ffffff" -pointsize 50 -gravity north -annotate +0+170 "दैनिक आवश्यक सबै सेवा" \\
  -font "${FONT_REG}" -fill "#fde68a" -pointsize 26 -gravity north -annotate +0+235 "एकै ठाउँमा, बिना कुनै शुल्क" \\
  -fill "#292524" -draw "roundrectangle 50,290 670,1020 24,24" \\
  -fill "#451a03" -draw "roundrectangle 70,320 650,470 16,16" \\
  -font "${FONT_BOLD}" -fill "#facc15" -pointsize 32 -gravity north -annotate +0+340 "🪙 आजको सुन चाँदीको भाउ" \\
  -font "${FONT_REG}" -fill "#fef08a" -pointsize 26 -gravity north -annotate +0+385 "छापावाल सुन: रु १,६०,५०० प्रति तोला" \\
  -font "${FONT_REG}" -fill "#e7e5e4" -pointsize 24 -gravity north -annotate +0+425 "चाँदी: रु १,९८० प्रति तोला (FENEGOSIDA)" \\
  -fill "#3b0764" -draw "roundrectangle 70,490 650,640 16,16" \\
  -font "${FONT_BOLD}" -fill "#e9d5ff" -pointsize 32 -gravity north -annotate +0+510 "🔮 दैनिक १२ राशिको राशिफल" \\
  -font "${FONT_REG}" -fill "#ffffff" -pointsize 25 -gravity north -annotate +0+555 "आजको दिन कस्तो रहला? शुभ रंग र शुभ अंक" \\
  -font "${FONT_REG}" -fill "#d8b4fe" -pointsize 23 -gravity north -annotate +0+595 "दैनिक बिहानै घरमै बसी राशिफल हेर्नुहोस्" \\
  -fill "#1e3a5f" -draw "roundrectangle 70,660 650,810 16,16" \\
  -font "${FONT_BOLD}" -fill "#bae6fd" -pointsize 32 -gravity north -annotate +0+680 "💭 स्वप्न शास्त्र (सपनाको फल)" \\
  -font "${FONT_REG}" -fill "#ffffff" -pointsize 25 -gravity north -annotate +0+725 "राति सपनामा सर्प, पानी वा पैसा देख्नुभयो?" \\
  -font "${FONT_REG}" -fill "#7dd3fc" -pointsize 23 -gravity north -annotate +0+765 "वैदिक शास्त्र अनुसार सपनाको शुभ-अशुभ फल" \\
  -fill "#064e3b" -draw "roundrectangle 70,830 650,980 16,16" \\
  -font "${FONT_BOLD}" -fill "#bbf7d0" -pointsize 32 -gravity north -annotate +0+850 "📿 १०८ डिजिटल जप माला र मन्त्र" \\
  -font "${FONT_REG}" -fill "#ffffff" -pointsize 25 -gravity north -annotate +0+895 "गायत्री, महामृत्युञ्जय र हनुमान चालिसा" \\
  -font "${FONT_REG}" -fill "#86efac" -pointsize 23 -gravity north -annotate +0+935 "मोबाइलमै रुद्राक्ष मालासहित ध्यान गर्नुहोस्" \\
  -fill "#d97706" -draw "roundrectangle 80,1070 640,1180 32,32" \\
  -font "${FONT_XBOLD}" -fill "#ffffff" -pointsize 40 -gravity north -annotate +0+1095 "👉 shubhapatro.com" \\
  -font "${FONT_REG}" -fill "#fef08a" -pointsize 22 -gravity north -annotate +0+1145 "अहिले नै खोल्नुहोस्" \\
  ${WORK_DIR}/scene4.png`);

console.log('Rendering Scene 5: Final CTA...');
execSync(`convert -size 720x1280 gradient:"#991b1b-#1e1b4b" \\
  -fill "#fef08a" -draw "roundrectangle 130,100 590,160 30,30" \\
  -font "${FONT_BOLD}" -fill "#78350f" -pointsize 28 -gravity north -annotate +0+115 "📱 कुनै एप डाउनलोड गर्नै पर्दैन" \\
  -font "${FONT_XBOLD}" -fill "#ffffff" -pointsize 56 -gravity north -annotate +0+190 "अहिले नै चलाउनुहोस्" \\
  -font "${FONT_BOLD}" -fill "#facc15" -pointsize 32 -gravity north -annotate +0+260 "शुभ पात्रो - SHUBHA PATRO" \\
  -fill "#18181b" -draw "roundrectangle 50,330 670,950 24,24" \\
  -font "${FONT_BOLD}" -fill "#ffffff" -pointsize 36 -gravity north -annotate +0+370 "कसरी चलाउने? सजिलो ३ उपाय:" \\
  -fill "#27272a" -draw "roundrectangle 80,430 640,560 18,18" \\
  -font "${FONT_BOLD}" -fill "#facc15" -pointsize 30 -gravity north -annotate +0+450 "१. मोबाइलको ब्राउजर खोल्नुहोस्" \\
  -font "${FONT_REG}" -fill "#e4e4e7" -pointsize 24 -gravity north -annotate +0+500 "Chrome वा Safari मा गएर shubhapatro.com टाइप गर्नुहोस्" \\
  -fill "#27272a" -draw "roundrectangle 80,590 640,720 18,18" \\
  -font "${FONT_BOLD}" -fill "#38bdf8" -pointsize 30 -gravity north -annotate +0+610 "२. 'Add to Home Screen' गर्नुहोस्" \\
  -font "${FONT_REG}" -fill "#e4e4e7" -pointsize 24 -gravity north -annotate +0+660 "Share मा थिचेर सिधै मोबाइल स्क्रिनमा राख्नुहोस्" \\
  -fill "#27272a" -draw "roundrectangle 80,750 640,880 18,18" \\
  -font "${FONT_BOLD}" -fill "#4ade80" -pointsize 30 -gravity north -annotate +0+770 "३. १००%% हलुका, छिटो र निःशुल्क" \\
  -font "${FONT_REG}" -fill "#e4e4e7" -pointsize 24 -gravity north -annotate +0+820 "कुनै स्टोरेज नखाई अफलाइनमा पनि चल्ने" \\
  -fill "#dc2626" -draw "roundrectangle 60,1000 660,1190 32,32" \\
  -font "${FONT_XBOLD}" -fill "#ffffff" -pointsize 46 -gravity north -annotate +0+1030 "🌐 shubhapatro.com" \\
  -font "${FONT_BOLD}" -fill "#fef08a" -pointsize 30 -gravity north -annotate +0+1095 "Google मा गएर खोज्नुहोस्!" \\
  -font "${FONT_REG}" -fill "#ffffff" -pointsize 22 -gravity north -annotate +0+1140 "आफ्नो साथी र परिवारसँग शेयर गर्नुहोस्" \\
  ${WORK_DIR}/scene5.png`);

console.log('All 5 scenes rendered successfully!');
