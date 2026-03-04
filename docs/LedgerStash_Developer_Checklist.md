# LedgerStash Developer Checklist

**Purpose:** Prioritized list of all fixes and improvements identified in the product audit, organized by launch priority and estimated effort.

**Status:** Ready for development  
**Target Completion:** March 18, 2026 (before promotional push begins March 19)

---

## 🔴 CRITICAL (Launch Blockers) — Must Complete by March 18

These issues prevent revenue generation or create legal exposure. Nothing should ship until these are done.

### 1. Integrate Stripe Payment Processing

**Priority:** CRITICAL  
**Effort:** 4-6 hours  
**Impact:** Enables revenue generation  

**What needs to be done:**
- Set up Stripe account and API keys
- Create a `/billing` or `/upgrade` page with Stripe checkout
- Implement subscription management (create, update, cancel subscriptions)
- Add a "Billing" section to Settings where users can view their current plan, update payment method, and download invoices
- Update the pricing page to show "Upgrade Now" button for logged-in trial users (instead of "Start Free Trial")
- Add trial expiration email notification (3 days before trial ends) with upgrade link
- Implement webhook handlers for subscription events (payment_succeeded, payment_failed, customer.subscription.deleted)
- Test the full flow: trial → upgrade → paid subscription

**Acceptance Criteria:**
- A trial user can click "Upgrade" and complete a Stripe checkout
- Payment is processed and the user's plan is updated immediately
- User can view their billing history and manage payment method
- Owner Dashboard shows "Paid Users" count increasing

---

### 2. Fix Terms of Service "[Your State/Country]" Placeholder

**Priority:** CRITICAL  
**Effort:** 15 minutes  
**Impact:** Removes legal exposure  

**What needs to be done:**
- Replace "[Your State/Country]" with the actual jurisdiction (e.g., "the State of California" or "the laws of the United States")
- Have a legal professional review the updated Terms of Service
- Update the effective date if any changes are made

**Acceptance Criteria:**
- Terms of Service page displays actual jurisdiction, not placeholder text
- No other placeholders remain in the document

---

### 3. Rewrite All Onboarding Tour Steps (Terminology Overhaul)

**Priority:** CRITICAL  
**Effort:** 2-3 hours  
**Impact:** Eliminates the #1 trust-killer  

**What needs to be done:**
Replace all 6 steps of the onboarding tour with CPA-specific language. Use the table below as reference:

| Current Step | Current Language | New Language |
| :--- | :--- | :--- |
| Step 1: Welcome | "create compliance requirements and collect acknowledgments from your team" | "create PBC lists and collect documents from your clients" |
| Step 2: Add Recipients | "adding the people who need to acknowledge your policies — employees, contractors, or vendors" | "adding your clients who need to submit tax documents" |
| Step 3: Create Requirements | "Define what needs to be acknowledged — NDAs, policies, training confirmations" | "Define what documents you need — W-2s, 1099s, bank statements, mortgage interest forms" |
| Step 4: Send for Signature | "send signing requests to your recipients. They'll receive an email with a secure link to acknowledge the document" | "send document requests to your clients. They'll receive an email with a secure link to upload documents" |
| Step 5: Track Compliance | "Monitor who has signed and who hasn't. Send reminders, export reports, and download PDF certificates" | "Monitor which clients have submitted documents and which haven't. Send reminders and export status reports" |
| Step 6: You're All Set | "Start by adding recipients or creating your first requirement" | "Start by adding clients or creating your first PBC list" |

**Acceptance Criteria:**
- All 6 onboarding tour steps use accounting/CPA terminology
- No references to "signing," "signatures," "recipients," "requirements," "compliance," "acknowledgments," or "policies"
- All examples reference accounting documents (W-2s, 1099s, etc.) not compliance documents

---

### 4. Update All Email Templates (Terminology Overhaul)

**Priority:** CRITICAL  
**Effort:** 2-3 hours  
**Impact:** Ensures client-facing communications match the brand  

**What needs to be done:**
Rewrite all four email template types to use document collection language instead of signing language:

| Email Type | Current Subject | New Subject | Current Body Language | New Body Language |
| :--- | :--- | :--- | :--- | :--- |
| Initial | "Action required: Please sign [Document]" | "Action required: Please upload your tax documents" | "review and sign the following document" | "Your accountant has requested the following documents" |
| Reminder | "Reminder: [Document] still needs your signature" | "Reminder: Your tax documents are still needed" | "hasn't signed yet" | "hasn't submitted yet" |
| Escalated | "Urgent: [Document] signature required" | "Urgent: Your tax documents are overdue" | "complete your signature" | "submit your documents" |
| Overdue | "Final notice: [Document] signature overdue" | "Final notice: Tax documents overdue" | "acknowledge the document" | "upload the documents" |

