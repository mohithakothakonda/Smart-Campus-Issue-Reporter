# 🏫 Smart Campus Issue Reporter

> **"Report Smart. Resolve Faster. Build a Better Campus."**

An intelligent, full-stack campus complaint management platform engineered for colleges and universities. Students report infrastructure and maintenance issues with **real-time AI classification**, **GPS-based campus boundary verification**, and **visual lifecycle tracking**. Campus administrators manage, triage, dispatch departments, and monitor facility analytics from a centralized command dashboard.

---

## 🌟 Key Highlights & Core Features

### 1. 🤖 AI-Based Issue Identification (Google Gemini API + NLP Fallback)
- **Automated Triage**: Analyzes complaint title and description to extract:
  - **Category** (*Electrical, Plumbing, Classroom Maintenance, Damaged Furniture, Internet & Wi-Fi, Cleanliness & Sanitation, Laboratory Equipment, Washroom Maintenance, Security, Other*)
  - **Appropriate Department** (*Electrical Department, Plumbing Department, Maintenance Department, IT Department, Housekeeping Department, Laboratory Maintenance Department, Security Department*)
  - **Suggested Urgency Priority** (*High, Medium, Low*)
  - **Concise 1-Sentence Summary**
  - **Recommended Action** for facilities administration
- **Dual-Engine Architecture**: Seamlessly calls Google Gemini API (`gemini-1.5-flash`), with an instant **zero-downtime rule-based NLP classifier fallback** if an API key is not supplied or if external network access is unavailable.
- **Safety First**: Dangerous electrical faults, fire risks, and flooding hazards are automatically flagged for immediate dispatch.
- **Human-in-the-Loop**: Clear visual badge distinguishing AI suggestions from verified facts; administrators retain full authority to override AI assignments.

### 2. 📍 GPS-Based Campus Boundary Verification
- **Haversine Distance Formula**: Accurately computes great-circle distance between the student's browser GPS coordinates and the college's configured campus reference coordinates.
- **Configurable Boundary Radius**: Enforces a strict campus perimeter (default: 1,500 meters) to ensure complaints originate from verified campus grounds.
- **Simulation Toggle**: Built-in *"Simulate Campus Location (120m)"* control allows seamless evaluation and testing when running from off-campus or in local environments.
- **Granular Classroom Details**: Students manually specify Building, Floor, and Room number for precise on-site technician dispatch.

### 3. 👥 Role-Based Portals & Access Control
- **Student Portal**:
  - Personal dashboard with KPI counts (*Submitted, Pending, In Progress, Resolved*).
  - Streamlined complaint submission form with image uploads (drag & drop / file picker), building selector, GPS detection, and real-time AI preview.
  - Interactive **Visual Stepper Tracker** (*Submitted → Under Review → Assigned → In Progress → Resolved / Rejected*) with timestamped technician audit remarks.
  - In-app notification drawer with unread count badge.
  - Private data protection: Students cannot view other students' personal complaints.
- **Administrator Portal**:
  - Centralized management table with multi-criteria filtering (*by Category, Department, Priority, Status, and Search*).
  - Triage modal to reassign departments, adjust final priorities, transition lifecycle statuses, and add administrative remarks.
  - Dedicated **Campus Analytics Page** powered by **Recharts**:
    - Categorical Defect Distribution (Pie Chart)
    - Departmental Workload & Completed Tasks (Bar Chart)
    - Lifecycle Status Breakdown (Doughnut Chart)
    - Monthly Complaint Trends (Area Chart)
    - Department Efficiency & Completion Matrix
  - Protected admin routes: Users cannot self-elevate to administrator during registration.

### 4. 🔔 In-App Notification System
- Real-time notification streams triggered automatically when:
  - A complaint is submitted and routed.
  - An administrator reviews or reassigns the ticket.
  - The status advances (*In Progress, Resolved, Rejected*).
  - A technician adds administrative remarks.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React Icons, Recharts, Axios |
