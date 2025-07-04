import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// No need for path/fs modules for Vercel in this setup

dotenv.config();
connectDB();

const app = express();

// Set up CORS to allow requests from the Vercel frontend
const clientURL = process.env.CLIENT_URL;
if (clientURL) {
  app.use(cors({
    origin: clientURL,
    credentials: true,
  }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/upload', uploadRoutes);

// --- ERROR MIDDLEWARE (must be after routes) ---
app.use(notFound);
app.use(errorHandler);

// Vercel handles the server, so we DO NOT need app.listen()
// We just need to export the 'app'
export default app;
