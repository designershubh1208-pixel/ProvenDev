# 🛡️ ProvenDev - Decentralized Skill Verification Platform

![ProvenDev Banner](https://via.placeholder.com/1200x600/4f46e5/ffffff?text=ProvenDev+Platform+Preview)

> **Verify Your Skills. Prove Your Worth.** > The first developer portfolio platform that combines **AI Analysis**, **Expert Verification**, and **Blockchain Technology** to turn your side projects into undeniable, immutable proof of competence.

---

## 🚀 **The Problem**
In the current tech recruitment landscape:
* **Resume Inflation:** Candidates often list skills they haven't actually mastered.
* **Verification Fatigue:** Recruiters waste hours manually reviewing code or conducting repetitive technical interviews.
* **Lack of Ownership:** Developers rely on centralized platforms (LinkedIn, Upwork) that own their data and reputation.

## 💡 **The Solution: ProvenDev**
ProvenDev bridges the gap between Web2 portfolios (GitHub) and Web3 identity. It creates a **"Proof-of-Skill"** ecosystem where:
1.  **AI Agents** analyze code complexity and tech stacks instantly.
2.  **Human Experts** verify the quality and authenticity of the work.
3.  **Blockchain Minting** permanently records the achievement on the Polygon network as a verifiable asset.

---

## 🌟 **Key Features**

### 🤖 **AI-Powered Analysis**
* Automatically parses GitHub repositories.
* Extracts tech stacks (languages, frameworks) and summarizes architecture.
* Fetches and displays live README documentation within the dashboard.

### 🛡️ **Dual-Layer Verification**
* **Layer 1 (AI):** instant "smoke test" for validity and stack detection.
* **Layer 2 (Human Admin):** Manual review to ensure code quality, originality, and functionality before approval.

### 🔗 **Blockchain Minting (Polygon)**
* Approved projects are minted as immutable assets.
* Users receive a **Transaction Hash** that serves as cryptographic proof of their skill.
* *Current Version:* Uses a high-fidelity simulation mode for gas-free testing (Mainnet ready architecture).

### 🎨 **SaaS-Level UX**
* **Glassmorphism & Parallax:** Premium landing page with scroll-triggered animations.
* **Dynamic Dashboards:** Personalized views for Users (Inventory/Portfolio) and Admins (Global Overview).
* **Smart Routing:** Seamless authentication flow and protected routes.

---

## 🛠️ **Tech Stack**

| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS, Framer Motion |
| **Backend (BaaS)** | Firebase (Auth, Firestore) |
| **AI Integration** | GitHub API (Raw Data Fetching & Analysis) |
| **Blockchain** | Simulation Engine (EVM Architecture Ready) |
| **Icons** | Lucide React |

---

## 📸 **Screenshots**

### **1. Landing Page (Parallax Effect)**
*A premium entry point explaining the value proposition.*

### **2. User Dashboard**
*Real-time stats tracking verified skills, on-chain assets, and success rates.*

### **3. Admin Verification Center**
*Admins review AI summaries, check repo links, and mint approvals to the blockchain.*

---

## 🏁 **Getting Started**

### **Prerequisites**
* Node.js (v18+)
* npm or yarn

### **Installation**

1.  **Clone the Repo**
    ```bash
    git clone [https://github.com/yourusername/provendev.git](https://github.com/yourusername/provendev.git)
    cd provendev
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory and add your Firebase credentials:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```

---

## 🛣️ **Roadmap**

- [x] **Phase 1:** Core Platform (Auth, Dashboard, Inventory)
- [x] **Phase 2:** AI Agent Integration (GitHub Parsing)
- [x] **Phase 3:** Admin Verification Logic
- [x] **Phase 4:** Blockchain Simulation & Minting UI
- [ ] **Phase 5:** Mainnet Deployment (Polygon/Ethereum)
- [ ] **Phase 6:** Public Profile Pages for sharing credentials

---

## 🤝 **Contributing**

Contributions are always welcome!
1.  Fork the project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 **License**

Distributed under the MIT License. See `LICENSE` for more information.

---

project demo link - 
https://proven-dev.vercel.app/
