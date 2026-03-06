// // // import { GoogleGenerativeAI } from "@google/generative-ai";
// // // import dotenv from 'dotenv';

// // // dotenv.config(); // Ensure env variables are loaded

// // // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // // export const rankApplicants = async (projectDetails, applicants) => {
// // //   try {
// // //     // Use a lightweight model for speed
// // //     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// // //     // 1. Determine shortlist limit logic
// // //     const totalCount = applicants.length;
// // //     let limit = 0;

// // //     if (totalCount > 5) {
// // //       limit = 5; // Top 5 if more than 5 applicants
// // //     } else {
// // //       // "2:3 ratio" logic (approx 66%)
// // //       limit = Math.ceil(totalCount * 0.66);
// // //       if (limit >= totalCount && totalCount > 1) limit = totalCount - 1; 
// // //       if (limit < 1) limit = 1;
// // //     }

// // //     // 2. Construct the Prompt
// // //     const prompt = `
// // //       You are an expert HR AI. Rank the following freelancers for a project.
      
// // //       PROJECT DETAILS:
// // //       Title: ${projectDetails.title}
// // //       Description: ${projectDetails.description}
// // //       Required Skills: ${projectDetails.skillsRequired.join(", ")}
// // //       Budget: ${projectDetails.budget}

// // //       CANDIDATES (${applicants.length} total):
// // //       ${applicants.map((app) => `
// // //         ID: ${app.applicantId._id}
// // //         Name: ${app.applicantId.firstName} ${app.applicantId.lastName}
// // //         Title: ${app.applicantId.title}
// // //         Skills: ${app.applicantId.skills.join(", ")}
// // //         Bio: ${app.applicantId.bio}
// // //         Rating: ${app.applicantId.rating}
// // //         Completed Projects: ${app.applicantId.completedProjects}
// // //       `).join("\n")}

// // //       TASK:
// // //       Select the TOP ${limit} candidates who best fit the project based on skills and experience.
      
// // //       OUTPUT FORMAT:
// // //       Return ONLY a raw JSON array of objects. Do not include markdown formatting like \`\`\`json.
// // //       Example:
// // //       [
// // //         { "id": "FREELANCER_ID", "reason": "Strong match for React skill", "matchScore": 95 },
// // //         ...
// // //       ]
// // //     `;

// // //     // 3. Generate Content
// // //     const result = await model.generateContent(prompt);
// // //     const response = await result.response;
    
// // //     // Clean up the text response (remove markdown if Gemini adds it)
// // //     const text = response.text().replace(/```json|```/g, "").trim();

// // //     const rankedData = JSON.parse(text);

// // //     return rankedData;
// // //   } catch (error) {
// // //     console.error("Gemini AI Error:", error);
// // //     // Fallback: If AI fails, return empty array or handle gracefully
// // //     throw new Error("Failed to rank applicants with AI.");
// // //   }
// // // };



// // import { GoogleGenerativeAI } from "@google/generative-ai";
// // import dotenv from 'dotenv';

// // dotenv.config(); // Ensure env variables are loaded

// // // Check if API Key is loaded
// // if (!process.env.GEMINI_API_KEY) {
// //     console.error("CRITICAL ERROR: GEMINI_API_KEY is missing in .env file");
// // }

// // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // export const rankApplicants = async (projectDetails, applicants) => {
// //   try {
// //     // Debug: Log data received
// //     console.log(`AI Service: Received ${applicants.length} applicants for project "${projectDetails.title}"`);

// //     // Use a stable model. If 'flash' fails, try 'gemini-pro'
// //     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// //     const totalCount = applicants.length;
// //     let limit = 0;

// //     if (totalCount > 5) {
// //       limit = 5;
// //     } else {
// //       limit = Math.ceil(totalCount * 0.66);
// //       if (limit >= totalCount && totalCount > 1) limit = totalCount - 1; 
// //       if (limit < 1) limit = 1;
// //     }

// //     const prompt = `
// //       You are an expert HR AI. Rank the following freelancers for a project.
      
// //       PROJECT DETAILS:
// //       Title: ${projectDetails.title}
// //       Description: ${projectDetails.description}
// //       Required Skills: ${projectDetails.skillsRequired.join(", ")}
// //       Budget: ${projectDetails.budget}

// //       CANDIDATES (${applicants.length} total):
// //       ${applicants.map((app) => `
// //         ID: ${app.applicantId._id}
// //         Name: ${app.applicantId.firstName} ${app.applicantId.lastName}
// //         Title: ${app.applicantId.title || 'Freelancer'}
// //         Skills: ${app.applicantId.skills ? app.applicantId.skills.join(", ") : 'None listed'}
// //         Bio: ${app.applicantId.bio || 'No bio'}
// //         Rating: ${app.applicantId.rating || 0}
// //         Completed Projects: ${app.applicantId.completedProjects || 0}
// //       `).join("\n")}

// //       TASK:
// //       Select the TOP ${limit} candidates who best fit the project.
      
// //       OUTPUT FORMAT:
// //       Return ONLY a raw JSON array of objects. 
// //       Strictly follow this structure:
// //       [
// //         { "id": "FREELANCER_ID", "reason": "Short reason why", "matchScore": 90 }
// //       ]
// //       Do NOT add markdown like \`\`\`json. Just the array.
// //     `;

// //     // Generate Content
// //     const result = await model.generateContent(prompt);
// //     const response = await result.response;
    
// //     // Clean up text
// //     let text = response.text();
// //     console.log("AI Raw Response:", text); // <--- DEBUG PRINT

// //     // Remove markdown code blocks if present
// //     text = text.replace(/```json/g, "").replace(/```/g, "").trim();

// //     const rankedData = JSON.parse(text);

