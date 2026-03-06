import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Project',
        unique: true, // A project can only be reviewed once
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client',
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'freelancerModelType',
    },
    freelancerModelType: {
        type: String,
        required: true,
        enum: ['Freelancer', 'Student'],
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Review = mongoose.model('Review', reviewSchema);
export default Review; // Use export default