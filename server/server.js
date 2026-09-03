const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.log("⚠️ GEMINI_API_KEY is missing.");
}

const aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// Health Check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "CareerBoost AI server is running",
        aiConfigured: Boolean(apiKey)
    });
});


// Cover Letter AI
app.post("/api/generate-cover-letter", async (req, res) => {

    try {

        const {
            fullName,
            jobTitle,
            companyName,
            email,
            phone,
            location,
            jobDescription
        } = req.body;

        if (!fullName || !jobTitle || !companyName) {
            return res.status(400).json({
                success: false,
                error: "Full name, job title and company name are required."
            });
        }

        if (!aiClient) {
            return res.status(500).json({
                success: false,
                error: "Gemini API key is not configured."
            });
        }

        const prompt = `
You are an expert professional career-writing assistant.

Create a personalized and professional cover letter for the candidate below.

Candidate:
Name: ${fullName}
Target Job: ${jobTitle}
Company: ${companyName}
Email: ${email || "Not provided"}
Phone: ${phone || "Not provided"}
Location: ${location || "Not provided"}

Job Description:
${jobDescription || "No job description provided."}

Instructions:
- Write a professional job-specific cover letter.
- Analyze the job description and naturally use relevant skills and responsibilities.
- Do not invent experience, qualifications, certifications or achievements.
- Do not make false claims.
- If the candidate is a fresher, emphasize transferable skills, willingness to learn, attention to detail and adaptability.
- Keep it concise and professional.
- Avoid unnecessary generic statements.
- Do not use emojis.
- Do not use markdown.
- Return only the final cover letter.
`;

        const response = await aiClient.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt
        });

        const coverLetter = response.text;

        if (!coverLetter) {
            return res.status(500).json({
                success: false,
                error: "AI returned an empty response."
            });
        }

        res.json({
            success: true,
            coverLetter: coverLetter.trim()
        });

    } catch (error) {

        console.error("AI Cover Letter Error:", error);

        res.status(500).json({
            success: false,
            error: error.message || "Failed to generate cover letter."
        });
    }
});


// Start Server
app.listen(PORT, () => {
    console.log(`🚀 CareerBoost AI server running at http://localhost:${PORT}`);
});
