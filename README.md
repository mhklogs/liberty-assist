<div align="center">

# LibertyAssist

**Role-aware civic and legal assistance assistant** — a Gemini-powered assistant
that tailors its guidance to who you are and which US state you live in, backed
by an offline-first data layer that runs with no backend at all.

`React 19` `Vite 8` `Supabase` `Gemini 2.5 Flash` `Tailwind`

</div>

---

## What it does

Most legal-assistance tools give everyone the same answer. LibertyAssist
personalises by **role** and **state**, because the correct answer to "what
should I do" genuinely differs between a nurse in Texas and an asylum seeker in
California.

Pick a profile, pick your state, and the assistant, checklists and document
templates re-tailor themselves.

### Seven personas

| Persona | Focus |
| --- | --- |
| US General Citizen | Passport, DMV, voting registration, jury duty |
| Student / Youth | Financial aid, part-time work, campus legal rights |
| Senior Citizen (65+) | Medicare, Social Security, estate basics, elder abuse |
| Immigrant (Visa / Green Card) | USCIS forms, renewals, the Civics test |
| Refugee / Asylum Seeker | Asylum process, interviews, work authorisation |
| Medical Professional | HIPAA checklists, DEA registries, licensing boards |
| US Attorney / Lawyer | Professional conduct, filing workflows, CLE |

All 50 states plus DC are supported, and state-specific rules are surfaced in
the assistant context and the sidebar.

### Tools

- **Interactive US Civics test practice** — question bank with progress tracking
- **Passport and document checklists** — step-by-step with Google Calendar export
- **Calculators** — read-aloud, copy-to-clipboard and print helpers
- **Essay and document workspace** — draft, save and re-read your own documents
- **Focus timer** — study and drafting blocks with alerts
- **Study flashcard system** — including the Bill of Rights and the four
  founding documents (Declaration, Articles of Confederation, Constitution)
- **AI assistant chat** — Gemini 2.5 Flash, markdown-rendered, with a per-user
  disclaimer and memory context
- **Print, copy and download** on every document view

### Interface

- Role-gated sidebar and dashboard
- Light and dark themes
- Three font scales for accessibility
- Read-aloud (speech synthesis) across document views
- Responsive layout

---

## Quickstart

Prerequisites: **Node.js 18+**.

```bash
npm install
npm run dev
```

**No configuration is required to run it.** The app ships a mock Supabase
implementation backed by `localStorage` that mimics the Auth and database APIs,
so sign-in, profile switching, saved chats, documents and learnings all work
immediately with no backend.

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Serve the production build |
| `npm run lint` | Oxlint |

---

## Configuration

Everything is optional. The app reads from environment variables first, then
from values entered in the UI, then falls back to the local mock.

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_GEMINI_API_KEY` | No | Enables the AI assistant. Without it the chat returns a guided fallback response |
| `VITE_SUPABASE_URL` | No | Real Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase anon key |

### Supabase tables

If you wire up a real backend, the app expects four tables:
`profiles`, `chat_history`, `saved_documents`, `user_learnings`.

`src/supabaseClient.js` implements a drop-in mock with the same surface, so
you can develop against it and switch to the real client without touching
component code.

### Data handling

Without Supabase, all user data stays in `localStorage` under the
`liberty_assist_*` keys. Clearing site data erases it. With Supabase, rows are
scoped per authenticated user.

> Entered API keys are stored in `localStorage` in the browser. For a
> production deployment, proxy Gemini through your own backend instead of
> shipping a key to the client.

---

## A note on scope

This is a **demonstration of role-based context engineering and an
offline-first data layer**. The checklists, templates and guidance are
illustrative. It is not a legal advice service, and it is not a substitute for
a licensed attorney or an accredited legal aid provider. Every assistant
response carries a disclaimer.

---

## License

MIT — use commercially, no attribution required.