| **Backend** | Node.js, Express.js, Multer, JSON Web Tokens (JWT), bcryptjs, CORS |
| **Database** | MongoDB with Mongoose + Embedded Zero-Config Persistent Store Fallback |
| **AI Integration** | Google Gemini API (`@google/genai` / REST) + Rule-Based NLP Classifier |
| **Geospatial** | Browser Geolocation API + Great-Circle Haversine Formula |
| **Storage** | Cloudinary integration + Local Disk Storage serving via `/uploads/` |

---

## 📂 Project Structure

```
smart-campus-reporter/
├── package.json                    # Root orchestration scripts
├── README.md                       # Comprehensive system documentation
├── server/
│   ├── package.json                # Backend dependencies
│   ├── .env                        # Active environment variables
│   ├── .env.example                # Template configuration
│   ├── test-e2e.js                 # Automated 10-step E2E integration test suite
│   ├── uploads/                    # Local storage directory for complaint photos
│   └── src/
│       ├── server.js               # Express app, static serving, auto-seed
│       ├── config/
│       │   ├── db.js               # Dual-mode DB connection (MongoDB / Embedded)
│       │   ├── campus.js           # Haversine distance calculator & campus boundary
│       │   ├── cloudinary.js       # Cloudinary integration + local fallback
│       │   └── embeddedStore.js    # Resilient JSON persistent database adapter
│       ├── models/
│       │   ├── User.js             # User model with bcrypt authentication
│       │   ├── Complaint.js        # Complaint model with status history
│       │   └── Notification.js     # In-app notification schema
│       ├── middleware/
│       │   ├── auth.js             # JWT verification & role authorization
│       │   └── upload.js           # Multer image validation & handling
│       ├── services/
│       │   ├── geminiService.js    # Gemini AI API + Rule-Based NLP classifier
│       │   └── notificationService.js # Notification dispatcher
│       ├── controllers/
│       │   ├── authController.js   # Student registration, login, profile
│       │   ├── complaintController.js # CRUD, GPS checks, AI previews
│       │   ├── notificationController.js # Real-time alerts
│       │   └── analyticsController.js # Recharts dashboard data aggregation
│       ├── routes/                 # Express API route definitions
│       └── seed/
│           └── seedData.js         # Pre-seeds admin, students & 8 diverse tickets
└── client/
    ├── package.json                # Frontend dependencies
    ├── vite.config.js              # Vite bundler configuration & backend proxy
    ├── tailwind.config.js          # Tailwind color theme & animations
    ├── index.html                  # HTML entry point
    └── src/
        ├── App.jsx                 # Dynamic portal routing & role management
        ├── main.jsx                # React root mount
        ├── context/
        │   ├── AuthContext.jsx     # Authentication state & session recovery
        │   └── NotificationContext.jsx # Real-time notification polling & state
        ├── services/
        │   ├── api.js              # Axios instance with JWT interceptors
        │   └── geolocation.js      # Browser GPS & client-side Haversine calculation
        ├── components/
        │   ├── common/             # Navbar, Sidebar, Badges, Modals, StatCards
        │   ├── complaints/         # Visual Stepper, GPS Card, AI Card, ComplaintCard
        │   └── charts/             # Recharts (CategoryPie, DepartmentBar, StatusDoughnut, TrendLine)
        └── pages/
            ├── LandingPage.jsx     # Marketing landing page with 1-click demo logins
            ├── LoginPage.jsx       # Student & Admin login with demo pre-fill
            ├── RegisterPage.jsx    # Student registration with validation
            ├── student/            # StudentDashboard, SubmitComplaint, MyComplaints
            └── admin/              # AdminDashboard, AdminComplaints, AdminAnalytics
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **MongoDB**: Local MongoDB daemon or MongoDB Atlas URI (The system includes an automatic embedded persistent store so it functions out-of-the-box even without a running MongoDB service!).

### Step 1: Install Dependencies
From the project root:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 2: Configure Environment Variables
Verify or edit `server/.env`:
```ini
PORT=5000
NODE_ENV=development

