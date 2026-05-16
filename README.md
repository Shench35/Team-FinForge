# CertVerify — AI-Powered Academic Certificate Verification

**Squad Hackathon 3.0 | Challenge 01 — Proof of Life | Education Domain**

> Verify a WAEC or NECO certificate in 15 seconds. Not 5 hours.

---

## Table of Contents

1. [The Problem](#problem)
2. [Our Solution](#solution)
3. [How It Works](#how-it-works)
4. [System Architecture](#architecture)
5. [Tech Stack](#tech-stack)
6. [Setup & Installation](#setup)
7. [API Reference](#api)
8. [Business Model](#business)
9. [Roadmap](#roadmap)

---

## The Problem

Certificate fraud is endemic across West Africa.

- An estimated **30–40% of credentials** in certain sectors are forged
- Manual verification takes **2–5 hours per certificate** and costs **$5–20**
- There is no accessible, automated system built specifically for Nigerian exam bodies

The existing solutions are manual, slow, expensive, and unscalable. Employers, universities, and government agencies have no reliable way to verify credentials at scale.

---

## Our Solution

CertVerify is a two-layer AI verification system built specifically for WAEC and NECO certificates.

**Layer 1 — Visual Forensics (Gemini Vision)**
The certificate image is sent to Gemini with a structured reference template of what an authentic WAEC or NECO document looks like. Gemini checks layout, fonts, seals, QR codes, candidate photos, required text markers, and signs of tampering.

**Layer 2 — Independent Rule Validation (Python)**
Our own code independently validates the extracted data — registration number format, grade-remark consistency, age sanity checks, subject count, and duplicate detection — without relying on Gemini. Failures deduct severity-weighted penalty points from the score.

**Result:** A trust score from 0–100 with a clear verdict and a detailed explainable report.

| Verdict | Score | Meaning |
|---|---|---|
| `AUTHENTIC` | 75–100 | Certificate appears genuine |
| `SUSPICIOUS` | 40–74 | Issues detected, recommend manual review |
| `HIGH_RISK` | Below 40 | Multiple critical failures, likely fraudulent |

---

## How It Works

```
User selects WAEC or NECO → uploads certificate (JPG, PNG, PDF)
                ↓
Gemini Vision analyses against reference template (8–12s)
                ↓
Python validator runs independent rule checks (1–2s)
                ↓
Scores combined → trust score calculated → verdict produced
                ↓
Detailed report: score, verdict, flagged issues, extracted data
```

**Verification time:** ~15 seconds
**Manual alternative:** 2–5 hours

---

## System Architecture

```
┌─────────────────────────────────────┐
│         React Frontend              │
│  (Upload → Results → Dashboard)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         FastAPI Backend             │
│  ├── /AI_pipeline  (verification)   │
│  ├── /payment      (Squad)          │
│  └── /third_party  (B2B API)        │
└──────┬───────────────────┬──────────┘
       │                   │
┌──────▼──────┐   ┌────────▼────────┐
│ Gemini API  │   │  PostgreSQL DB   │
│ (Vision)    │   │  + JSON store   │
└─────────────┘   └────────┬────────┘
                           │
                  ┌────────▼────────┐
                  │  Squad Payment  │
                  │  (Webhook)      │
                  └─────────────────┘
```

### Key Backend Files

```
backend_python_fastapi/
├── document_analyser.py     ← Gemini Vision prompt + parsing
├── validator.py             ← Independent rule-based validation
├── reference_template.py    ← WAEC + NECO reference schemas
├── pipeline_route.py        ← Main verification endpoints
├── payment.py               ← Squad payment integration
├── third_party.py           ← B2B API key + credit management
├── third_party_route.py     ← B2B API endpoints
├── auth_dependencies.py     ← JWT verification
└── DB/                      ← SQLModel ORM + PostgreSQL
```

---

## Tech Stack

### Frontend
- **React 19 + TypeScript** — type-safe UI
- **Vite** — fast builds and HMR
- **Tailwind CSS** — utility-first styling
- **React Router v7** — client-side routing
- **React Context** — auth and demo state management

### Backend
- **FastAPI** — async Python API framework
- **Gemini 1.5 Flash** — vision model for document analysis
- **PostgreSQL + SQLModel** — typed ORM with ACID transactions
- **httpx** — async HTTP client for Squad API calls
- **python-jose** — JWT verification

### Infrastructure
- **Squad** — Nigerian payment processor (webhooks, transaction verification)
- **ngrok** — local tunnel for webhook testing

### Why These Choices

| Choice | Why |
|---|---|
| FastAPI | Async from ground up, auto-generated docs, Pydantic validation |
| Gemini 1.5 Flash | Best speed-to-quality ratio for vision tasks, generous free tier |
| Squad | Built for Nigeria, hackathon partner, webhook support |
| Two-layer validation | Gemini alone can hallucinate — rules catch what AI misses |

---

## Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### Backend

```bash
cd backend_python_fastapi

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Fill in your keys (see below)

# Start server
uvicorn main:app --reload --port 8000
```

**`.env` variables:**
```env
SQUAD_SECRET_KEY=sandbox_sk_your_key
SQUAD_BASE_URL=https://sandbox-api-d.squadco.com
DATABASE_URL=postgresql://user:password@localhost/certverify
GEMINI_API_KEY=your_gemini_key
JWT_SECRET=your_shared_jwt_secret
```

### Frontend

```bash
cd frontend
npm install
npm run dev                     # http://localhost:5173
```

**`.env` variables:**
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Run Both

```bash
# Terminal 1
cd backend_python_fastapi && uvicorn main:app --reload

# Terminal 2
cd frontend && npm run dev

# API docs
open http://localhost:8000/docs
```

---

## API Reference

### Core Verification

**Verify a certificate**
```
POST /AI_pipeline/verify/analyse
Content-Type: multipart/form-data
```

| Field | Type | Required | Values |
|---|---|---|---|
| `file` | File | ✅ | JPG, PNG, PDF |
| `cert_type` | String | ✅ | `WAEC` or `NECO` |

**Example:**
```javascript
const formData = new FormData();
formData.append('file', certificateFile);
formData.append('cert_type', 'WAEC');

const res = await fetch('http://localhost:8000/AI_pipeline/verify/analyse', {
  method: 'POST',
  body: formData
});

const result = await res.json();
```

**Success response:**
```json
{
  "success": true,
  "document_score": 85,
  "document_verdict": "AUTHENTIC",
  "flagged_issues": [],
  "triggered_flags": [],
  "extracted_info": {
    "candidate_name": "SANNI RASHEEDAT BOLUWATIFE",
    "registration_number": "4280140134",
    "exam_year": "2021",
    "school_name": "VIVANIS COLLEGE, ABEOKUTA",
    "subjects": [
      {"subject": "ENGLISH LANGUAGE", "grade": "B3", "remark": "GOOD"}
    ]
  }
}
```

**Type mismatch response:**
```json
{
  "success": false,
  "type_mismatch": true,
  "message": "This does not appear to be a WAEC certificate. It looks like: NECO certificate",
  "detected_type": "NECO"
}
```

### Payment

```
POST /payment/pay/initiate?email=user@test.com&amount_naira=500
GET  /payment/pay/verify/{transaction_ref}
POST /payment/webhook   ← Squad calls this automatically
```

### B2B Third-Party API

```
POST /third_party/api/v1/credits/purchase?email=dev@company.com
POST /third_party/api/v1/verify
     Header: x-api-key: cvfy_your_key
```

Full B2B docs: see `/Readme_F/THIRD_PARTY_API_DOCS.md`

---

## Business Model

### Revenue Streams

**B2C Subscriptions**

| Plan | Price | Verifications |
|---|---|---|
| Free | ₦0 | 3/month |
| Pro | ₦5,000/month | 20/month |
| Pro Max | ₦15,000/month | Unlimited |

**B2B API Credits**

| Bundle | Price | Credits |
|---|---|---|
| Starter | ₦50,000 | 500 credits |
| Growth | ₦150,000 | 2,000 credits |
| Enterprise | Custom | Custom |

### Market Size

| Segment | Opportunity |
|---|---|
| WAEC/NECO verifications (Nigeria) | ~10M/year |
| West African expansion | ~25M/year |
| Global African diaspora credentials | $1B+ TAM |

### vs. Manual Verification

| | Manual | CertVerify |
|---|---|---|
| Time | 2–5 hours | 15 seconds |
| Cost | ₦5,000–20,000 | ₦300–1,000 |
| Audit trail | None | Complete |
| Scale | 5–10/day | 5,000+/day |

---

## What Makes This Different

**Domain-specific, not generic**
Our reference templates are built from real WAEC and NECO certificates. We know what "SUBJECT RECORDED: EIGHT" means. Generic document tools do not.

**Two-layer validation**
Gemini handles visual reasoning. Our Python rules handle strict logic. Neither fully trusts the other. This is how production fraud detection systems work.

**Explainable verdicts**
We don't just say "fake". We say "missing Chairman of Council signature (severity: 35), grade-remark mismatch on subject 3 (severity: 35)". Institutions need to know why.

**B2B ready from day one**
Credit-based API with key management means any HR platform, university portal, or recruitment tool can plug in immediately.

---

## Roadmap

### Post-Hackathon (Month 1–2)
- Re-enable JWT authentication and payment gate
- Production deployment on cloud
- GCE and IGCSE certificate support
- Rate limiting per API key

### Growth (Month 3–6)
- Knowledge assessment layer (candidate Q&A)
- Institution dashboard for bulk verification
- Ghana and Kenya expansion (WASSCE, KCSE)
- Analytics and reporting

### Enterprise (Month 7–12)
- White-label solution for universities
- Direct WAEC/NECO API integration
- Degree certificate verification
- International expansion

---

## Demo Notes

**Demo build:** Auth and payment gate are disabled on `/AI_pipeline/verify/analyse` for frictionless judging.

**Test files:** Use the sample WAEC and NECO certificates in `/test_data/`

**API docs:** http://localhost:8000/docs (interactive, try it live)

**Analysis time:** 12–15 seconds — keep the loading spinner visible

---

## Team FinForge

Built at Squad Hackathon 3.0 — May 2026

**What this is:** A credible, full-stack foundation for Nigeria's certificate verification infrastructure.

**What this is not:** A generic document scanner. A vaporware blockchain pitch. A toy.

---

*"Verification in 15 seconds. Not 5 hours."*
