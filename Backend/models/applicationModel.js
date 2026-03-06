// import mongoose from 'mongoose'; // <-- Use import

// const applicationSchema = new mongoose.Schema({
//   projectId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'Project',
//   },
//   applicantId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     refPath: 'applicantModelType', // Points to Freelancer or Student
//   },
//   applicantModelType: {
//     type: String,
//     required: true,
//     enum: ['Freelancer', 'Student'], // The models that can apply
//   },
//   clientId: { // Store the client ID for easy checking
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     ref: 'Client',
//   },
//   status: {
//     type: String,
//     enum: ['applied', 'shortlisted', 'rejected', 'hired', 'completed'],
//     default: 'applied',
//   },
//   freelancerMarkedComplete: {
//     type: Boolean,
//     default: false,
//   },
//   clientMarkedComplete: {
//     type: Boolean,
//     default: false,
//   }
// }, {
//   timestamps: true, // records when they applied
// });

// // Prevent a user from applying to the same project twice
// applicationSchema.index({ projectId: 1, applicantId: 1 }, { unique: true });

// const Application = mongoose.model('Application', applicationSchema);
// export default Application; // <-- Use export default





import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project',
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'applicantModelType', // Points to Freelancer or Student
  },
  applicantModelType: {
    type: String,
    required: true,
    enum: ['Freelancer', 'Student'],
  },
  clientId: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Client',
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'rejected', 'hired', 'completed'],
    default: 'applied',
  },
  freelancerMarkedComplete: {
    type: Boolean,
    default: false,
  },
  clientMarkedComplete: {
    type: Boolean,
    default: false,
  },
  // --- NEW FIELD: Tracks if the client has reviewed this work ---
  isReviewed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});

// Prevent a user from applying to the same project twice
applicationSchema.index({ projectId: 1, applicantId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;