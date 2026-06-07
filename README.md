# Launchpad 🚀

Launchpad is an intelligent career and opportunity tracking platform that helps students and job seekers automatically manage job and internship applications. It connects to your email, uses AI to extract opportunity details, parses your resume to identify your skills, and matches you with the best roles—saving you hours of manual tracking.

## 🌟 Key Features

- **Automated Opportunity Discovery:** Periodically polls your Gmail to find and extract job/internship opportunities using Google's Gemini 2.5 Flash AI.
- **Smart Skill Matching:** Upload your resume, and the platform uses AI to extract your technical and professional skills, matching them against required skills for newly discovered opportunities.
- **Intelligent Dashboard:** A centralized view to manage your applications, track deadlines, and monitor your overall career progress.
- **Secure Authentication:** Integrated with Google OAuth for secure login and email access.

## 🛠️ Tech Stack

### Frontend
- **React 18** with **Vite 5**
- **Tailwind CSS v4** for modern styling
- **React Router v6** for navigation
- **Lucide React** for icons

### Backend
- **Node.js** & **Express**
- **MongoDB** (via Mongoose)
- **Google Generative AI (Gemini)** for natural language processing and extraction
- **Google APIs** for Gmail integration
- **JWT** for session management and authentication

## 📂 Project Structure

```text
launchpad/
├── backend/            # Node/Express server, MongoDB models, background jobs, AI services
└── frontend/           # React application, Tailwind styling, pages, and components
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance (local or Atlas)
- Google Cloud Console Project (for OAuth and Gmail API)
- Google AI Studio API Key (for Gemini integration)

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd launchpad
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

You need to set up environment variables for both the frontend and backend. 

**Backend (`backend/.env`):**
Create a `backend/.env` file based on the provided `.env.example`:
```env
# MongoDB connection string
MONGO_URI=mongodb://localhost:27017/launchpad

# Port for the server
PORT=5000

# URL of the frontend application
FRONTEND_URL=http://localhost:5173

# Google OAuth setup
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback

# Security & Encryption
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key_for_tokens

# Gemini AI Integration
GEMINI_API_KEY=your_gemini_api_key

# SMTP configuration for any outbound emails
EMAIL_USER=your_smtp_email
EMAIL_PASS=your_smtp_password
```

**Frontend (`frontend/.env`):**
Create a `frontend/.env` file based on `.env.example`:
```env
VITE_API_URL=http://localhost:5000
```

### Running the App Locally

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open the Application:**
   Navigate to `http://localhost:5173` (or the port specified by Vite) in your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open-source. Please check the repository for further licensing details.