**Key changes:**
- Remove all "sign," "signature," "acknowledge," "acknowledgment" language
- Replace with "upload," "submit," "provide," "send" language
- Update sender name from "Snowbie" to the actual firm name (or leave as variable)
- Update the custom message placeholder to reference "tax documents" not "policies"

**Acceptance Criteria:**
- All four email templates use document collection language
- Test emails can be sent and reviewed
- No references to signing or signatures remain

---

### 5. Fix Page Title Bug (Dynamic Page Titles)

**Priority:** CRITICAL  
**Effort:** 30 minutes  
**Impact:** Quick win for professionalism  

**What needs to be done:**
- Update the page title (browser tab) to reflect the current page dynamically
- Examples: "Dashboard | LedgerStash," "Clients | LedgerStash," "Settings | LedgerStash," "Documents | LedgerStash"
- Ensure the title updates when navigating between routes

**Acceptance Criteria:**
- Browser tab title changes as user navigates
- Title format is consistent: "[Page Name] | LedgerStash"

---

### 6. Update Organization Name Default and Onboarding Prompt

**Priority:** CRITICAL  
**Effort:** 1-2 hours  
**Impact:** Removes development artifact from client-facing communications  

**What needs to be done:**
- Remove "Lovable" as the default organization name
- Add a required field in the onboarding flow (after sign-up, before dashboard) asking the user to enter their firm name
- Store this as the organization name and use it in all email templates
- Prevent sending any client-facing communications until the organization name is set
- Update the Settings > Organization tab to show the firm name prominently

**Acceptance Criteria:**
- New users are prompted to enter their firm name during onboarding
- Organization name appears in email templates sent to clients
- "Lovable" never appears in any client-facing communication

---

## 🟠 HIGH PRIORITY (Complete by March 14)

These issues hurt conversion, retention, and professional credibility. They should be completed before the promotional push begins.

### 7. Add Client Portal Invitation Flow

**Priority:** HIGH  
**Effort:** 2-3 hours  
**Impact:** Completes the core user journey  

**What needs to be done:**
- Add a "Send Invite" or "Share Portal Link" button on the client detail page
- When clicked, generate a secure, time-limited invitation link for the client
- Send a branded email to the client with the invitation link and instructions
- The invitation email should explain what LedgerStash is and how to use it
- Track whether the client has accepted the invitation
- Display invitation status on the client detail page (e.g., "Invitation sent on March 5" or "Client joined on March 6")

**Acceptance Criteria:**
- User can send an invitation from the client detail page
- Client receives an email with a secure link to join their portal
- Client can click the link and access their document upload portal
- Invitation status is visible in the UI

---

### 8. Update "End-to-End Encrypted" Claim to Accurate Language

**Priority:** HIGH  
**Effort:** 30 minutes  
**Impact:** Removes misleading security claim  

**What needs to be done:**
- Change the dashboard badge from "End-to-End Encrypted" to "Bank-Grade Encryption" or "AES-256 Encrypted"
- Update the Security page to specify the exact encryption standard (e.g., "AES-256 encryption at rest, TLS 1.2+ in transit")
- Ensure the language is accurate and not overstated

**Acceptance Criteria:**
- Dashboard badge displays accurate encryption claim
- Security page specifies encryption standards
- No misleading claims about E2E encryption

---

### 9. Add Two-Factor Authentication (2FA) Option

**Priority:** HIGH  
**Effort:** 3-4 hours  
**Impact:** Builds trust with security-conscious CPAs  

**What needs to be done:**
- Implement TOTP-based 2FA (compatible with Google Authenticator, Authy, Microsoft Authenticator)
- Add a "Enable Two-Factor Authentication" toggle in Settings > Security
- When enabled, user scans a QR code and enters a 6-digit code to confirm setup
- On next login, user is prompted for 2FA code after entering password
- Provide backup codes in case user loses access to their authenticator app
- Add option to disable 2FA (with password confirmation)

**Acceptance Criteria:**
- User can enable 2FA in Settings
- 2FA is required on login when enabled
- Backup codes are provided and work
- User can disable 2FA

---

### 10. Add File Actions (Download, Delete, Preview)

