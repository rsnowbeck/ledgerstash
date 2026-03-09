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

const TRIAL_URL = "https://ledgerstash.com/signup";

function addPageFooter(doc: jsPDF, pageNum: number, totalPages: number) {
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  doc.setDrawColor(200, 200, 200);
  doc.line(20, ph - 20, pw - 20, ph - 20);
  doc.setFontSize(8);
  doc.setTextColor(...TEXT_MUTED);
  doc.text("Ledger Stash — The Private Vault for Your Accounting Firm", 20, ph - 12);
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
  doc.setFillColor(...ACCENT);
  doc.rect(0, ph * 0.65, pw, 4, "F");

  drawLogoHeader(doc, 30, WHITE, true);

  doc.setTextColor(...WHITE);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  const title = "The Success Tax Report:\nWhy Boutique Firms Are Overpaying\nfor Enterprise Bloat";
  doc.text(title, pw / 2, 95, { align: "center", lineHeightFactor: 1.3 });

  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  const subtitle = "Stop chasing tax docs over email. Give your clients a secure,\nwhite-labeled vault to exchange sensitive documents, track\nPBC lists, and build professional trust.";
  doc.text(subtitle, pw / 2, 135, { align: "center", lineHeightFactor: 1.5 });

  // CTA button with clickable link
  const ctaBtnY1 = ph * 0.7;
  doc.setFillColor(...ACCENT);
  doc.roundedRect(pw / 2 - 50, ctaBtnY1, 100, 14, 3, 3, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...WHITE);
  doc.text("Start Your 14-Day Free Trial", pw / 2, ctaBtnY1 + 9.5, { align: "center" });
  doc.link(pw / 2 - 50, ctaBtnY1, 100, 14, { url: TRIAL_URL });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 220);
  doc.text("The Private Vault for Your Accounting Firm", pw / 2, ph - 30, { align: "center" });

  // ===== PAGE 2: The Problem =====
  doc.addPage();
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, pw, ph, "F");

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
  const introText = "SmartVault and TaxDome are designed for firms with 10+ employees. Solo practitioners and boutique firms get stuck paying for bloated features they'll never use.";
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

  // ===== PAGE 3: Comparison Table (matches website exactly) =====
  doc.addPage();
  doc.setFillColor(...WHITE);
  doc.rect(0, 0, pw, ph, "F");

  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pw, 40, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("Ledger Stash vs. The Competition", pw / 2, 25, { align: "center" });

  y = 55;
  const margin = 15;
  const tableW = pw - margin * 2;
  const featureColW = tableW * 0.22;
  const dataColW = (tableW - featureColW) / 3;

  // Table header row
  const headerH = 14;
  doc.setFillColor(...PRIMARY);
  doc.rect(margin, y, tableW, headerH, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Feature", margin + 4, y + 9);
  doc.text("Ledger Stash", margin + featureColW + dataColW * 0.5, y + 9, { align: "center" });
  doc.text("SmartVault", margin + featureColW + dataColW * 1.5, y + 9, { align: "center" });
  doc.text("TaxDome", margin + featureColW + dataColW * 2.5, y + 9, { align: "center" });
  y += headerH;

  // Comparison rows — identical to website Comparison.tsx
  const compRows = [
    {
      feature: "Solo Firm Pricing",
      ls: "$29/month",
      lsSub: "Unlimited team members included",
      lsSub2: "",
      sv: "$210/month",
      svSub: "$1,800/year — 3-user minimum",
      svSub2: "",
      td: "$800/year per seat",
      tdSub: "Annual contract only",
      tdSub2: "",
    },
    {
      feature: "User Minimums",
      ls: "None — start as a solo",
      sv: "3-user minimum",
      td: "1-seat minimum",
    },
    {
      feature: "Maximum Staff Seats",
      ls: "Unlimited (Included)",
      sv: "Per-user pricing",
      td: "Per-user pricing",
    },
    {
      feature: "Client Login Required?",
      ls: "No — one-click magic link",
      sv: "Yes",
      td: "Yes",
    },
    {
      feature: "PBC List Terminology",
      ls: "Built for accountants (W-2s, K-1s, PBC)",
      sv: 'Generic "file requests"',
      td: 'Generic "file requests"',
    },
    {
      feature: "White-Label Branding",
      ls: "Logo + name on all plans",
      sv: "Custom portal",
      td: "Portal branding only",
    },
    {
      feature: "Time to First Client",
      ls: "Under 5 minutes",
      sv: "Days to weeks",
      td: "6–8 weeks",
    },
    {
      feature: "Compliance",
      ls: "IRS 4557 · FTC Safeguards · GLBA",
      sv: "SOC 2 · IRS 4557",
      td: "General Security",
    },
    {
      feature: "Audit Trail",
      ls: "ESIGN/UETA (IP, Timestamp, Browser)",
      sv: "Basic audit trail",
      td: "Built-in eSign logs",
    },
  ];

  for (let r = 0; r < compRows.length; r++) {
    const row = compRows[r];

    // Calculate row height based on content wrapping
    const colContentW = dataColW - 8;
    const featureLines = doc.splitTextToSize(row.feature, featureColW - 8);
    const lsLines = doc.splitTextToSize(row.ls, colContentW);
    const svLines = doc.splitTextToSize(row.sv, colContentW);
    const tdLines = doc.splitTextToSize(row.td, colContentW);

    let subLinesCount = 0;
    if (row.lsSub) subLinesCount = Math.max(subLinesCount, 1);
    if (row.lsSub2) subLinesCount = Math.max(subLinesCount, 2);
    if ((row as any).svSub) subLinesCount = Math.max(subLinesCount, 1);
    if ((row as any).svSub2) subLinesCount = Math.max(subLinesCount, 2);
    if ((row as any).tdSub) subLinesCount = Math.max(subLinesCount, 1);
    if ((row as any).tdSub2) subLinesCount = Math.max(subLinesCount, 2);

    const mainMaxLines = Math.max(featureLines.length, lsLines.length, svLines.length, tdLines.length);
    const rowH = Math.max(14, mainMaxLines * 4.5 + subLinesCount * 4 + 8);

    // Alternating row background
    if (r % 2 === 0) {
      doc.setFillColor(...LIGHT_BG);
      doc.rect(margin, y, tableW, rowH, "F");
    }

    // Draw column dividers
    doc.setDrawColor(220, 220, 220);
    doc.line(margin + featureColW, y, margin + featureColW, y + rowH);
    doc.line(margin + featureColW + dataColW, y, margin + featureColW + dataColW, y + rowH);
    doc.line(margin + featureColW + dataColW * 2, y, margin + featureColW + dataColW * 2, y + rowH);

    const textY = y + 6;

    // Feature label
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...TEXT_DARK);
    doc.text(featureLines, margin + 4, textY);

    // Ledger Stash column (green/success)
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...SUCCESS);
    doc.text(lsLines, margin + featureColW + 4, textY);
    let lsSubY = textY + lsLines.length * 4;
    if (row.lsSub) {
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...TEXT_MUTED);
      doc.text(row.lsSub, margin + featureColW + 4, lsSubY + 1);
      lsSubY += 4;
    }
    if (row.lsSub2) {
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...SUCCESS);
      doc.text(row.lsSub2, margin + featureColW + 4, lsSubY + 1);
    }

    // SmartVault column
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEXT_MUTED);
    doc.text(svLines, margin + featureColW + dataColW + 4, textY);
    let svSubY = textY + svLines.length * 4;
    if ((row as any).svSub) {
      doc.setFontSize(6);
      doc.text((row as any).svSub, margin + featureColW + dataColW + 4, svSubY + 1);
      svSubY += 4;
    }
    if ((row as any).svSub2) {
      doc.setFontSize(6);
      doc.setTextColor(220, 38, 38);
      doc.text((row as any).svSub2, margin + featureColW + dataColW + 4, svSubY + 1);
    }

    // TaxDome column
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...TEXT_MUTED);
    doc.text(tdLines, margin + featureColW + dataColW * 2 + 4, textY);
    let tdSubY = textY + tdLines.length * 4;
    if ((row as any).tdSub) {
      doc.setFontSize(6);
      doc.text((row as any).tdSub, margin + featureColW + dataColW * 2 + 4, tdSubY + 1);
      tdSubY += 4;
    }
    if ((row as any).tdSub2) {
      doc.setFontSize(6);
      doc.setTextColor(220, 38, 38);
      doc.text((row as any).tdSub2, margin + featureColW + dataColW * 2 + 4, tdSubY + 1);
    }

    // Bottom row border
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y + rowH, margin + tableW, y + rowH);

    y += rowH;
  }

  // Savings callout
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
      desc: "No translating generic 'file request' tools into accounting terminology. Requirements, PBC lists, and compliance tracking speak your language.",
    },
    {
      title: "Automated Reminders",
      desc: "Auto-pilot reminders chase your clients so you don't have to. Set frequency, customize messaging, and let Ledger Stash handle the follow-ups during busy season.",
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
  const secIntro = "Fully compliant with IRS requirements for safeguarding taxpayer data. Ledger Stash meets or exceeds every security standard your solo firm needs.";
  const secLines = doc.splitTextToSize(secIntro, pw - 50);
  doc.text(secLines, 25, y);
  y += secLines.length * 7 + 15;

  const secFeatures = [
    { title: "IRS Publication 4557", desc: "Full compliance with IRS guidelines for protecting taxpayer information." },
    { title: "FTC Safeguards Rule", desc: "Meets Federal Trade Commission requirements for financial data protection." },
    { title: "GLBA Compliance", desc: "Gramm-Leach-Bliley Act compliant for safeguarding consumer financial information." },
    { title: "Bank-Grade Encryption", desc: "AES-256 encryption at rest, TLS 1.3 in transit. Your clients' data is protected at every step." },
    { title: "Audit-Ready Tracking", desc: "Every signature includes IP address, user agent, and timestamp — providing a forensic-grade audit trail for all tax professionals." },
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

  drawLogoHeader(doc, 35, WHITE, true);

  doc.setTextColor(...WHITE);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text("Your Winning Hand", pw / 2, 95, { align: "center" });

  // Three pillars
  const pillars = ["Simplicity", "Affordability", "Purpose-Built"];
  const pillarX = pw / 4;
  for (let i = 0; i < pillars.length; i++) {
    const x = pillarX * (i + 1);
    doc.setFillColor(...ACCENT);
    doc.roundedRect(x - 30, 110, 60, 26, 3, 3, "F");
    doc.setTextColor(...WHITE);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(pillars[i], x, 126, { align: "center" });
  }

  y = 155;
  doc.setTextColor(200, 200, 220);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const closingLines = [
    "$29/month — No user minimums",
    "Unlimited users included on every plan",
    "Set up in minutes, not weeks",
    "Frictionless client experience — no logins",
    "Accounting-specific PBC management",
    "IRS 4557, FTC Safeguards & GLBA compliant",
    "Full white-labeling on every plan",
    "Auto-pilot reminders during busy season",
  ];
  const maxTextW = pw - 60;
  for (const line of closingLines) {
    const bulletX = 40;
    doc.setTextColor(...SUCCESS);
    doc.text("\u2713", bulletX, y);
    doc.setTextColor(200, 200, 220);
    const wrapped = doc.splitTextToSize(line, maxTextW);
    doc.text(wrapped, bulletX + 10, y);
    y += wrapped.length * 7 + 5;
  }

  // CTA button with clickable link
  y += 15;
  const ctaBtnW = 120;
  const ctaBtnH = 18;
  const ctaBtnX = pw / 2 - ctaBtnW / 2;
  doc.setFillColor(...ACCENT);
  doc.roundedRect(ctaBtnX, y, ctaBtnW, ctaBtnH, 4, 4, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Start Your 14-Day Free Trial", pw / 2, y + 12, { align: "center" });
  doc.link(ctaBtnX, y, ctaBtnW, ctaBtnH, { url: TRIAL_URL });

  y += 30;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 220);
  doc.text("ledgerstash.com", pw / 2, y, { align: "center" });
  doc.link(pw / 2 - 25, y - 5, 50, 10, { url: "https://ledgerstash.com" });

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 170);
  doc.text("No email required to download this guide. Free resource for solo firms and practitioners.", pw / 2, ph - 25, { align: "center" });

  // Save
  doc.save("LedgerStash_Comparison.pdf");
}
