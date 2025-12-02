import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.warn("GOOGLE_API_KEY is not set in environment variables.");
}

export const genAI = new GoogleGenerativeAI(apiKey || "");
