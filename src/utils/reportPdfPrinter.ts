/**
 * Clean & Reliable PDF Document Generator for Vedic Kundali & 36 Gun Milan Reports
 * Uses browser print engine with dedicated high-resolution styling window
 * Creates a clean, formatted downloadable PDF file without external heavy binaries
 */

import { KundaliResult, GunMilanResult } from './kundaliEngine';
import { toNepaliDigits } from './nepaliCalendar';

export function printAndDownloadReport(
  type: 'kundali' | 'gunmilan',
  kundaliData?: KundaliResult,
  gunMilanData?: GunMilanResult,
  customerMeta?: { name?: string; phone?: string; transactionRef?: string }
): void {
  const isKundali = type === 'kundali' && !!kundaliData;
  const title = isKundali 
    ? `${kundaliData!.name} - वैदिक जन्म कुण्डली प्रतिवेदन` 
    : `${gunMilanData?.boyName || 'वर'} र ${gunMilanData?.girlName || 'कन्या'} - अष्टकूट ३६ गुण मिलान`;

  // Construct printable HTML document with clean styling
  const docHtml = `
<!DOCTYPE html>
<html lang="ne">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 14mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1c1917;
      background: #ffffff;
      margin: 0;
      padding: 0;
      font-size: 11pt;
      line-height: 1.45;
    }
    .header {
      border-bottom: 2px solid #b45309;
      padding-bottom: 12px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand {
      font-size: 18pt;
      font-weight: 900;
      color: #92400e;
      letter-spacing: -0.5px;
    }
    .subbrand {
      font-size: 9pt;
      color: #78716c;
      font-weight: 600;
    }
    .cert-badge {
      text-align: right;
      font-size: 9pt;
      color: #047857;
      font-weight: bold;
      background: #ecfdf5;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #a7f3d0;
    }
    .title-banner {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 16px;
    }
    .title-banner h1 {
      margin: 0;
      font-size: 15pt;
      color: #78350f;
    }
    .title-banner p {
      margin: 4px 0 0;
      font-size: 9.5pt;
      color: #92400e;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 14px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      gap: 10px;
      margin-bottom: 14px;
    }
    .card {
      border: 1px solid #e7e5e4;
      border-radius: 6px;
      padding: 8px 10px;
      background: #fafaf9;
    }
    .card-label {
      font-size: 8pt;
      color: #78716c;
      font-weight: bold;
      text-transform: uppercase;
    }
    .card-value {
      font-size: 11pt;
      font-weight: 800;
      color: #1c1917;
      margin-top: 2px;
    }
    .section-title {
      font-size: 11pt;
      font-weight: 800;
      color: #92400e;
      border-bottom: 1px solid #fde68a;
      padding-bottom: 4px;
      margin: 14px 0 8px 0;
      display: flex;
      justify-content: space-between;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
      margin-bottom: 14px;
    }
    th {
      background: #f5f5f4;
      border: 1px solid #d6d3d1;
      padding: 6px 8px;
      text-align: left;
      font-weight: 800;
    }
    td {
      border: 1px solid #e7e5e4;
      padding: 5px 8px;
    }
    .badge-good {
      color: #065f46;
      background: #d1fae5;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 8.5pt;
    }
    .badge-bad {
      color: #991b1b;
      background: #fee2e2;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 8.5pt;
    }
    .prediction-box {
      border-left: 3px solid #b45309;
      background: #fafaf9;
      padding: 8px 12px;
      margin-bottom: 10px;
      font-size: 9.5pt;
      border-radius: 0 6px 6px 0;
    }
    .footer {
      margin-top: 24px;
      border-top: 1px solid #d6d3d1;
      padding-top: 8px;
      font-size: 8pt;
      color: #78716c;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">शुभ पात्रो (Shubha Patro)</div>
      <div class="subbrand">वैदिक ज्योतिष, पञ्चाङ्ग तथा अष्टकूट गुण मिलान अनुसन्धान केन्द्र</div>
    </div>
    <div class="cert-badge">
      ✓ आधिकारिक वैदिक प्रतिवेदन (Verified Dossier)
    </div>
  </div>

  ${isKundali ? `
    <!-- KUNDALI REPORT CONTENT -->
    <div class="title-banner">
      <h1>${kundaliData!.name} को विस्तृत वैदिक जन्म कुण्डली</h1>
      <p>
        जन्म मिति: <strong>${kundaliData!.dobBsFormatted || kundaliData!.dob}</strong> (${kundaliData!.dobAd} AD) • 
        समय: <strong>${kundaliData!.tob}</strong> • स्थान: <strong>${kundaliData!.pob}</strong> (अक्षांश: ${kundaliData!.latitude}°, देशान्तर: ${kundaliData!.longitude}°)
      </p>
    </div>

    <!-- 4 CORE METRICS -->
    <div class="grid-4">
      <div class="card">
        <div class="card-label">लग्न (Ascendant)</div>
        <div class="card-value">${kundaliData!.lagnaNe}</div>
        <div style="font-size:8.5pt;color:#78716c;">स्वामी: ${kundaliData!.lagnaLordNe.split(' ')[0]}</div>
      </div>
      <div class="card">
        <div class="card-label">चन्द्र राशि (Moon Sign)</div>
        <div class="card-value">${kundaliData!.rashiNe}</div>
        <div style="font-size:8.5pt;color:#78716c;">स्वामी: ${kundaliData!.rashiLordNe.split(' ')[0]}</div>
      </div>
      <div class="card">
        <div class="card-label">जन्म नक्षत्र (Nakshatra)</div>
        <div class="card-value">${kundaliData!.nakshatraNe}</div>
        <div style="font-size:8.5pt;color:#78716c;">चरण ${toNepaliDigits(kundaliData!.charan)} • ${kundaliData!.ganNe} गण</div>
      </div>
      <div class="card">
        <div class="card-label">माङ्गलिक स्थिति</div>
        <div class="card-value" style="color:${kundaliData!.isManglik ? '#b91c1c' : '#047857'};">
          ${kundaliData!.isManglik ? 'माङ्गलिक (Manglik)' : 'अमाङ्गलिक (Safe)'}
        </div>
        <div style="font-size:8.5pt;color:#78716c;">नाडी: ${kundaliData!.nadiNe}</div>
      </div>
    </div>

    <!-- NAME ASTROLOGY -->
    <div class="section-title">
      <span>१. नाम तथा जन्म नक्षत्र तादात्म्यता (Name Astrological Alignment)</span>
      <span style="font-size:8.5pt;color:#78716c;">बोलचालको नाम: ${kundaliData!.name}</span>
    </div>
    <div class="card" style="margin-bottom:12px;">
      <p style="margin:0 0 6px 0;font-size:9.5pt;">
        <strong>बोलचालको नामको राशि:</strong> ${kundaliData!.namaRashiNe} (${kundaliData!.namaRashiEn}) • <strong>स्वामी:</strong> ${kundaliData!.namaLordNe} • 
        <strong>जन्म नक्षत्र अनुसार उत्तम नामाक्षर:</strong> '${kundaliData!.janmaNamaAkshar}'
      </p>
      <p style="margin:0;font-size:9pt;color:#44403c;font-style:italic;">
        ${kundaliData!.namaJanmaHarmonyNe}
      </p>
    </div>

    <!-- PLANETARY DEGREE TABLE -->
    <div class="section-title">
      <span>२. नवग्रह स्पष्ट स्थिति तथा भाव विवरण (Planetary Degrees)</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>ग्रह (Graha)</th>
          <th>राशि (Sign)</th>
          <th>अंश / स्पष्ट (Degree)</th>
          <th>भाव (House)</th>
          <th>अवस्था (Dignity)</th>
        </tr>
      </thead>
      <tbody>
        ${kundaliData!.planets.map(p => `
          <tr>
            <td><strong>${p.nameNe}</strong> (${p.symbol})</td>
            <td>${p.rashiNe}</td>
            <td>${p.degree}</td>
            <td>भाव ${p.house}</td>
            <td>${p.dignityNe || 'सामान्य'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- DASHA TIMELINE -->
    <div class="section-title">
      <span>३. वर्तमान विंशोत्तरी महादशा तथा १२० वर्षे कालचक्र</span>
      <span style="font-size:8.5pt;color:#b45309;">सक्रिय: ${kundaliData!.currentDasha.startDate} - ${kundaliData!.currentDasha.endDate}</span>
    </div>
    <div class="prediction-box">
      <strong>हालको दशा:</strong> ${kundaliData!.currentDasha.mahadasha} • <strong>अन्तर्दशा:</strong> ${kundaliData!.currentDasha.antardasha}<br/>
      <em>"${kundaliData!.currentDasha.predictionNe}"</em>
    </div>

    <!-- DETAILED LIFE PREDICTIONS -->
    <div class="section-title">
      <span>४. समग्र जीवन फलकथन (Tailored Life Predictions)</span>
    </div>
    <div class="prediction-box">
      <strong>कर्म तथा धन योग (Career & Wealth):</strong><br/>
      ${kundaliData!.careerPredictionNe}
    </div>
    <div class="prediction-box">
      <strong>दाम्पत्य तथा वैवाहिक जीवन (Marriage & Family):</strong><br/>
      ${kundaliData!.marriagePredictionNe}
    </div>
    <div class="prediction-box">
      <strong>आरोग्य तथा स्वास्थ्य योग (Health & Constitution):</strong><br/>
      ${kundaliData!.healthPredictionNe}
    </div>

    <!-- AUSPICIOUS FACTORS -->
    <div class="section-title">
      <span>५. शुभ तत्त्वहरू तथा नित्य वैदिक उपाय (Auspicious Factors & Upaya)</span>
    </div>
    <div class="grid-4">
      <div class="card"><div class="card-label">शुभ रत्न</div><div class="card-value" style="color:#047857;">${kundaliData!.luckyGem}</div></div>
      <div class="card"><div class="card-label">शुभ रङ्ग</div><div class="card-value">${kundaliData!.luckyColor}</div></div>
      <div class="card"><div class="card-label">शुभ अङ्क</div><div class="card-value">${toNepaliDigits(kundaliData!.luckyNumber)}</div></div>
      <div class="card"><div class="card-label">शुभ वार</div><div class="card-value">${kundaliData!.luckyDayNe}</div></div>
    </div>
    <div class="card">
      <p style="margin:0;font-size:9pt;">
        <strong>इष्टदेव:</strong> ${kundaliData!.luckyDeity} • <strong>शुभ दिशा:</strong> ${kundaliData!.luckyDirectionNe} • 
        <strong>दैनिक मन्त्र:</strong> <code style="font-weight:bold;color:#92400e;">${kundaliData!.vedicMantra}</code>
      </p>
    </div>
  ` : `
    <!-- GUN MILAN REPORT CONTENT -->
    <div class="title-banner">
      <h1>अष्टकूट ३६ गुण मिलान प्रतिवेदन (Horoscope Matchmaking)</h1>
      <p>
        वर: <strong>${gunMilanData!.boyName}</strong> (${gunMilanData!.boyRashi} / ${gunMilanData!.boyNakshatra}) • 
        कन्या: <strong>${gunMilanData!.girlName}</strong> (${gunMilanData!.girlRashi} / ${gunMilanData!.girlNakshatra})
      </p>
    </div>

    <div class="grid-2">
      <div class="card" style="background:#fff1f2;border-color:#fecdd3;">
        <div class="card-label">कुल प्राप्ताङ्क (Score)</div>
        <div class="card-value" style="font-size:22pt;color:#e11d48;">
          ${toNepaliDigits(gunMilanData!.totalScore)} / ३६
          <span style="font-size:11pt;color:#4c0519;font-weight:normal;">(${Math.round((gunMilanData!.totalScore / 36) * 100)}%)</span>
        </div>
      </div>
      <div class="card" style="background:#f0fdf4;border-color:#bbf7d0;">
        <div class="card-label">विवाह निर्णय निष्कर्ष</div>
        <div class="card-value" style="font-size:12pt;color:#15803d;margin-top:4px;">
          ${gunMilanData!.verdictNe}
        </div>
      </div>
    </div>

    ${gunMilanData!.manglikMatchNe ? `
      <div class="card" style="border-left:4px solid ${gunMilanData!.hasManglikDoshaConflict ? '#e11d48' : '#059669'};margin-bottom:12px;">
        <div class="card-label">माङ्गलिक तुलना तथा सामञ्जस्य (Manglik Match)</div>
        <p style="margin:4px 0 0;font-size:10pt;font-weight:600;color:#1c1917;">
          ${gunMilanData!.manglikMatchNe}
        </p>
      </div>
    ` : ''}

    <!-- 8 KOOTAS TABLE -->
    <div class="section-title">
      <span>अष्टकूट गुण मिलान अंक तालिका (Ashtakoot Scorecard)</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>कूट (Koota)</th>
          <th>अधिकतम</th>
          <th>प्राप्त अंक</th>
          <th>वर / कन्या</th>
          <th>विश्लेषण</th>
        </tr>
      </thead>
      <tbody>
        ${gunMilanData!.kootas.map(k => `
          <tr>
            <td><strong>${k.nameNe}</strong></td>
            <td>${k.maxPoints}</td>
            <td style="font-weight:bold;color:${k.obtainedPoints === k.maxPoints ? '#059669' : k.obtainedPoints === 0 ? '#dc2626' : '#d97706'}">
              ${k.obtainedPoints}
            </td>
            <td>${k.boyValue} / ${k.girlValue}</td>
            <td style="font-size:8.5pt;">${k.analysisNe}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="section-title">
      <span>ज्योतिषीय परामर्श तथा उपाय (Recommendations & Remedies)</span>
    </div>
    <div class="prediction-box">
      <strong>परामर्श:</strong> ${gunMilanData!.recommendationNe}
    </div>
    <div class="prediction-box" style="border-color:#059669;">
      <strong>शान्ति उपाय:</strong>
      <ul style="margin:4px 0 0 16px;padding:0;">
        ${gunMilanData!.remediesNe.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>
  `}

  <div class="footer">
    <div>
      शुभ पात्रो वैदिक अनुसन्धान केन्द्र • ग्राहक: ${customerMeta?.name || 'Devotee'} 
      ${customerMeta?.transactionRef ? `• रसिद नं: ${customerMeta.transactionRef}` : ''}
    </div>
    <div>
      मिति: ${new Date().toLocaleDateString('en-GB')} • www.shubhapatro.com
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 400);
    };
  </script>
</body>
</html>
  `;

  // Open clean isolated window for native print / save as PDF
  const printWindow = window.open('', '_blank', 'width=850,height=950');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(docHtml);
    printWindow.document.close();
  } else {
    // If popup blocked, fallback to standard window.print()
    window.print();
  }
}
