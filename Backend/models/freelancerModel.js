// // import mongoose from 'mongoose'; // <-- Use import
// // import bcrypt from 'bcryptjs';

// // // --- Sub-schemas for profile data ---
// // const EducationSchema = new mongoose.Schema({
// //   degree: String,
// //   school: String,
// //   year: String,
// // });
// // const ExperienceSchema = new mongoose.Schema({
// //   title: String,
// //   company: String,
// //   duration: String,
// //   description: String,
// // });
// // const PortfolioProjectSchema = new mongoose.Schema({
// //   name: String,
// //   link: String,
// //   tech: String,
// //   description: String,
// // });

// // const freelancerSchema = new mongoose.Schema({
// //   email: { type: String, required: true, unique: true, lowercase: true },
// //   password: { type: String, required: true, minlength: 6 },
// //   firstName: { type: String, required: true },
// //   lastName: { type: String, required: true },
// //   mobile: { type: String, required: true },
  
// //   // Profile Fields
// //   profileImage: { type: String, default: 'https://i.imgur.com/6VBx3io.png' },
// //   title: { type: String, default: 'Freelancer' },
// //   bio: { type: String, default: 'Welcome to my profile!' },
// //   rate: { type: String, default: '$20/hr' },
// //   location: { type: String, default: 'Location not set' },
// //   availability: { type: String, default: 'Available for hire' },
// //   age: { type: Number },
// //   gender: { type: String, enum: ['Female', 'Male', 'Other', 'Prefer not to say'] },
// //   skills: [String],
// //   education: [EducationSchema],
// //   experience: [ExperienceSchema],
// //   projects: [PortfolioProjectSchema],
// // }, {
// //   timestamps: true
// // });

// // freelancerSchema.pre('save', async function (next) {
// //   if (!this.isModified('password')) return next();
// //   const salt = await bcrypt.genSalt(10);
// //   this.password = await bcrypt.hash(this.password, salt);
// //   next();
// // });
// // freelancerSchema.methods.matchPassword = async function (enteredPassword) {
// //   return await bcrypt.compare(enteredPassword, this.password);
// // };

// // const Freelancer = mongoose.model('Freelancer', freelancerSchema);
// // export default Freelancer; // <-- Use export default




// import mongoose from 'mongoose'; 
// import bcrypt from 'bcryptjs';

// // --- Sub-schemas for profile data ---
// const EducationSchema = new mongoose.Schema({
//   degree: String,
//   school: String,
//   year: String,
// });
// const ExperienceSchema = new mongoose.Schema({
//   title: String,
//   company: String,
//   duration: String,
//   description: String,
// });
// const PortfolioProjectSchema = new mongoose.Schema({
//   name: String,
//   link: String,
//   tech: String,
//   description: String,
// });

// // --- NEW: Review Sub-schema (Critical for saving reviews on profile) ---
// const ReviewSubSchema = new mongoose.Schema({
//   name: { type: String, required: true }, // Stores Client Name/Company Name
//   rating: { type: Number, required: true },
//   comment: { type: String, required: true },
//   clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
//   projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
//   createdAt: { type: Date, default: Date.now }
// });

// const freelancerSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true, lowercase: true },
//   password: { type: String, required: true, minlength: 6 },
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   mobile: { type: String, required: true },
  
//   // Profile Fields
//   profileImage: { type: String, default: 'https://i.imgur.com/6VBx3io.png' },
//   title: { type: String, default: 'Freelancer' },
//   bio: { type: String, default: 'Welcome to my profile!' },
//   rate: { type: String, default: '$20/hr' },
//   location: { type: String, default: 'Location not set' },
//   availability: { type: String, default: 'Available for hire' },
//   age: { type: Number },
//   gender: { type: String, enum: ['Female', 'Male', 'Other', 'Prefer not to say'] },
  
//   skills: [String],
//   education: [EducationSchema],
//   experience: [ExperienceSchema],
//   projects: [PortfolioProjectSchema],

//   // --- ADDED: Reviews & Rating Fields ---
//   reviews: [ReviewSubSchema], 
//   rating: { type: Number, default: 0 }, 
//   completedProjects: { type: Number, default: 0 },

// }, {
//   timestamps: true
// });

// freelancerSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// freelancerSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// const Freelancer = mongoose.model('Freelancer', freelancerSchema);
// export default Freelancer;




import mongoose from 'mongoose'; 
import bcrypt from 'bcryptjs';

// --- Sub-schemas for profile data ---
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

// --- NEW: Work History Schema (Automatic from Platform) ---
const WorkHistorySchema = new mongoose.Schema({
  projectTitle: String,
  companyName: String, // Client's Company Name
  repoLink: String,
  liveLink: String,
  description: String, // One line overview from submission
  completedAt: { type: Date, default: Date.now }
});

const ReviewSubSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Stores Client Name/Company Name
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  createdAt: { type: Date, default: Date.now }
});

const freelancerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: String, required: true },
  
  // Profile Fields
  profileImage: { type: String, default: 'https://i.imgur.com/6VBx3io.png' },
  title: { type: String, default: 'Freelancer' },
  bio: { type: String, default: 'Welcome to my profile!' },
  rate: { type: String, default: '$20/hr' },
  location: { type: String, default: 'Location not set' },
  availability: { type: String, default: 'Available for hire' },
  age: { type: Number },
  gender: { type: String, enum: ['Female', 'Male', 'Other', 'Prefer not to say'] },
  
  skills: [String],
  education: [EducationSchema],
  experience: [ExperienceSchema],
  
  // --- Manual Projects (Academic/Personal) ---
  projects: [PortfolioProjectSchema],

  // --- NEW: Automatic Work History ---
  workHistory: [WorkHistorySchema],

  reviews: [ReviewSubSchema], 
  rating: { type: Number, default: 0 }, 
  completedProjects: { type: Number, default: 0 },

}, {
  timestamps: true
});

freelancerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

freelancerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Freelancer = mongoose.model('Freelancer', freelancerSchema);
export default Freelancer;