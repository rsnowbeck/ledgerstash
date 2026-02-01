import { jsPDF } from "jspdf";
import { format } from "date-fns";

interface SignatureData {
  recipientName: string;
  recipientEmail: string;
  requirementTitle: string;
  signedName: string;
  sentAt: string | null;
  completedAt: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  signingRequestId: string;
  organizationName?: string;
  organizationLogoUrl?: string | null;
}

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

export async function generateSignaturePdf(data: SignatureData): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // ===== Attestly Design System Colors (converted from HSL to RGB) =====
  // Primary - Deep Slate Navy: HSL(215, 50%, 23%) → #1D2F49
  const primaryColor: [number, number, number] = [29, 47, 73];
  // Accent - Teal: HSL(173, 58%, 39%) → #2A9D8F
  const accentColor: [number, number, number] = [42, 157, 143];
  // Foreground text: HSL(215, 25%, 15%) → #1D232C
  const textColor: [number, number, number] = [29, 35, 44];
  // Muted foreground: HSL(215, 15%, 45%) → #626B7A
  const mutedColor: [number, number, number] = [98, 107, 122];
  // Light section background (similar to --muted)
  const sectionBgColor: [number, number, number] = [241, 243, 245];

  // Header with organization branding - Deep Slate Navy background
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 50, "F");
  
  // Add teal accent stripe
  doc.setFillColor(...accentColor);
  doc.rect(0, 50, pageWidth, 3, "F");

  let headerTextY = 20;

  // Try to add organization logo
  if (data.organizationLogoUrl) {
    const logoBase64 = await loadImageAsBase64(data.organizationLogoUrl);
    if (logoBase64) {
      try {
        doc.addImage(logoBase64, "PNG", 15, 10, 30, 30);
        headerTextY = 25;
      } catch (e) {
        console.error("Failed to add logo to PDF:", e);
      }
    }
  }

  // Organization name or Attestly
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const orgDisplayName = data.organizationName || "Attestly";
  doc.text(orgDisplayName, pageWidth / 2, headerTextY - 5, { align: "center" });
  
  // Certificate title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Certificate of Acknowledgment", pageWidth / 2, headerTextY + 10, { align: "center" });

  // Document ID
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(200, 200, 200);
  doc.text(`Document ID: ${data.signingRequestId}`, pageWidth / 2, headerTextY + 20, { align: "center" });

  // Main content area
  let yPos = 70;

  // Requirement title
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Requirement:", 20, yPos);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text(data.requirementTitle, 20, yPos + 8);
  
  yPos += 30;

  // Divider
  doc.setDrawColor(229, 231, 235);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 15;

  // Signer Information Section - uses the light section background
  doc.setFillColor(...sectionBgColor);
  doc.roundedRect(20, yPos, pageWidth - 40, 50, 3, 3, "F");
  
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Signer Information", 30, yPos + 12);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...mutedColor);
  
  doc.text("Name:", 30, yPos + 25);
  doc.setTextColor(...textColor);
  doc.text(data.recipientName, 70, yPos + 25);
  
  doc.setTextColor(...mutedColor);
  doc.text("Email:", 30, yPos + 35);
  doc.setTextColor(...textColor);
  doc.text(data.recipientEmail, 70, yPos + 35);
  
  doc.setTextColor(...mutedColor);
  doc.text("Signed As:", 30, yPos + 45);
  doc.setTextColor(...textColor);
  doc.text(data.signedName, 70, yPos + 45);

  yPos += 65;

  // Signature Details Section
  doc.setFillColor(...sectionBgColor);
  doc.roundedRect(20, yPos, pageWidth - 40, 40, 3, 3, "F");
  
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Signature Details", 30, yPos + 12);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  const sentDate = data.sentAt 
    ? format(new Date(data.sentAt), "MMMM d, yyyy 'at' h:mm a") 
    : "—";
  const completedDate = data.completedAt 
    ? format(new Date(data.completedAt), "MMMM d, yyyy 'at' h:mm a") 
    : "—";
  
  doc.setTextColor(...mutedColor);
  doc.text("Sent:", 30, yPos + 25);
  doc.setTextColor(...textColor);
  doc.text(sentDate, 70, yPos + 25);
  
  doc.setTextColor(...mutedColor);
  doc.text("Signed:", 30, yPos + 35);
  doc.setTextColor(...textColor);
  doc.text(completedDate, 70, yPos + 35);

  yPos += 55;

  // Audit Trail Section
  doc.setFillColor(...sectionBgColor);
  doc.roundedRect(20, yPos, pageWidth - 40, 40, 3, 3, "F");
  
  doc.setTextColor(...textColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Audit Trail", 30, yPos + 12);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  
  doc.setTextColor(...mutedColor);
  doc.text("IP Address:", 30, yPos + 25);
  doc.setTextColor(...textColor);
  doc.text(data.ipAddress || "Not recorded", 80, yPos + 25);
  
  doc.setTextColor(...mutedColor);
  doc.text("User Agent:", 30, yPos + 35);
  doc.setTextColor(...textColor);
  const userAgentDisplay = data.userAgent 
    ? (data.userAgent.length > 60 ? data.userAgent.substring(0, 60) + "..." : data.userAgent)
    : "Not recorded";
  doc.text(userAgentDisplay, 80, yPos + 35);

  yPos += 55;

  // Verification Statement
  doc.setDrawColor(229, 231, 235);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 15;
  
  doc.setTextColor(...mutedColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  const verificationText = "This document certifies that the above-named individual has electronically acknowledged the specified requirement. The signature was captured through a secure, tokenized link and includes audit metadata for verification purposes.";
  const splitText = doc.splitTextToSize(verificationText, pageWidth - 40);
  doc.text(splitText, 20, yPos);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 25;
  doc.setDrawColor(229, 231, 235);
  doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
  
  doc.setTextColor(...mutedColor);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated on ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}`,
    pageWidth / 2,
    footerY + 5,
    { align: "center" }
  );
  
  // Powered by Attestly (if org-branded)
  if (data.organizationName) {
    doc.setFontSize(7);
    doc.setTextColor(180, 180, 180);
    doc.text("Powered by Attestly", pageWidth / 2, footerY + 12, { align: "center" });
  }

  // Download the PDF
  const fileName = `signature-certificate-${data.signingRequestId.substring(0, 8)}.pdf`;
  doc.save(fileName);
}
