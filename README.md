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

- **Extract & defang** — automatic detection of all IOC types as you type
- **Duplicate detection** — same IOC appearing multiple times shows an amber ×N badge
- **Refang mode** — reverse defanged indicators back to their original form
- **Filter by type** — IPs / Domains / URLs / Hashes / Emails / CVEs
- **Pivot links** — one-click investigation per IOC (hover to reveal):
  - IP → VirusTotal · Shodan · AbuseIPDB
  - Domain → VirusTotal · URLhaus
  - URL → VirusTotal · URLhaus
  - Hash → VirusTotal · MalwareBazaar
  - CVE → NVD · EPSS (FIRST)
- **YARA rule generator** — builds a ready-to-use `.yar` rule from extracted IOCs
- **Export** — `.txt`, `.csv`, `.json`, `.yar`, or Markdown table
- **Drag & drop** — drop a `.txt`, `.log`, or `.csv` file directly on the input
- **Bulk upload** — select multiple files at once, processed and merged
- **Session history** — auto-saves last 25 sessions in localStorage
- **Global IOC counter** — total IOCs defanged since first use, stored locally
- **URL param / API mode** — `?input=…` auto-processes on load; `&format=json` returns a JSON panel
- **Browser extension** — context menu defang on any page (see below)
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

### URL param mode

```
# Auto-populate and process
https://dgiry.github.io/defang-ioc?input=185.220.101.45%20evil.ru

# Refang mode
https://dgiry.github.io/defang-ioc?input=185.220.101[.]45&mode=refang

# JSON response panel
https://dgiry.github.io/defang-ioc?input=185.220.101.45&format=json
```

---

## Browser Extension

Select text on any page → right-click → **🔬 Defang IOCs** → result copied to clipboard.

**Installation (Chrome / Edge / Brave):**

1. Clone or download this repo
2. Open `chrome://extensions` → enable **Developer mode**
3. Click **Load unpacked** → select the `extension/` folder
4. Select text on any page → right-click → **🔬 Defang IOCs**

The extension also includes a popup (click the toolbar icon) with the full defang/refang UI.

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

- Additional IOC types (registry keys, file paths, ASNs)
- Improved TLD coverage in domain regex
- Firefox extension packaging

Please open an issue before submitting a large PR.

---

## License

MIT — free to use, modify and self-host.

---

*Part of the [SecPrior](https://github.com/dgiry/secprior) open source security toolset.*
