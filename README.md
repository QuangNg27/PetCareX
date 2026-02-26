# PetCareX

Full‑stack pet clinic management system for a multi‑branch veterinary chain. It provides role‑based access for customers and staff to manage pets, services, products, invoices, and reports, built on SQL Server, a Node.js REST API, and a React frontend.

---

## 1. Project Structure

Top‑level layout:

- `db/` – SQL Server database script
	- `ScriptDB.sql` – creates the `PetCareX` database, tables, constraints, and sample logic
- `web/client/` – React + Vite + Tailwind CSS single‑page application (SPA)
- `web/server/` – Node.js + Express REST API using `mssql` to connect to SQL Server

---

## 2. Tech Stack

- **Frontend**
	- React 19, React Router
	- Vite dev/build tooling
	- Tailwind CSS
	- React Hook Form + Zod for forms and validation
	- Axios for API calls, Recharts for charts

- **Backend**
	- Node.js, Express
	- MSSQL with `mssql` driver
	- JWT authentication (`jsonwebtoken`)
	- Helmet, CORS, Morgan

- **Database**
	- Microsoft SQL Server
	- `PetCareX` database defined in `db/ScriptDB.sql`
	- Tables for customers, pets, employees, branches, services, products, invoices, loyalty levels, etc.

---

## 3. Features (High Level)

- Authentication & Authorization
	- Login / register and JWT‑based authentication
	- Role‑based permissions (Customer, Doctor, Sales, Receptionist, Branch Manager, Company Manager)

- Customer & Pet Management
	- Customer profiles, loyalty level and spending tracking
	- Pet records with species, breed, health status
	- Medical and vaccination history (with staff views)

- Services & Medical Workflows
	- Examination and vaccination services
	- Vaccination packages
	- Service price history and updates

- Products & Inventory
	- Product catalog (food, medicine, accessories, vaccines)
	- Price management and history
	- Inventory checks and low‑stock alerts

- Billing & Reporting
	- Invoices per customer and branch
	- Revenue reports (daily / monthly / yearly / by service type)
	- Customer and vaccine statistics

- Reviews & Feedback
	- Customer reviews for branches/services
	- Recent reviews and per‑branch/per‑customer views

> Note: Exact available endpoints and UI pages depend on the current state of the codebase; see `web/client/src/config/apiConfig.js` and `web/server/src/routes/` for full details.

---

## 4. Prerequisites

Install these before running the project:

- Node.js (LTS recommended)
- npm (bundled with Node.js)
- Microsoft SQL Server (local or remote instance)
- A SQL client such as SQL Server Management Studio (SSMS)

---

## 5. Database Setup (SQL Server)

1. Start your SQL Server instance.
2. Open `db/ScriptDB.sql` in SSMS or another SQL client connected to SQL Server.
3. Execute the whole script:
	 - Creates the `PetCareX` database (if it does not exist).
	 - Creates all tables, constraints, and related objects.
4. Note the SQL Server connection information you will use:
	 - Host (server name)
	 - Database name (`PetCareX` by default)
	 - Username and password

---

## 6. Backend Setup (web/server)

1. Open a terminal in the backend folder:

	 ```bash
	 cd web/server
	 npm install
	 ```

2. Create a `.env` file in `web/server` with at least:

	 ```env
	 PORT=5000
	 NODE_ENV=development

	 # CORS: URL of the frontend app
	 CLIENT_URL=http://localhost:5173

	 # SQL Server connection
	 DB_HOST=YOUR_SQL_SERVER_HOST
	 DB_USER=YOUR_SQL_USERNAME
	 DB_PASSWORD=YOUR_SQL_PASSWORD
	 DB_NAME=PetCareX

	 # JWT
	 JWT_SECRET=your_jwt_secret_here
	 ```

	 Adjust values to match your local SQL Server and desired ports.

3. Start the backend in development mode:

	 ```bash
	 npm run dev
	 ```

4. The API will be available at (by default):

	 - Base URL: `http://localhost:5000`
	 - Health check: `http://localhost:5000/health`

---

## 7. Frontend Setup (web/client)

1. Open another terminal for the frontend:

	 ```bash
	 cd web/client
	 npm install
	 ```

2. Create a `.env` file in `web/client` with:

	 ```env
	 VITE_API_BASE_URL=http://localhost:5000
	 ```

	 This must point to the running backend URL.

3. Start the frontend dev server:

	 ```bash
	 npm run dev
	 ```

4. Vite will show the local URL (commonly `http://localhost:5173`). Make sure this matches `CLIENT_URL` in the backend `.env`.

---

## 8. Available npm Scripts

### Frontend (`web/client/package.json`)

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview the production build
- `npm run lint` – run ESLint

### Backend (`web/server/package.json`)

- `npm run dev` – start API server with `nodemon`
- `npm start` – start API server with Node

---

## 9. API Overview

The main route groups exposed by the backend (see `web/server/src/routes/`):

- `/api/auth` – authentication and user profile
- `/api/customers` – customers, pets, loyalty & spending
- `/api/services` – examinations, vaccinations, packages, and service prices
- `/api/products` – products, prices, and inventory
- `/api/invoices` – invoices and billing
- `/api/branches` – branches and branch employees/services
- `/api/employees` – employee profiles and schedules
- `/api/reports` – revenue and analytics reports
- `/api/reviews` – reviews and ratings
- `/api/company` – company‑level management endpoints

For full details, inspect the controller and repository files under `web/server/src/controllers/` and `web/server/src/repositories/`.

---

## 10. User Roles & Permissions

Defined in `web/server/src/config/constants.js`:

- Customer (`Khách hàng`)
- Doctor (`Bác sĩ`)
- Sales (`Bán hàng`)
- Receptionist (`Tiếp tân`)
- Branch Manager (`Quản lý chi nhánh`)
- Company Manager (`Quản lý công ty`)

Role‑based authorization is enforced in middleware and routes to protect staff‑only and manager‑only operations.

---

## 11. Development Notes

- Backend uses a shared response format defined in `web/server/src/config/app.js`.
- Errors are handled centrally via `web/server/src/middleware/errorHandler.js`.
- The frontend centralizes API endpoints and status codes in `web/client/src/config/apiConfig.js`.

---

## 12. Troubleshooting

- **Cannot connect to database**
	- Verify SQL Server is running and reachable.
	- Check `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in the backend `.env`.

- **CORS errors in browser**
	- Ensure `CLIENT_URL` in backend `.env` matches the URL where Vite is running.

- **401 Unauthorized from API**
	- Make sure you are logged in and that the frontend is sending the `Authorization: Bearer <token>` header.

- **Frontend cannot call API**
	- Confirm `VITE_API_BASE_URL` matches the backend URL and port.

---

## 13. License / Usage

This project was created for an academic Advanced Database course. Use it for learning, extension, or demonstration purposes as allowed by your course or institution policies.
