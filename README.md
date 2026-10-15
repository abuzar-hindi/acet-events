# 🪔 ACET Dandiya Celebration — Digital Invitation & Faculty Signature Portal

A full-stack, festival-themed digital invitation and digital signature collection portal created for **Aligarh College of Engineering and Technology (ACET)** for the Dandiya & Garba Night celebration.

The portal is designed for student organizers to present invitations to esteemed faculty members, capture their digital signatures directly on mobile devices or laptops, and manage faculty listings securely.

---

## ✨ Features & Architecture

### 1. 🪔 Untouched Premium Hero Section
- Festive night theme with authentic Garba & Dandiya visual aesthetics.
- Traditional Hindi festival headline (*"रंगों की शाम, गरबा के नाम"*).
- Event countdown timer, event badges (Date, Time, Venue), and interactive call-to-actions.

### 2. 📜 Warm Parchment Invitation Card Section
- Redesigned with a warm ivory/cream textured backdrop.
- Authentic SVG rangoli watermarks, mandalas, and festive corner accents.
- Hindi and English invitation poetry and formal greeting from student organizers.

### 3. 👥 Faculty Directory & Acceptance Tracker
- Festive plum/purple background with subtle rangoli pattern overlays.
- Real-time search by faculty name or **Designation** (Professor, Associate Professor, Assistant Professor, HOD, Director, Dean).
- Acceptance statistics: Total invited, Confirmed attendees, and Pending responses.
- Dynamic status indicators with timestamp for signed invitations.

### 4. ✍️ Dedicated Digital Signature Route (`/sign/:facultyId`)
- Full-screen signing experience with personalized invitation message.
- Responsive HTML5 Canvas signature pad with stroke smoothing and clear functionality.
- Direct submission storing signature data in MongoDB Atlas.

### 5. 🎉 Festive Thank-You Route (`/thank-you/:facultyId`)
- Celebration screen featuring circular glowing mandala rings and faculty recognition badge.
- Instant feedback confirming faculty acceptance.
- Quick navigation button returning directly to the directory (`/#faculty`).

### 6. 🔐 Secure Organizer Controls
- Organizer actions protected by a dedicated backend-validated password (`acet_ca_26`).
- **Add Faculty Member Modal** with real-time password verification to prevent unauthorized modifications.
- Complete migration from generic departments to official academic **Designations**.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router v6, Tailwind CSS & Vanilla CSS Design System, Canvas API, Lucide React Icons.
- **Backend**: Node.js, Express.js, Mongoose.
- **Database**: MongoDB Atlas.
- **Tools**: Vite, Nodemon, Dotenv, CORS.

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd server
npm install
```

Configure your `.env` in the `server` directory (already pre-configured):

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.l9hig46.mongodb.net/acet_dandiya?retryWrites=true&w=majority
FRONTEND_URL=http://localhost:3000,http://localhost:3001
ADD_MEMBER_PASSWORD=acet_ca_26
```

Seed the initial database with 20 faculty members and designations:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```
The server will run on `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:3001` (or `http://localhost:3000`).

To build for production:

```bash
npm run build
```

---

## 🔒 Organizer Credentials

| Setting | Default Value | Notes |
|---|---|---|
| **Add Faculty Member Password** | `acet_ca_26` | Configured via `ADD_MEMBER_PASSWORD` in `server/.env` |

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/faculty` | Fetch all faculty members with designations & status |
| `GET` | `/api/faculty/:id` | Fetch specific faculty member details |
| `POST` | `/api/faculty` | Add a new faculty member (requires `password`) |
| `POST` | `/api/faculty/:id/sign` | Submit signature data URI for faculty member |
| `GET` | `/api/health` | Health check endpoint |
