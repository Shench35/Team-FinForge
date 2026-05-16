# FinForge API — Frontend Integration Guide

**Demo Build** | Last Updated: May 15, 2026

---

## Demo Configuration

| Feature | Status | Note |
|---|---|---|
| JWT Authentication | Disabled | Re-enabled after demo |
| Payment Gate | Disabled | Re-enabled after demo |
| Knowledge Assessment | On Hold | Pitched as future feature |
| Document Analysis | ✅ Live | Core feature — fully working |

---

## Base URL

```
http://localhost:8000
```

---

## 1. Certificate Verification

This is the main endpoint. Call it directly with a certificate file and type.

**Endpoint**
```
POST /AI_pipeline/verify/analyse
Content-Type: multipart/form-data
```

**Form Fields**

| Field | Type | Required | Values |
|---|---|---|---|
| `file` | File | ✅ | JPG, PNG, PDF |
| `cert_type` | String | ✅ | `WAEC` or `NECO` |

**Example**
```javascript
const verifyCertificate = async (file, certType) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('cert_type', certType);

  const response = await fetch('http://localhost:8000/AI_pipeline/verify/analyse', {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  return result;
};
```

**Success Response**
```json
{
  "success": true,
  "document_score": 85,
  "document_verdict": "AUTHENTIC",
  "flagged_issues": [],
  "triggered_flags": [],
  "extracted_info": {
    "candidate_name": "JOHN DOE",
    "exam_year": "2018",
    "registration_number": "4250101001",
    "subjects": [...]
  }
}
```

**Verdict Values**

| Verdict | Score Range | Meaning |
|---|---|---|
| `AUTHENTIC` | 75 - 100 | Certificate appears genuine |
| `SUSPICIOUS` | 40 - 74 | Issues detected, needs review |
| `HIGH_RISK` | Below 40 | Likely fraudulent |

**Error Response**
```json
{
  "success": false,
  "error": "Could not process file"
}
```

---

## 2. Type Mismatch Response

If the user selects WAEC but uploads a NECO certificate:

```json
{
  "success": false,
  "type_mismatch": true,
  "message": "This does not appear to be a WAEC certificate. It looks like: NECO certificate",
  "detected_type": "NECO"
}
```

Handle this by showing the user a clear message and letting them reselect the type.

---

## 3. Payment Endpoints

Available for demo but not linked to verification in this build.

**Initiate Payment**
```
POST /payment/pay/initiate?email=user@test.com&amount_naira=500
```

**Verify Payment**
```
GET /payment/pay/verify/{transaction_ref}
```

---

## 4. What to Show on the Results Screen

```javascript
if (result.success) {
  // 1. Show Extracted Data
  const name = result.extracted_info.candidate_name
  const year = result.extracted_info.exam_year

  // 2. Show Results
  const score = result.document_score        // 0-100 number
  const verdict = result.document_verdict    // AUTHENTIC / SUSPICIOUS / HIGH_RISK
  const issues = result.flagged_issues       // Array of issue strings
  const flags = result.triggered_flags       // Array of technical flag objects

  // Colour code the verdict
  // AUTHENTIC  → green
  // SUSPICIOUS → amber
  // HIGH_RISK  → red

} else if (result.type_mismatch) {
  // Show type mismatch message
  const message = result.message

} else {
  // Show generic error
  const error = result.error
}
```

---

## 5. Implementation Checklist

- [ ] File upload accepts JPG, PNG, PDF only
- [ ] Show cert type selector — WAEC or NECO
- [ ] Show loading spinner — analysis takes **10-15 seconds**
- [ ] Handle `type_mismatch` response with clear user message
- [ ] Display `document_score` as a visual score ring or bar
- [ ] Display `document_verdict` with colour coding
- [ ] Display `flagged_issues` as a list if verdict is not AUTHENTIC
- [ ] Handle `success: false` with error message

---

## 6. Important Notes for Demo

- Analysis takes **10-15 seconds** — do not remove the loading spinner
- The endpoint accepts real certificates — use the sample WAEC and NECO files provided
- `triggered_flags` contains detailed technical information — useful for the judges panel view
- Do not expose `raw_gemini_result` in the UI

---

*After the hackathon: JWT auth and payment gate will be re-enabled. The frontend will need to send `Authorization: Bearer <token>` header on all requests.*