**Priority:** HIGH  
**Effort:** 2-3 hours  
**Impact:** Improves document management UX  

**What needs to be done:**
- Add hover actions or a context menu to document items in the client detail page
- Implement download functionality (download the file to user's computer)
- Implement delete functionality (with confirmation dialog)
- Implement preview functionality if possible (PDF preview, image preview, etc.)
- Display file size correctly (currently shows 0.0 MB on dashboard but 25.4 KB on client detail)

**Acceptance Criteria:**
- User can download, delete, or preview documents from the client detail page
- File size displays consistently across all pages
- Delete action requires confirmation

---

### 11. Fix File Size Display Inconsistency

**Priority:** HIGH  
**Effort:** 30 minutes  
**Impact:** Improves data consistency  

**What needs to be done:**
- Dashboard shows "0.0 MB" for a file that is actually 25.4 KB
- Investigate the root cause (likely a formatting issue)
- Ensure file size displays consistently and correctly across all pages (dashboard, client detail, documents page)
- Use consistent units (KB for small files, MB for large files)

**Acceptance Criteria:**
- File size displays correctly on dashboard and client detail page
- Consistent formatting across all pages

---

### 12. Add Social Proof to Landing Page

**Priority:** HIGH  
**Effort:** 1-2 hours  
**Impact:** Builds credibility with prospects  

**What needs to be done:**
- Add 1-2 testimonials from early users (if available) or placeholder testimonials from CPAs
- Add a "Trusted by CPAs" section with logos or names of early adopter firms
- Add a "Built for Tax Season 2026" badge or similar trust indicator
- Once real users sign up, replace placeholder testimonials with real ones

**Acceptance Criteria:**
- Landing page displays social proof (testimonials, logos, or trust badges)
- Placeholder text is professional and credible

---

## 🟡 MEDIUM PRIORITY (Complete by March 21)

These issues improve the product but are not launch blockers. They can be completed after the critical fixes.

### 13. Update Owner Dashboard Terminology

**Priority:** MEDIUM  
**Effort:** 1 hour  
**Impact:** Aligns internal metrics with product positioning  

**What needs to be done:**
- Change "Signing Requests" to "Document Requests"
- Change "Completed Signatures" to "Documents Submitted"
- Update any other compliance-related terminology in the Owner Dashboard

**Acceptance Criteria:**
- Owner Dashboard uses accounting terminology
- No references to "signing" or "signatures"

---

### 14. Add CSV Import for Clients

**Priority:** MEDIUM  
**Effort:** 2-3 hours  
**Impact:** Improves onboarding for firms with many clients  

**What needs to be done:**
- Add a "Import Clients" button or option in the Clients page
- Allow users to upload a CSV file with client data (First Name, Last Name, Email, Notes)
- Parse the CSV and create multiple clients in bulk
- Show a preview of the data before confirming import
- Handle errors gracefully (e.g., invalid email format, duplicate emails)

**Acceptance Criteria:**
- User can upload a CSV file with client data
- Clients are created in bulk from the CSV
- Errors are handled gracefully

---

### 15. Fix Account Owner Role Display

**Priority:** MEDIUM  
**Effort:** 30 minutes  
**Impact:** Improves clarity of user roles  

**What needs to be done:**
- Update the role assignment logic so the account creator displays as "Owner" or "Admin" instead of "Member"
- Update the team management page to reflect this correctly

**Acceptance Criteria:**
- Account owner displays as "Owner" or "Admin" in team settings
- Other team members display as "Member"

---

### 16. Update Notification Settings Language

**Priority:** MEDIUM  
**Effort:** 30 minutes  
**Impact:** Aligns settings with product terminology  

**What needs to be done:**
- Change "Receive emails about signature completions and updates" to "Receive emails about document submissions and updates"
- Change "Get notified when recipients haven't signed yet" to "Get notified when clients haven't submitted documents yet"

**Acceptance Criteria:**
- Notification settings use document collection language
- No references to signing or signatures

---

### 17. Update Team Management Language

**Priority:** MEDIUM  
**Effort:** 30 minutes  
**Impact:** Aligns team settings with product terminology  

**What needs to be done:**
- Change "Can manage recipients and requirements" to "Can manage clients and PBC lists"
- Update any other team role descriptions to use accounting terminology

**Acceptance Criteria:**
- Team management descriptions use accounting terminology

---

### 18. Add Annual Pricing Option

**Priority:** MEDIUM  
**Effort:** 1-2 hours  
**Impact:** Improves conversion and LTV  

**What needs to be done:**
- Add annual pricing option to the pricing page (e.g., 2 months free if paying annually)
- Update Stripe to support annual billing cycles
- Allow users to switch between monthly and annual billing in their subscription settings

**Acceptance Criteria:**
- Pricing page displays annual pricing option
- Users can select annual billing during checkout
- Users can switch billing cycles in Settings

---

## 🟢 LOW PRIORITY (Nice to Have)

These are improvements that enhance the product but are not critical for launch.

### 19. Add Client Edit Capability

**Priority:** LOW  
**Effort:** 1-2 hours  
**Impact:** Improves client management UX  

**What needs to be done:**
- Add an "Edit" button on the client detail page
- Allow users to edit client name, email, and notes
- Show a confirmation dialog before saving changes
- Update the client list view to reflect changes

**Acceptance Criteria:**
- User can edit client information
- Changes are saved and reflected in the UI

---

### 20. Add Task Edit/Delete Functionality

**Priority:** LOW  
**Effort:** 1-2 hours  
**Impact:** Improves PBC task management  

**What needs to be done:**
- Add edit and delete buttons/actions to PBC tasks
- Allow users to edit task name, description, due date, and priority
- Show a confirmation dialog before deleting
- Update the task list to reflect changes

**Acceptance Criteria:**
- User can edit and delete PBC tasks
- Changes are saved and reflected in the UI

---

### 21. Add Phone Number Field to Client Profile

**Priority:** LOW  
**Effort:** 30 minutes  
**Impact:** Improves client communication options  

**What needs to be done:**
- Add a phone number field to the "Add Client" modal and client detail page
- Store and display the phone number

**Acceptance Criteria:**
- Phone number field is available in client profile
- Phone number is stored and displayed

---

### 22. Add Cookie Consent Banner

**Priority:** LOW  
**Effort:** 1 hour  
**Impact:** Improves GDPR/CCPA compliance  

**What needs to be done:**
- Add a simple cookie consent banner to the bottom of the page
- Allow users to accept or reject non-essential cookies
- Respect user preferences

**Acceptance Criteria:**
- Cookie consent banner appears on first visit
- User preferences are respected

---

### 23. Add Session Management

**Priority:** LOW  
**Effort:** 2-3 hours  
**Impact:** Improves security and user control  

**What needs to be done:**
- Add a "Sessions" page in Settings where users can view active sessions
- Allow users to log out of other devices
- Show session details (device, location, last active time)

**Acceptance Criteria:**
- User can view active sessions
- User can log out of other devices

---

### 24. Improve Security Page with Specific Details

**Priority:** LOW  
**Effort:** 1-2 hours  
**Impact:** Builds trust with security-conscious users  

**What needs to be done:**
- Add specific encryption standards (e.g., "AES-256 encryption at rest")
- Add data center location information
- Add information about SOC 2 compliance (if applicable)
- Add information about backup frequency and retention

**Acceptance Criteria:**
- Security page includes specific technical details
- No vague language like "industry-standard safeguards"

---

## Summary by Timeline

| Week | Critical | High Priority | Medium Priority | Total |
| :--- | :--- | :--- | :--- | :--- |
| Week 1 (March 5-11) | 6 fixes | 0 | 0 | 6 fixes |
| Week 2 (March 12-18) | 0 | 6 fixes | 3 fixes | 9 fixes |
| Week 3 (March 19-25) | 0 | 0 | 5 fixes | 5 fixes |
| After Launch | 0 | 0 | 10 fixes | 10 fixes |

---

## Testing Checklist

After each fix is completed, test the following:

- [ ] No console errors or warnings
- [ ] Feature works as described in acceptance criteria
- [ ] UI is responsive (mobile, tablet, desktop)
- [ ] Terminology is consistent across the entire application
- [ ] Email templates render correctly and contain correct language
- [ ] Stripe integration processes payments correctly
- [ ] All links work and lead to correct pages
- [ ] No broken images or missing assets

---

## Deployment Checklist

Before deploying to production:

- [ ] All critical fixes are complete
- [ ] All high-priority fixes are complete
- [ ] Testing checklist is complete
- [ ] No console errors or warnings
- [ ] Performance is acceptable (page load time < 3 seconds)
- [ ] Security headers are properly configured
- [ ] SSL certificate is valid
- [ ] Backup is created before deployment
- [ ] Rollback plan is in place

