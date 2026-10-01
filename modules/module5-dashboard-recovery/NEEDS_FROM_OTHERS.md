# NEEDS_FROM_OTHERS.md — Module 5 Assumptions

This file tracks every API field or contract assumption Module 5 has made.
**Update this file when Module 2 shares `API.md` or `shared/api_contract.md`.**

---

## Auth (Module 2)

| Assumption | Field | Notes |
|---|---|---|
| Auth token stored in `localStorage` key `agrim_token` | `agrim_token` | Replace with Supabase session if Module 2 uses Supabase auth |
| Token payload (base64 JSON) contains `{ id, name, role }` | — | Role values: `citizen`, `volunteer`, `authority` |

---

## Reports (`/reports`)

| Assumption | Field | Actual (fill in) |
|---|---|---|
| Status values are exactly `open`, `assigned`, `resolved` | `status` | |
| Severity values are `low`, `medium`, `high` | `severity` | |
| Hazard type values are `flood`, `landslide`, `fire` | `hazard_type` | |
| `assigned_volunteer` is the volunteer's `id` string | `assigned_volunteer` | |
| `PATCH /reports/:id` accepts partial body | — | |

---

## Alerts (`/alerts`)

| Assumption | Field | Actual |
|---|---|---|
| Alert status values: `pending`, `approved`, `rejected` | `status` | |
| Translations object: `{ en, kok, mr, hi }` | `translations` | |
| `POST /alerts/:id/approve` body: `{ name, id }` (approver) | — | |
| `POST /alerts/:id/reject` body: `{ reason }` | — | |

---

## Resources (`/resources`)

| Assumption | Field | Actual |
|---|---|---|
| Type values: `boat`, `vehicle`, `water_tank`, `spare_room`, `first_aid` | `type` | |
| `available` is a boolean | `available` | |

---

## Retrain endpoint

| Assumption | Notes |
|---|---|
| `POST /retrain` exists on the Module 3 service (or Module 2 proxies it) | Disable button with tooltip if 404/unreachable |
| Returns `{ status, message }` | |

---

## Volunteers (`/volunteers`)

| Assumption | Field | Actual |
|---|---|---|
| `availability` is boolean | `availability` | |
| `skills` is a comma-separated string | `skills` | |
| `area` is a string matching report area | `area` | |
