
// import path from 'path'; 
// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import connectDB from './config/db.js'; 

// // --- Import ALL Route Files ---
// import freelancerAuthRoutes from './routes/freelancerAuthRoutes.js';
// import clientAuthRoutes from './routes/clientAuthRoutes.js';
// import studentAuthRoutes from './routes/studentAuthRoutes.js';
// import interviewExperienceRoutes from './routes/interviewExperienceRoutes.js';
// import projectRoutes from './routes/projectRoutes.js';
// import freelancerRoutes from './routes/freelancerRoutes.js';
// import applicationRoutes from './routes/applicationRoutes.js';
//  //import reviewRoutes from './routes/reviewRoutes.js';
// import profileRoutes from './routes/profileRoutes.js'; 
// import uploadRoutes from './routes/uploadRoutes.js'; 

// // --- NEW: Import Client Profile Routes ---
// import clientProfileRoutes from './routes/clientProfileRoutes.js'; 

// // ... other imports
// import studentProfileRoutes from './routes/studentProfileRoutes.js'; // <-- Import this
// // ... imports
// import reviewRoutes from './routes/reviewRoutes.js'; 


// import jobRoutes from './routes/jobRoutes.js'; // <-- 1. Import


// dotenv.config();
// connectDB();

// const app = express();

// // --- Middleware ---
// app.use(cors());
// app.use(express.json());

// // --- Test Route ---
// app.get('/', (req, res) => {
//   res.send('CareerLaunchPad API is running...');
// });

// // --- API Routes ---
// app.use('/api/auth/freelancer', freelancerAuthRoutes);
// app.use('/api/auth/client', clientAuthRoutes);
// app.use('/api/auth/student', studentAuthRoutes);
// app.use('/api/interviews', interviewExperienceRoutes);
// app.use('/api/projects', projectRoutes);
// app.use('/api/freelancer', freelancerRoutes);
// app.use('/api/applications', applicationRoutes);
//  //app.use('/api/reviews', reviewRoutes);
// app.use('/api/profile', profileRoutes); 
// app.use('/api/upload', uploadRoutes); 

// // ...
// app.use('/api/reviews', reviewRoutes); // <-- Make sure this line exists

// // --- NEW: Use Client Profile Routes ---
// app.use('/api/client/profile', clientProfileRoutes); 

// // ...
// app.use('/api/student/profile', studentProfileRoutes); // <-- Add this line

// app.use('/api/jobs', jobRoutes); // <-- 2. Add this line


// // --- STATIC FOLDER ---
// const __dirname = path.resolve();
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// // --- Error Handling ---
// app.use((err, req, res, next) => {
//     console.error("Global Error Handler:", err.stack);
//     const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
//     res.status(statusCode);
//     res.json({
//         message: err.message,
//         stack: process.env.NODE_ENV === 'production' ? null : err.stack,
//     });
// });

// // --- Start Server ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
// });


import path from 'path'; 
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js'; 

// --- Import ALL Route Files ---
import freelancerAuthRoutes from './routes/freelancerAuthRoutes.js';
import clientAuthRoutes from './routes/clientAuthRoutes.js';
import studentAuthRoutes from './routes/studentAuthRoutes.js';
import interviewExperienceRoutes from './routes/interviewExperienceRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import freelancerRoutes from './routes/freelancerRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import profileRoutes from './routes/profileRoutes.js'; 
import uploadRoutes from './routes/uploadRoutes.js'; 
import clientProfileRoutes from './routes/clientProfileRoutes.js'; 
import studentProfileRoutes from './routes/studentProfileRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js'; 
import jobRoutes from './routes/jobRoutes.js'; // <-- Job Routes Imported

dotenv.config();
connectDB();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Test Route ---
app.get('/', (req, res) => {
  res.send('CareerLaunchPad API is running...');
});

// --- API Routes ---
app.use('/api/auth/freelancer', freelancerAuthRoutes);
app.use('/api/auth/client', clientAuthRoutes);
app.use('/api/auth/student', studentAuthRoutes);
app.use('/api/interviews', interviewExperienceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/freelancer', freelancerRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/profile', profileRoutes); 
app.use('/api/upload', uploadRoutes); 
app.use('/api/reviews', reviewRoutes); 
app.use('/api/client/profile', clientProfileRoutes); 
app.use('/api/student/profile', studentProfileRoutes); 
app.use('/api/jobs', jobRoutes); // <-- Job Routes Registered

// --- STATIC FOLDER ---
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// --- Error Handling ---
app.use((err, req, res, next) => {
    console.error("Global Error Handler:", err.stack);
    const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});