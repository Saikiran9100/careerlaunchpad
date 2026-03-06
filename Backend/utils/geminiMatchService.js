// // import { GoogleGenerativeAI } from "@google/generative-ai";
// // import dotenv from 'dotenv';
// // dotenv.config();

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // export const rankJobsWithAI = async (userProfile, rawJobs) => {
// //     try {
// //         // Using the flash-latest model that worked for you in the previous feature
// //         const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// //         // Limit to 15 jobs to avoid hitting Gemini token limits
// //         const jobsToAnalyze = rawJobs.slice(0, 15);

// //         const prompt = `
// //         You are an AI Job Matchmaker.
        
// //         CANDIDATE PROFILE:
// //         Skills: ${userProfile.skills.join(", ")}
// //         Bio: ${userProfile.bio || "N/A"}

// //         JOB LIST:
// //         ${JSON.stringify(jobsToAnalyze.map((j, i) => ({
// //             id: i, 
// //             title: j.title, 
// //             company: j.company,
// //             desc: j.description ? j.description.substring(0, 150) : "N/A"
// //         })))}

// //         TASK:
// //         Evaluate the relevance of each job for this candidate.
// //         Return ONLY a JSON array of objects strictly in this format:
// //         [
// //           { "id": 0, "matchScore": 95, "reason": "Short 1-sentence reason" }
// //         ]
// //         Do not include markdown tags like \`\`\`json.
// //         `;

// //         const result = await model.generateContent(prompt);
// //         let text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
// //         const rankings = JSON.parse(text);

// //         // Merge AI scores back into our job data
// //         const scoredJobs = jobsToAnalyze.map((job, index) => {
// //             const rank = rankings.find(r => r.id === index);
// //             return {
// //                 ...job,
// //                 matchScore: rank ? rank.matchScore : 0,
// //                 aiReason: rank ? rank.reason : "General skill match."
// //             };
// //         });

// //         // Sort by highest match score first
// //         return scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

// //     } catch (error) {
// //         console.error("Gemini Job Ranking Error:", error);
// //         return rawJobs; // If AI fails, still return the jobs to the user
// //     }
// // };\




// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from 'dotenv';
// dotenv.config();

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const rankJobsWithAI = async (userProfile, rawJobs) => {
//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

//         const jobsToAnalyze = rawJobs.slice(0, 15);

//         const projectSummary = userProfile.projects && userProfile.projects.length > 0 
//             ? userProfile.projects.map(p => typeof p === 'string' ? p : (p.title || "Project")).join(", ")
//             : "No previous projects listed.";

//         const prompt = `
//         You are an AI Job Matchmaker.
        
//         CANDIDATE PROFILE:
//         Skills: ${userProfile.skills ? userProfile.skills.join(", ") : "N/A"}
//         Past Projects/Experience: ${projectSummary}
//         Bio: ${userProfile.bio || "N/A"}

//         JOB LIST:
//         ${JSON.stringify(jobsToAnalyze.map((j, i) => ({
//             id: i, 
//             title: j.title, 
//             company: j.company,
//             desc: j.description ? j.description.substring(0, 150) : "N/A"
//         })))}

//         TASK:
//         Evaluate the relevance of each job for this candidate. Consider both their skills and past project experience.
//         Return ONLY a JSON array of objects strictly in this format:
//         [
//           { "id": 0, "matchScore": 95, "reason": "Short 1-sentence reason" }
//         ]
//         Do not include markdown tags like \`\`\`json.
//         `;

//         // --- NEW: Create a 10-second timeout timer ---
//         const timeout = new Promise((_, reject) =>
//             setTimeout(() => reject(new Error("Gemini API took too long (Timeout)")), 10000)
//         );

//         // --- NEW: Race Gemini against the timer ---
//         const result = await Promise.race([
//             model.generateContent(prompt),
//             timeout
//         ]);

//         let text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
//         const rankings = JSON.parse(text);

//         const scoredJobs = jobsToAnalyze.map((job, index) => {
//             const rank = rankings.find(r => r.id === index);
//             return {
//                 ...job,
//                 matchScore: rank ? rank.matchScore : 0,
//                 aiReason: rank ? rank.reason : "General skill match."
//             };
//         });

//         return scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

//     } catch (error) {
//         // If Gemini freezes or fails, it will catch here and safely return the raw jobs!
//         console.error("Gemini Job Ranking Skipped:", error.message);
//         return rawJobs; 
//     }
// };





import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const rankJobsWithAI = async (userProfile, rawJobs) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const jobsToAnalyze = rawJobs.slice(0, 15);

        const projectSummary = userProfile.projects && userProfile.projects.length > 0 
            ? userProfile.projects.map(p => typeof p === 'string' ? p : (p.title || "Project")).join(", ")
            : "No previous projects listed.";

        const prompt = `
        You are an AI Job Matchmaker.
        
        CANDIDATE PROFILE:
        Skills: ${userProfile.skills ? userProfile.skills.join(", ") : "N/A"}
        Past Projects/Experience: ${projectSummary}
        Bio: ${userProfile.bio || "N/A"}

        JOB LIST:
        ${JSON.stringify(jobsToAnalyze.map((j, i) => ({
            id: i, 
            title: j.title, 
            company: j.company,
            desc: j.description ? j.description.substring(0, 150) : "N/A"
        })))}

        TASK:
        Evaluate the relevance of each job for this candidate. Consider both their skills and past project experience.
        Return ONLY a JSON array of objects strictly in this format:
        [
          { "id": 0, "matchScore": 95, "reason": "Short 1-sentence reason" }
        ]
        Do not include markdown tags like \`\`\`json.
        `;

        // Create a 10-second timeout timer
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Gemini API took too long (Timeout)")), 10000)
        );

        // Race Gemini against the 10-second timer to prevent freezing
        const result = await Promise.race([
            model.generateContent(prompt),
            timeout
        ]);

        let text = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();
        const rankings = JSON.parse(text);

        const scoredJobs = jobsToAnalyze.map((job, index) => {
            const rank = rankings.find(r => r.id === index);
            return {
                ...job,
                matchScore: rank ? rank.matchScore : 0,
                aiReason: rank ? rank.reason : "General skill match."
            };
        });

        return scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

    } catch (error) {
        console.error("Gemini Job Ranking Skipped (Safety Fallback):", error.message);
        return rawJobs; 
    }
};