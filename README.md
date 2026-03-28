# 🎉 EventFlow — Event Management System (MERN Stack)

A full-stack Event Management Web Application built with **MongoDB, Express.js, React.js, and Node.js** (MERN Stack). Inspired by [Luma's](https://lu.ma) clean and modern UI.

![EventFlow](https://img.shields.io/badge/EventFlow-MERN%20Stack-6c63ff?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with secure token storage
- Role-based access control (Admin, Organizer, Attendee)
- Auto-login on page refresh with token validation

### 📅 Event Management
- Full CRUD operations for events
- Multi-step event creation form with live preview
- Image upload for event banners
- Category-based filtering (Conference, Workshop, Seminar, Cultural, Sports, Tech)
- Search with debounce (300ms)
- Pagination support

### 🎫 Registration System
- One-click event registration
- Waitlist support when events reach capacity
- Cancel registration functionality
- Capacity progress bar visualization
- Confetti animation on successful registration 🎊

### 🎨 Premium UI/UX
- **Dark/Light mode** toggle with persistence
- **Glassmorphism** navbar and components
- **Framer Motion** page transitions and animations
- Skeleton loading states
- Toast notifications
- Responsive design (mobile-first)
- Modern design system with Inter font

### 📊 Dashboard
- Stats cards (Events Created, Registrations, Upcoming Events)
- Quick action buttons
- Upcoming events overview

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Vite, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ODM |
| **Auth** | JWT (JSON Web Tokens), bcryptjs |
| **UI Libraries** | React Icons, React Hot Toast, React Hook Form |
| **File Upload** | Multer |

---

## 📁 Project Structure

```
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/       # Auth & upload middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── uploads/         # Uploaded images
│   └── server.js        # Express server entry
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context (Auth, Theme)
│   │   ├── pages/       # Page components
│   │   ├── utils/       # API client & helpers
│   │   ├── App.jsx      # Main app with routing
│   │   └── main.jsx     # React entry point
│   ├── index.html
│   └── tailwind.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### 1. Clone the repository
```bash
git clone https://github.com/nxtman0z/Event-Management-System-MERN.git
cd Event-Management-System-MERN
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
MONGO_URI=mongodb://localhost:27017/eventflow_db
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in Browser
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | Get all events (with filters) |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/events` | Create event (protected) |
| PUT | `/api/events/:id` | Update event (protected) |
| DELETE | `/api/events/:id` | Delete event (protected) |
| GET | `/api/events/my-events` | Get user's events |

### Registrations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/registrations/register/:eventId` | Register for event |
| DELETE | `/api/registrations/cancel/:eventId` | Cancel registration |
| GET | `/api/registrations/my-registrations` | Get user's registrations |
| GET | `/api/registrations/event/:eventId` | Get event registrations |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get profile |
| PUT | `/api/users/profile` | Update profile |
| PUT | `/api/users/change-password` | Change password |

---

## 🎨 Design System

| Property | Value |
|----------|-------|
| Font | Inter (Google Fonts) |
| Primary Color | `#6c63ff` (Purple) |
| Accent Color | `#48cae4` (Cyan) |
| Dark Background | `#0a0a0f` |
| Light Background | `#f8f9ff` |
| Border Radius | 16px (cards), 12px (inputs) |

---

## 📸 Pages

1. **Landing Page** — Hero with animated gradient, search, featured events, stats
2. **Login/Register** — Split layout with social login UI, role selection
3. **Events Listing** — Search, filters, category pills, pagination
4. **Event Detail** — Banner, info cards, registration, countdown, share
5. **Dashboard** — Stats cards, quick actions, upcoming events
6. **Create Event** — Multi-step form with live preview
7. **My Events** — Edit, delete, view registrations
8. **My Registrations** — Countdown timers, cancel option
9. **Profile** — Avatar upload, edit info, change password

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**University Major Project** — Event Management System using MERN Stack

Made with ❤️ and lots of ☕
