export interface PBCTemplate {
  id: string;
  name: string;
  category: string;
  tasks: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }[];
}

export const PBC_TEMPLATES: PBCTemplate[] = [
  {
    id: "individual-1040",
    name: "Individual Tax Return (1040)",
    category: "Tax Preparation",
    tasks: [
      { title: "Upload W-2 forms", description: "All W-2 wage statements from employers", priority: "high" },
      { title: "Upload 1099 forms", description: "1099-INT, 1099-DIV, 1099-MISC, 1099-NEC, 1099-R, etc.", priority: "high" },
      { title: "Mortgage interest statement (1098)", description: "From your mortgage lender", priority: "medium" },
      { title: "Property tax records", description: "Annual property tax statements", priority: "medium" },
      { title: "Charitable donation receipts", description: "Receipts for all charitable contributions over $250", priority: "medium" },
      { title: "Medical expense receipts", description: "If total exceeds 7.5% of AGI", priority: "low" },
      { title: "Prior year tax return", description: "Copy of last year's federal and state returns", priority: "high" },
      { title: "Photo ID (front & back)", description: "Valid government-issued photo ID", priority: "high" },
    ],
  },
  {
    id: "business-1120s",
    name: "S-Corp Tax Return (1120-S)",
    category: "Tax Preparation",
    tasks: [
      { title: "Year-end financial statements", description: "Profit & Loss and Balance Sheet", priority: "high" },
      { title: "Bank statements (all 12 months)", description: "For all business bank accounts", priority: "high" },
      { title: "Payroll reports (annual summary)", description: "W-3, 941 quarterly summaries", priority: "high" },
      { title: "Depreciation schedule", description: "List of all fixed assets with purchase dates and costs", priority: "medium" },
      { title: "Loan statements", description: "Year-end statements for all business loans", priority: "medium" },
      { title: "Vehicle mileage log", description: "If business vehicles are used", priority: "low" },
      { title: "1099s issued to contractors", description: "Copies of all 1099-NEC forms issued", priority: "high" },
      { title: "K-1 distributions schedule", description: "Shareholder distribution records", priority: "high" },
    ],
  },
  {
    id: "partnership-1065",
    name: "Partnership Tax Return (1065)",
    category: "Tax Preparation",
    tasks: [
      { title: "Partnership agreement", description: "Current executed partnership agreement", priority: "high" },
      { title: "Year-end financial statements", description: "Profit & Loss, Balance Sheet, Capital Accounts", priority: "high" },
      { title: "Bank statements (all 12 months)", description: "All partnership bank accounts", priority: "high" },
      { title: "Partner capital account reconciliation", description: "Beginning and ending balances per partner", priority: "high" },
      { title: "Guaranteed payments schedule", description: "Details of all guaranteed payments to partners", priority: "medium" },
      { title: "Property contribution/distribution records", description: "Any property transactions with partners", priority: "medium" },
    ],
  },
  {
    id: "bookkeeping-monthly",
    name: "Monthly Bookkeeping",
    category: "Bookkeeping",
    tasks: [
      { title: "Bank statements", description: "All business bank account statements for the month", priority: "high" },
      { title: "Credit card statements", description: "All business credit card statements", priority: "high" },
      { title: "Sales receipts / invoices", description: "All customer invoices and sales receipts", priority: "medium" },
      { title: "Expense receipts", description: "Receipts for all business purchases", priority: "medium" },
      { title: "Payroll reports", description: "Payroll journal or pay stub summaries", priority: "medium" },
    ],
  },
  {
    id: "new-client-onboarding",
    name: "New Client Onboarding",
    category: "Onboarding",
    tasks: [
      { title: "Sign engagement letter", description: "Review and sign the engagement letter for our services", priority: "high" },
      { title: "Complete W-9 form", description: "IRS Form W-9 for taxpayer identification", priority: "high" },
      { title: "Provide prior year tax returns (2 years)", description: "Federal and state returns for the past 2 years", priority: "high" },
      { title: "Provide IRS correspondence", description: "Any recent IRS or state tax authority letters", priority: "medium" },
      { title: "Upload photo ID", description: "Government-issued photo ID (front & back)", priority: "high" },
      { title: "Provide bank account details for direct deposit", description: "Routing and account number for refund direct deposit", priority: "low" },
    ],
  },
  {
    id: "audit-preparation",
    name: "Audit Preparation",
    category: "Compliance",
    tasks: [
      { title: "General ledger", description: "Complete general ledger for the audit period", priority: "high" },
      { title: "Trial balance", description: "Adjusted trial balance as of year-end", priority: "high" },
      { title: "Bank reconciliations", description: "All bank reconciliations for the year", priority: "high" },
      { title: "Accounts receivable aging", description: "AR aging report as of year-end", priority: "medium" },
      { title: "Accounts payable aging", description: "AP aging report as of year-end", priority: "medium" },
      { title: "Fixed asset register", description: "Complete list of fixed assets with depreciation schedules", priority: "medium" },
      { title: "Board minutes", description: "Minutes from all board meetings during the year", priority: "low" },
      { title: "Insurance policies", description: "Copies of all active insurance policies", priority: "low" },
    ],
  },
  {
    id: "w2-employee-collection",
    name: "W-2 Employee Collection",
    category: "Tax Preparation",
    tasks: [
      { title: "W-2 wage statement", description: "W-2 from each employer for the tax year", priority: "high" },
      { title: "Final pay stub of the year", description: "Last pay stub showing YTD totals for verification", priority: "medium" },
      { title: "State W-2 (if different)", description: "Separate state W-2 if issued by employer", priority: "medium" },
      { title: "W-2c corrected statement", description: "Upload any corrected W-2c forms received", priority: "low" },
      { title: "Multiple employer summary", description: "List of all employers worked for during the year", priority: "high" },
    ],
  },
  {
    id: "1099-contractor-collection",
    name: "1099 Contractor Collection",
    category: "Tax Preparation",
    tasks: [
      { title: "1099-NEC forms", description: "All 1099-NEC forms received for non-employee compensation", priority: "high" },
      { title: "1099-MISC forms", description: "All 1099-MISC forms for rents, royalties, or other income", priority: "high" },
      { title: "1099-K forms", description: "Payment card and third-party network transactions (Venmo, PayPal, etc.)", priority: "high" },
      { title: "Business expense receipts", description: "Receipts for deductible business expenses related to contract work", priority: "medium" },
      { title: "Home office measurements", description: "Square footage of home office and total home if claiming deduction", priority: "low" },
      { title: "Vehicle mileage log", description: "Business mileage records if using personal vehicle", priority: "medium" },
    ],
  },
  {
    id: "scorp-annual-package",
    name: "S-Corp Annual Package",
    category: "Tax Preparation",
    tasks: [
      { title: "K-1 schedules for all shareholders", description: "Schedule K-1 for each shareholder's distributive share", priority: "high" },
      { title: "Annual payroll summary (W-3)", description: "W-3 transmittal and all employee W-2s issued", priority: "high" },
      { title: "941 quarterly reports", description: "All four quarterly Form 941 payroll tax returns", priority: "high" },
      { title: "Year-end profit & loss statement", description: "Full-year P&L from accounting software", priority: "high" },
      { title: "Year-end balance sheet", description: "Balance sheet as of December 31", priority: "high" },
      { title: "Shareholder distribution records", description: "All distributions made to shareholders during the year", priority: "high" },
      { title: "Business loan year-end statements", description: "Year-end statements for all outstanding business loans", priority: "medium" },
      { title: "Health insurance premiums (2% shareholders)", description: "Total premiums paid for >2% shareholder health insurance", priority: "medium" },
    ],
  },
  {
    id: "extension-request-package",
    name: "Extension Request Package",
    category: "Tax Preparation",
    tasks: [
      { title: "Estimated income summary", description: "Best estimate of total income for the tax year", priority: "high" },
      { title: "Estimated deductions summary", description: "Best estimate of itemized or business deductions", priority: "high" },
      { title: "Prior year tax return", description: "Last filed return for reference and safe harbor calculations", priority: "high" },
      { title: "Estimated tax payments made", description: "All federal and state estimated payments (dates and amounts)", priority: "high" },
      { title: "W-2 / 1099 forms received so far", description: "Any income documents already received", priority: "medium" },
      { title: "Signed extension authorization", description: "Client authorization to file Form 4868 or 7004", priority: "high" },
    ],
  },
];
