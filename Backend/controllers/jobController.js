





import asyncHandler from 'express-async-handler';
import Job from '../models/jobModel.js';

// --- NEW IMPORTS FOR AI AGGREGATOR ---
import { aggregateJobs } from '../utils/jobAggregatorService.js';
import { rankJobsWithAI } from '../utils/geminiMatchService.js';
import Student from '../models/studentModel.js';
import Freelancer from '../models/freelancerModel.js';

// --- Corrected Sample Data for Auto-Seeding ---
const sampleJobs = [
    {
        company: "Suguna Foods",
        title: "Senior Software Engineer",
        rating: 4.0,
        reviews: "1.4K+",
        logoUrl: "https://logo.clearbit.com/sugunafoods.co.in",
        description: "Hiring for multiple software development roles. Join our team to innovate in the food tech industry. Experience with microservices is a plus.",
        skills: ["Java", "Spring Boot", "SQL", "Microservices"],
        location: "Coimbatore, India",
        applyLink: "https://www.sugunafoods.co.in/careers",
        postedDate: new Date(new Date().setDate(new Date().getDate()-1)) // 1 day ago
    },
    {
        company: "IndiaMART",
        title: "Frontend Developer (React)",
        rating: 3.6,
        reviews: "5.6K+",
        logoUrl: "https://logo.clearbit.com/indiamart.com",
        description: "Looking for talented engineers to build the future of B2B e-commerce in India. Must have strong proficiency in React.js and Redux.",
        skills: ["React", "Node.js", "Redux", "JavaScript"],
        location: "Noida, India",
        applyLink: "https://careers.indiamart.com/",
        postedDate: new Date(new Date().setDate(new Date().getDate()-2)) // 2 days ago
    },
    {
        company: "Reckitt",
        title: "Data Scientist",
        rating: 3.9,
        reviews: "1.7K+",
        logoUrl: "https://logo.clearbit.com/reckitt.com",
        description: "Join a global FMCG leader. We have openings for data scientists to analyze consumer behavior trends using machine learning models.",
        skills: ["Python", "Data Science", "Machine Learning", "Pandas"],
        location: "Gurugram, India",
        applyLink: "https://www.reckitt.com/careers/",
        postedDate: new Date() // Today
    },
    {
        company: "Tech Mahindra",
        title: "Cloud Solutions Architect",
        rating: 4.1,
        reviews: "10K+",
        logoUrl: "https://logo.clearbit.com/techmahindra.com",
        description: "Explore opportunities in cloud computing with a global IT giant. You will design scalable cloud architectures on AWS.",
        skills: ["Cloud", "AWS", "Docker", "Kubernetes"],
        location: "Pune, India",
        applyLink: "https://careers.techmahindra.com/",
        postedDate: new Date(new Date().setDate(new Date().getDate()-1))
    },
    {
        company: "Zoho Corporation",
        title: "Product Designer (UI/UX)",
        rating: 4.4,
        reviews: "3.2K+",
        logoUrl: "https://logo.clearbit.com/zoho.com",
        description: "We are looking for a creative Product Designer to design intuitive user experiences for our suite of business applications.",
        skills: ["UI/UX", "Figma", "Design Systems", "Prototyping"],
        location: "Chennai, India",
        applyLink: "https://www.zoho.com/careers/",
        postedDate: new Date(new Date().setDate(new Date().getDate()-3))
    },
    {
        company: "Freshworks",
        title: "Backend Engineer (Ruby/Java)",
        rating: 4.2,
        reviews: "2.1K+",
        logoUrl: "https://logo.clearbit.com/freshworks.com",
        description: "Scale our SaaS products to millions of users. Deep understanding of backend technologies and API design is required.",
        skills: ["Ruby", "Java", "REST API", "PostgreSQL"],
        location: "Chennai, India",
        applyLink: "https://www.freshworks.com/company/careers/",
        postedDate: new Date(new Date().setDate(new Date().getDate()-4))
    },
    {
        company: "Flipkart",
        title: "SDE-II",
        rating: 4.3,
        reviews: "8K+",
        logoUrl: "https://logo.clearbit.com/flipkart.com",
        description: "Solve complex e-commerce challenges at scale. Work on high-performance distributed systems.",
        skills: ["Java", "System Design", "Distributed Systems", "Kafka"],
        location: "Bengaluru, India",
        applyLink: "https://www.flipkartcareers.com/",
        postedDate: new Date(new Date().setDate(new Date().getDate()-1))
    },
    {
        company: "TCS",
        title: "Cybersecurity Analyst",
        rating: 3.8,
        reviews: "15K+",
        logoUrl: "https://logo.clearbit.com/tcs.com",
        description: "Monitor and secure enterprise networks. Experience with SIEM tools and vulnerability assessment is required.",
        skills: ["Cybersecurity", "Network Security", "SIEM", "Ethical Hacking"],
        location: "Mumbai, India",
        applyLink: "https://www.tcs.com/careers",
        postedDate: new Date(new Date().setDate(new Date().getDate()-5))
    },
    {
        company: "Wipro",
        title: "Full Stack Developer (.NET)",
        rating: 3.7,
        reviews: "12K+",
        logoUrl: "https://logo.clearbit.com/wipro.com",
        description: "Develop enterprise-grade web applications using .NET Core and Angular. Strong C# skills needed.",
        skills: [".NET", "C#", "Angular", "SQL Server"],
        location: "Hyderabad, India",
        applyLink: "https://careers.wipro.com/",
        postedDate: new Date(new Date().setDate(new Date().getDate()-2))
    },
    {
        company: "Swiggy",
        title: "Mobile App Developer (Flutter)",
        rating: 4.0,
        reviews: "1.2K+",
        logoUrl: "https://logo.clearbit.com/swiggy.com",
        description: "Build the next generation of food delivery apps. Proficiency in Flutter and Dart is essential.",
        skills: ["Flutter", "Dart", "Mobile Dev", "Firebase"],
        location: "Bengaluru, India",
        applyLink: "https://careers.swiggy.com/",
        postedDate: new Date(new Date().setDate(new Date().getDate()-1))
    }
];

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = asyncHandler(async (req, res) => {
    // 1. Check if DB is empty
    const count = await Job.countDocuments();
    
    // 2. If empty, seed with sample data
    if (count === 0) {
        await Job.insertMany(sampleJobs);
        console.log("Database was empty. Seeded with sample jobs.");
    }

    // 3. Fetch all jobs (sorted by newest)
    const jobs = await Job.find({}).sort({ postedDate: -1 });
    res.json(jobs);
});

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
export const getJobById = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (job) {
        res.json(job);
    } else {
        res.status(404);
        throw new Error('Job not found');
    }
});


