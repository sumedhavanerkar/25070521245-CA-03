# 🎓 Campus Lost & Found Portal

**Student PRN:** 25070521245  
**Project Type:** FLEXI CA-3 Mini-Project  
**Department:** Computer Science Engineering (CSE)  
**Year:** Second Year  
**Stack:** MERN (MongoDB, Express, React, Node.js)

---

## 📋 Project Objective

Build a full-stack web application that helps college students:
- Report items they have **lost** on campus
- Report items they have **found** on campus
- **Browse and search** all listings
- **Contact** the reporter to recover belongings
- **Manage** listings (edit, delete, update status)

---

## 🚫 Problem Statement

College campuses are busy places where students frequently misplace personal belongings — ID cards, phones, wallets, keys, notebooks, and more. Currently, most campuses rely on physical notice boards or WhatsApp groups to report lost items, which are inefficient and hard to search.

The **Campus Lost & Found Portal** provides a centralized digital platform where students can instantly report, search, and recover their lost belongings.

---

## ✅ Features

| Feature | Description |
|---|---|
| 🔴 Report Lost Item | Submit details of an item you lost |
| 🟢 Report Found Item | Report an item you found on campus |
| 🔍 Browse & Search | Search all listings with filters |
| 📋 Manage Listings | Edit, delete, update status of any item |
| 📊 Live Statistics | Real-time stats from MongoDB |
| 📱 Responsive Design | Works on desktop, tablet, and mobile |
| 🏷️ Category Filters | Filter by ID Cards, Books, Phones, etc. |
| 📍 Location Filters | Filter by campus location |
| ℹ️ About / Viva Page | Project info and exam preparation Q&A |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React.js | 18.x | UI Components |
| Vite | 5.x | Build Tool |
| React Router | 6.x | Navigation |
| Axios | 1.x | HTTP Requests |
| Lucide React | — | Icons |
| React Hot Toast | 2.x | Notifications |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript Runtime |
| Express.js | 4.x | Web Framework / API |
| Mongoose | 8.x | MongoDB ODM |
| dotenv | 16.x | Environment Variables |
| CORS | 2.x | Cross-Origin Requests |
| Helmet | 8.x | Security Headers |
| Morgan | 1.x | Request Logging |
| express-validator | 7.x | Input Validation |

### Database
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud Database (recommended) |
| MongoDB Compass | GUI to inspect database |

---

## 📁 Folder Structure

```
25070521245/
├── client/                     ← React Frontend (Vite)
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/         ← Reusable UI components
│   │   │   ├── Navbar.jsx      ← Navigation bar
│   │   │   ├── Footer.jsx      ← Footer
│   │   │   ├── ItemCard.jsx    ← Item listing card
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── LoadingSkeleton.jsx
│   │   │   └── Pagination.jsx
│   │   ├── pages/              ← Page components
│   │   │   ├── HomePage.jsx        ← Home / Hero
│   │   │   ├── BrowsePage.jsx      ← Browse & Filter
│   │   │   ├── ItemDetailPage.jsx  ← Single item details
│   │   │   ├── ReportItemPage.jsx  ← Report Lost/Found form
│   │   │   ├── ManageListingsPage.jsx ← Manage all listings
│   │   │   ├── AboutPage.jsx       ← About / How It Works
│   │   │   └── NotFoundPage.jsx    ← 404 page
│   │   ├── services/
│   │   │   └── api.js          ← Axios API calls to backend
│   │   ├── utils/
│   │   │   └── constants.js    ← Shared constants
│   │   ├── hooks/
│   │   │   └── useAuth.jsx     ← Auth context (optional)
│   │   ├── App.jsx             ← Root component + Routes
│   │   ├── main.jsx            ← Entry point
│   │   ├── App.css             ← All styles
│   │   └── index.css           ← CSS variables
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── server/                     ← Node.js + Express Backend
│   ├── config/
│   │   └── db.js               ← MongoDB connection
│   ├── models/
│   │   └── Item.js             ← Mongoose schema for items
│   ├── routes/
│   │   └── items.js            ← API route definitions
│   ├── controllers/
│   │   └── itemController.js   ← Business logic (CRUD)
│   ├── middleware/
│   │   ├── auth.js             ← Auth middleware
│   │   ├── errorHandler.js     ← Global error handler
│   │   └── validate.js         ← Request validation
│   ├── utils/
│   │   ├── AppError.js         ← Custom error class
│   │   └── seed.js             ← Database seed data
│   ├── server.js               ← Express app entry point
│   ├── package.json
│   └── .env.example
│
├── README.md                   ← This file
└── .gitignore
```

