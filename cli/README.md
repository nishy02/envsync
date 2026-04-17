# envsync-cli

Install globally:

```bash
npm install -g envsync-cli
```

Use it from any project directory:

```bash
envsync login
envsync projects list
envsync push --file .env
envsync pull --file .env
```

Helpful commands:

- `envsync projects create "My Project"`
- `envsync projects use 3`
- `envsync projects share 3 teammate@example.com --role viewer`
- `envsync config set-api https://your-api.example.com`

The CLI stores its machine-local config in `~/.envsync/config.json`.
