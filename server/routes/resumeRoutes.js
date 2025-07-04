import express from 'express';
import {
    createResume,
    getUserResumes,
    getResumeById,
    updateResume,
    deleteResume,
    getPublicResume
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').post(protect, createResume).get(protect, getUserResumes);
router.route('/:id').get(protect, getResumeById).put(protect, updateResume).delete(protect, deleteResume);
router.get('/public/:slug', getPublicResume);

export default router;