import mongoose from 'mongoose'; // <-- Use import

const interviewExperienceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userModelType'
  },
  userModelType: {
    type: String,
    required: true,
    enum: ['Freelancer', 'Student']
  },
  collegeName: { type: String, required: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  roleAppliedFor: { type: String, required: true, trim: true },
  packageLPA: { type: Number },
  jobLocation: { type: String, trim: true },
  interviewDate: { type: Date },
  interviewQuestions: [{ type: String, trim: true }],
  experienceDetails: { type: String, required: true },
  tipsOrRemarks: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  offerReceived: { type: Boolean, default: null },
}, {
  timestamps: true,
});

const InterviewExperience = mongoose.model('InterviewExperience', interviewExperienceSchema);
export default InterviewExperience; // <-- Use export default