<div align="center">

# URL Shortener — Node.js + Express + MongoDB

Tiny URLs, instant redirects, and click analytics. Built with **Express 5**, **MongoDB/Mongoose**, and **EJS**.

<a><img src="https://img.shields.io/badge/Node.js-18%2B-brightgreen" /></a>
<a><img src="https://img.shields.io/badge/Express-5.1.0-black" /></a>
<a><img src="https://img.shields.io/badge/MongoDB-Mongoose-green" /></a>
<a><img src="https://img.shields.io/badge/View-EJS-blue" /></a>

</div>

---

## Overview

This service accepts a long URL and returns a short identifier. Visiting the short URL redirects users to the original link and records a visit event for basic **click analytics**.

The codebase follows a simple MVC-style structure:
- **Models**: URL document in MongoDB (short id, original URL, visit history, timestamps)
- **Routes/Controllers**: REST endpoints for creating short URLs, redirecting, and analytics
- **Views**: EJS templates for static pages (via `staticRouter`)
- **Infra**: Mongoose connection helper (`connect.js`), Express middlewares (`cookie-parser`, optional auth)

> From the code: `index.js` wires **routes/url**, **routes/staticRouter**, **routes/user**, uses an auth middleware `restrictToLoggedinUserOnly`, and connects to MongoDB with `connectToMongoDB()`.

---

## Features

- **Shorten URLs** → Create a compact short id for any valid URL
- **Redirects** → `GET /:id` redirects to the original destination
- **Click Analytics** → Track total visits with timestamped history per short id
- **Server-rendered pages** (EJS) for simple UI (via `staticRouter`)
- **Modular DB** connection via `connect.js`

---

## Tech Stack

- **Runtime**: Node.js 18+
- **Web**: Express **5.x**
- **DB**: MongoDB with Mongoose **8.x**
- **Views**: EJS
- **Utilities**: `cookie-parser`, `dotenv` (recommended), `nanoid`/`shortid`/`uuid` (installed for id generation)

---

## Project Structure

```
.
├─ connect.js              # Mongoose connection helper
├─ index.js                # App entrypoint: middlewares, routes, redirect handler
├─ routes/
│  ├─ url.js               # REST endpoints (create URL, analytics)     ← (imported in index.js)
│  ├─ staticRouter.js      # EJS-rendered pages                         ← (imported in index.js)
│  └─ user.js              # (optional) user routes / auth              ← (imported in index.js)
├─ models/
│  └─ url.js               # URL schema (shortId, redirectURL, visits)  ← (imported in index.js)
├─ middlewares/
│  └─ auth.js              # restrictToLoggedinUserOnly (optional)
├─ package.json
└─ .env                    # MONGO_URL, PORT (recommended)
```

> Note: Only some files are shown above; the rest follow the same folders referenced by `index.js`.

---

## API Reference

| Method | Endpoint                 | Body / Params                                  | Description                          |
|-------:|--------------------------|------------------------------------------------|--------------------------------------|
| POST   | `/url`                   | `{ "url": "https://example.com/..." }`         | Create a short URL and return id     |
| GET    | `/:id`                   | `id` path param                                | Redirect to original URL             |
| GET    | `/url/analytics/:id`     | `id` path param                                | Return total clicks & visit history  |

Typical JSON responses:
```json
// POST /url (success)
{ "id": "abc123", "shortUrl": "http://localhost:8001/abc123" }

// GET /url/analytics/abc123
{ "id": "abc123", "totalClicks": 42, "visitHistory": [{ "timestamp": 1733942400000 }] }
```

---

## Getting Started

### 1) Clone & install
```bash
git clone <YOUR-REPO-URL>
cd url-shortener
npm install
```

### 2) Environment variables
Create a `.env` in project root (recommended):

```env
MONGO_URL=mongodb://127.0.0.1:27017/short-url
PORT=8001
# JWT_SECRET=optional_if_auth_is_used
```

At the very top of `index.js`:
```js
require('dotenv').config();
```

Change the connect line to use the env var (optional, but cleaner):
```js
const { connectToMongoDB } = require('./connect');
connectToMongoDB(process.env.MONGO_URL);
```

### 3) Run
```bash
npm start        # uses nodemon index.js
# or
node index.js
```
App starts at `http://localhost:8001`.

---

## Example Usage (curl)

**Create a short URL**
```bash
curl -X POST http://localhost:8001/url   -H "Content-Type: application/json"   -d '{"url":"https://developer.mozilla.org/en-US/docs/Web/JavaScript"}'
```

**Open the short URL in browser**
```
http://localhost:8001/<id>
```

**Fetch analytics**
```bash
curl http://localhost:8001/url/analytics/<id>
```

---


<div align="center">
  <sub>Thank You.</sub>
</div>
