const mongoose = require('mongoose');

/**
 * Resume Schema
 * Full resume data structure matching the frontend Resume type.
 */
const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Resume name is required'],
      trim: true,
      default: 'Untitled Resume',
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedIn: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    summary: { type: String, default: '' },
    experience: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        field: String,
        year: String,
        cgpa: String,
      },
    ],
    skills: [{ type: String }],
    projects: [
      {
        name: String,
        description: String,
        technologies: String,
        link: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        year: String,
      },
    ],
    templateId: {
      type: String,
      enum: ['professional', 'modern', 'executive'],
      default: 'professional',
    },
    isPremium: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
