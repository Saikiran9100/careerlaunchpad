import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --- Page Components ---
import LandingPage from "./Pages/LandingPage/LandingPage.jsx";
import Home from "./Pages/LandingPage/Home/Home.jsx";

// --- Auth Components ---
import Login from "./Components/Login/Login.jsx";
import SignupForm from "./Components/Signup/SignupForm.jsx";

// --- Main Features Page ---
import Features from "./Components/Features/Features.jsx";

// --- Dashboard Components ---
import StudentDashboard from "./Components/StudentDashboard/StudentDashboard.jsx"; // Freelancer/Student Dashboard
import ClientDashboard from "./Components/ClientDashboard/ClientDashboard.jsx"; // Client Dashboard

// --- Client Specific Components ---
import AllocateProject from "./Components/Client/AllocateProject.jsx";
import ClientAllProjects from "./Components/Client/ClientAllProjects.jsx";
import ClientProjectDetail from "./Components/Client/ClientProjectDetail.jsx";
import ProjectApplicants from "./Components/Client/ProjectApplicants.jsx"; // For viewing applicants

// --- Interview Components ---
import InterviewList from "./Components/Interview/InterviewList.jsx";
import AllExperiences from "./Components/Interview/AllExperiences.jsx";
import ExperienceDetail from "./Components/Interview/ExperienceDetail.jsx";
import AddExperience from "./Components/Interview/AddExperience.jsx";

// --- Project Components (Freelancer/General) ---
import AllProjects from "./Components/Projects/AllProjects.jsx";
import ProjectDetail from "./Components/Projects/ProjectDetail.jsx";

// --- Job Components ---
import AllJobs from "./Components/Jobs/AllJobs.jsx";
import JobDetail from "./Components/Jobs/JobDetail.jsx";

// --- Profile Components ---
import FreelancerProfile from "./Components/FreelancerProfile/FreelancerProfile.jsx"; // Freelancer Profile
import ClientProfile from "./Components/ClientProfile/ClientProfile.jsx"; // Optional

// ... other imports
import StudentProfile from "./Components/StudentProfile/StudentProfile.jsx";

// 1. Import from the 'Projects' folder
import SubmitProject from "./Components/Projects/SubmitProject";
// 1. Import
import CompletedProjectDetails from "./Components/Projects/CompletedProjectDetails";


// To this (Update the path):
import AIRecommendationPage from "./Pages/LandingPage/AIRecommendation/AIRecommendationPage";
import AIJobsPage from './Components/Jobs/AIJobsPage'; 





function App() {
  return (
    <Router>
      <Routes>
        {/* === Core Routes === */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupForm />} />
        {/* === Dashboard Routes === */}
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        {/* === Client Specific Routes === */}
        <Route path="/allocate-project" element={<AllocateProject />} />
        <Route path="/client/all-projects" element={<ClientAllProjects />} />
        <Route path="/client/projects/:id" element={<ClientProjectDetail />} />
        <Route
          path="/client/projects/:id/applicants"
          element={<ProjectApplicants />}
        />
        {/* <Route path="/cprofile" element={<ClientProfile />} /> */}
        {/* === Main Features Route === */}
        <Route path="/features" element={<Features />} />
        {/* === Project Routes (Freelancer/General) === */}
        <Route path="/project" element={<AllProjects />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        {/* === Interview Routes === */}
        <Route path="/all-experiences" element={<AllExperiences />} />
        <Route path="/interview/new" element={<AddExperience />} />
        <Route path="/interview/:id" element={<ExperienceDetail />} />
        {/* === Job Routes === */}
        <Route path="/jobs" element={<AllJobs />} />
        <Route path="/job/:id" element={<JobDetail />} />
        {/* === Profile Routes === */}
        {/* This route handles the freelancer's own profile */}
        <Route path="/fprofile" element={<FreelancerProfile />} />
        {/* This route handles viewing any user's profile by their ID */}
        <Route path="/profile/:id" element={<FreelancerProfile />} />
        <Route path="/cprofile" element={<ClientProfile />} />
        <Route path="/sprofile" element={<StudentProfile />} />
        {/* // 2. Add the route (if not already there) */}
        <Route path="/submit-project/:id" element={<SubmitProject />} />

        {/* // 2. Add Route */}
        <Route
          path="/project/completed/:id"
          element={<CompletedProjectDetails />}
        />

        <Route
          path="/projects/:projectId/ai-recommendations"
          element={<AIRecommendationPage />}
        />
        <Route path="/jobs/ai-recommendations" element={<AIJobsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
