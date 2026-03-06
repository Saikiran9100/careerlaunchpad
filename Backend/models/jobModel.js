import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  title: { type: String, required: true }, // Added title for better structure
  rating: { type: Number, default: 0 },
  reviews: { type: String },
  logoUrl: { type: String },
  description: { type: String, required: true },
  skills: [{ type: String }], // Array of strings for skills
  location: { type: String, default: 'Remote' },
  applyLink: { type: String },
  postedDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);
export default Job;