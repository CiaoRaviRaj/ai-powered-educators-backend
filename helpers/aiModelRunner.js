// import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEN_API_KEY })

const dummyOutput = '{"instructions":"## Instructions for Students\\n\\n### Assignment: Essay on Climate Change\\n\\n---\\n\\n**Course**: *No course title provided*\\n\\n**Subject**: *No subject provided*\\n\\n**Grade Level**: *Not specified*\\n\\n**Due Date**: *To be announced*\\n\\n**Total Points**: *100*\\n\\n---\\n\\n### Student Information\\n\\n- Student Name: _______________\\n- Student ID: ________________\\n- Date: _____________________\\n\\n---\\n\\n### General Instructions\\n\\n- Please read all instructions carefully before beginning.\\n- Write your answers in clear, complete sentences.\\n- Show all your work where applicable.\\n- You may use additional paper if needed.\\n- Ensure your essay addresses the impact of climate change on global ecosystems.\\n\\n### Submission Guidelines\\n\\n- Submit your completed assignment through the designated platform.\\n- Ensure all pages are properly labeled with your name and student ID.\\n- Follow any additional submission guidelines provided by your instructor.\\n\\n---\\n\\n### Assignment Content\\n\\n**Assignment Description:**\\n> Write a 500-word essay on the impacts of climate change on global ecosystems.\\n\\n**Learning Objectives:**\\n> - Learning about climate change and its effects on global ecosystems.\\n\\n**Assignment Questions:**\\n\\n- Discuss at least three ways climate change has altered ecosystems around the world.\\n- Provide real-world examples to support your discussion.\\n- Explain possible future impacts if current trends continue.\\n\\n**Answer Space:**\\n- Provide adequate space after each question or use additional paper as necessary.\\n\\n---\\n\\n### Formatting Requirements\\n\\n- **Spacing**: Double-spaced for written responses\\n- **Margins**: 1-inch margins on all sides\\n- **Font**: 12-point Times New Roman or Arial\\n\\n---\\n\\n### Footer Details\\n\\n- **Time Allowed**: As specified by the instructor\\n- **Additional Resources**: Provided separately if needed\\n- **Teacher Contact**: Contact your instructor for any clarifications","rubric":"## Grading Rubric\\n\\n| Category | Description | Excellent (90-100%) | Good (80-89%) | Satisfactory (70-79%) | Needs Improvement (Below 70%) |\\n|:---|:---|:---|:---|:---|:---|\\n| **Content Understanding** | Demonstrates comprehensive understanding of the subject matter | Demonstrates deep understanding with insightful examples and analysis | Demonstrates good understanding with some examples and analysis | Demonstrates basic understanding with limited examples and analysis | Demonstrates poor understanding with little or no examples and weak analysis |\\n\\n\\n---\\n\\n### Feedback Section\\n\\n- **Strengths:**\\n- **Areas for Improvement:**\\n- **Additional Comments:**"}'



export const AI_MODEL_TYPE = {
  // OPEN_AI: "openai",
  GEMINI_PRO: "GEMINI_PRO",
  GEMINI_GEMMA: "GEMINI_GEMMA",
};

export async function aiModelRunner(modelType, messages) {
  console.log("messages", messages);
  try {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Message array must be non-empty.");
    }

    switch (modelType) {
      // case AI_MODEL_TYPE.OPEN_AI: {
      //   const chatCompletion = await openai.chat.completions.create({
      //     model: "gpt-4", // Or any other OpenAI chat model
      //     messages,
      //   });
      //   return chatCompletion.choices[0].message.content;
      // }
      case AI_MODEL_TYPE.GEMINI_PRO: {
        return dummyOutput;
        //Keep older name
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Or a specific Gemini model like "gemini-pro"
        const parts = messages.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }));

        const result = await model.generateContent({ contents: parts });
        const response = await result.response;
        return response.text();
      }
      case AI_MODEL_TYPE.GEMINI_GEMMA: {

        return dummyOutput;
        // Format the messages properly
        const prompt = messages.map((msg) => msg.content).join("\n\n");
        console.log("prompt", prompt);
        // Initialize a chat with the Flash Lite model
        const response = await genAI.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
        });
        console.log("response", response);
        return response.text();
      }
      default:
        throw new Error(`Unsupported model type: ${modelType}`);
    }
  } catch (err) {
    console.error("AI Model Runner Error:", err);
    throw err;
  }
}

