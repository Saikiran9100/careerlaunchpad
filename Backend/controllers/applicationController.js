
import asyncHandler from 'express-async-handler';
import Application from '../models/applicationModel.js';
import Project from '../models/projectModel.js';
import mongoose from 'mongoose';

// @desc    Update an application's status (e.g., hire, reject)
// @route   PUT /api/applications/:id/status
// @access  Private (Client)
export const updateApplicationStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const applicationId = req.params.id;
    const clientId = req.user._id;

    if (!status) {
        res.status(400);
        throw new Error('Status is required.');
    }
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
         res.status(400);
         throw new Error('Invalid application ID');
    }

    const application = await Application.findById(applicationId).populate('projectId');
    if (!application) {
        res.status(404);
        throw new Error('Application not found.');
    }

    const project = application.projectId;
    if (project.postedBy.toString() !== clientId.toString()) {
        res.status(403);
        throw new Error('You are not authorized to update this application.');
    }
    
    if (project.status !== 'open' && status === 'hired') {
        res.status(400);
        throw new Error('This project is no longer open for applications.');
    }

    application.status = status;
    await application.save();

    if (status === 'hired') {
        project.status = 'in-progress';
        project.assignedFreelancer = application.applicantId;
        project.assignedFreelancerModelType = application.applicantModelType;
        await project.save();

        await Application.updateMany(
            { projectId: project._id, _id: { $ne: application._id }, status: 'applied' },
            { $set: { status: 'rejected' } }
        );
    }

    res.status(200).json(application);
});