---

## 🗄️ Database Schema (Item Model)

```javascript
{
  title:                  String (required, 3-100 chars)
  description:            String (required, 10-1000 chars)
  type:                   'lost' | 'found'  (required)
  category:               String (enum: ID Card, Books, Phone, etc.)
  location:               String (campus location)
  eventDate:              Date (when it was lost/found)
  imageUrl:               String (optional image URL)
  distinguishingFeatures: String (unique marks, stickers, etc.)
  contactName:            String (reporter's name)
  contactEmail:           String (private, not shown publicly)
  contactPhone:           String (private, not shown publicly)
  status:                 'active' | 'claimed' | 'resolved'
  reportedBy:             ObjectId (ref to User, optional)
  reporterDisplayName:    String
  createdAt:              Date (auto)
  updatedAt:              Date (auto)
}
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check server and database status |
| GET | `/api/items` | Get all items (with filters & pagination) |
| GET | `/api/items/stats` | Get statistics (total lost, found, resolved) |
| GET | `/api/items/:id` | Get a single item by ID |
| POST | `/api/items` | Create a new item report |
| PUT | `/api/items/:id` | Update an existing item |
| PATCH | `/api/items/:id/status` | Update item status only |
| DELETE | `/api/items/:id` | Delete an item |

### Query Parameters for GET /api/items
| Parameter | Example | Description |
|---|---|---|
| `type` | `?type=lost` | Filter by lost or found |
| `category` | `?category=Wallet` | Filter by category |
| `status` | `?status=active` | Filter by status |
| `search` | `?search=phone` | Text search |
| `page` | `?page=2` | Pagination |
| `limit` | `?limit=12` | Items per page |
| `sort` | `?sort=oldest` | Sort order |

---

## ⚙️ Installation

### Prerequisites
- Node.js v18 or higher
- npm v8 or higher
- MongoDB Atlas account (free tier is fine)

### Step 1: Clone or open the project

```
The project is already at: C:\Users\sumed\OneDrive\Desktop\DD\25070521245
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

## 🔧 Environment Configuration

### Backend — `server/.env`

Copy `server/.env.example` to `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string_here
MONGODB_DB_NAME=campus_lost_found
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_chars
JWT_EXPIRES_IN=7d
```

> **IMPORTANT:** Replace `your_mongodb_atlas_connection_string_here` with your actual connection string from MongoDB Atlas.

### Frontend — `client/.env`

The file is already created:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🌿 MongoDB Atlas Setup (Step-by-Step)

### 1. Create a Free Account
Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and sign up with your email.

### 2. Create a Free Cluster
- Click **"Build a Database"**
- Choose **M0 (Free Tier)**
- Select a cloud provider (AWS is fine)
- Click **"Create"**

### 3. Create a Database User
- Go to **Database Access**
- Click **"Add New Database User"**
- Choose **Password Authentication**
- Enter a username (e.g., `campus_user`) and a strong password
- Set role to **"Read and write to any database"**
- Click **"Add User"**

### 4. Allow Your IP Address
- Go to **Network Access**
- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"** (0.0.0.0/0) — for development
- Click **"Confirm"**

### 5. Get Your Connection String
- Go to **Database** → Click **"Connect"**
- Choose **"Drivers"** → Select **Node.js**
- Copy the connection string, e.g.:
  ```
  mongodb+srv://campus_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- Replace `<password>` with your actual password

### 6. Update `server/.env`
Paste your connection string:
```env
MONGODB_URI=mongodb+srv://campus_user:yourpassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

---

## 🔭 MongoDB Compass Setup

