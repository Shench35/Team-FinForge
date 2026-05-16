# Team FinForge - Full Demo Workflow & State Guide

This document outlines the complete flow from landing to verification, including Tiered Access.

---

## 1. Initial Entry & Auth (Teammate's Scope)
- **Landing Page:** The first thing users see is the **Dashboard**.
- **Login/Signup:** Use the authentication system provided by the Auth Lead.
- **The Handover Point:** Once the user is logged in, your global state **MUST** capture the user's `email`.
- **Default State:** Immediately after a successful login, set the following initial state:
```javascript
const [userRole, setUserRole] = useState('regular'); 
const [freeCredits, setFreeCredits] = useState(1);
const [userEmail, setUserEmail] = useState(loggedInEmail); // From Auth System
```

---

## 2. The Dashboard Experience (Regular)
- The user lands on the Dashboard.
- They see the **Certificate Upload** tool.
- They use their **1 Free Credit** to run a verification.
- **Action:** After the result is shown, set `freeCredits = 0`.

---

## 3. The Upgrade Flow (The Paywall)
- Once `freeCredits === 0`, the Dashboard replaces the Upload tool with an **Upgrade UI**.
- User chooses a plan:
  - **Option A: Pro** (₦1,000)
  - **Option B: Developer** (₦5,000)
- User clicks "Pay" and is redirected to the **Squad Payment Page**.

---

## 4. Post-Payment: The Success Page
After the payment is complete, the user is redirected to a **Success Page** in your app.

**Success Page Features:**
1. A "Payment Successful!" message.
2. A **"Back to Dashboard"** button.

**Critical Logic on "Back to Dashboard":**
When the user clicks this button, you must update the `userRole` before navigating back.

```javascript
const handleBackToDashboard = (chosenPlan) => {
  // Update state based on what they just paid for
  if (chosenPlan === 'pro') {
    setUserRole('pro');
  } else if (chosenPlan === 'developer') {
    setUserRole('developer');
  }
  
  // Navigate back
  router.push('/dashboard');
};
```

---

## 5. The "Unlocked" Dashboard
Now the user lands back on the Dashboard, but the UI has changed:

### If Role is `pro`:
- The "Limit Reached" message is gone.
- The **Upload Tool** is fully unlocked for unlimited use.

### If Role is `developer`:
- Everything in `pro` is unlocked.
- A new **"API Developer Portal"** tab appears in the sidebar.
- Inside the portal, they can generate an **API Key** and see their **B2B Credits**.

---

## 6. Implementation Summary for Frontend
1. **Landing:** Go straight to Dashboard.
2. **Auth:** Use the `/login` and `/register` endpoints (DB).
3. **State Management:** Use a global state (Context or Redux) to store `userRole` so it persists when moving from the Success Page back to the Dashboard.
4. **Redirection:** Ensure the Squad `callback_url` points to your `/payment-success` page.
5. **The Reset:** For the demo, provide a way to "Reset to Regular" so you can show the flow multiple times to different judges.
