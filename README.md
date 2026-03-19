# 🐙 GitHub Actions

A collection of custom GitHub Actions used in FancyStudio.

---

## ✨ Getting Started

```yaml
name: Send GitHub Events to Discord

on:
    issues:
        types: [opened, closed]
    push:

jobs:
    discord-webhooks:
        runs-on: ubuntu-latest

        steps:
            - name: Checkout Code
              uses: actions/checkout@v6

            - name: Execute Discord Webhooks
              uses: FancyStudioTeam/GitHub-Actions@main
              with:
                  webhook_id: ${{ secrets.DISCORD_WEBHOOK_ID }}
                  webhook_token: ${{ secrets.DISCORD_WEBHOOK_TOKEN }}
```

## ℹ️ API

### ⚙️ GitHub Action Options

| Option          | Description                       | Required |
| --------------- | --------------------------------- | -------- |
| `webhook_id`    | The ID of the Discord webhook.    | `✅`     |
| `webhook_token` | The token of the Discord webhook. | `✅`     |
