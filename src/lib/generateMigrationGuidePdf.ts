import { jsPDF } from "jspdf";

// Load image as base64
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

// Design system colors (matches Blue Ocean PDF)
const PRIMARY: [number, number, number] = [49, 46, 129];
const ACCENT: [number, number, number] = [79, 70, 229];
const TEXT_DARK: [number, number, number] = [29, 35, 44];
const TEXT_MUTED: [number, number, number] = [98, 107, 122];
const WHITE: [number, number, number] = [255, 255, 255];
const LIGHT_BG: [number, number, number] = [241, 243, 245];
const SUCCESS: [number, number, number] = [22, 163, 74];

const TRIAL_URL = "https://ledgerstash.com/signup";

export async function generateMigrationGuidePdf(competitor: "SmartVault" | "TaxDome" = "SmartVault"): Promise<void> {
  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  // Load shield logo
  const shieldBase64 = await loadImageAsBase64(
    `${window.location.origin}/images/ledgerstash-shield.png`
  );

  // ===== COVER / TITLE AREA =====
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pw, ph, "F");

  // Accent stripe
  doc.setFillColor(...ACCENT);
  doc.rect(0, ph * 0.62, pw, 4, "F");

  // Logo
  if (shieldBase64) {
    try {
      doc.setFillColor(...WHITE);
      doc.roundedRect(pw / 2 - 10, 28, 20, 20, 3, 3, "F");
      doc.addImage(shieldBase64, "PNG", pw / 2 - 8, 29, 16, 16);
    } catch {}
  }
  doc.setTextColor(...WHITE);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("LedgerStash", pw / 2, 60, { align: "center" });

  // Title
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text("60-Second Migration Guide", pw / 2, 85, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(`How to Move From ${competitor} to LedgerStash`, pw / 2, 100, {
    align: "center",
  });

  doc.setFontSize(11);
  doc.setTextColor(200, 200, 220);
  doc.text("4 steps. No downtime. No weekend sacrifice.", pw / 2, 115, {
    align: "center",
  });

  // ===== THE 4 STEPS =====
  let y = 140;

  const steps = [
    {
      num: "1",
      title: "The Export",
      body: `Log into ${competitor} and hit "Export All" to download your files as a local zip. This gives you a portable copy of everything — ready to move.`,
      time: "~2 minutes",
    },
    {
      num: "2",
      title: "The Branding",
      body: "Upload your firm's logo to LedgerStash. It takes about 10 seconds and instantly white-labels your entire client portal.",
      time: "~10 seconds",
    },
    {
      num: "3",
      title: "The Import",
      body: "Use our Bulk Folder Upload. Drag your client folders into LedgerStash. We automatically map the folder names to client accounts.",
      time: "~30 seconds",
    },
    {
      num: "4",
      title: "The Invite",
      body: 'Send a "Welcome" Magic Link to your clients. No passwords for them to reset, no onboarding for you to manage. They click and they\'re in.',
      time: "~20 seconds",
    },
  ];

  for (const step of steps) {
    // Step number circle
    doc.setFillColor(...ACCENT);
    doc.circle(32, y + 8, 8, "F");
    doc.setTextColor(...WHITE);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(step.num, 32, y + 12, { align: "center" });

    // Step content card background
    doc.setFillColor(70, 67, 150);
    doc.roundedRect(45, y - 2, pw - 65, 30, 3, 3, "F");

    // Title
    doc.setTextColor(...WHITE);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(step.title, 52, y + 7);

    // Time badge
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 255, 180);
    doc.text(step.time, pw - 25, y + 7, { align: "right" });

    // Body
    doc.setTextColor(210, 210, 230);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const bodyLines = doc.splitTextToSize(step.body, pw - 80);
    doc.text(bodyLines, 52, y + 15);

    y += 38;
  }

  // ===== BOTTOM CTA =====
  y = ph * 0.68;
  doc.setFillColor(...SUCCESS);
  doc.roundedRect(pw / 2 - 55, y, 110, 16, 3, 3, "F");
  doc.setTextColor(...WHITE);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Start Your 14-Day Free Trial", pw / 2, y + 11, { align: "center" });
  doc.link(pw / 2 - 55, y, 110, 16, { url: TRIAL_URL });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 220);
  doc.text("No credit card required. No user minimums.", pw / 2, y + 26, {
    align: "center",
  });

  // Savings callout
  const savingsText =
    competitor === "SmartVault"
      ? "Save $2,172+ per year vs. SmartVault"
      : "Save $452+ per year vs. TaxDome";
  doc.setFontSize(10);
  doc.setTextColor(...WHITE);
  doc.setFont("helvetica", "bold");
  doc.text(savingsText, pw / 2, y + 40, { align: "center" });

  // Footer
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(160, 160, 180);
  doc.text(
    "Ledger Stash — The Private Vault for Your Accounting Firm",
    pw / 2,
    ph - 12,
    { align: "center" }
  );

  // ===== DOWNLOAD =====
  const fileName = `LedgerStash_Migration_Guide_${competitor}.pdf`;
  const pdfBlob = doc.output("blob");
  const blobUrl = URL.createObjectURL(pdfBlob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}
