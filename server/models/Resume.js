import mongoose from 'mongoose';
import slugify from 'slugify';

const sectionSchema = new mongoose.Schema({
    id: { type: String, required: true }, // For front-end key mapping
    type: { type: String, required: true, enum: ['summary', 'experience', 'education', 'skills', 'projects', 'certificates'] },
    title: { type: String, required: true },
    content: mongoose.Schema.Types.Mixed,
});

const resumeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, default: 'Untitled Resume' },
    slug: { type: String, unique: true },
    sections: [sectionSchema],
    isPublic: { type: Boolean, default: false },
    template: { type: String, default: 'minimalist' }, // e.g., 'minimalist', 'modern'
    customization: {
        font: { type: String, default: 'Arial' },
        color: { type: String, default: '#000000' },
    },
    profilePicture: { type: String }
}, { timestamps: true });

resumeSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(`${this.title}-${this._id.toString().slice(-6)}`, { lower: true, strict: true });
  }
  next();
});

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;