export interface ParsedRecipient {
  full_name: string;
  email: string;
  recipient_type: string;
  department: string | null;
}

export interface CSVParseResult {
  valid: ParsedRecipient[];
  errors: { row: number; message: string }[];
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function parseRecipientsCSV(content: string): CSVParseResult {
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  
  if (lines.length < 2) {
    return {
      valid: [],
      errors: [{ row: 0, message: "CSV must have a header row and at least one data row" }],
    };
  }

  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map(normalizeHeader);

  // Find column indexes
  const nameIndex = headers.findIndex((h) => 
    h === "fullname" || h === "name" || h === "recipientname"
  );
  const emailIndex = headers.findIndex((h) => 
    h === "email" || h === "emailaddress"
  );
  const typeIndex = headers.findIndex((h) => 
    h === "type" || h === "recipienttype"
  );
  const deptIndex = headers.findIndex((h) => 
    h === "department" || h === "dept" || h === "group"
  );

  if (nameIndex === -1) {
    return {
      valid: [],
      errors: [{ row: 1, message: "Missing required column: Full Name (or Name)" }],
    };
  }

  if (emailIndex === -1) {
    return {
      valid: [],
      errors: [{ row: 1, message: "Missing required column: Email" }],
    };
  }

  const valid: ParsedRecipient[] = [];
  const errors: { row: number; message: string }[] = [];
  const seenEmails = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = parseCSVLine(line);
    const rowNum = i + 1;

    const name = values[nameIndex]?.trim() || "";
    const email = values[emailIndex]?.trim().toLowerCase() || "";
    const type = values[typeIndex]?.trim().toLowerCase() || "employee";
    const department = values[deptIndex]?.trim() || null;

    // Validation
    if (!name) {
      errors.push({ row: rowNum, message: "Missing name" });
      continue;
    }

    if (!email) {
      errors.push({ row: rowNum, message: "Missing email" });
      continue;
    }

    if (!isValidEmail(email)) {
      errors.push({ row: rowNum, message: `Invalid email: ${email}` });
      continue;
    }

    if (seenEmails.has(email)) {
      errors.push({ row: rowNum, message: `Duplicate email: ${email}` });
      continue;
    }

    seenEmails.add(email);

    // Normalize recipient type
    let recipientType = "employee";
    if (type === "contractor" || type === "contract") {
      recipientType = "contractor";
    } else if (type === "vendor" || type === "supplier") {
      recipientType = "vendor";
    }

    valid.push({
      full_name: name,
      email,
      recipient_type: recipientType,
      department,
    });
  }

  return { valid, errors };
}

export function generateSampleCSV(): string {
  return `Full Name,Email,Type,Department
John Smith,john.smith@example.com,employee,Engineering
Jane Doe,jane.doe@example.com,contractor,Marketing
Bob Wilson,bob.wilson@example.com,vendor,`;
}
