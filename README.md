# EnvSync – Secure Environment Variable Manager

EnvSync is a full-stack system that allows developers to **securely store, sync, and manage environment variables** using a CLI tool and web dashboard.

---

## Live Demo

* Frontend: https://envsync-iota.vercel.app
* Backend API: https://envsync-tqj1.onrender.com

---
## 🧪 Demo Workflow (Try it Yourself)

Follow these steps to test EnvSync end-to-end:

---

### 1️⃣ Register a New User

Go to the live frontend:
 https://envsync-iota.vercel.app

* Click **Register**
* Enter email & password
* Create your account

---

### 2️⃣ Login via CLI

In your terminal:

```bash
envsync login
```

Enter the same credentials you used in the UI.

---

### 3️⃣ Create a `.env` File

Inside any project folder:

```env
API_KEY=123456
DB_PASSWORD=hello123
```

---

### 4️⃣ Push Secrets to Cloud

```bash
envsync push
```

Secrets are encrypted and stored securely

---

### 5️⃣ Pull Secrets

Delete your `.env` file, then run:

```bash
envsync pull
```

✔ Your `.env` file is restored

---

### 6️⃣ View in Dashboard

Go back to:
 https://envsync-iota.vercel.app

* Open Dashboard
* View your secrets
* Check Audit Logs

---

## Features

* 🔐 AES-256 encryption for secure storage of secrets
* 👤 JWT-based authentication for multi-user access
* ⚙️ CLI tool to push/pull `.env` files
* 📊 Web dashboard to view secrets
* 📜 Audit logging (track push/pull actions)
* ☁️ Cloud deployment (Render + Vercel + Neon)
* 🔄 Dynamic project handling (no hardcoding)

---

## Tech Stack

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Neon)
* **Authentication:** JWT
* **Encryption:** AES-256
* **CLI:** Commander.js
* **Deployment:** Render, Vercel

---

##  How it Works

```text
CLI / Dashboard
        ↓
Backend API (Render)
        ↓
Encrypted Storage (Neon DB)
```

---

## CLI Usage

```bash
envsync login
envsync push
envsync pull
```

---

## Security

* Secrets are encrypted before storing in DB
* Passwords are hashed using bcrypt
* JWT used for secure authentication

---

## Screenshots
<img width="1919" height="871" alt="image" src="https://github.com/user-attachments/assets/c3930179-6995-4fc2-a2c6-18c39425bd09" />

<img width="1918" height="870" alt="image" src="https://github.com/user-attachments/assets/08b65e8f-148c-41d6-940d-0a0e366ab319" />

<img width="853" height="171" alt="image" src="https://github.com/user-attachments/assets/242cf51c-81a6-49a7-b398-8486cf02b60b" />


---

## Future Improvements

* Multi-project support
* Role-based access (admin/dev)
* Team collaboration

---

## 👩‍💻 Author

**Nishat Fatema**
Computer Science Engineer