// //     return rankedData;
// //   } catch (error) {
// //     console.error("Gemini AI Detailed Error:", error);
// //     // Return empty array instead of crashing, so frontend handles it better
// //     throw new Error("Failed to rank applicants: " + error.message);
// //   }
// // };




// import { GoogleGenerativeAI } from "@google/generative-ai";
// import dotenv from 'dotenv';

// dotenv.config(); // Ensure env variables are loaded

// // Check if API Key is loaded
// if (!process.env.GEMINI_API_KEY) {
//     console.error("CRITICAL ERROR: GEMINI_API_KEY is missing in .env file");
// }

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const rankApplicants = async (projectDetails, applicants) => {
//   try {
//     // Debug: Log data received
//     console.log(`AI Service: Received ${applicants.length} applicants for project "${projectDetails.title}"`);

//     // --- FIX: Using a model confirmed to be available for your key ---
//     // 'gemini-2.0-flash' is fast and efficient for this type of task
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     const totalCount = applicants.length;
//     let limit = 0;

//     if (totalCount > 5) {
//       limit = 5;
//     } else {
//       limit = Math.ceil(totalCount * 0.66);
//       if (limit >= totalCount && totalCount > 1) limit = totalCount - 1; 
//       if (limit < 1) limit = 1;
//     }

//     const prompt = `
//       You are an expert HR AI. Rank the following freelancers for a project.
      
//       PROJECT DETAILS:
//       Title: ${projectDetails.title}
//       Description: ${projectDetails.description}
//       Required Skills: ${projectDetails.skillsRequired.join(", ")}
//       Budget: ${projectDetails.budget}

//       CANDIDATES (${applicants.length} total):
//       ${applicants.map((app) => `
//         ID: ${app.applicantId._id}
//         Name: ${app.applicantId.firstName} ${app.applicantId.lastName}
//         Title: ${app.applicantId.title || 'Freelancer'}
//         Skills: ${app.applicantId.skills ? app.applicantId.skills.join(", ") : 'None listed'}
//         Bio: ${app.applicantId.bio || 'No bio'}
//         Rating: ${app.applicantId.rating || 0}
//         Completed Projects: ${app.applicantId.completedProjects || 0}
//       `).join("\n")}

//       TASK:
//       Select the TOP ${limit} candidates who best fit the project.
      
//       OUTPUT FORMAT:
//       Return ONLY a raw JSON array of objects. 
//       Strictly follow this structure:
//       [
//         { "id": "FREELANCER_ID", "reason": "Short reason why", "matchScore": 90 }
//       ]
//       Do NOT add markdown like \`\`\`json. Just the array.
//     `;

//     // Generate Content
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
    
//     // Clean up text
//     let text = response.text();
//     console.log("AI Raw Response:", text); // <--- DEBUG PRINT

//     // Remove markdown code blocks if present
//     text = text.replace(/```json/g, "").replace(/```/g, "").trim();

//     const rankedData = JSON.parse(text);

//     return rankedData;
//   } catch (error) {
//     console.error("Gemini AI Detailed Error:", error);
//     // Return empty array instead of crashing, so frontend handles it better
//     throw new Error("Failed to rank applicants: " + error.message);
//   }
// };



import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config(); // Ensure env variables are loaded

// Check if API Key is loaded
if (!process.env.GEMINI_API_KEY) {
    console.error("CRITICAL ERROR: GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const rankApplicants = async (projectDetails, applicants) => {
  try {
    // Debug: Log data received
    console.log(`AI Service: Received ${applicants.length} applicants for project "${projectDetails.title}"`);

    // --- FIX: Use 'gemini-flash-latest' (Stable Alias from your available list) ---
    // If this fails, try 'gemini-2.5-flash'
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const totalCount = applicants.length;
    let limit = 0;

    if (totalCount > 5) {
      limit = 5;
    } else {
      limit = Math.ceil(totalCount * 0.66);
      if (limit >= totalCount && totalCount > 1) limit = totalCount - 1; 
      if (limit < 1) limit = 1;
    }

    const prompt = `
      You are an expert HR AI. Rank the following freelancers for a project.
      
      PROJECT DETAILS:
      Title: ${projectDetails.title}
      Description: ${projectDetails.description}
      Required Skills: ${projectDetails.skillsRequired.join(", ")}
      Budget: ${projectDetails.budget}

      CANDIDATES (${applicants.length} total):
      ${applicants.map((app) => `
        ID: ${app.applicantId._id}
        Name: ${app.applicantId.firstName} ${app.applicantId.lastName}
        Title: ${app.applicantId.title || 'Freelancer'}
        Skills: ${app.applicantId.skills ? app.applicantId.skills.join(", ") : 'None listed'}
        Bio: ${app.applicantId.bio || 'No bio'}
        Rating: ${app.applicantId.rating || 0}
        Completed Projects: ${app.applicantId.completedProjects || 0}
      `).join("\n")}

      TASK:
      Select the TOP ${limit} candidates who best fit the project.
      
      OUTPUT FORMAT:
      Return ONLY a raw JSON array of objects. 
      Strictly follow this structure:
      [
        { "id": "FREELANCER_ID", "reason": "Short reason why", "matchScore": 90 }
      ]
      Do NOT add markdown like \`\`\`json. Just the array.
    `;

    // Generate Content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Clean up text
    let text = response.text();
    console.log("AI Raw Response:", text); // <--- DEBUG PRINT

    // Remove markdown code blocks if present
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const rankedData = JSON.parse(text);

    return rankedData;
  } catch (error) {
    console.error("Gemini AI Detailed Error:", error);
    // Return empty array instead of crashing, so frontend handles it better
    throw new Error("Failed to rank applicants: " + error.message);
  }
};