// export const getProfileMatchedJobs = asyncHandler(async (req, res) => {
//     console.log("--- STARTING JOB AGGREGATION ---");
//     console.log("1. API /match-profile called!");
    
//     const userId = req.user._id;
//     let userModel;

//     if (req.userType === 'Student') {
//         userModel = await Student.findById(userId);
//     } else {
//         userModel = await Freelancer.findById(userId);
//     }

//     console.log("2. User Skills Found:", userModel?.skills);
    
//     const databaseJobs = await Job.find({}).sort({ postedDate: -1 });
//     let liveJobs = [];

//     if (userModel && userModel.skills && userModel.skills.length > 0) {
//         try {
//             console.log("3. Fetching from external APIs (Adzuna + JSearch)... this may take a few seconds.");
//             const rawJobs = await aggregateJobs(userModel);
            
//             console.log(`4. APIs returned ${rawJobs.length} jobs. Sending to Gemini for ranking...`);
//             // if (rawJobs.length > 0) {
//             //     liveJobs = await rankJobsWithAI(userModel, rawJobs);
//             //     console.log("5. Gemini ranking complete!");
//             // }
//             if (rawJobs.length > 0) {
//                 // BYPASS GEMINI FOR TESTING: Just use the raw jobs directly
//                 liveJobs = rawJobs; 
//                 console.log("5. Gemini SKIPPED for testing!");
//             }
//         } catch (error) {
//             console.error("Live API Pipeline Error:", error.message);
//         }
//     } else {
//         console.log("3. No skills found, skipping live APIs.");
//     }

//     const combinedJobs = [...liveJobs, ...databaseJobs];
//     console.log(`6. Sending ${combinedJobs.length} total jobs to frontend.`);
//     console.log("--- FINISHED ---");
    
//     res.json(combinedJobs);
// });



// @desc    Get Matched Jobs (ON DEMAND), Save to DB, and Clean Old Ones
// @route   GET /api/jobs/match-profile
// @access  Private
export const getProfileMatchedJobs = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    let userModel;

    if (req.userType === 'Student') {
        userModel = await Student.findById(userId);
    } else {
        userModel = await Freelancer.findById(userId);
    }

    if (!userModel || !userModel.skills || userModel.skills.length === 0) {
        return res.status(400).json({ message: "No skills found. Update your profile first!" });
    }

    try {
        console.log("Fetching live jobs from APIs...");
        const rawJobs = await aggregateJobs(userModel);

        if (rawJobs.length > 0) {
            // Rank with Gemini
            const liveJobs = await rankJobsWithAI(userModel, rawJobs);

            // --- 1. SAVE NEW JOBS TO DATABASE ---
            const jobsToSave = liveJobs.map(job => ({
                title: job.title,
                company: job.company,
                location: job.location,
                description: job.description,
                applyLink: job.applyLink,
                source: job.source || 'External API',
                matchScore: job.matchScore,
                aiReason: job.aiReason,
                postedDate: new Date(),
                isLiveFetch: true // Custom flag to identify API jobs
            }));

            try {
                // ordered: false ensures if one job fails validation, the rest still save
                await Job.insertMany(jobsToSave, { ordered: false }); 
                console.log(`Saved ${jobsToSave.length} new live jobs to database.`);
            } catch (dbErr) {
                console.log("DB Insert Error (Ignored):", dbErr.message);
            }

            // --- 2. AUTOMATIC CLEANUP: DELETE EXTERNAL JOBS OLDER THAN 3 DAYS ---
            const threeDaysAgo = new Date();
            threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
            
            try {
                const deleteResult = await Job.deleteMany({ 
                    isLiveFetch: true, 
                    postedDate: { $lt: threeDaysAgo } 
                });
                console.log(`Cleaned up ${deleteResult.deletedCount} old API jobs.`);
            } catch (cleanupErr) {
                console.log("Cleanup Error (Ignored):", cleanupErr.message);
            }

            res.json(liveJobs);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error("Live API Pipeline Error:", error.message);
        res.status(500);
        throw new Error("Failed to fetch live jobs.");
    }
});