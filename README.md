# ⚡ ATROCITY.DEV // SEC_OPS_DOCK
 
[![Architecture: Zero-Trust](https://img.shields.io/badge/Architecture-Zero--Trust-00ff41?style=for-the-badge&logo=google-cloud)](https://cloud.google.com/)
[![Sec: OWASP_Hardened](https://img.shields.io/badge/Security-OWASP_Hardened-ff003c?style=for-the-badge&logo=owasp)](https://owasp.org/)

> **Status: [ACTIVE]**  
> **Classification: SECURE_ENVIRONMENT**  
> **System: Hardened Cybersecurity Sandbox & Dossier**

A high-performance, hardened digital dossier and terminal interface built for the intersection of Offensive Security and Production Engineering.

---

## 🛡 SECURITY ARCHITECTURE

The infrastructure is designed with a **Red-Team Mindset**, assuming breach at the edge and protecting the core.

### Infrastructure Highlights:
- **Zero-Trust Deployment:** Workload Identity Federation (WIF) eliminates long-lived GCP keys.
- **IAP Tunneling:** Production VM has **zero open ports** to the public internet; deployment happens via Identity-Aware Proxy (IAP).
- **Hardened CSP:** Strict security policies to eliminate XSS vectors and unauthorized script execution.
- **Docker Isolation:** Multi-stage builds using `node:alpine` images to minimize attack surface and patch vulnerabilities.

### Terminal Sandbox:
The terminal isn't just a UI; it's a simulated environment with:
- `hack`: A cryptographic bypass minigame.
- `ls -la`: Hidden system logs and classified dossiers.
- `cat /etc/shadow`: Try it if you think you have root access.
- `sudo rm -rf /`: Don't try this unless you want to see the system melt down.

---

## 🛠 TECH STACK

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Framer Motion, TailwindCSS |
| **Backend** | Node.js, Express, TypeScript, MongoDB |
| **DevOps** | Docker, Docker Compose, GitHub Actions |
| **Cloud** | GCP (Compute Engine, IAP, Artifact Registry) |
| **Security** | Zod Validation, HSTS, Secure CSP, WIF |

---

## 🚀 LOCAL DEPLOYMENT

```bash
# Clone the repository
git clone https://github.com/ATR-oCiTy/atrocity.dev.git

# Install dependencies
npm run install:all

# Launch the secure environment
npm run dev
```

---

<p align="center">
  <img src="https://raw.githubusercontent.com/ATR-oCiTy/atrocity.dev/main/frontend/public/favicon.svg" width="40" height="40" />
  <br>
  <b>Constructed by Ashley Thomas Roy</b><br>
  <i>Cybersecurity Student // Production Engineer</i>
</p>
