# Liberty Assist — Delivery Roadmap (v3)

> **Provenance note.** This roadmap was produced on **2026-09-29** from the same
> static analysis as the rest of `documents/` (see `00-index.md`). Backlog items are
> derived from the functional requirements in `02-functional-requirements.md`, the
> non-functional targets in `03-non-functional-requirements.md`, and the market
> findings in `01-market-analysis.md`. Timeline targets are `[TO BE VALIDATED]`
> where they depend on future estimates rather than shipped code.

## 1. Objective & horizon

Legal assistant chat UI (assistant-ui / React). This roadmap plans the next **5–6 weeks** of incremental delivery in
lockstep with the SDLC phases and traceability rules in `07-sdlc-lifecycle.md`
(Requirements → Design → Implement → Verify → Release/Operate → Improve).

Current shipped state: `https://liberty-assist.vercel.app` (production), source committed, v2 documentation set complete.

The shipped build is role-aware rather than a generic chat box: seven personas
(general citizen, student, senior, immigrant, refugee/asylum seeker, medical
professional, attorney) across all 50 states plus DC, with an assistant chat on
Gemini 2.5 Flash, a civics test, document checklists with calendar export,
calculators, a document workspace, a focus timer, flashcards, and light/dark
themes, three font scales and read-aloud support. It is a single 2,914-line
`src/App.jsx` (FR-3: no component directory was detected) plus a 166-line
`src/supabaseClient.js` that supplies a `localStorage`-backed mock of the four
documented tables when no Supabase project is configured (FR-7). No API routes
and no auth layer were detected (FR-1, FR-2).

## 2. Product backlog

Prioritised with MoSCoW. Items are phrased as outcomes (not tasks) and map to FR/NFR ids.

| ID | Item (outcome) | Source | Priority |
| --- | --- | --- | --- |
| PBI-01 | The assistant answers without shipping a model key to the browser — `App.jsx` calls `generativelanguage.googleapis.com` directly with a key the user typed into `localStorage`, and the readme already calls this out as production-inappropriate | NFR-5.2 | Must |
| PBI-02 | The single `App.jsx` is split along the seams the product already exposes (persona selection, state selection, and each of the eight tools), so a change to one tool cannot silently break another | FR-3 | Must |
| PBI-03 | Both storage modes are interchangeable: the mock and the real Supabase path write and read the same four tables (`profiles`, `chat_history`, `saved_documents`, `user_learnings`) with the same shape, and switching between them loses nothing | FR-7 | Must |
| PBI-04 | Every assistant response carries the per-user disclaimer — including the streamed responses and the no-key fallback path, not only the in-app chat turn | FR-3 / NFR-5.7 | Must |
| PBI-05 | A test suite covers persona/state resolution and checklist completion, which currently have no coverage at all | NFR-6.1 | Must |
| PBI-06 | The configuration contract is true in code and docs: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are read in `src/supabaseClient.js`, `VITE_GEMINI_API_KEY` is documented in the readme but is not read anywhere in `src/`, and FR-8 currently records "no environment variables referenced" | FR-8 | Must |
| PBI-07 | CI runs `oxlint` and the production build on every push — the lint script exists but nothing invokes it | NFR-6.2 / NFR-6.3 | Should |
| PBI-08 | User-data handling and retention are documented for both modes: what stays in `localStorage`, what leaves the browser when Supabase is configured, and how to erase it | NFR-5.7 | Should |
| PBI-09 | LCP and CLS are measured on the deployed build and the `[TO BE MEASURED]` NFR-1 targets are replaced with real numbers | NFR-1.3 / NFR-1.4 | Should |
| PBI-10 | Dependency vulnerability scan is run, and HTTPS/HSTS plus any rate limiting on the assistant endpoint are assessed | NFR-5.3 / NFR-5.5 / NFR-5.6 | Should |
| PBI-11 | State-specific content goes beyond the 50-state baseline, with a stated source and refresh date for every statutory claim the assistant can make | market differentiator | Could |
| PBI-12 | A paid, vertical practice area taken head-on against Harvey, Lexis+ AI and CoCounsel | market §5 | Won't (this horizon) |

