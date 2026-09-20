# JourneyFlow - Customer Event Simulator
> Production-grade cross-channel customer event simulator designed for hackathons, powering identity resolution and journey intelligence platforms.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.2-646cff.svg)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4.19-green.svg)](https://expressjs.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac.svg)](https://tailwindcss.com/)

---

## 1. Project Overview

**JourneyFlow Simulator** generates realistic synthetic customer interaction events across physical and digital touchpoints:
1. **Website** (browsing, session cookies, logins, checkout)
2. **Mobile App** (app opens, hardware device IDs, order tracking, native Apple Pay)
3. **Call Center / IVR** (inbound calls, multi-turn cases, sentiment, escalations)
4. **Physical Store** (beacon visits, associate consultations, POS transactions)

Instead of requiring external production systems during a hackathon, this simulator acts as a high-fidelity event source. It feeds structured events into an ingestion endpoint (`POST /events`), allowing identity resolution engines to demonstrate:
- Cross-channel stitching & retrospective attribution
- Session-aware identity resolution (shared browsers / multi-user devices)
- Weak evidence handling & ambiguity detection
- Conflicting evidence preservation
- Drop-off, abandonment, repeat-contact, and churn-risk intelligence

---

## 2. Architecture & Ingestion Pipeline

```
               React 18 + Vite Frontend
                          │
      ┌───────────────────┴───────────────────┐
      │                                       │
      ▼ (POST /demo/scenario/:id)             ▼ (POST /events)
   Scenario                                Custom / Bulk
   Generators                               Events Form
      │                                       │
      └───────────────────┬───────────────────┘
                          │
                          ▼
            Universal Event Ingestion Pipeline
           (Validation, ID & Timestamp default)
                          │
                          ▼
               In-Memory Event Store
            (Thread-safe query, metrics)
                          │
                          ▼
           Identity Resolution & Journey Graph
```

> **Strict Pipeline Principle**: Predefined demo scenarios do **not** bypass the pipeline. All generated demo events are routed through the exact same ingestion and validation logic as external events sent to `POST /events`.

---

## 3. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, TypeScript, tsx
- **Data Layer**: In-Memory Event Store (stateless across process restarts; supports rapid demo resets)
- **Tooling**: Concurrently (single command development runner)

---

## 4. Folder Structure

```
journeyflow-simulator/
├── package.json                 # Unified dependency manager & scripts
├── tsconfig.json                # Strict TypeScript configuration
├── vite.config.ts               # Vite configuration with backend proxy
├── tailwind.config.js           # Dark theme design tokens
├── postcss.config.js            # PostCSS configuration
├── index.html                   # HTML5 application shell
├── .env.example                 # Environment variables template
├── test-all-endpoints.ts        # Automated end-to-end API test suite
├── README.md                    # Project documentation
└── src/
    ├── shared/
    │   ├── types.ts             # Shared interfaces (Events, Scenarios, Results)
    │   └── scenariosList.ts     # Metadata for all 15 predefined scenarios
    ├── backend/
    │   ├── server.ts            # Express server entry point & CORS
    │   ├── routes/
    │   │   ├── events.ts        # POST/GET /events, GET /events/:id, metrics
    │   │   ├── scenarios.ts     # POST /demo/scenario/:id, GET /demo/scenarios
    │   │   └── system.ts        # GET /health, POST /reset
    │   ├── services/
    │   │   ├── eventStore.ts    # Event store, normalization, status detection
    │   │   └── scenarioRunner.ts# Scenario execution through ingestion logic
    │   └── scenarios/
    │       └── definitions.ts   # Scenario generators & deterministic telemetry
    └── frontend/
        ├── main.tsx             # React DOM root
        ├── App.tsx              # Main dashboard controller
        ├── index.css            # Tailwind & dark theme styling
        ├── services/
        │   └── api.ts           # REST API client
        └── components/
            ├── Navbar.tsx       # Brand header, status indicator & action buttons
            ├── HeroPipeline.tsx # Interactive simulation pipeline visualizer
            ├── MetricsGrid.tsx  # Dynamic computed metrics cards
            ├── ScenarioSection.tsx # Category tabs & 15 scenario cards
            ├── ScenarioCard.tsx # Scenario card with run trigger & loading state
            ├── ScenarioResultPanel.tsx # Execution verification & insights panel
            ├── IdentityGraph.tsx# Live identity resolution node graphs
            ├── FilterBar.tsx    # Channel, Type, Scenario filters & Search
            ├── EventTable.tsx   # Live event stream table with status badges
            ├── EventDetailsDrawer.tsx # Attribute inspector & raw JSON viewer
            ├── CustomEventModal.tsx   # Manual single-event dispatcher
            ├── BulkEventModal.tsx     # Synthetic batch generator (10-100)
            ├── ResetConfirmModal.tsx  # Confirmation modal for demo reset
            ├── StatusBadge.tsx        # Identity & channel badges
            └── ToastContainer.tsx     # Floating toast notifications
```

---

## 5. Installation & Running

### Prerequisites
- Node.js >= 18.0.0 (tested on v24)
- npm >= 9.0.0

### Quick Start (Single Command)

```bash
# 1. Clone or navigate to the directory
cd journeyflow-simulator

# 2. Install all dependencies
npm install

# 3. Launch both Backend & Frontend concurrently
npm run dev
```

### URLs:
- **Frontend Dashboard**: `http://localhost:5173`
- **Backend API**: `http://localhost:3000`

### Additional Commands:
```bash
npm run test     # Run the automated end-to-end API verification suite
npm run build    # Build production assets with zero TypeScript errors
npm run lint     # Run TypeScript type check
```

---

## 6. Available Scenarios (All 15 Implemented)

### Category: IDENTITY RESOLUTION
1. **Cross-Channel Identity Resolution** (`identity-resolution`):
   - Anonymous visitor views electronics, authenticates, opens mobile app, and places support call.
   - Outcome: `ANON-WEB-1001 → U-1001 → CUST-1001` stitched across Web, Mobile, and Call Center.
2. **Anonymous → Login** (`anonymous-login`):
   - 3 pre-login browsing actions followed by login and checkout.
   - Outcome: Retrospective binding of previous anonymous session events to `CUST-1002`.
3. **Ambiguous Identity** (`identity-ambiguity`):
   - Inbound query with weak identifier: Name "Amit Patel" with no phone or account.
   - Outcome: `status: AMBIGUOUS`, confidence: `LOW`, candidates: `[CUST-1003, CUST-1004]`.
4. **Identity Conflict** (`identity-conflict`):
   - Single event with contradictory keys: Caller phone matches `CUST-1005` while order matches `CUST-1006`.
   - Outcome: `status: CONFLICT`. Both candidates preserved without destructive merge.
5. **Shared Browser** (`shared-browser`):
   - Same browser cookie (`ANON-SHARED-01`) used across two sessions by different people (`CUST-1013` & `CUST-1014`).
   - Outcome: Session-aware resolution prevents permanent cookie-to-person corruption.
6. **Multiple Phone Numbers** (`multiple-phone`):
   - Customer `CUST-1015` uses both primary (+91 9876500015) and secondary (+91 9876500099) phones.
   - Outcome: Both numbers resolve to the single unified customer record.
7. **Unresolved Identity** (`unresolved`):
   - Anonymous traffic (`ANON-UNKNOWN-999`, `DEV-UNKNOWN`) without identifiable keys.
   - Outcome: Retains `status: UNRESOLVED` without forcing arbitrary customer creation.
8. **Retrospective Resolution** (`retrospective-resolution`):
   - Multi-step funnel initially anonymous; resolved upon subsequent login within the session.

### Category: JOURNEY INTELLIGENCE
9. **Checkout Drop-off** (`checkout-dropoff`):
   - Funnel progresses to `checkout_started` but omits `purchase`.
   - Pattern: `CHECKOUT DROP-OFF` (Cart Abandonment).
10. **Payment Failure Drop-off** (`payment-failure`):
    - Payment gateway rejects transaction (`bank_declined`).
    - Pattern: `PAYMENT FAILURE DROP-OFF`.
11. **Call Center Escalation** (`call-center-escalation`):
    - Case `CASE-7011` created with normal priority; customer calls back unresolved.
    - Pattern: `CALL CENTER ESCALATION` (Priority raised to HIGH).
12. **Repeat Contact** (`repeat-contact`):
    - 3 calls within a short SLA window for the same delivery delay.
    - Pattern: `REPEAT CONTACT DETECTED`.
13. **Churn-Associated Journey** (`churn-associated`):
    - Payment failure → Support call → Repeat call → Escalation → No purchase.
    - Pattern: `CHURN-ASSOCIATED PATTERN`.

### Category: CHANNELS
14. **Mobile App Journey** (`mobile-app`):
    - Native mobile app lifecycle with device ID `DEV-IOS-9941` and Apple Pay checkout.
15. **Physical Store** (`physical-store`):
    - In-store beacon detection, associate consultation, and POS terminal transaction `TXN-88219`.

---

## 7. Working API Endpoints

### 1. `GET /health`
Returns service status.
```json
// Response (200 OK)
{
  "status": "ok",
  "service": "journeyflow-event-simulator"
}
```

### 2. `POST /events`
Accepts a single event or a batch of events. Validates, assigns `event_id` and timestamp if omitted, stores in memory, and returns metadata.

**Single Event Request:**
```json
POST /events
Content-Type: application/json

{
  "event": {
    "channel": "web",
    "event_type": "page_view",
    "session_id": "SES-WEB-901",
    "anonymous_id": "ANON-WEB-901",
    "data": {
      "url": "/products/audio"
    }
  }
}
```

**Batch Request:**
```json
POST /events
Content-Type: application/json

{
  "events": [
    {
      "channel": "mobile_app",
      "event_type": "app_open",
      "session_id": "SES-MOB-01"
    },
    {
      "channel": "call_center",
      "event_type": "support_call",
      "phone": "9876500001",
      "customer_id": "CUST-1001"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "received": 2,
  "event_ids": [
    "EVT-000001",
    "EVT-000002"
  ],
  "events": [ ... ]
}
```

### 3. `GET /events`
Returns all received events. Supports optional query filters:
- `?channel=web`
- `?event_type=purchase`
- `?scenario=checkout-dropoff`
- `?search=rahul`

```json
// Response (200 OK)
{
  "success": true,
  "count": 8,
  "events": [ ... ]
}
```

### 4. `GET /events/:eventId`
Returns a specific event by ID.
```json
// GET /events/EVT-000001 (200 OK)
{
  "success": true,
  "event": {
    "event_id": "EVT-000001",
    "timestamp": "2026-09-20T08:00:00.000Z",
    "channel": "web",
    "event_type": "page_view",
    "session_id": "SES-WEB-1001",
    "anonymous_id": "ANON-WEB-1001",
    "user_id": null,
    "customer_id": null,
    "identity_status": "UNRESOLVED"
  }
}

// GET /events/EVT-NONEXISTENT (404 Not Found)
{
  "success": false,
  "message": "Event not found"
}
```

### 5. `POST /demo/scenario/:scenarioId`
Triggers one of the 15 predefined scenarios through the ingestion pipeline.
```bash
POST /demo/scenario/checkout-dropoff
```
```json
// Response (200 OK)
{
  "success": true,
  "scenario": "checkout-dropoff",
  "events_generated": 4,
  "events": [ ... ],
  "metadata": { ... },
  "analysis": {
    "detectedPattern": "CHECKOUT DROP-OFF",
    "identityStatus": "RESOLVED",
    "checklist": [ ... ],
    "explanation": "..."
  }
}
```

### 6. `POST /reset`
Clears in-memory events, state, and metrics.
```json
// Response (200 OK)
{
  "success": true,
  "message": "Demo reset successfully"
}
```

---

## 8. Hackathon Demonstration Flow

Follow this exact walkthrough during judging:

1. **Step 1: Clean Slate**
   - Open `http://localhost:5173`.
   - Observe header: `● API Connected`, `Events: 0`.
   - Observe Empty State in Event Stream with call-to-action button.

2. **Step 2: Cross-Channel Identity Stitching**
   - Click **Run Scenario** on **Cross-Channel Identity Resolution**.
   - 8 events populate instantly with realistic timestamps.
   - Result Panel displays graph: `ANON-WEB-1001 ➔ U-1001 ➔ CUST-1001`.
   - Mobile and IVR events unify to `CUST-1001`.

3. **Step 3: Journey Drop-off**
   - Click **Checkout Drop-off**.
   - Result displays: `Product View ➔ Add To Cart ➔ Checkout Started ➔ DROP-OFF`.
   - Checklist flags: `⚠ Purchase event missing`.

4. **Step 4: Customer Escalation**
   - Click **Call Center Escalation**.
   - Watch `CASE-7011` transition from normal priority to high escalation.

5. **Step 5: Identity Ambiguity**
   - Click **Ambiguous Identity**.
   - Observe `status: AMBIGUOUS`. Identity graph visualizes 50% split between `CUST-1003` and `CUST-1004` without false merging.

6. **Step 6: Identity Conflict**
   - Click **Identity Conflict**.
   - Observe `status: CONFLICT`. Demonstrates preservation of dual conflicting evidence (Phone vs. Order).

7. **Step 7: Shared Browser Session Boundary**
   - Click **Shared Browser**.
   - Visualizes two sessions on `ANON-SHARED-01` resolving to two separate customers (`CUST-1013` & `CUST-1014`).

8. **Step 8: Advanced Custom & Bulk Generators**
   - Click **+ Custom Event** to craft and send a manual event directly to `POST /events`.
   - Click **Batch (10-100)** to generate 50 realistic synthetic events.
   - Filter by channel, search for phone numbers, and export full logs to JSON or CSV.

9. **Step 9: Reset**
   - Click **Reset Demo**.
   - Confirm in modal. Metrics return to 0 and empty state renders cleanly.

---

## 9. Troubleshooting

- **API Disconnected?**
  - Verify that the Express server is running on port 3000 (`npm run server` or `npm run dev`).
  - Check that port 3000 is not blocked by another application.
- **Port Conflict?**
  - Set `PORT=3001` in `.env` and update `VITE_API_BASE_URL` accordingly.
- **Module Warnings?**
  - Ensure `package.json` contains `"type": "module"`.

# testing_history
