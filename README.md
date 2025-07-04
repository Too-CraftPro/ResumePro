# ResumePro - The Modern Resume Builder

Welcome to ResumePro! A full-stack, production-ready web application similar to Enhancv.com, built with the MERN stack and designed for a seamless user experience.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based login, registration, and protected routes.
- **🧱 Drag & Drop Builder**: Easily reorder resume sections.
- **✍️ Rich Text Editing**: Use a WYSIWYG editor for detailed descriptions.
- **🚀 Real-time Preview**: See your changes instantly.
- **💾 Autosave**: Never lose your progress.
- **🎨 Customizable Templates**: Switch between professional designs, fonts, and colors.
- **📄 PDF Export**: Download a high-quality, print-ready PDF of your resume.
- **🔗 Sharable Public Link**: Share your resume with a public URL.
- **📱 Fully Responsive**: Looks great on all devices.

## 🔩 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router, React Beautiful DnD
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Deployment**: Ready for Render, Vercel, Heroku, etc.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)
- Cloudinary account (for image uploads)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd resumepro
    ```

2.  **Install root dependencies:**
    ```bash
    npm install
    ```

3.  **Setup Backend:**
    ```bash
    cd server
    npm install
    cp ../.env.example .env 
    # Or rename the root .env.example to .env
    ```
    - Fill in your `MONGO_URI`, `JWT_SECRET`, and `CLOUDINARY_*` variables in the `.env` file.

4.  **Setup Frontend:**
    ```bash
    cd ../client
    npm install
    ```

5.  **Run the application (from the root directory):**
    ```bash
    npm run dev
    ```
    This will start both the backend server (on port 5000) and the frontend client (on port 5173) concurrently.

### ☁️ Deployment (Example: Render)

1.  Push your code to a GitHub repository.
2.  On Render, create a new "Web Service".
3.  Connect your GitHub repository.
4.  Configure the service:
    - **Root Directory**: `.` (leave as is if using monorepo settings)
    - **Build Command**: `npm run build`
    - **Start Command**: `npm start`
    - **Environment Variables**: Add all the variables from your `.env` file to the Render environment settings. Ensure `NODE_ENV` is set to `production`.
5.  Deploy! Render will automatically install dependencies for both `client` and `server` and run the build script.

---