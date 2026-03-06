import { jsPDF } from "jspdf";

// Helper function to load image as base64
async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// Design system colors (from branding memory)
const PRIMARY: [number, number, number] = [49, 46, 129];     // hsl(243, 47%, 34%)
const ACCENT: [number, number, number] = [79, 70, 229];      // hsl(245, 58%, 52%)
const TEXT_DARK: [number, number, number] = [29, 35, 44];
const TEXT_MUTED: [number, number, number] = [98, 107, 122];
const WHITE: [number, number, number] = [255, 255, 255];
const LIGHT_BG: [number, number, number] = [241, 243, 245];
const SUCCESS: [number, number, number] = [22, 163, 74];
const DANGER: [number, number, number] = [220, 38, 38];

function addPageFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  doc.setDrawColor(200, 200, 200);
  doc.line(20, ph - 20, pw - 20, ph - 20);
  doc.setFontSize(8);
  doc.setTextColor(...TEXT_MUTED);
  doc.text("LedgerStash — The Private Vault for Your Boutique Accounting Firm", 20, ph - 12);
  doc.text(`${pageNum} / ${totalPages}`, pw - 20, ph - 12, { align: "right" });
}

export async function generateBlueOceanPdf(): Promise<void> {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const totalPages = 7;

  // Load shield logo
  const shieldBase64 = await loadImageAsBase64(`${window.location.origin}/images/ledgerstash-shield.png`);

  // Helper to draw the header logo block on colored pages
  function drawLogoHeader(doc: jsPDF, y: number, color: [number, number, number] = WHITE, inverted = false) {
    if (shieldBase64) {
      try {
        if (inverted) {
          // Draw a white rounded rect behind the shield to make it visible on dark backgrounds
          doc.setFillColor(...WHITE);
          doc.roundedRect(pw / 2 - 10, y, 20, 20, 3, 3, "F");
        }
        doc.addImage(shieldBase64, "PNG", pw / 2 - 8, y + 1, 16, 16);
      } catch {}
    }
    doc.setTextColor(...color);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("LedgerStash", pw / 2, y + 30, { align: "center" });
  }

  // ===== PAGE 1: Title Page =====
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pw, ph, "F");
  // Accent stripe
  doc.setFillColor(...ACCENT);
  doc.rect(0, ph * 0.65, pw, 4, "F");

  drawLogoHeader(doc, 35);

  doc.setTextColor(...WHITE);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  const title = "The Blue Ocean\nfor Solo CPAs";
  doc.text(title, pw / 2, 90, { align: "center", lineHeightFactor: 1.3 });

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  const subtitle = "Stop chasing tax docs over email. Give your clients a secure,\nwhite-labeled vault to exchange sensitive documents, track\nPBC lists, and build professional trust.";
  doc.text(subtitle, pw / 2, 130, { align: "center", lineHeightFactor: 1.5 });

  doc.setFillColor(...ACCENT);
  doc.roundedRect(pw / 2 - 50, ph * 0.7, 100, 14, 3, 3, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text("Start Your 14-Day Free Trial", pw / 2, ph * 0.7 + 9.5, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 220);
  doc.text("The Private Vault for Your Boutique Accounting Firm", pw / 2, ph - 30, { align: "center" });

  // ===== PAGE 2: The Problem =====
  doc.addPage();
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, pw, ph, "F");

  // Header bar
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pw, 40, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text('The "Built for Teams, Not Solos" Problem', pw / 2, 25, { align: "center" });

  let y = 60;
  doc.setTextColor(...TEXT_DARK);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const introText = "SmartVault and TaxDome are designed for firms with 10+ employees. Solo CPAs and boutique firms get stuck paying for bloated features they'll never use.";
  const introLines = doc.splitTextToSize(introText, pw - 50);
  doc.text(introLines, 25, y);
  y += introLines.length * 7 + 15;

  const problems = [
    {
      title: "Enterprise Bloat",
      desc: "Practice management, CRM, and invoicing features you don't need — but still pay for.",
    },
    {
      title: "Complex Onboarding",
      desc: "TaxDome requires 6–8 weeks of dedicated onboarding. SmartVault needs days of training. You need to start today.",
    },
    {
      title: "Hidden Minimums",
      desc: "SmartVault's Business Pro requires a 3-user minimum at $210/month. TaxDome charges $800/year per seat. You're a solo — why pay for ghost users?",
    },
    {
      title: "Client Friction",
      desc: "Both platforms force your clients to create accounts, remember passwords, and download apps. Your clients just want to send you their W-2.",
    },
  ];

  for (const p of problems) {
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(20, y, pw - 40, 32, 3, 3, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PRIMARY);
    doc.text(p.title, 28, y + 10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEXT_MUTED);
    const descLines = doc.splitTextToSize(p.desc, pw - 65);
    doc.text(descLines, 28, y + 18);
    y += 38;
  }

  addPageFooter(doc, 2, totalPages);

  // ===== PAGE 3: Comparison Table =====
  doc.addPage();
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, pw, ph, "F");

  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pw, 40, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("LedgerStash vs. The Competition", pw / 2, 25, { align: "center" });

  y = 55;
  const colW = (pw - 40) / 3;

  // Table header
  doc.setFillColor(...PRIMARY);
  doc.rect(20, y, pw - 40, 12, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("LedgerStash", 20 + colW * 0.5, y + 8, { align: "center" });
  doc.text("SmartVault", 20 + colW * 1.5, y + 8, { align: "center" });
  doc.text("TaxDome", 20 + colW * 2.5, y + 8, { align: "center" });
  y += 12;

  const compRows = [
    { label: "Solo CPA Price", ls: "$29/mo", sv: "$210/mo", td: "$800/yr per seat" },
    { label: "Annual Savings", ls: "$290/yr (save 16%)", sv: "$1,800/yr (3-user min)", td: "Annual only" },
    { label: "User Minimums", ls: "None — Unlimited Users", sv: "3-user minimum", td: "1 seat min (team-oriented)" },
    { label: "Client Login?", ls: "No — Frictionless", sv: "Yes — Account required", td: "Yes — App + account" },
    { label: "PBC Management", ls: "Accounting-Specific", sv: 'Generic "File Request"', td: 'Generic "File Request"' },
    { label: "White-Label", ls: "Full (All Plans)", sv: "Custom Portal (All Plans)", td: "Portal Branding Only" },
    { label: "Setup Time", ls: "Minutes", sv: "Days to Weeks", td: "6–8 Weeks" },
    { label: "Busy Season Auto", ls: "Auto-Pilot Reminders", sv: "Manual Requests", td: "Complex Setup Required" },
    { label: "Compliance", ls: "IRS 4557 · FTC · GLBA", sv: "SOC 2 · IRS 4557 · FTC", td: "General Security" },
  ];

  for (let r = 0; r < compRows.length; r++) {
    const row = compRows[r];
    const rowH = 14;
    if (r % 2 === 0) {
      doc.setFillColor(...LIGHT_BG);
      doc.rect(20, y, pw - 40, rowH, "F");
    }
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...TEXT_DARK);

    // LedgerStash column (green)
    doc.setTextColor(...SUCCESS);
    doc.text(row.ls, 20 + colW * 0.5, y + 5, { align: "center" });
    doc.setFontSize(6.5);
    doc.setTextColor(...TEXT_MUTED);
    doc.text(row.label, 20 + colW * 0.5, y + 10, { align: "center" });

    // SmartVault column
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEXT_MUTED);
    doc.text(row.sv, 20 + colW * 1.5, y + 5, { align: "center" });
    doc.setFontSize(6.5);
    doc.text(row.label, 20 + colW * 1.5, y + 10, { align: "center" });

    // TaxDome column
    doc.setFontSize(8);
    doc.text(row.td, 20 + colW * 2.5, y + 5, { align: "center" });
    doc.setFontSize(6.5);
    doc.text(row.label, 20 + colW * 2.5, y + 10, { align: "center" });

    y += rowH;
  }

  y += 10;
  doc.setFillColor(...SUCCESS);
  doc.roundedRect(pw / 2 - 45, y, 90, 18, 3, 3, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Save $2,172+ Per Year", pw / 2, y + 12, { align: "center" });

  addPageFooter(doc, 3, totalPages);

  // ===== PAGE 4: Frictionless Client Experience =====
  doc.addPage();
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, pw, ph, "F");

  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pw, 40, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Frictionless Client Experience", pw / 2, 25, { align: "center" });

  y = 60;
  const features4 = [
    {
      title: "No Passwords, No Accounts",
      desc: "Your clients receive a secure, tokenized link. One click and they're in — no signup, no app download, no password to forget.",
    },
    {
      title: "Your Brand, Not Ours",
      desc: "Full white-labeling on every plan. Your clients see your firm's logo and name — building trust in your brand, not ours.",
    },
    {
      title: "Mobile-First Design",
      desc: "Clients can acknowledge policies and upload documents from any device. No app required — just a modern browser.",
    },
    {
      title: "Unlimited Users Included",
      desc: "Add team members, staff, and collaborators without per-seat charges. Every plan includes unlimited users — pay for the plan, not the headcount.",
    },
  ];

  for (const f of features4) {
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(20, y, pw - 40, 35, 3, 3, "F");
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PRIMARY);
    doc.text(f.title, 28, y + 12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEXT_MUTED);
    const lines = doc.splitTextToSize(f.desc, pw - 65);
    doc.text(lines, 28, y + 21);
    y += 42;
  }

  addPageFooter(doc, 4, totalPages);

  // ===== PAGE 5: PBC List Management =====
  doc.addPage();
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, pw, ph, "F");

  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pw, 40, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("PBC List Management", pw / 2, 25, { align: "center" });

  y = 60;
  const features5 = [
    {
      title: "Accounting-Specific Language",
      desc: "Built by CPAs, for CPAs. No translating generic 'file request' tools into accounting terminology. Requirements, PBC lists, and compliance tracking speak your language.",
    },
    {
      title: "Automated Reminders",
      desc: "Auto-pilot reminders chase your clients so you don't have to. Set frequency, customize messaging, and let LedgerStash handle the follow-ups during busy season.",
    },
    {
      title: "Audit-Ready Export",
      desc: "Every signature, acknowledgment, and document exchange includes a full audit trail with timestamps, IP addresses, and user agent data — ready for IRS review.",
    },
  ];

  for (const f of features5) {
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(20, y, pw - 40, 40, 3, 3, "F");
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PRIMARY);
    doc.text(f.title, 28, y + 12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEXT_MUTED);
    const lines = doc.splitTextToSize(f.desc, pw - 65);
    doc.text(lines, 28, y + 22);
    y += 48;
  }

  addPageFooter(doc, 5, totalPages);

  // ===== PAGE 6: Security & Compliance =====
  doc.addPage();
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, pw, ph, "F");

  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pw, 40, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Security & Compliance", pw / 2, 25, { align: "center" });

  y = 60;
  doc.setTextColor(...TEXT_DARK);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const secIntro = "Fully compliant with IRS requirements for safeguarding taxpayer data. LedgerStash meets or exceeds every security standard your solo practice needs.";
  const secLines = doc.splitTextToSize(secIntro, pw - 50);
  doc.text(secLines, 25, y);
  y += secLines.length * 7 + 15;

  const secFeatures = [
    { title: "IRS Publication 4557", desc: "Full compliance with IRS guidelines for protecting taxpayer information." },
    { title: "FTC Safeguards Rule", desc: "Meets Federal Trade Commission requirements for financial data protection." },
    { title: "GLBA Compliance", desc: "Gramm-Leach-Bliley Act compliant for safeguarding consumer financial information." },
    { title: "Bank-Grade Encryption", desc: "AES-256 encryption at rest, TLS 1.3 in transit. Your clients' data is protected at every step." },
    { title: "Tokenized Signing Links", desc: "Every signing request uses a unique, time-limited token — no shared passwords, no reusable links." },
  ];

  for (const f of secFeatures) {
    doc.setFillColor(...LIGHT_BG);
    doc.roundedRect(20, y, pw - 40, 28, 3, 3, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...PRIMARY);
    doc.text(f.title, 28, y + 10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEXT_MUTED);
    doc.text(f.desc, 28, y + 20);
    y += 34;
  }

  addPageFooter(doc, 6, totalPages);

  // ===== PAGE 7: CTA / Closing =====
  doc.addPage();
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pw, ph, "F");

  drawLogoHeader(doc, 40);

  doc.setTextColor(...WHITE);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text("Your Winning Hand", pw / 2, 85, { align: "center" });

  // Three pillars
  const pillars = ["Simplicity", "Affordability", "Purpose-Built"];
  const pillarX = pw / 4;
  for (let i = 0; i < pillars.length; i++) {
    const x = pillarX * (i + 1);
    doc.setFillColor(...ACCENT);
    doc.roundedRect(x - 28, 100, 56, 28, 3, 3, "F");
    doc.setTextColor(...WHITE);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(pillars[i], x, 117, { align: "center" });
  }

  y = 150;
  doc.setTextColor(200, 200, 220);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const closingLines = [
    "✓  $29/month — No user minimums, unlimited users included",
    "✓  Set up in minutes, not weeks",
    "✓  Frictionless client experience — no logins required",
    "✓  Accounting-specific PBC management",
    "✓  IRS 4557, FTC Safeguards & GLBA compliant",
    "✓  Full white-labeling on every plan",
    "✓  Auto-pilot reminders during busy season",
  ];
  for (const line of closingLines) {
    doc.text(line, pw / 2, y, { align: "center" });
    y += 10;
  }

  y += 15;
  doc.setFillColor(...ACCENT);
  doc.roundedRect(pw / 2 - 55, y, 110, 16, 4, 4, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Start Your 14-Day Free Trial", pw / 2, y + 11, { align: "center" });

  y += 28;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 220);
  doc.text("Visit LedgerStash.com today", pw / 2, y, { align: "center" });

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 170);
  doc.text("No email required to download this guide. Free resource for solo CPAs.", pw / 2, ph - 20, { align: "center" });

  // Save
  doc.save("LedgerStash_The_Blue_Ocean_for_Solo_CPAs.pdf");
}
