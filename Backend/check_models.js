import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ No API Key found in .env");
  process.exit(1);
}

console.log("🔑 Using API Key:", apiKey.substring(0, 8) + "...");

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    // This is a direct fetch to the API to see what's allowed
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await response.json();

    if (data.error) {
      console.error("❌ API Error:", data.error.message);
      return;
    }

    console.log("\n✅ AVAILABLE MODELS FOR YOUR KEY:");
    const models = data.models || [];
    models.forEach(m => {
      if (m.supportedGenerationMethods.includes("generateContent")) {
        console.log(`   - ${m.name.replace("models/", "")}`); // This is the name we need!
      }
    });
    console.log("\n👉 Please copy one of the names above into your geminiService.js\n");

  } catch (error) {
    console.error("❌ Network Error:", error);
  }
}

listModels();