import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// --- NEW IMPORTS FOR PRODUCTION DEPLOYMENT ---
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
connectDB();

const app = express();

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- API ROUTES ---
// All your API routes must be here, BEFORE the frontend serving logic
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/upload', uploadRoutes);


// =================================================================
// --- SERVE FRONTEND IN PRODUCTION ---
// =================================================================

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  // Set the client/dist folder as a static folder
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // For any route that is not an API route, serve the index.html from the build folder
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../', 'client', 'dist', 'index.html'))
  );
} else {
  // If not in production, just have a simple root route for API testing
  app.get('/', (req, res) => {
    res.send('ResumePro API is running in development mode...');
  });
}
// =================================================================

// --- ERROR MIDDLEWARE (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
