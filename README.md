# 🛒 SmartMart – Intelligent Mart Management System (MERN + DSA + GenAI)

**Simplify Store Management. Showcase Your Dev + DSA + GenAI Power.**

A full-stack retail platform (like D-Mart, K-Mart) built with **MERN stack** + deep **DSA logic** + smart **GenAI features**.  
🔑 **Goal:** Show practical dev + strong DSA + AI integration in one real-world project.

📧 connectwithsiddh@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/siddharth-patel-b1ba53270/)

---

## 🚀 Key Highlights

- 🔐 Role-based Login (Admin, Staff, Manager)
- 🧾 Smart Billing + Offers + QR Scan
- 📦 Auto Reorder + Inventory Rules
- 📊 Sales Analytics Dashboard
- 🚚 Delivery Route Optimization
- 💬 AI Assistant (GenAI)
- 📁 Bulk CSV Upload
- 🏬 Multi-Mart Branch System

---

## 🛠️ Tech Stack

| Layer      | Tech Used                          |
|------------|------------------------------------|
| Frontend   | React.js / React Native            |
| Backend    | Node.js, Express.js                |
| Database   | MongoDB                            |
| Auth       | JWT (Role-based Access)            |
| Charts     | Chart.js                           |
| Maps       | Leaflet / Mapbox                   |
| File Upload| CSV (XLSX parser)                  |
| GenAI      | OpenAI API + LangChain.js          |

---

## 🎯 Problem It Solves

- 📦 Track stock, expiry, reorder levels
- 🧾 Fast billing with smart offers
- 🚚 Delivery planning & optimization
- 📊 Sales insights & trends
- 🔄 Predictive restocking

---

## 🔥 Smart Features + DSA Concepts

| Feature                           | Description                              | DSA Used                          |
|-----------------------------------|------------------------------------------|-----------------------------------|
| Inventory Management              | Stock tracking, expiry alerts            | `HashMap`, `MinHeap`, `Queue`     |
| Barcode/QR Scanner                | Scan code → Auto-fill product            | `Trie` (optional)                 |
| Smart Billing System              | Cart, coupons, invoice                   | `HashMap`, `Stack`, `Tree`        |
| Delivery Route Optimization       | Shortest delivery path                   | `Graph`, `Dijkstra`, `PriorityQueue` |
| Auto Reorder System               | Stock < threshold → reorder              | `MinHeap`, `Queue`, `HashMap`     |
| Analytics Dashboard               | Top products, expiry alerts              | `Sort`, `Set`, `Moving Avg`       |
| Customer/Supplier Management      | Track orders, avoid duplicates           | `Linked List`, `Set`              |
| Multi-Mart Support                | Branch transfers                         | `Graph`, `DFS`                    |
| Bulk CSV Upload                   | Add 100s of products                     | `Array`, `Queue`                  |
| Role-based Access Control         | Admin, Billing, Manager roles            | `Map`                             |
| Report Generator                  | PDF/CSV for sales & profit               | `HashMap`, `Sort`, `Aggregate`    |
| Offer & Coupon Engine             | Discounts based on cart                  | `Tree`, `HashMap`                 |

---

## 🤖 GenAI Powered Features (OpenAI + LangChain)

| Feature                           | What It Does                             | Why It’s 🔥                        |
|-----------------------------------|------------------------------------------|-----------------------------------|
| 🧠 **AI Assistant**               | Ask: “Show expired items”, “Top seller?”| Real-time DB insights with AI     |
| 📄 **AI Report Generator**       | Smart monthly summaries in plain English| Adds business intelligence        |
| 🎯 **Smart Offer Generator**     | Suggest combo offers, discounts         | AI uses sales history to suggest  |
| 📝 **Product Description Filler**| Auto-generates product details           | Looks polished, professional      |
| 💬 **AI Chatbot (for Staff)**    | Help on using system features            | Boosts UX and modern touch        |

🧠 **Bonus:** Add **GenAI Mode Toggle** for turning AI features on/off inside app.

---

## 📸 Screenshots (Optional)

_Add screenshots here showing:_  
- 📊 Dashboard  
- 🧾 Billing page  
- 🗺️ Route optimization map  
- 💡 GenAI assistant responses  

---

## 📝 Installation & Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/smartmart.git
cd smartmart

# Install all dependencies (backend + frontend)
npm install

# Start both backend and frontend together
npm run dev
```

✅ Make sure your `package.json` has a `dev` script like this:

```json
"scripts": {
    "client": "npm run dev --prefix client",
    "server": "npm run dev --prefix server",
    "dev": "concurrently \"npm run client\" \"npm run server\""
  }
```

✅ Setup `.env` files in both `backend/` and `frontend/` folders:

**In `backend/.env`:**
```env
MONGODB_URL= *******************************
PORT=4000
JWT_SECRET= *******************************
EMAIL_USER= *******************************
EMAIL_PASS= *******************************
CLOUDINARY_CLOUD_NAME= *******************************
CLOUDINARY_API_KEY= *******************************
CLOUDINARY_API_SECRET= *******************************
OPENCAGE_API_KEY= *******************************
```

**In `frontend/.env`:**
```env
REACT_APP_API_URL=http://localhost:4000
```



---


**"Built SmartMart, a full-stack retail platform (MERN) with integrated DSA logic (Graph, Heap, HashMap, Tree) and GenAI features (OpenAI + LangChain) for dynamic insights, report generation, and smart offer suggestions."**


---

## 📬 Contact

📩 **Email:** connectwithsiddh@gmail.com  
🔗 **LinkedIn:** [Siddharth Patel](https://www.linkedin.com/in/siddharth-patel-b1ba53270/)

---

## 🙌 Thanks for scrolling!

If you found this useful, give it a ⭐  
And feel free to fork it for your own version!
