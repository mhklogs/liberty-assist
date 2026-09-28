# liberty-assist — Architecture Summary

> Generated from static analysis on 2026-09-28.

## Components

| Layer | Present | Evidence |
| --- | --- | --- |
| Presentation / UI | no | 0 route module(s), 0 component file(s) |
| API / server | no | 0 handler(s), entrypoints: none |
| Domain / business logic | unclear | no dedicated layer detected |
| Persistence | yes | @supabase/supabase-js |
| Authentication | no | none detected |

## Detected frameworks and libraries

| Package | Purpose (inferred) |
| --- | --- |
| `@supabase/supabase-js` | Supabase |
| `@types/react` | dependency |
| `@types/react-dom` | dependency |
| `@vitejs/plugin-react` | dependency |
| `lucide-react` | dependency |
| `oxlint` | dependency |
| `react` | React |
| `react-dom` | React |
| `vite` | Vite |

## Runtime and delivery

| Concern | Finding |
| --- | --- |
| Language mix | JavaScript, CSS, HTML |
| Package manager | npm |
| Container | none |
| Serverless / PaaS | not configured for Vercel |
| CI | none detected |
| Tests | **none detected** |
| Type safety | none detected |

## Environment variables referenced

_None referenced._
