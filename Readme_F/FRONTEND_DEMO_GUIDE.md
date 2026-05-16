# Team FinForge - Demo Integration Guide (Simplified)

This guide is designed for the current demo phase. It focuses on the **Payment Flow** and the **Document Verification** results, omitting security headers and the interactive assessment phase for now.

---

## High-Level Demo Workflow

1.  **Payment:** User initiates payment and is redirected to the Squad checkout.
2.  **Verification:** User uploads their certificate. The AI verifies authenticity and returns a trust verdict.

---

## 1. Payment Endpoints (Squad Integration)

The payment flow is required before verification can be processed.

### A. Initiate Payment
Generates a checkout URL for the user.

- **URL:** `/payment/pay/initiate`
- **Method:** `POST`
- **Query Parameters:**
  - `email` (string): The user's email address.
  - `amount_naira` (float): The amount to charge (e.g., `1000.0`).
- **Response Example:**
```json
{
    "checkout_url": "https://sandbox-api-d.squadco.com/pay/...",
    "transaction_ref": "4f9e3..."
}
```
- **Action:** Open the `checkout_url` in a new tab or redirect the user.

### B. Verify Payment Status
Checks if the payment was successful.

- **URL:** `/payment/pay/verify/{transaction_ref}`
- **Method:** `GET`
- **Response Example:**
```json
{
    "paid": true,
    "status": "success",
    "amount": 100000,
    "email": "user@example.com",
    "transaction_ref": "..."
}
```

---

## 2. Document Analysis (AI Verification)

This endpoint processes the uploaded certificate and returns a trust score.

- **URL:** `/AI_pipeline/verify/analyse`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Security:** None (No Authorization header required for demo).
- **Request Body:**
  - `file` (File): Image (JPG/PNG) or PDF of the certificate.
  - `cert_type` (string): The certificate type (e.g., `WAEC`, `NECO`).
- **Response Example:**
```json
{
    "success": true,
    "document_score": 88,
    "document_verdict": "AUTHENTIC",
    "document_details": {
        "candidate_name": "SALIU ABDULLAHI",
        "exam_year": "2017",
        "registration_number": "4250..."
    },
    "flagged_issues": [],
    "message": "Document analysed successfully."
}
```

---

## 3. Important Implementation Notes

1.  **CORS:** The backend is configured to allow all origins (`*`), so you shouldn't face any CORS issues during the demo.
2.  **Base URL:** Use `http://localhost:8000` (or the provided ngrok/server URL) as the base for all requests.
3.  **No Auth Required:** You **do not** need to send any JWT or Bearer tokens in the headers for these endpoints.
4.  **Loading States:** AI analysis takes approximately **10-15 seconds**. Please ensure the frontend shows a "Verifying Certificate..." spinner.
5.  **Assessment Data:** You may see a `questions` array in the response; please **ignore** it for the current demo.
