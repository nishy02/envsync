# envsync

EnvSync is a project-based secret sync system for `.env` files with:

- a publishable CLI package that users can install globally on their own machines,
- authenticated project sharing between registered users,
- encrypted-at-rest secret storage with authenticated encryption,
- project-scoped audit logs.

## What changed

- `envsync-cli` is now package-ready and exposes a global `envsync` command.
- Secrets are now upserted by `(project_id, key)` instead of duplicating rows on every push.
- Shared projects are handled through `project_members` with `owner`, `editor`, and `viewer` roles.
- Server-side encryption now uses AES-256-GCM and still supports decrypting legacy stored values.

## CLI install

After publishing the package from [`cli/package.json`](C:\Users\nisha\Desktop\envsync\cli\package.json), users can install it globally with:

```bash
npm install -g envsync-cli
```

Then they can use it from any folder:

```bash
envsync login
envsync projects list
envsync push --file .env
envsync pull --file .env
```

If you want to test the package locally before publishing:

```bash
cd cli
npm pack
npm install -g ./envsync-cli-1.1.0.tgz
```

## Server setup

Run the SQL migration in [server/migrations/001_secure_project_sharing.sql](C:\Users\nisha\Desktop\envsync\server\migrations\001_secure_project_sharing.sql) before deploying the updated server.

Required environment variables:

- `DATABASE_URL` or the individual Postgres connection vars
- `JWT_SECRET`
- `ENCRYPTION_KEY`

## New CLI commands

- `envsync register`
- `envsync login`
- `envsync logout`
- `envsync whoami`
- `envsync projects list`
- `envsync projects create <name>`
- `envsync projects use <projectId>`
- `envsync projects share <projectId> <email> --role viewer|editor`
- `envsync config show`
- `envsync config set-api <url>`

## Publishing the CLI

Publish from the `cli` folder:

```bash
cd cli
npm publish
```

That gives users a normal package-install experience instead of needing the whole repository first.
