import { format } from "date-fns";

interface Recipient {
  id: string;
  full_name: string;
  email: string;
  recipient_type: string;
  department: string | null;
  created_at: string;
}

interface SigningRequest {
  id: string;
  status: string | null;
  sent_at: string | null;
  completed_at: string | null;
  signed_name: string | null;
  expires_at: string | null;
  recipient: {
    full_name: string;
    email: string;
  } | null;
  requirement: {
    title: string;
  } | null;
}

function escapeCSVValue(value: string): string {
  // If value contains comma, newline, or quote, wrap in quotes and escape internal quotes
  if (value.includes(",") || value.includes("\n") || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function generateCSV(headers: string[], rows: string[][]): string {
  const headerRow = headers.map(escapeCSVValue).join(",");
  const dataRows = rows.map((row) => row.map(escapeCSVValue).join(","));
  return [headerRow, ...dataRows].join("\n");
}

function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportRecipientsToCSV(recipients: Recipient[]): void {
  const headers = [
    "Full Name",
    "Email",
    "Type",
    "Department",
    "Created Date",
  ];

  const rows = recipients.map((r) => [
    r.full_name,
    r.email,
    r.recipient_type || "employee",
    r.department || "",
    format(new Date(r.created_at), "yyyy-MM-dd"),
  ]);

  const csv = generateCSV(headers, rows);
  const filename = `recipients-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
  downloadCSV(csv, filename);
}

export function exportSignaturesToCSV(requests: SigningRequest[], includeAll = false): void {
  const filteredRequests = includeAll 
    ? requests 
    : requests.filter((r) => r.status === "completed");

  const headers = [
    "Recipient Name",
    "Recipient Email",
    "Requirement",
    "Status",
    "Signed As",
    "Sent Date",
    "Completed Date",
  ];

  const rows = filteredRequests.map((req) => [
    req.recipient?.full_name || "",
    req.recipient?.email || "",
    req.requirement?.title || "",
    req.status || "pending",
    req.signed_name || "",
    req.sent_at ? format(new Date(req.sent_at), "yyyy-MM-dd HH:mm:ss") : "",
    req.completed_at ? format(new Date(req.completed_at), "yyyy-MM-dd HH:mm:ss") : "",
  ]);

  const csv = generateCSV(headers, rows);
  const filename = `signatures-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
  downloadCSV(csv, filename);
}
