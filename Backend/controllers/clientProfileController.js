import asyncHandler from 'express-async-handler';
import Client from '../models/clientModel.js';

// @desc    Get current logged-in client's profile
// @route   GET /api/client/profile/me
// @access  Private (Client only)
export const getClientProfile = asyncHandler(async (req, res) => {
    // req.user is already set by the 'protect' middleware
    const client = await Client.findById(req.user._id).select('-password');

    if (client) {
        res.json(client);
    } else {
        res.status(404);
        throw new Error('Client not found');
    }
});

// @desc    Update client profile details
// @route   PUT /api/client/profile/me
// @access  Private (Client only)
export const updateClientProfile = asyncHandler(async (req, res) => {
    const client = await Client.findById(req.user._id);

    if (client) {
        // Update basic fields
        client.firstName = req.body.firstName || client.firstName;
        client.lastName = req.body.lastName || client.lastName;
        client.mobile = req.body.mobile || client.mobile;
        
        // Update profile-specific fields
        client.companyName = req.body.companyName || client.companyName;
        client.website = req.body.website || client.website;
        client.bio = req.body.bio || client.bio;
        client.location = req.body.location || client.location;
        client.profileImage = req.body.profileImage || client.profileImage;

        // Note: Password update is usually handled in a separate route for security, 
        // but if you want to allow it here, you can uncomment the lines below:
        // if (req.body.password) {
        //     client.password = req.body.password;
        // }

        const updatedClient = await client.save();

        res.json({
            _id: updatedClient._id,
            firstName: updatedClient.firstName,
            lastName: updatedClient.lastName,
            email: updatedClient.email,
            companyName: updatedClient.companyName,
            bio: updatedClient.bio,
            website: updatedClient.website,
            location: updatedClient.location,
            mobile: updatedClient.mobile,
            profileImage: updatedClient.profileImage,
        });
    } else {
        res.status(404);
        throw new Error('Client not found');
    }
});