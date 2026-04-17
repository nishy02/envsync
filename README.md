# EnvSync – Secure Environment Variable Manager

EnvSync is a full-stack system that allows developers to **securely store, sync, and manage environment variables** using a CLI tool and web dashboard.

---

## Live Demo

* Frontend: https://envsync-iota.vercel.app
* Backend API: https://envsync-tqj1.onrender.com

---

## CLI Install

```bash
npm install -g @nishy_02/envsync-cli
```

Then use it from any project folder:

```bash
envsync login
envsync projects list
envsync push --file .env
envsync pull --file .env
```

---

## Demo Workflow (Try it Yourself)

### 1️⃣ Register a New User

Go to https://envsync-iota.vercel.app, click **Register**, enter email & password.

### 2️⃣ Login via CLI

```bash
envsync login
```

### 3️⃣ Create a `.env` File

```env
API_KEY=123456
DB_PASSWORD=hello123
```

### 4️⃣ Push Secrets to Cloud

```bash
envsync push
```

### 5️⃣ Pull Secrets

```bash
envsync pull
```

### 6️⃣ Share with a Teammate

```bash
envsync projects share <projectId> teammate@example.com --role editor
```

---

## All CLI Commands

- `envsync register`
- `envsync login`
- `envsync logout`
- `envsync whoami`
- `envsync push --file .env`
- `envsync pull --file .env`
- `envsync projects list`
- `envsync projects create <name>`
- `envsync projects use <projectId>`
- `envsync projects share <projectId> <email> --role viewer|editor`
- `envsync config show`
- `envsync config set-api <url>`

---

## Features

* 🔐 AES-256-GCM encryption for secure storage of secrets
* 👤 JWT-based authentication for multi-user access
* 👥 Project sharing with `owner`, `editor`, and `viewer` roles
* ⚙️ CLI tool to push/pull `.env` files
* 📊 Web dashboard to view secrets
* 📜 Audit logging (track push/pull actions)
* ☁️ Cloud deployment (Render + Vercel + Neon)

---

## Tech Stack

* **Frontend:** React.js (Vercel)
* **Backend:** Node.js, Express.js (Render)
* **Database:** PostgreSQL (Neon)
* **Authentication:** JWT
* **Encryption:** AES-256-GCM
* **CLI:** Commander.js (npm)

---

## Security

* Secrets are encrypted before storing in DB
* Passwords are hashed using bcrypt
* JWT used for secure authentication

---

## Author

**Nishat Fatema**  
Computer Science Engineer
