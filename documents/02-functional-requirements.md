# liberty-assist — Functional Requirements

> Derived from static analysis of the source tree on 2026-09-28. Each requirement cites
> the file that evidences it, so any claim can be checked. Requirements marked
> *inferred* are derived from naming and structure rather than an explicit
> specification.

## FR-1 Route and page behaviour

No file-system-routed pages were detected. This project appears to be a library, CLI, notebook collection, or a single-page entrypoint.


## FR-2 Programmatic interface

*No API route handlers detected.*

## FR-3 Presentation components

*No dedicated component directory detected.*

## FR-7 Persistence

A database or storage client is a dependency. The system shall persist domain records durably, and shall not lose writes on transient failure. *(inferred)*

## FR-8 Configuration

The following environment variables are referenced in source. Each shall be
validated at startup with a clear error when missing.

| Variable | Referenced in |
| --- | --- |
| *(none referenced)* | — |
