# School Digital Intelligence Platform (EduPulse) — Interactive Prototype

A multi-tenant, white-label institutional intelligence platform built for modern educational ecosystems. Designed to demonstrate the core value loop:  
**Detect → Alert → Action → Follow-up → Improvement**

---

## 🚀 Quick Start & Setup

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation & Run Locally
```bash
# Navigate to project directory
cd school-platform

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 👥 Demo Access & Role Switching

**No password required.** On the `/login` screen, simply click any of the 4 animated role cards:
1. 🏛️ **Management** — School Administration & Control (`/management/dashboard`)
2. 👨‍🏫 **Teacher** — Class & Academic Management (`/teacher/dashboard`)
3. 🎓 **Student** — Learning, Syllabus & Payments (`/student/dashboard`)
4. 💰 **Accounts** — Fee Collection & Payment Verification (`/accounts/dashboard`)

> **Live Role Switcher**: You can also switch roles and schools on the fly using the Topbar dropdown from any screen without logging out!

---

## 🏫 Supported Demo Schools (Multi-Tenant & White-Label)

- **Vidya Public School** (`school-001`)
  - Theme: Royal Blue & Indigo
  - Statutory Attendance Benchmark: **75%**
  - Exam Pass Threshold: **40%**
- **Sunrise International Academy** (`school-002`)
  - Theme: Emerald Green & Teal
  - Statutory Attendance Benchmark: **80%**
  - Exam Pass Threshold: **45%**

---

## 🛠️ Technology Stack

- **Core**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + Lucide Icons + Glassmorphism UI
- **State Management & Persistence**: Zustand with LocalStorage auto-sync
- **Data Visualization**: Recharts (Interactive Line, Bar, and Area charts)
- **Public Website CMS**: Real-time synchronized CMS directly updating `/school-site`

---

## 🎯 Complete 9-Step Demonstration Script (Investor / Client Pitch)

```text
Step 1: Start on Login Page (/login)
        • Showcase the 4 high-fidelity role cards.
        • Switch between "Vidya Public School" and "Sunrise International Academy" to demonstrate white-label theme adaptation.

Step 2: Enter Management Dashboard (/management/dashboard)
        • Highlight the 8 real-time KPI metrics (Students, Teachers, Attendance %, Collections, Pending Fees, Syllabus Delays, Students At Risk, Parent Alerts).
        • Review the 30-day Attendance trend and Monthly Fee Collection charts.
        • Jump into Academic Intelligence and At-Risk Student profiles.

Step 3: Switch to Teacher Portal (/teacher/attendance)
        • Mark attendance for Class 6-A (mark a student absent).
        • Notice instant generation of a parental absence notification across the platform!
        • Open Teaching Plan (/teacher/teaching-plan) and toggle topic statuses.

Step 4: Demonstrate AI Academic Assistant (/management/ai)
        • Switch between Management, Teacher, and Parent personas.
        • Click prompt: "Which students need immediate attention?"
        • Observe real-time diagnostic card detailing student risks and recommended action protocols.
        • Test "Explain Aarav's performance in simple language" for parent conferences.

Step 5: Student & Parent Journey (/student/fees)
        • Log in as Student Aarav Sharma (Class 6-A).
        • Check fee demands and click "Pay Now".
        • Scan dynamic UPI QR Code, simulate receipt upload, and submit.
        • Notice status moves to "Pending Verification".

Step 6: Accounts Audit & Verification Flow (/accounts/verification)
        • Switch to Accounts role.
        • Open Verification Queue, inspect the high-resolution bank slip in the Proof Modal.
        • Click "Verify ✅" to approve.
        • Observe cross-dashboard update: student balance clears, parent receives WhatsApp/SMS receipt confirmation!

Step 7: Parent Communication Layer (/accounts/communication)
        • Test the 8-Alert Simulator (Absence, Attendance <75%, Low Marks, Compound Risk, Fee Pending, etc.).
        • Switch to the "Simulated Parent View" to inspect pixel-perfect previews across WhatsApp, SMS, and Official Email!

Step 8: Public School Website (/school-site)
        • Open the school's public website with 13 independent sections (Home, About, Academics, Faculty, Facilities, Achievements, Gallery, Events, Notice Board, Online Admissions Form, and Contact).
        • Toggle the theme switcher to witness live color rebranding.

Step 9: Real-time CMS Update (/management/website-cms)
        • Add a new notice or edit the hero headline.
        • Return to /school-site to see changes reflected immediately without server reload!
```

---

## 🧪 Verification & Build Status

- **Typecheck**: `npx tsc -b` passes with **0 errors**.
- **Production Bundle**: `npm run build` compiles in **< 850ms**.
