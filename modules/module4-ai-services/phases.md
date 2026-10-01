# Module 4: AI Verification, Language & Matching - Phases

This document outlines the specific phases, tasks, and deadlines for **Module 4**, aligning with the global project build plan.

## Phase 1: Foundation & Setup
**Timeline:** Oct 1-4
**Goal:** Initialize the module, gather initial data, and lay the groundwork for AI services.

### Tasks
- [ ] Create folder structure (`vision/`, `language/`, `matching/`, `approval/`).
- [ ] Initialize Python environment, `requirements.txt`, and `Dockerfile`.
- [ ] Set up `api.py` with FastAPI for exposing endpoints.
- [ ] Gather sample/test photos for flood, landslide, and fire (store in `vision/sample_photos/`).
- [ ] Draft initial prompts for generative AI tasks (`language/prompts/`).

### Dependencies
- Module 2: Agreement on API request/response formats (`shared/api_contract.md`).

---

## Phase 2: AI Early Warning (Alerts)
**Timeline:** Oct 3-8
**Goal:** Generate localized, personalized alerts and implement the approval workflow.

### Tasks
- [ ] Build `alert_generator.py`: Generate personal messages tailored by household type (low-lying home, shop, farmer, fisherman, tourist).
- [ ] Implement `translate.py`: Support English, Konkani, Marathi, and Hindi.
- [ ] Build `human_approval.py`: Add a human-in-the-loop approval step before official alerts go out.
- [ ] Expose alert endpoints in `api.py`.

### Dependencies
- Module 3: Need risk levels and reasons.
- Module 5: Synthetic household profiles.

---

## Phase 3: AI Verification (Live Map Support)
**Timeline:** Oct 6-10
**Goal:** Build the vision and duplicate merging logic to ensure trustworthy reports.

### Tasks
- [ ] Build `classify_photo.py`: Implement photo classifier (pre-trained CNN or fine-tuned model) to verify flood, landslide, and fire images, and flag fakes.
- [ ] Build `train_classifier.py` if custom model fine-tuning is required.
- [ ] Build `duplicate_merge.py`: Logic to group/merge reports from the same place and time.
- [ ] Expose verification and merging endpoints in `api.py`.

### Dependencies
- Module 1: Citizen reports and photos from the frontend.
- Module 2: Backend storage and retrieval of reports.

---

## Phase 4: Recovery & Matching
**Timeline:** Oct 9-12
**Goal:** Help communities recover by generating action plans and matching needs with resources.

### Tasks
- [ ] Build `plan_generator.py`: Generate household action plans (where to go, what to carry, who to call).
- [ ] Build `need_offer_match.py`: Connect a household's specific needs to nearby volunteers and resources (boat, vehicle, water tank, spare room).
- [ ] Expose action plan and matching endpoints in `api.py`.

### Dependencies
- Module 5: Synthetic resources and volunteer data.
- Module 2: Backend storage of needs and resources.

---

## Phase 5: Polish, Responsible AI & Demo Prep
**Timeline:** Oct 12-14
**Goal:** Finalize the module, document AI usage, and prepare for the demo.

### Tasks
- [ ] Feature freeze; focus on bug fixes.
- [ ] Test all `api.py` endpoints with Module 2 integration.
- [ ] Provide input for `docs/ai_tools_used.md` and `docs/responsible_ai.md` (disclose generative AI usage, models).
- [ ] Provide sample test photos and message examples for the demo script.

### Dependencies
- Cross-module testing (Modules 1, 2, 3, and 5) to ensure end-to-end flow.
