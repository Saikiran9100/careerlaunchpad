import asyncHandler from 'express-async-handler';
import Student from '../models/studentModel.js';

// @desc    Get current student profile
// @route   GET /api/student/profile/me
// @access  Private (Student only)
export const getStudentProfile = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.user._id).select('-password');

    if (student) {
        res.json(student);
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc    Update student profile
// @route   PUT /api/student/profile/me
// @access  Private (Student only)
export const updateStudentProfile = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.user._id);

    if (student) {
        // Basic Info
        student.firstName = req.body.firstName || student.firstName;
        student.lastName = req.body.lastName || student.lastName;
        student.mobile = req.body.mobile || student.mobile;
        student.bio = req.body.bio || student.bio;
        student.location = req.body.location || student.location;
        student.profileImage = req.body.profileImage || student.profileImage;
        
        // Student Specific Arrays
        student.skills = req.body.skills || student.skills;
        student.education = req.body.education || student.education;
        // Students might have academic projects
        student.projects = req.body.projects || student.projects;
        
        // Social Links (Github/LinkedIn are important for students)
        student.githubLink = req.body.githubLink || student.githubLink;
        student.linkedinLink = req.body.linkedinLink || student.linkedinLink;

        const updatedStudent = await student.save();

        res.json({
            _id: updatedStudent._id,
            firstName: updatedStudent.firstName,
            lastName: updatedStudent.lastName,
            email: updatedStudent.email,
            mobile: updatedStudent.mobile,
            bio: updatedStudent.bio,
            location: updatedStudent.location,
            profileImage: updatedStudent.profileImage,
            skills: updatedStudent.skills,
            education: updatedStudent.education,
            projects: updatedStudent.projects,
            githubLink: updatedStudent.githubLink,
            linkedinLink: updatedStudent.linkedinLink,
        });
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});