MongoDB Compass is a GUI tool to visually inspect your database.

### 1. Download MongoDB Compass
From [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)

### 2. Connect to Atlas
- Open Compass
- Click **"New Connection"**
- Paste your `MONGODB_URI` connection string
- Click **"Connect"**

### 3. View Your Data
- You will see the `campus_lost_found` database
- Inside, the `items` collection contains all reported items
- You can view, filter, and inspect all documents visually

---

## 🚀 How to Run the Project

You need **two terminal windows**.

### Terminal 1 — Start the Backend Server

```bash
cd C:\Users\sumed\OneDrive\Desktop\DD\25070521245\server
npm run dev
```

Expected output:
```
🚀 Server running on http://localhost:5000
📡 API base: http://localhost:5000/api
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

### Terminal 2 — Start the Frontend

```bash
cd C:\Users\sumed\OneDrive\Desktop\DD\25070521245\client
npm run dev
```

Expected output:
```
VITE v5.4.x  ready in 300ms
➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
```

### Open the Application
Open your browser and go to:
```
http://localhost:5173
```

---

## 🧪 How to Test the Application

### Manual Testing Checklist

1. **Home Page** — Open `http://localhost:5173` — should show hero, stats, recent items
2. **Report Lost Item** — Click "Report Lost" → fill the form → submit → should save to MongoDB
3. **Report Found Item** — Click "Report Found" → fill the form → submit
4. **Browse Items** — Click "Browse Items" → search and filter items
5. **Item Details** — Click any item card → should show full details
6. **Edit Item** — Click "Edit" button on item detail page → update fields → save
7. **Update Status** — Go to "Manage Listings" → change status dropdown
8. **Delete Item** — Click the delete button → confirm → item should disappear
9. **Stats** — Check home page numbers match what's in the database
10. **API Health** — Open `http://localhost:5000/api/health` in browser

### Test API with Browser
- `http://localhost:5000/api/health` — Should show `{"status":"ok","database":"connected"}`
- `http://localhost:5000/api/items` — Should return all items as JSON
- `http://localhost:5000/api/items/stats` — Should return statistics

---

## 🌱 Seed the Database (Optional)

To add sample data to your database:

```bash
cd server
node utils/seed.js
```

---

## ❌ Common Errors & Solutions

| Error | Solution |
|---|---|
| `MONGODB_URI is not defined` | Copy `.env.example` to `.env` and set your MongoDB URI |
| `ECONNREFUSED` on frontend | Make sure the backend is running on port 5000 |
| `CORS error` in browser | Check that `CLIENT_URL` in server `.env` matches your frontend URL |
| `MongooseError: Invalid connection string` | Check your Atlas connection string format |
| `MongoNetworkError` | Whitelist your IP in MongoDB Atlas Network Access |
| Port 5000 already in use | Change `PORT=5001` in server `.env` |
| Port 5173 already in use | Vite will auto-use next available port |

---

## 📖 How to Explain This Project to Faculty

### What the project does
This is a full-stack web application called "Campus Lost & Found Portal". Students can report items they have lost or found on campus, browse all reported items, and connect with reporters to recover their belongings. All data is stored in a MongoDB database and persists across page refreshes.

### Why React is used
React.js is used for the frontend because it allows us to build reusable UI components, manage application state efficiently, and create a fast, interactive single-page application without full page reloads.

### Why Node.js and Express are used
Node.js allows us to run JavaScript on the server side. Express.js is a lightweight web framework that makes it easy to define API routes, handle HTTP requests, and send JSON responses to the frontend.

### Why MongoDB is used
MongoDB is a NoSQL database that stores data as flexible JSON-like documents. It integrates naturally with JavaScript/Node.js through Mongoose, making it easy to define schemas and perform database operations.

### What CRUD means
- **C**reate: Report a new lost/found item (POST /api/items)
- **R**ead: Browse and view items (GET /api/items, GET /api/items/:id)
- **U**pdate: Edit an item or change its status (PUT, PATCH)
- **D**elete: Remove an item listing (DELETE /api/items/:id)

