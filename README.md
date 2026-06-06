# Invoice Management Dashboard

A full-stack invoice management application built with React.js, NestJS, and MongoDB.

---

## Tech Stack

| Layer    | Technology                   |
| -------- | ---------------------------- |
| Frontend | React.js (Vite + TypeScript) |
| Backend  | NestJS (Node.js)             |
| Database | MongoDB with Mongoose        |
| Styling  | Plain CSS                    |

---

## Project Structure

```
invoice-app/
  invoice-backend/     ← NestJS API
  invoice-frontend/    ← React dashboard
```

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB (local or Atlas)

---

## Backend Setup

### 1. Install dependencies

```bash
cd invoice-backend
npm install
```

### 2. Create `.env` file in the root of `invoice-backend`

```env
MONGO_URI=mongodb://localhost:27017/invoice-db
PORT=8000
```

### 3. Start MongoDB (Mac)

```bash
brew services start mongodb-community
```

### 4. Run the seed script

Place `seed-data.json` in the root of `invoice-backend`, then run:

```bash
npm run seed
```

Expected output:

```
Connected to MongoDB
Cleared existing data
Inserted 61 customers
Inserted 2000 invoices
Done. Disconnected.
```

### 5. Start the backend server

```bash
npm run start:dev
```

API runs at: `http://localhost:8000`

---

## Frontend Setup

### 1. Install dependencies

```bash
cd invoice-frontend
npm install
```

### 2. Start the frontend

```bash
npm run dev
```

Dashboard runs at: `http://localhost:5173`

---

## API Endpoints

### Invoices

| Method | Endpoint        | Description                                  |
| ------ | --------------- | -------------------------------------------- |
| GET    | `/invoices`     | Paginated, sortable, filterable invoice list |
| GET    | `/invoices/:id` | Single invoice                               |
| POST   | `/invoices`     | Create invoice                               |
| PATCH  | `/invoices/:id` | Update invoice                               |
| DELETE | `/invoices/:id` | Delete invoice                               |

### Query Parameters for `GET /invoices`

| Param         | Type   | Description                  |
| ------------- | ------ | ---------------------------- |
| page          | number | Page number (default: 1)     |
| limit         | number | Items per page (default: 20) |
| sortBy        | string | `amount` or `dueDate`        |
| sortOrder     | string | `asc` or `desc`              |
| status        | string | Filter by status             |
| customer      | string | Filter by customer name      |
| issueDateFrom | date   | Issue date range start       |
| issueDateTo   | date   | Issue date range end         |
| dueDateFrom   | date   | Due date range start         |
| dueDateTo     | date   | Due date range end           |
| taxRate       | number | Filter by tax rate           |

### Customers

| Method | Endpoint              | Description                                               |
| ------ | --------------------- | --------------------------------------------------------- |
| GET    | `/customers`          | List all customers                                        |
| GET    | `/customers/top-five` | Top 5 customers by invoice value                          |
| GET    | `/customers/:id`      | Customer profile with invoice history and summary metrics |

---

## Data Modeling Rationale

### Two Collections: `customers` and `invoices`

**Customer**

```
{
  name: string        // unique customer name
  company: string     // 1:1 with customer
  timestamps
}
```

**Invoice**

```
{
  invoiceId: string   // unique e.g. INV-6598015
  customer: ObjectId  // reference to Customer
  amount: number
  taxRate: number     // enum: 0, 3, 5, 18, 28
  tax: number         // computed: amount × taxRate / 100
  total: number       // computed: amount + tax
  status: string      // enum: Sent | Unpaid | Overdue | Paid | Void | Draft
  issueDate: Date
  dueDate: Date
  timestamps
}
```

**Why separate collections?**

- Invoices are the primary query entity — they need independent pagination, sorting, and filtering
- Customer profile view requires standalone customer lookups with aggregated invoice metrics
- Referencing Customer via ObjectId on Invoice enables efficient `populate()` and aggregation pipelines

**Why company lives on Customer?**

- The seed data has a strict 1:1 relationship between customer and company
- No need for a separate Company collection — embedding company as a field on Customer keeps it simple and avoids unnecessary joins

**Why not embed invoices inside Customer?**

- 2000 invoices across 61 customers means ~33 invoices per customer on average
- Embedding would make invoice-level queries (filter by status, sort by amount) very expensive
- Separate collection with an indexed `customer` field is far more performant

---

## Seed Script

The seed script (`src/seed.ts`) does the following:

1. Reads `seed-data.json` from the project root
2. Clears existing `customers` and `invoices` collections
3. Extracts 61 unique customers and inserts them
4. Maps each invoice's customer string to the corresponding ObjectId
5. Inserts all 2000 invoices with proper references

```bash
npm run seed
```

---

## Dashboard Features

### Screen 1 — Invoice List

- Paginated table (20 per page)
- Sortable by Amount and Due Date
- Filterable by Status, Tax Rate, and Date
- Search by customer name
- Click row to edit invoice
- Click customer name to view profile
- Create new invoice via modal

### Screen 2 — Customer Profile

- Customer name, initials avatar, company
- Summary metrics: Total Billed, Total Tax, Outstanding, # Invoices
- Paid / Unpaid / Overdue breakdown
- Full invoice history table

### Screen 3 — Create / Edit Invoice Modal

- Customer dropdown (company auto-fills)
- Tax and Total auto-computed from Amount × Tax Rate
- Status dropdown with all valid states

### Screen 4 — Summary / Analytics

- Global stats: Total Billed, Total Tax, # Invoices, # Customers
- Top 5 customers by invoice value (horizontal bar chart)
- Click customer to navigate to their profile

---

## Assumptions

- `tax` and `total` are always computed server-side from `amount` and `taxRate` — never trusted from client input
- Customer–Company relationship is strictly 1:1 as per the seed data; no UI is provided to change a customer's company
- Invoice deletion is hard delete (no soft delete / archive)
- The seed script clears existing data on every run — it is not idempotent
- `invoiceId` (e.g. `INV-6598015`) is treated as a unique business identifier separate from MongoDB's `_id`

---

## Stretch Goals (Not Implemented)

- Docker Compose setup
- Unit / integration tests
