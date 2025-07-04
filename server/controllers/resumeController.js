import asyncHandler from 'express-async-handler';
import Resume from '../models/Resume.js';
import User from '../models/User.js';

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
const createResume = asyncHandler(async (req, res) => {
    const { title } = req.body;

    const initialSections = [
        { id: 'summary', type: 'summary', title: 'Professional Summary', content: { text: 'A brief summary about you...' } },
        { id: 'experience', type: 'experience', title: 'Work Experience', content: { items: [] } },
        { id: 'education', type: 'education', title: 'Education', content: { items: [] } },
        { id: 'skills', type: 'skills', title: 'Skills', content: { items: [] } },
    ];

    const resume = new Resume({
        user: req.user._id,
        title: title || 'Untitled Resume',
        sections: initialSections,
    });

    const createdResume = await resume.save();
    res.status(201).json(createdResume);
});

// @desc    Get all resumes for a user
// @route   GET /api/resumes
// @access  Private
const getUserResumes = asyncHandler(async (req, res) => {
    const resumes = await Resume.find({ user: req.user._id });
    res.json(resumes);
});

// @desc    Get a single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = asyncHandler(async (req, res) => {
    const resume = await Resume.findById(req.params.id);
    if (resume && resume.user.toString() === req.user._id.toString()) {
        res.json(resume);
    } else {
        res.status(404);
        throw new Error('Resume not found');
    }
});

// @desc    Update a resume
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = asyncHandler(async (req, res) => {
    const { title, sections, isPublic, template, customization, profilePicture } = req.body;
    const resume = await Resume.findById(req.params.id);

    if (resume && resume.user.toString() === req.user._id.toString()) {
        resume.title = title || resume.title;
        resume.sections = sections || resume.sections;
        resume.isPublic = isPublic !== undefined ? isPublic : resume.isPublic;
        resume.template = template || resume.template;
        resume.customization = customization || resume.customization;
        resume.profilePicture = profilePicture || resume.profilePicture;

        const updatedResume = await resume.save();
        res.json(updatedResume);
    } else {
        res.status(404);
        throw new Error('Resume not found');
    }
});

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findById(req.params.id);
    if (resume && resume.user.toString() === req.user._id.toString()) {
        await resume.deleteOne();
        res.json({ message: 'Resume removed' });
    } else {
        res.status(404);
        throw new Error('Resume not found');
    }
});


// @desc    Get a public resume by slug
// @route   GET /api/resumes/public/:slug
// @access  Public
const getPublicResume = asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({ slug: req.params.slug, isPublic: true }).populate('user', 'name');

    if (resume) {
        res.json(resume);
    } else {
        res.status(404);
        throw new Error('Public resume not found or is set to private.');
    }
});


export { createResume, getUserResumes, getResumeById, updateResume, deleteResume, getPublicResume };