# 🔬 Defang IOC

**Paste any threat intel text. Extract, defang, and pivot on every indicator in seconds.**

[![Live Tool](https://img.shields.io/badge/tool-live-brightgreen.svg)](https://dgiry.github.io/defang-ioc)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![No dependencies](https://img.shields.io/badge/dependencies-none-lightgrey.svg)]()

---

## What it does

Paste a threat report, incident note, email, or raw intelligence text.
Defang IOC instantly extracts every indicator and defangs it — ready to share safely in Slack, tickets, or reports.

**Supported indicators:**

| Type | Example input | Defanged output |
|------|--------------|-----------------|
| IP address | `185.220.101.45` | `185.220.101[.]45` |
| Domain | `evil-domain.ru` | `evil-domain[.]ru` |
| URL | `https://malware.io/payload` | `hxxps://malware[.]io/payload` |
| Email | `attacker@phish.net` | `attacker[@]phish[.]net` |
| MD5 / SHA1 / SHA256 | `4d186321...` | *(displayed as-is)* |
| CVE | `CVE-2024-21887` | *(displayed as-is)* |

---

## Features

- **Extract & defang** — automatic detection of all IOC types in one paste
- **Refang mode** — reverse defanged indicators back to their original form
- **Filter by type** — IPs / Domains / URLs / Hashes / Emails / CVEs
- **Pivot links** — one-click investigation per IOC:
  - IP → VirusTotal · Shodan · AbuseIPDB
  - Domain → VirusTotal · URLhaus
  - URL → VirusTotal · URLhaus
  - Hash → VirusTotal · MalwareBazaar
  - CVE → NVD · EPSS (FIRST)
- **Export** — Download `.txt`, `.csv`, `.json` or copy as Markdown table
- **Session history** — auto-saves last 25 sessions in localStorage, restore with one click
- **Defanged full text** — the complete input text with all IOCs defanged inline
- **Zero dependencies** — single HTML file, no backend, no tracking

---

## Usage

### Online (no install)

👉 **[dgiry.github.io/defang-ioc](https://dgiry.github.io/defang-ioc)**

### Local

```bash
# Just open the file — no server needed
open index.html
```

### Self-hosted

Drop `index.html` on any static host (GitHub Pages, Netlify, Vercel, S3, your own server).
No build step. No configuration.

---

## Keyboard shortcut

`Ctrl+Enter` (or `Cmd+Enter`) — process the current input immediately.

---

## Privacy

- No data is sent anywhere
- No analytics, no tracking, no cookies
- History is stored only in your browser's localStorage
- Works fully offline after first load

---

## Contributing

Pull requests welcome. Areas of interest:

- Additional IOC types (YARA rules, registry keys, file paths)
- Better domain regex (improved TLD coverage)
- Bulk session export
- Browser extension version

Please open an issue before submitting a large PR.

---

## License

MIT — free to use, modify and self-host.

---

*Part of the [SecPrior](https://github.com/dgiry/secprior) open source security toolset.*
