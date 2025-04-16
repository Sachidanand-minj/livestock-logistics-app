# 🐄 Livestock Logistics App 🚚

A real-time livestock transportation management system with role-based dashboards for:
- 🧑‍🌾 **Sender** – Create, confirm, and track shipments
- 🚛 **Transporter** – Accept shipments and send live locations
- 🛡 **Admin** – Monitor users and shipments, delete records

---

## 🛠 Tech Stack

- **Frontend**: React + TailwindCSS + Google Maps + Toastify
- **Backend**: Node.js + Express + MongoDB + JWT
- **Real-time**: Socket.IO
- **Deployment**: (Coming Soon) Railway / Render / Vercel

---

## 🚀 Getting Started

### 📦 Backend

```bash
cd livestock-logistics-backend
npm install
cp .env.example .env # and fill in your Mongo URI & JWT_SECRET
npm run dev

🌐 Frontend
cd livestock-logistics-frontend
npm install
npm run dev

🧪 Test Users
Admin: admin@logistics.com / Admin@123
Sender: sam@example.com / Sam@123
Transporter: pankaj@example.com / Pankaj@123


🧑‍💻 Contributing
# Fork this repo
# Create a new branch
git checkout -b feature/your-feature-name

# Make changes, then push:
git add .
git commit -m "✨ Added XYZ feature"
git push origin feature/your-feature-name

