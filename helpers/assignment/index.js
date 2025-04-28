import AssignmentCategory from "../../models/AssignmentCategory.js";
import Course from '../../models/Course.js';
import { aiModelRunner, AI_MODEL_TYPE } from '../../helpers/aiModelRunner.js';
async function generateAssignmentSystemPrompt(assignmentData) {
    try {
        const {
            title,
            description,
            learningObjectivesDescription,
            courseId,
            assignmentCategoryId
        } = assignmentData;

        // Fetch course and category details with populated data
        const course = courseId ? await Course.findById(courseId) : null;
        const category = await AssignmentCategory.findById(assignmentCategoryId)
            .populate('assignmentSubCategoryIds');

        // Prepare the input message for AI
        const messages = [
            {
                role: "user",
                content: `Generate a comprehensive assignment system prompt using the following information:

Assignment Basic Information:
- Title: "${title}"
- Description: "${description || 'Not provided'}"
- Learning Objectives: "${learningObjectivesDescription || 'Not provided'}"

${course ? `Course Context:
- Course Title: "${course.courseTitle}"
- Course Description: "${course.courseDescription}"
- Subject: "${course.subjectId ? 'Linked to subject' : 'No subject specified'}"
- Grade Level: "${course.gradeId ? 'Linked to grade' : 'No grade specified'}"
- Course System Prompt: ${course.systemPrompt}` : 'No course context provided'}

Assignment Category Information:
- Category Title: "${category.title}"
- Category Subtitle: "${category.subTitle || 'Not provided'}"

Assignment Sub-Categories:
${category.assignmentSubCategoryIds.map(subCat => `
Sub-Category: "${subCat.title}"
Description: "${subCat.description}"
System Prompt: ${subCat.systemPrompt}
`).join('\n')}

Please analyze all the provided information and generate a structured assignment system prompt that:
1. Integrates course context, learning objectives, and assignment requirements
2. Incorporates the specific instructions from relevant sub-categories
3. Maintains educational standards and assessment clarity

Return the response in the following JSON format:
{
  "instructions": "With perper markdown format, Detailed instructions for students including all assignment requirements, format, submission guidelines, etc.",
  "rubric": "With perper markdown format, Comprehensive grading criteria and assessment framework"
}`
            }
        ];

        // Generate system prompt using Gemini
        const generatedPrompt = await aiModelRunner(
            AI_MODEL_TYPE.GEMINI_GEMMA,
            messages
        );

        // Parse and validate the response
        const parsedResponse = JSON.parse(generatedPrompt);

        // Validate the response format
        if (!parsedResponse.instructions || !parsedResponse.rubric) {
            throw new Error("Invalid AI response format");
        }

        return parsedResponse;

    } catch (error) {
        console.error("Error generating assignment system prompt:", error);
        throw error;
    }
}


export { generateAssignmentSystemPrompt };