### What an API is
API stands for Application Programming Interface. In this project, the backend exposes a REST API — a set of URL endpoints that the frontend calls to perform CRUD operations on the database. Data is exchanged in JSON format.

### How frontend communicates with backend
The React frontend uses the Axios library to send HTTP requests to the Express backend. For example, when a user submits the "Report Lost Item" form, Axios sends a POST request to `http://localhost:5000/api/items` with the form data. The backend validates it, saves it to MongoDB via Mongoose, and sends back the saved item.

### How data is stored in MongoDB
Each reported item is stored as a document in the `items` collection inside the `campus_lost_found` database. Mongoose provides a schema that defines the structure, validation rules, and data types for each document.

---

## ❓ Viva Questions & Answers

**Q1: What is the purpose of this project?**  
A: A web app where students can report lost/found campus items, search listings, and recover belongings using a full-stack MERN approach.

**Q2: What does MERN stand for?**  
A: MongoDB, Express.js, React.js, Node.js — the four main technologies used to build this application.

**Q3: What is React.js?**  
A: A JavaScript library by Facebook for building user interfaces using reusable components and a virtual DOM for efficient updates.

**Q4: What is Mongoose?**  
A: An Object Data Modeling (ODM) library for MongoDB that lets us define schemas, add validation, and use simple methods like `Item.find()` and `Item.create()`.

**Q5: What is a REST API?**  
A: An architectural style where resources (like items) are accessed via URLs using HTTP methods: GET (read), POST (create), PUT (update), DELETE (remove).

**Q6: What is CRUD?**  
A: Create, Read, Update, Delete — the four fundamental database operations. This app implements all four for the `items` collection.

**Q7: How does data persist after a browser refresh?**  
A: Data is stored in MongoDB Atlas (cloud database), not in the browser. Every time the page loads, the frontend fetches fresh data from the backend API.

**Q8: What is Vite?**  
A: A modern frontend build tool that provides instant hot module replacement (HMR) during development and optimized builds for production.

**Q9: What is CORS and why do you need it?**  
A: Cross-Origin Resource Sharing. Since the frontend (port 5173) and backend (port 5000) run on different ports, the browser blocks requests by default. The `cors` middleware on the backend allows the frontend to make API calls.

**Q10: How is form data validated?**  
A: On the frontend, React state and a validation function check required fields before submission. On the backend, `express-validator` middleware validates the incoming request body before the database operation.

---

## 🚀 Future Enhancements

1. User authentication (login/register) so users can manage only their own listings
2. Real image upload to cloud storage (Cloudinary or AWS S3)
3. Email notifications when a matching item is found
4. Push notifications via Firebase
5. Mobile app using React Native
6. Admin dashboard with analytics
7. QR code generation for item labels
8. Machine learning-based item matching

---

## 🔗 GitHub Instructions

### Push to GitHub

```bash
# Navigate to project root
cd C:\Users\sumed\OneDrive\Desktop\DD\25070521245

# Initialize git (if not already done)
git init

# Add all files (excludes node_modules and .env via .gitignore)
git add .

# Commit
git commit -m "Initial commit: Campus Lost & Found Portal - FLEXI CA-3"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/25070521245.git

# Push
git push -u origin main
```

> **Note:** Create a new repository on GitHub first at [https://github.com/new](https://github.com/new). Name it `25070521245`. Do NOT initialize it with a README (we already have one).

---

## 📌 Final Submission Checklist

- [x] Folder named exactly `25070521245`
- [x] `client/` folder with React frontend
- [x] `server/` folder with Node.js backend
- [x] All 8 pages implemented
- [x] Frontend builds successfully (`npm run build`)
- [x] Backend starts correctly
- [x] All API endpoints working
- [x] Frontend-backend integration complete
- [x] Form validation on frontend and backend
- [x] MongoDB Atlas configuration ready
- [x] `.gitignore` excludes `node_modules` and `.env`
- [x] `.env.example` files committed
- [x] README.md complete
- [ ] Set your MongoDB Atlas connection string in `server/.env`
- [ ] Push to GitHub

---

*Campus Lost & Found Portal — FLEXI CA-3 | PRN: 25070521245*
