// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

// // 1. Fetch from Adzuna
// const fetchAdzunaJobs = async (query) => {
//     const appId = process.env.ADZUNA_APP_ID;
//     const appKey = process.env.ADZUNA_APP_KEY;
//     if (!appId || !appKey) return [];

//     try {
//         const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=${query}&content-type=application/json`;
//         const { data } = await axios.get(url);
        
//         return data.results.map(job => ({
//             title: job.title,
//             company: job.company.display_name,
//             location: job.location.display_name,
//             description: job.description,
//             applyLink: job.redirect_url,
//             source: 'Adzuna'
//         }));
//     } catch (error) {
//         console.error("Adzuna API Error:", error.message);
//         return [];
//     }
// };

// // 2. Fetch from JSearch (RapidAPI)
// const fetchJSearchJobs = async (query) => {
//     const apiKey = process.env.RAPID_API_KEY;
//     if (!apiKey) return [];

//     try {
//         const options = {
//             method: 'GET',
//             url: 'https://jsearch.p.rapidapi.com/search',
//             params: { query: `${query} in India`, num_pages: '1' },
//             headers: {
//                 'X-RapidAPI-Key': apiKey,
//                 'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
//             }
//         };
//         const response = await axios.request(options);
        
//         return response.data.data.map(job => ({
//             title: job.job_title,
//             company: job.employer_name,
//             location: job.job_city ? `${job.job_city}, ${job.job_country}` : 'Remote',
//             description: job.job_description,
//             applyLink: job.job_apply_link,
//             source: 'JSearch'
//         }));
//     } catch (error) {
//         console.error("JSearch API Error:", error.message);
//         return [];
//     }
// };

// // 3. Main function to aggregate both
// export const aggregateJobs = async (userSkills) => {
//     const query = userSkills && userSkills.length > 0 ? userSkills[0] : 'software engineer';
    
//     // Run both API requests at the exact same time to save time
//     const [adzunaJobs, jsearchJobs] = await Promise.all([
//         fetchAdzunaJobs(query),
//         fetchJSearchJobs(query)
//     ]);

//     // Combine the lists and return them
//     return [...adzunaJobs, ...jsearchJobs];
// };




import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// 1. Fetch from Adzuna
const fetchAdzunaJobs = async (query) => {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    if (!appId || !appKey) return [];

    try {
        const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=${query}&content-type=application/json`;
        const { data } = await axios.get(url);
        
        return data.results.map(job => ({
            title: job.title,
            company: job.company.display_name,
            location: job.location.display_name,
            description: job.description,
            applyLink: job.redirect_url,
            source: 'Adzuna'
        }));
    } catch (error) {
        console.error("Adzuna API Error:", error.message);
        return [];
    }
};

// 2. Fetch from JSearch (RapidAPI)
const fetchJSearchJobs = async (query) => {
    const apiKey = process.env.RAPID_API_KEY;
    if (!apiKey) return [];

    try {
        const options = {
            method: 'GET',
            url: 'https://jsearch.p.rapidapi.com/search',
            params: { query: `${query} in India`, num_pages: '1' },
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        };
        const response = await axios.request(options);
        
        return response.data.data.map(job => ({
            title: job.job_title,
            company: job.employer_name,
            location: job.job_city ? `${job.job_city}, ${job.job_country}` : 'Remote',
            description: job.job_description,
            applyLink: job.job_apply_link,
            source: 'JSearch'
        }));
    } catch (error) {
        console.error("JSearch API Error:", error.message);
        return [];
    }
};

// 3. Main function to aggregate both
export const aggregateJobs = async (userProfile) => {
    // Extract skills from profile
    const userSkills = userProfile.skills || [];
    
    // Create a powerful query string based on their top skill 
    const query = userSkills.length > 0 ? userSkills[0] : 'software engineer';
    
    // Run both API requests at the exact same time
    const [adzunaJobs, jsearchJobs] = await Promise.all([
        fetchAdzunaJobs(query),
        fetchJSearchJobs(query)
    ]);

    // Combine the lists
    return [...adzunaJobs, ...jsearchJobs];
};