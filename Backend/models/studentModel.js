import mongoose from 'mongoose'; // <-- Use import
import bcrypt from 'bcryptjs';

// --- Re-usable Sub-schemas ---
const EducationSchema = new mongoose.Schema({
  degree: String,
  school: String,
  year: String,
});
const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  duration: String,
  description: String,
});
const PortfolioProjectSchema = new mongoose.Schema({
  name: String,
  link: String,
  tech: String,
  description: String,
});

const studentSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: String, required: true },
  collegeName: { type: String, default: '' },
  
  // Profile Fields
  profileImage: { type: String, default: 'https://i.imgur.com/6VBx3io.png' },
  title: { type: String, default: 'Student' },
  bio: { type: String, default: 'Welcome to my profile!' },
  rate: { type: String, default: 'N/A' },
  location: { type: String, default: 'Location not set' },
  availability: { type: String, default: 'Available for internships' },
  age: { type: Number },
  gender: { type: String, enum: ['Female', 'Male', 'Other', 'Prefer not to say'] },
  skills: [String],
  education: [EducationSchema],
  experience: [ExperienceSchema],
  projects: [PortfolioProjectSchema],
}, {
  timestamps: true
});

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
studentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);
export default Student; // <-- Use export default