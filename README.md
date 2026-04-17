# EnvSync – Secure Environment Variable Manager

EnvSync lets developers securely store, sync, and share `.env` files across machines and teammates using a CLI tool and web dashboard.

- Frontend: https://envsync-iota.vercel.app
- Backend API: https://envsync-tqj1.onrender.com
- npm: https://www.npmjs.com/package/@nishy_02/envsync-cli

---

## CLI Install

```bash
npm install -g @nishy_02/envsync-cli
```

---

## Quick Start (Single User)

```bash
envsync register        # create an account
envsync login           # login
envsync projects create "my-app"   # create a project
envsync push --file .env           # push your .env to the cloud
envsync pull --file .env           # pull it back on any machine
```

---

## Sharing with Teammates

This is the main use case — one person owns the project and shares it with others.

### Step 1 — Owner pushes secrets

```bash
envsync login
envsync projects create "my-app"
envsync push --file .env
envsync projects list              # note the project ID
```

### Step 2 — Owner shares the project

```bash
envsync projects share <projectId> teammate@email.com --role editor
```

Roles:
- `editor` — can push and pull secrets
- `viewer` — can only pull secrets

### Step 3 — Teammate sets up on their machine

```bash
npm install -g @nishy_02/envsync-cli
envsync register                   # they need an account first
envsync login
envsync projects list              # shared project appears here
envsync projects use <projectId>   # set it as active
envsync pull --file .env           # pulls the owner's secrets
```

That's it. The teammate now has the `.env` file locally.

---

## All CLI Commands

| Command | Description |
|---|---|
| `envsync register` | Create a new account |
| `envsync login` | Login |
| `envsync logout` | Clear local session |
| `envsync whoami` | Show current session info |
| `envsync push --file .env` | Push local .env to cloud |
| `envsync pull --file .env` | Pull secrets into local .env |
| `envsync projects list` | List all accessible projects |
| `envsync projects create <name>` | Create a new project |
| `envsync projects use <projectId>` | Set active project |
| `envsync projects share <projectId> <email> --role viewer\|editor` | Share project with a user |
| `envsync config show` | Show current CLI config |
| `envsync config set-api <url>` | Point CLI at a different API |

---

## Web Dashboard

Visit https://envsync-iota.vercel.app to:
- Register and login
- View your secrets
- Check audit logs (who pushed/pulled and when)

Sharing is currently CLI-only.

---

## Features

- AES-256-GCM encryption — secrets encrypted before hitting the DB
- JWT authentication — secure per-user sessions
- Role-based access — owner, editor, viewer per project
- Audit logs — every push, pull, and share is logged
- Cloud hosted — Render (API) + Neon (PostgreSQL) + Vercel (dashboard)

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React.js (Vercel) |
| Backend | Node.js + Express (Render) |
| Database | PostgreSQL (Neon) |
| Auth | JWT + bcrypt |
| Encryption | AES-256-GCM |
| CLI | Commander.js |

---

## Author

**Nishat Fatema** — Computer Science Engineer
