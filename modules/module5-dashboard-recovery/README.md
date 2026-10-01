# Module 5 — Authority Dashboard & Recovery

> **Agrim** · Sankalp Setu Hackathon 2026 · Goa University

React + Vite + Tailwind CSS dashboard for disaster authority officers, volunteers, and citizens.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Start in mock mode (no backend needed)
npm run dev
```

Open **http://localhost:5173** and log in with one of the demo accounts:

| Role      | Email                   | Password   | Pages accessible |
|-----------|-------------------------|------------|------------------|
| Authority | authority@demo.goa      | demo1234   | All pages        |
| Volunteer | volunteer@demo.goa      | demo1234   | Tasks, Shelters, Recovery |
| Citizen   | citizen@demo.goa        | demo1234   | Recovery Tracker |

---

## Mock mode

`VITE_USE_MOCK=true` (set in `.env`) routes **every API call** to `src/services/mockApi.js`
which uses 100 % synthetic data from `src/services/mockData.js`.
No real backend is needed — great for development and demo.

To connect to the real Module 2 backend:

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

---

## Pages

| Page | Route | Role |
|------|-------|------|
| Authority Dashboard | `/dashboard` | authority |
| Alert Approval | `/alerts` | authority |
| Shelters & Resources | `/shelters` | authority, volunteer |
| Recovery Tracker | `/recovery` | all |
| Lessons Learned | `/lessons` | authority |
| Volunteer Tasks | `/tasks` | volunteer |

---

## Project structure

```
src/
├── pages/           ← One file per page
├── components/
│   ├── ui/          ← SpotlightCard, StatusBadge, AnimatedTabs, States
│   ├── Navbar.jsx
│   ├── RoleGuard.jsx
│   ├── StatusBoard.jsx
│   └── IncidentTimeline.jsx
├── services/
│   ├── api.js       ← All API calls (switches on VITE_USE_MOCK)
│   ├── mockApi.js   ← In-memory mock
│   └── mockData.js  ← Synthetic data
├── context/
│   └── AuthContext.jsx
└── styles/
    └── tokens.css   ← Design tokens + Tailwind directives
```

---

## UI inspiration

Components draw visual inspiration from [Inspira UI](https://inspira-ui.com) (MIT licence).
Re-implemented as idiomatic React (no Vue/Nuxt code). Credited in `docs/ai_tools_used.md`.

---

## Responsible AI notes

- **All data is synthetic** — no real names, phones or addresses anywhere.
- **Alert approval is mandatory** — no official alert is sent without authority sign-off.
- Generative AI tools used are listed in `docs/ai_tools_used.md`.
