export const sampleProjectData = [
  {
    id: 1,
    title: "Build a Modern E-commerce Website",
    // Use 'postedBy' object to match DB structure (instead of just clientName)
    postedBy: {
        firstName: "John",
        lastName: "Doe",
        companyName: "EcoFoods Ltd."
    },
    // CHANGED: 'details' -> 'description'
    description: "We need a fast, responsive e-commerce platform with payment gateway integration and a user-friendly admin dashboard.",
    // CHANGED: 'skills' -> 'skillsRequired' (Critical for filtering)
    skillsRequired: ["React", "Node.js", "MongoDB"], 
    budget: 1200,
    status: 'open',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Mobile App Design (UI/UX)",
    postedBy: {
        firstName: "Sarah",
        lastName: "Smith",
        companyName: "NextGen Fitness"
    },
    description: "Looking for a talented UI/UX designer to create wireframes and high-fidelity prototypes for our new fitness tracking app.",
    skillsRequired: ["Figma", "UI/UX Design", "Prototyping"],
    budget: 700,
    status: 'open',
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Python Data Analysis Script",
    postedBy: {
        firstName: "Mike",
        lastName: "Ross",
        companyName: "DataCorp"
    },
    description: "Need a Python script to scrape data from 3 websites, clean it, and export it to a CSV format. Must handle anti-bot protection.",
    skillsRequired: ["Python", "Web Scraping", "Pandas"],
    budget: 400,
    status: 'open',
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    title: "Corporate Landing Page",
    postedBy: {
        firstName: "Emily",
        lastName: "Clark",
        companyName: "BrightStar Agency"
    },
    description: "A simple but elegant landing page for a marketing agency. Must be SEO optimized and fast loading.",
    skillsRequired: ["HTML", "CSS", "JavaScript", "SEO"],
    budget: 300,
    status: 'open',
    createdAt: new Date().toISOString()
  }
];