# FinForge Developer API Documentation

Welcome to the FinForge Third-Party API. This service allows external developers and organizations to integrate our AI-powered certificate verification engine into their own applications and workflows.

## 1. Getting Started

Our API uses a **Credit-Based Model**. To start verifying certificates, you must:
1.  **Register for an API Key:** Obtain a unique key linked to your email.
2.  **Purchase Credits:** Top up your balance (each verification costs 1 credit).
3.  **Authenticate:** Include your API key in the headers of every request.

---

## 2. Authentication

All requests to the Verification API must include your API key in the `x-api-key` header.

**Header Format:**
```http
x-api-key: cvfy_your_unique_api_key_here
```

> **Security Warning:** Your API key is confidential. Do not share it or include it in client-side code (frontend) that is publicly accessible. Always make API calls from your secure backend server.

---

## 3. Endpoints

### A. Register / Purchase Credits
Initialize your account and receive an API key. In a production environment, this is typically called after a successful payment transaction.

- **URL:** `POST /third_party/api/v1/credits/purchase`
- **Method:** `POST`
- **Query Parameters:**
  - `email` (string): Your registered business email.
- **Response Example:**
```json
{
  "api_key": "cvfy_a1b2c3d4e5f6...",
  "credits": 0,
  "message": "API key created successfully. Purchase credits to start verifying."
}
```

### B. Verify Certificate
The core verification engine. Analyzes a document and returns authenticity scores and extracted data.

- **URL:** `POST /third_party/api/v1/verify`
- **Method:** `POST`
- **Headers:** `x-api-key: <YOUR_KEY>`
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  - `file` (File): Image (JPG/PNG) or PDF of the certificate.
  - `cert_type` (string): The certificate type. Supported: `WAEC`, `NECO`.
- **Response Example:**
```json
{
  "success": true,
  "document_score": 85,
  "document_verdict": "AUTHENTIC",
  "credits_remaining": 49,
  "extracted_info": {
    "candidate_name": "JOHN DOE",
    "exam_year": "2018",
    "registration_number": "4250101001",
    "subjects": [...]
  },
  "flagged_issues": []
}
```

---

## 4. Error Codes

| Status | Code | Meaning |
|---|---|---|
| 401 | `Unauthorized` | Invalid or missing API key. |
| 402 | `Payment Required` | No credits remaining in your account. |
| 400 | `Bad Request` | Invalid file type or missing form fields. |
| 500 | `Server Error` | An internal error occurred during analysis. |

---

## 5. Code Examples

### Python (using `requests`)
```python
import requests

url = "http://api.finforge.com/third_party/api/v1/verify"
headers = {"x-api-key": "cvfy_your_key"}
files = {"file": open("certificate.jpg", "rb")}
data = {"cert_type": "WAEC"}

response = requests.post(url, headers=headers, files=files, data=data)
print(response.json())
```

### Node.js (using `axios` and `form-data`)
```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('file', fs.createReadStream('certificate.pdf'));
form.append('cert_type', 'WAEC');

axios.post('http://api.finforge.com/third_party/api/v1/verify', form, {
  headers: {
    ...form.getHeaders(),
    'x-api-key': 'cvfy_your_key'
  }
}).then(res => console.log(res.data));
```
