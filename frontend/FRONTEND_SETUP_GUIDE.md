# AgriSphere Frontend — Setup Guide

A real, working React app that talks to your existing backend — not a mockup. Login, registration, role-based navigation, and live pages for all 9 modules.

---

## Part A — Install and run (Windows)

1. Copy the whole `agrisphere-frontend` folder somewhere, e.g. `D:\Capstone\frontend`.
2. Open Command Prompt inside it:
   ```
   cd D:\Capstone\frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Confirm `.env` exists (copy `.env.example` → `.env` if not) and points at your backend:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```
5. **Make sure your backend is already running** (`npm start` in the `backend` folder, showing `✅ Connected to PostgreSQL`).
6. Start the frontend:
   ```
   npm run dev
   ```
7. Open the URL it prints (usually `http://localhost:5173`) in your browser.

You should see the AgriSphere login screen. Register a new account (any role), log in, and you'll land on the page appropriate for that role.

---

## Part B — What's actually built

**Fully wired, live pages** (real API calls, real forms, real state):
- Login / Register — all 7 roles
- Role-aware sidebar + routing — each role only sees and can access their own relevant pages
- **Farmer**: profile + land parcels (create/delete), crop plans (create/list), procurement (browse catalog + order), inventory (view), marketplace listings (create/delete), payments (view)
- **Supplier**: profile + product catalog (add/delete), incoming orders (approve/deliver/cancel)
- **Buyer**: marketplace (browse + buy), order history
- **Equipment Owner**: list equipment
- **Farmer** (equipment side): browse + book equipment, view own bookings
- **Cooperative Manager / Admin**: Dashboard (live stats + chart), farmer directory, crop master list management, warehouse management, procurement oversight, payments oversight (mark completed)

**Design:** custom palette (forest/gold/soil/leaf/rust tokens in `tailwind.config.js`), Zilla Slab for headings, Inter for body/data, dark sidebar + sage-stone content canvas, hairline-divider tables instead of generic shadow-cards.

---

## Part C — How it connects to your backend

- `src/api/axiosClient.js` is the only place that knows your backend's base URL and automatically attaches the JWT to every request.
- `src/store/authStore.js` holds the logged-in user and token, persisted to `localStorage` (this is a real standalone app running in your own browser, so that's the correct, standard approach — unlike a sandboxed preview environment).
- Every `api/*.js` file mirrors a backend route file one-to-one — `farmerApi.js` ↔ `farmerRoutes.js`, and so on. If you add a new backend endpoint later, add one function here and call it from a page.

## Part D — Extending it (the pattern to clone)

Every list+form page follows the same shape (see `FarmerListings.jsx` as a clean, short example):
1. `useState` for the data list + form fields + loading/error
2. `useEffect` calling the matching `api` function on mount
3. A `DataTable` for viewing, a `Modal` + `FormField`s for creating
4. Submit handler calls the API, then reloads the list

To add a new page: copy this shape, swap the API import, and add a `<Route>` in `App.jsx` plus a nav entry in `Sidebar.jsx`.

## Part E — Known limitations (be upfront about these if asked)

- No pagination yet — fine for demo/small data, would need adding for real scale.
- No client-side form validation beyond `required` — the backend validates properly, but the frontend doesn't yet show inline field errors before submitting.
- No edit forms for crop plans/listings/equipment yet — only create + delete. Update would follow the exact same Modal pattern already used for create.
- Logistics Partner role has no dedicated pages yet, since that backend module wasn't built out with its own routes.
