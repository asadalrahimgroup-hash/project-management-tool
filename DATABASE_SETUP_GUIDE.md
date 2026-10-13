# 🛠️ Database Setup Guide (New Computer / Team Member)

This guide walks you through setting up and running the database and application on another computer or for a new team member from scratch.

---

## ⚡ The Good News: Zero Manual Database Migration Needed!

You **do NOT** need to:
- Run complex SQL dump files or schema scripts manually.
- Restore backup dumps via `pgAdmin` or command-line tools.
- Set up custom table definitions or seed data manually.

**Why?**
The backend (`Backend-main/config/db.js`) has an automated **Self-Provisioning Engine**. Whenever the backend starts (`npm start`), it connects to the database specified in `DATABASE_URL`, automatically creates all tables, applies schema migrations, and populates initial seed data (users, roles, programs, projects, and tasks).

All you need is **a connection string to an empty PostgreSQL database**.

---

## 📋 Prerequisites on the New Computer

1. **Node.js**: Install Node.js (v18.x or v20.x LTS) from [nodejs.org](https://nodejs.org).
   Verify by running in terminal:
   ```bash
   node -v
   npm -v
   ```
2. **Git**: Installed to clone the repository.

---

## 🌐 Database Setup Options

Choose **Option 1 (Recommended)** for a quick 2-minute cloud setup without installing PostgreSQL software, or **Option 2** if you prefer a local PostgreSQL instance.

---

### Option 1: Free Cloud PostgreSQL (Recommended & Fastest — 2 Mins)

Using a free cloud PostgreSQL service (e.g., [Neon.tech](https://neon.tech) or [Supabase](https://supabase.com)) requires zero local database software and works across Windows, macOS, and Linux.

1. Go to **[Neon.tech](https://neon.tech)** and sign up (Free tier).
2. Click **Create Project** (e.g., name it `arg-pm-db`).
3. Neon will instantly display your **Connection Details / URI**.
4. Copy the connection string. It looks like:
   ```text
   postgresql://neondb_owner:YOUR_PASSWORD@ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
5. *(Optional)* Alternatively, if the original project database is being shared directly with you, simply request the existing `DATABASE_URL` from your team lead and paste it into `.env`.

---

### Option 2: Local PostgreSQL Installation (Offline / Local Machine)

If you prefer to run PostgreSQL locally on your machine:

1. **Download PostgreSQL**:
   - Download PostgreSQL (v14, 15, or 16) from [postgresql.org/download](https://www.postgresql.org/download/).
   - Follow the installer instructions.
   - When prompted for a superuser (`postgres`) password, choose a password you remember (e.g. `postgres123` or `admin123`).
   - Keep the default port `5432`.

2. **Create the Database**:
   - Open **pgAdmin** or run in PowerShell / Command Prompt:
     ```bash
     psql -U postgres
     ```
   - Enter your password and run:
     ```sql
     CREATE DATABASE arg_platform;
     ```
   - Verify it created successfully with:
     ```sql
     \l
     ```
   - Exit `psql` by typing `\q`.

3. **Construct your Local Connection String**:
   ```text
   postgresql://postgres:<YOUR_PASSWORD>@localhost:5432/arg_platform
   ```

---

## 🚀 Step-by-Step Installation & Running Guide

### Step 1: Clone or Copy the Repository
```bash
git clone <REPOSITORY_URL>
cd Frontend-main
```

---

### Step 2: Configure and Start the Backend

1. Navigate to the backend directory:
   ```bash
   cd Backend-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the environment file `.env`:
   - Duplicate `.env.example` and rename it to `.env`:
     ```bash
     # On Windows (PowerShell):
     Copy-Item .env.example .env

     # On macOS/Linux:
     cp .env.example .env
     ```
   - Open `.env` and configure your database connection:
     ```env
     PORT=5000
     DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>?sslmode=require
     JWT_SECRET=al-rahim-group-jwt-secret-2026
     NODE_ENV=development
     ```
     > **Note for Local PostgreSQL:** If using local PostgreSQL without SSL, remove `?sslmode=require` (e.g., `DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/arg_platform`).

4. Start the backend:
   ```bash
   npm start
   ```

5. **Verify the Terminal Output**:
   You should see:
   ```text
   Connecting to PostgreSQL / Neon via DATABASE_URL...
   PostgreSQL connection established
   🚀 Initializing database schema & actual dataset...
   ✅ QARC Database schema & actual dataset successfully synchronized!
   Server running on port 5000
   ```
   All database tables, columns, constraints, and default data are now fully synchronized!

---

### Step 3: Configure and Start the Frontend

1. Open a **new terminal window** and navigate to the frontend directory:
   ```bash
   cd Frontend-main
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create the environment file `.env.local`:
   - Duplicate `.env.local.example` to `.env.local`:
     ```bash
     # On Windows (PowerShell):
     Copy-Item .env.local.example .env.local

     # On macOS/Linux:
     cp .env.local.example .env.local
     ```
   - Ensure it contains:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:5000/api
     NEXT_PUBLIC_API_BASE=http://localhost:5000/api
     ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. Open your browser and go to:
   ```text
   http://localhost:3000
   ```
   *(or `http://localhost:3002` if port 3000 is occupied)*.

---

## 🔐 Default Credentials for First Login

Once the application is running, you can log in using any of the pre-seeded accounts:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@argplatform.com` | `Arg@Admin#2026!X9qL$` | Full access + Admin Console |
| **Project Manager** | `asad@argplatform.com` | `Arg@Asad2026!` | Project Management, all projects & members |
| **Project Manager** | `qasim@argplatform.com` | `Arg@Qasim2026!` | Project Management |
| **Team Member** | `fahad@argplatform.com` | `Arg@Fahad2026!` | Assigned projects, tasks & personal updates |
| **Team Member** | `ajiya@argplatform.com` | `Arg@Ajiya2026!` | Assigned projects, tasks & personal updates |
| **Team Member** | `hiba@argplatform.com` | `Arg@Hiba2026!` | Assigned projects, tasks & personal updates |
| **Team Member** | `kinjal@argplatform.com` | `Arg@Kinjal2026!` | Assigned projects, tasks & personal updates |
| **Team Member** | `khizra@argplatform.com` | `Arg@Khizra2026!` | Assigned projects, tasks & personal updates |

---

## ❓ Troubleshooting & FAQs

### 1. `Connection refused (ECONNREFUSED)` or `connection timeout`
- **For Cloud DB (Neon):** Check that your computer has an active internet connection and that no corporate proxy/firewall is blocking outbound connections on port `5432`.
- **For Local DB:** Make sure the PostgreSQL service is actively running on your machine:
  - Windows: Open Services (`services.msc`) and ensure `postgresql-x64-xx` is running.
  - Linux/Mac: Run `sudo systemctl status postgresql` or `brew services list`.

### 2. `password authentication failed for user "postgres"`
- Double-check the password entered in `DATABASE_URL`. If special characters like `@`, `:`, or `#` are in the password, they must be URL-encoded (e.g. `@` becomes `%40`, `#` becomes `%23`).

### 3. `self-signed certificate in certificate chain`
- The application already includes `ssl: { rejectUnauthorized: false }` in `Backend-main/config/db.js`, so cloud certificates from Neon/AWS/Supabase work out of the box.

### 4. Port Conflict (`Port 5000 already in use`)
- If port 5000 is occupied, you can change `PORT=5001` in `Backend-main/.env`, and update `NEXT_PUBLIC_API_URL=http://localhost:5001/api` in `Frontend-main/.env.local`.