# Database (Local or Atlas MongoDB URI)
MONGO_URI=mongodb://127.0.0.1:27017/smart_campus

# JWT Secret
JWT_SECRET=smart_campus_super_secret_jwt_key_2026_xyz!
JWT_EXPIRES_IN=7d

# Campus Geolocation Settings
CAMPUS_NAME=Greenwood Institute of Technology
CAMPUS_LATITUDE=12.9716
CAMPUS_LONGITUDE=77.5946
CAMPUS_RADIUS_METERS=1500

# Optional Google Gemini AI Key (If blank, rule-based NLP engine activates automatically)
GEMINI_API_KEY=

# Optional Cloudinary Storage (If blank, local disk storage handles photos)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Step 3: Seed Database
Populate demo administrator and student accounts, along with 8 realistic campus complaints across categories:
```bash
cd server
node src/seed/seedData.js
```

### Step 4: Run the Application

#### Option A: Run Both Client & Server Concurrently
Open two terminal windows:
```bash
# Terminal 1 (Backend API on http://localhost:5000)
cd server
npm run dev

# Terminal 2 (Vite Frontend on http://localhost:5173)
cd client
npm run dev
```

#### Option B: Run Unified Full-Stack Server
The Express server automatically serves the built frontend production bundle from `client/dist`:
```bash
cd server
npm start
# Open http://localhost:5000 in your browser!
```

---

## 🔑 Demo Credentials (Instant 1-Click Evaluation)

The application includes convenient **1-Click Demo Fill** buttons on the Landing and Login pages:

| Role | Email | Password | Pre-loaded Context |
|---|---|---|---|
| **Campus Administrator** | `admin@campus.edu` | `Admin@123` | Full access to central management, department dispatch, status changes, and campus analytics |
| **Student (John Doe)** | `john.doe@student.campus.edu` | `Student@123` | Active tickets in Electrical, Plumbing, IT, and Cleanliness categories |
| **Student (Sarah Smith)**| `sarah.smith@student.campus.edu` | `Student@123` | Tickets in Laboratory Equipment, Classroom Maintenance, and Security |

---

## 🧪 Automated End-to-End Test Suite

Run the comprehensive 10-step integration test suite verifying authentication, AI NLP parsing, GPS validation, ticket lifecycle, and notifications:
```bash
cd server
node test-e2e.js
```

**Verification Results:**
- ✅ `GET /api/health`: Database connection & campus boundary verification
- ✅ `POST /api/auth/login`: Administrator JWT authentication
- ✅ `POST /api/auth/login`: Student JWT authentication
- ✅ `POST /api/complaints/analyze-preview`: Gemini AI / Rule-based category & priority classification
- ✅ `GET /api/complaints`: Admin retrieval of campus-wide tickets
- ✅ `GET /api/complaints/my`: Student data isolation & ownership validation
- ✅ `GET /api/analytics/dashboard`: Recharts aggregation metrics
- ✅ `POST /api/complaints`: Ticket submission with simulated GPS & unique ID generation
- ✅ `PUT /api/complaints/:id/status`: Administrative triage & technician dispatch
- ✅ `GET /api/notifications`: Instant in-app notification delivery to students

---

## 🚀 Production Deployment

### Build for Production
```bash
cd client
npm run build
```
The optimized bundle is generated into `client/dist`. The Express backend serves this static directory with automatic fallback to `index.html`.

### Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/
RUN cd server && npm install --production
RUN cd client && npm install && npm run build
COPY . .
EXPOSE 5000
CMD ["node", "server/src/server.js"]
```

---

## 📄 License
MIT License. Built by Google DeepMind Engineer for smart campus facility management.
