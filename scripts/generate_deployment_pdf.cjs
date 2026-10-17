const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

function buildPdf() {
  const outputPath = path.join(__dirname, '../public/shubhapatro-deployment-guide.pdf');
  const doc = new PDFDocument({
    margin: 40,
    size: 'A4',
    info: {
      Title: 'Shubha Patro - Google Cloud Run Deployment & Update Guide',
      Author: 'Shubha Patro Engineering',
      Subject: 'Cloud Run & Custom Domain Guide for shubhapatro.com',
    }
  });

  const writeStream = fs.createWriteStream(outputPath);
  doc.pipe(writeStream);

  const primaryColor = '#881337'; // Rose 900
  const secondaryColor = '#0f172a'; // Slate 900
  const mutedColor = '#475569'; // Slate 600
  const boxBg = '#f8fafc'; // Slate 50
  const codeBg = '#1e293b'; // Slate 800

  // Header Banner
  doc.rect(40, 40, 515, 60).fill(primaryColor);
  doc.fillColor('#ffffff').fontSize(20).font('Helvetica-Bold').text('SHUBHA PATRO (शुभ पात्रो)', 55, 52);
  doc.fontSize(11).font('Helvetica').text('Official Google Cloud Run Deployment & Update Manual (shubhapatro.com)', 55, 77);

  doc.moveDown(2.5);
  doc.fillColor(secondaryColor);

  // Section 1
  doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('1. Overview & Setup Architecture');
  doc.moveDown(0.3);
  doc.fontSize(10).font('Helvetica').fillColor(secondaryColor)
    .text('Your application is built with React, Vite, and an Express backend, packaged inside Docker, and hosted on Google Cloud Run. Your custom domain shubhapatro.com is connected via Cloudflare DNS pointing directly to Google Cloud Anycast IPs.')
    .moveDown(0.4);

  // Architecture summary bullets
  const archPoints = [
    '• Google Cloud Project: hamropatro-app-live',
    '• Cloud Run Service Name: shubhapatro',
    '• Primary Region: asia-east1 (Taiwan / East Asia)',
    '• Live Production Domain: https://shubhapatro.com & https://www.shubhapatro.com',
    '• Container Port: 8080 (Cloud Run HTTP proxy)'
  ];
  archPoints.forEach(p => doc.font('Helvetica-Bold').fontSize(9.5).fillColor(mutedColor).text(p));

  doc.moveDown(1);

  // Section 2
  doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('2. Standard Update Workflow (Step-by-Step)');
  doc.moveDown(0.3);
  doc.fontSize(10).font('Helvetica').fillColor(secondaryColor)
    .text('Whenever you make edits to your code and want to deploy the changes to your live site, follow these 3 simple steps:');
  doc.moveDown(0.5);

  // Step A
  doc.fontSize(11).font('Helvetica-Bold').fillColor(primaryColor).text('Step A: Push Your Updates to GitHub');
  doc.fontSize(9.5).font('Helvetica').fillColor(secondaryColor)
    .text('On your local computer or AI Studio workspace, commit and push your changes to your repository:');
  doc.moveDown(0.3);

  // Code block helper
  function drawCodeBlock(codeText, height = 40) {
    const y = doc.y;
    doc.rect(40, y, 515, height).fill(codeBg);
    doc.fillColor('#38bdf8').font('Courier-Bold').fontSize(9).text(codeText, 50, y + 8, { width: 495 });
    doc.y = y + height + 10;
    doc.fillColor(secondaryColor);
  }

  drawCodeBlock('git add .\ngit commit -m "Update features and content"\ngit push origin main', 42);

  // Step B
  doc.fontSize(11).font('Helvetica-Bold').fillColor(primaryColor).text('Step B: Open Google Cloud Shell & Pull Latest Code');
  doc.fontSize(9.5).font('Helvetica').fillColor(secondaryColor)
    .text('Go to shell.cloud.google.com in your web browser. In the Cloud Shell terminal, navigate into your folder and pull the latest code:');
  doc.moveDown(0.3);

  drawCodeBlock('cd ~/shubhapatro\ngit pull origin main', 30);

  // Step C
  doc.fontSize(11).font('Helvetica-Bold').fillColor(primaryColor).text('Step C: Deploy to Google Cloud Run (Single Command)');
  doc.fontSize(9.5).font('Helvetica').fillColor(secondaryColor)
    .text('Run this exact command to build the updated container and deploy it live with zero downtime:');
  doc.moveDown(0.3);

  drawCodeBlock(
    'gcloud run deploy shubhapatro \\\n' +
    '  --source . \\\n' +
    '  --project hamropatro-app-live \\\n' +
    '  --region asia-east1 \\\n' +
    '  --platform managed \\\n' +
    '  --allow-unauthenticated \\\n' +
    '  --port 8080 \\\n' +
    '  --memory 512Mi \\\n' +
    '  --cpu 1',
    85
  );

  doc.fontSize(9.5).font('Helvetica-Oblique').fillColor(mutedColor)
    .text('Cloud Build will build the new Docker image and update the Cloud Run revision automatically. Your live traffic seamlessly shifts to the new revision once healthy.')
    .moveDown(1);

  // Page 2
  doc.addPage();

  // Header Banner Page 2
  doc.rect(40, 40, 515, 36).fill(primaryColor);
  doc.fillColor('#ffffff').fontSize(14).font('Helvetica-Bold').text('SHUBHA PATRO — Deployment & Maintenance Guide', 55, 52);
  doc.moveDown(2);
  doc.fillColor(secondaryColor);

  // Section 3: Shortcut Script
  doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('3. Quick One-Click Deploy Script');
  doc.moveDown(0.3);
  doc.fontSize(10).font('Helvetica').fillColor(secondaryColor)
    .text('Inside your ~/shubhapatro directory in Cloud Shell, you also have the deploy-gcloud.sh script. You can simply run:')
    .moveDown(0.3);

  drawCodeBlock('./deploy-gcloud.sh', 22);

  // Section 4: Cloudflare & DNS Reference
  doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('4. Cloudflare DNS Configuration Reference');
  doc.moveDown(0.3);
  doc.fontSize(10).font('Helvetica').fillColor(secondaryColor)
    .text('Your DNS records in Cloudflare should stay configured as follows (Proxy status MUST remain "DNS only" / Gray Cloud for Google managed certificates):')
    .moveDown(0.4);

  const dnsLines = [
    '• A Record:      @  ->  216.239.32.21  (DNS only / Gray cloud)',
    '• A Record:      @  ->  216.239.34.21  (DNS only / Gray cloud)',
    '• A Record:      @  ->  216.239.36.21  (DNS only / Gray cloud)',
    '• A Record:      @  ->  216.239.38.21  (DNS only / Gray cloud)',
    '• CNAME Record:  www -> ghs.googlehosted.com  (DNS only / Gray cloud)'
  ];
  dnsLines.forEach(l => doc.font('Courier-Bold').fontSize(9).fillColor('#1e293b').text(l));

  doc.moveDown(1);

  // Section 5: Troubleshooting & Helpful Commands
  doc.fontSize(14).font('Helvetica-Bold').fillColor(primaryColor).text('5. Troubleshooting & Useful Commands');
  doc.moveDown(0.3);

  doc.fontSize(10).font('Helvetica-Bold').fillColor(secondaryColor).text('A. Check Live Server Logs');
  doc.fontSize(9.5).font('Helvetica').text('To monitor live traffic, errors, or verify Forex/Bullion API requests:');
  doc.moveDown(0.2);
  drawCodeBlock('gcloud run services logs read shubhapatro --region asia-east1 --project hamropatro-app-live --limit 50', 25);

  doc.fontSize(10).font('Helvetica-Bold').fillColor(secondaryColor).text('B. Check Custom Domain Certificate Status');
  doc.fontSize(9.5).font('Helvetica').text('Verify the SSL certificate issuance status on Google Cloud:');
  doc.moveDown(0.2);
  drawCodeBlock('gcloud beta run domain-mappings describe --domain shubhapatro.com --region asia-east1 --project hamropatro-app-live', 25);

  doc.fontSize(10).font('Helvetica-Bold').fillColor(secondaryColor).text('C. If "npm ci" Error Occurs in Docker');
  doc.fontSize(9.5).font('Helvetica').text('The Dockerfile is configured with "npm install" to prevent package-lock mismatches. If ever needed, verify your Dockerfile contains:');
  doc.moveDown(0.2);
  drawCodeBlock('RUN npm install\nRUN npm run build', 25);

  doc.moveDown(0.8);
  doc.rect(40, doc.y, 515, 30).fill('#f1f5f9');
  doc.fillColor(primaryColor).font('Helvetica-Bold').fontSize(9).text('✓ Keep this document for future reference. Live site: https://shubhapatro.com', 55, doc.y + 10);

  doc.end();

  writeStream.on('finish', () => {
    console.log('PDF generated successfully at:', outputPath);
  });
}

buildPdf();
