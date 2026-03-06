// import mongoose from 'mongoose'; // <-- Use import

// const projectSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Please provide a project title'],
//     trim: true,
//   },
//   description: {
//     type: String,
//     required: [true, 'Please provide a project description'],
//   },
//   skillsRequired: [{
//     type: String,
//     trim: true,
//   }],
//   budget: {
//     type: Number,
//     required: [true, 'Please provide an approximate budget'],
//   },
//   deadline: {
//     type: Date,
//     required: false,
//   },
//   postedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'Client',
//   },
//   status: {
//     type: String,
//     enum: ['open', 'in-progress', 'completed', 'closed'],
//     default: 'open',
//   },
//   assignedFreelancer: { 
//     type: mongoose.Schema.Types.ObjectId,
//     refPath: 'assignedFreelancerModelType',
//     required: false,
//   },
//   assignedFreelancerModelType: {
//     type: String,
//     enum: ['Freelancer', 'Student'],
//     required: false,
//   }
// }, {
//   timestamps: true,
// });

// const Project = mongoose.model('Project', projectSchema);
// export default Project; // <-- Use export default






import mongoose from 'mongoose'; 

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a project description'],
  },
  skillsRequired: [{
    type: String,
    trim: true,
  }],
  budget: {
    type: Number,
    required: [true, 'Please provide an approximate budget'],
  },
  deadline: {
    type: Date,
    required: false,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Client',
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'submitted', 'completed', 'closed'], // Added 'submitted' status
    default: 'open',
  },
  assignedFreelancer: { 
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'assignedFreelancerModelType',
    required: false,
  },
  assignedFreelancerModelType: {
    type: String,
    enum: ['Freelancer', 'Student'],
    required: false,
  },
  // --- NEW: Submission Details ---
  submission: {
    repoLink: { type: String, default: '' },
    liveLink: { type: String, default: '' },
    videoLink: { type: String, default: '' },
    description: { type: String, default: '' },
    submittedAt: { type: Date }
  }
}, {
  timestamps: true,
});

const Project = mongoose.model('Project', projectSchema);
export default Project;