## 3. Sprint plan

**Sprint cadence:** 1 week = 1 sprint; stand-up daily (15 min), sprint review + retrospective at the end of each sprint.

| Sprint | Goal | PBI delivered | Done/exit criteria | Phase (SDLC) |
| --- | --- | --- | --- | --- |
| Sprint 1 | Make the contract true and put a gate on every push | PBI-06, PBI-04, PBI-07 | documented variables match `src/`; disclaimer asserted on all assistant paths; CI green on every push | Requirements → Verify |
| Sprint 2 | Stop exposing the model key in the browser | PBI-01 | assistant answers arrive through a proxy endpoint; no key is sent from or stored on the client in the default configuration | Implement → Verify |
| Sprint 3 | Make the monolith safe to change | PBI-02, PBI-05 | one tool can be edited and released without touching the others; suite green against the walkthrough in `05-use-cases.md` | Implement → Verify |
| Sprint 4 | Make the two storage modes genuinely equivalent | PBI-03 | the same record written through the mock and through Supabase reads back identically; no data loss on switch | Verify |
| Sprint 5 | Close the open NFR rows and cut a release | PBI-08, PBI-09, PBI-10 | NFR-1.3/1.4, NFR-5.3, NFR-5.5, NFR-5.6, NFR-5.7 carry values; release deployed to https://liberty-assist.vercel.app | Release & Operate |
| Sprint 6 | Improve | PBI-11 | retro actions from sprints 1–5 closed or re-planned; content refresh path agreed with a named owner | Improve |

## 4. Ceremonies

- **Daily stand-up (15 min):** what shipped since yesterday, what's blocked, what's next — tied to the active sprint's PBI board.
- **Sprint review (30 min, end of sprint):** demo PBI outcomes against the sprint goal; update `05-use-cases.md` walkthrough where behavior changed.
- **Retrospective (30 min, end of sprint):** inspect + adapt; record one actionable improvement per sprint in git notes.
- **Backlog refinement (before sprint 1):** re-prioritise PBIs against latest market findings.

## 5. Burndown (planned)

Tracked as PBI points remaining per sprint. Planned trajectory below; the team records actuals at each sprint review. `[TO BE MEASURED]` until the first sprint completes.

| Sprint | Planned remaining points |
| --- | --- |
| Start | 58 |
| Sprint 1 | 48 |
| Sprint 2 | 39 |
| Sprint 3 | 30 |
| Sprint 4 | 21 |
| Sprint 5 | 11 |
| Sprint 6 | 0 |
| Done (0) | 0 |

## 6. Rollout & deploy

- Build/deploy per `07-sdlc-lifecycle.md` §5 (release policy).
- Production: `https://liberty-assist.vercel.app`
- Health: a broken build blocks the next sprint's first commit; security findings are release blockers.

## 7. Risks

| Risk | Mitigation |
| --- | --- |
| Requirements drift vs. implemented code | PBI↔FR↔use-case traceability check per change (`07-sdlc-lifecycle.md` §3) |
| Unmeasured NFRs treated as done | `[TO BE MEASURED]` targets stay visible until instrumented |
| Burndown actuals fall off plan | Over-plan cut scope in the retrospective, not mid-sprint |
| Splitting a 2,914-line file while behaviour must stay identical | Characterisation tests (PBI-05) land before the split, and each extracted surface is verified against `05-use-cases.md` |
| Guidance shown without its disclaimer, or with stale statutory content | PBI-04 and PBI-11 make the disclaimer and the content source part of the definition of done |
| Well-funded incumbents (Harvey, Lexis+ AI, CoCounsel) own the paid layer (market §4) | Hold the educational/offline-first position; do not compete on the paid layer inside this horizon |
