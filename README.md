# Kenpath Assignment — Revenue Officer Portal

An AI-assisted application processing tool designed for Telangana Revenue Officers, built entirely in Telugu for local-language accessibility.

**Demo Credentials:** Username: `officer` | Password: `demo123`

---

## 1. The Problem

Revenue officers in Telangana process hundreds of land record applications (patta transfers, mutations, corrections) daily. Current systems are slow, paper-heavy, and require officers to manually cross-reference documents. When an officer has 50+ pending applications, it is difficult to know which application is the most urgent, quickly identify missing documents, or read through pages of data to write a summary.

## 2. Who It Affects

- **Officers:** Saves hours of manual reading. The dashboard prioritizes urgent cases, and the AI provides instant summaries and risk flags.
- **Citizens:** Faster approvals and fewer rejections due to easily identifiable missing documents.
- **Department:** Better audit trails and consistent decision-making.

## 3. What the Application Does

1. **Dashboard Overview:** Shows total pending applications, urgent cases, and missing documents. Applications are automatically sorted by priority (Urgent > Medium > Normal). Includes a search bar and filter tabs.
2. **AI Assistant (Powered by Google Gemini):** Generates a 2-3 sentence summary in Telugu, flags missing documents and inconsistencies, and suggests a decision with reasons. The AI never makes the final decision.
3. **Officer Decision Panel:** The officer enters remarks and clicks Approve, Reject, or Return. All decisions are audit-logged with the officer's username and timestamp.

## 4. Main Technical Decisions

- **Security (Auth):** Uses `httpOnly` cookies for session management (safer than localStorage). Passwords are hashed using `bcryptjs`. Custom HMAC-SHA256 signed tokens. Middleware protects all routes.
- **AI Safety (Validation):** LLM output is unpredictable. We use `Zod` schemas to validate the AI's JSON response at runtime. Includes an exponential backoff retry mechanism for Gemini API errors.
- **Rate Limiting:** In-memory rate limiter protects the login and AI endpoints to prevent abuse.
- **Local Language Design:** The UI is entirely in Telugu using `Noto Sans Telugu`. A strict 3-color design system (Indigo, Amber, Slate) ensures a professional interface.
- **Tech Stack:** Next.js (App Router), Tailwind CSS v4, Framer Motion, Zod, `@google/genai`.

## 5. How to Run Locally

1. Clone the repository: `git clone <your-github-repo-link>`
2. Install dependencies: `npm install`
3. Create `.env.local` in the root and add:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   SESSION_SECRET=your_random_64_character_string
   ```
