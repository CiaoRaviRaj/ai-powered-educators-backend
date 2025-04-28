const generateInstructionSystemPrompt = () => {
    return JSON.stringify({
        type: "INSTRUCTION",
        structure: {
            assignmentHeader: {
                title: "{{courseTitle}} - {{assignmentTitle}}",
                course: "{{courseTitle}}",
                subject: "{{subjectName}}",
                grade: "{{gradeLevel}}",
                dueDate: "{{dueDate}}",
                totalPoints: "{{totalPoints}}"
            },
            studentInformation: {
                fields: [
                    "Student Name: _______________",
                    "Student ID: ________________",
                    "Date: _____________________"
                ]
            },
            instructions: {
                general: [
                    "Please read all instructions carefully before beginning.",
                    "Write your answers in clear, complete sentences.",
                    "Show all your work where applicable.",
                    "You may use additional paper if needed.",
                    "{{customInstructions}}"
                ],
                submission: [
                    "Submit your completed assignment through the designated platform",
                    "Ensure all pages are properly labeled with your name and student ID",
                    "{{submissionGuidelines}}"
                ]
            },
            assignmentContent: {
                description: "{{assignmentDescription}}",
                learningObjectives: "{{learningObjectives}}",
                questions: "{{questions}}",
                answerSpace: "Provide adequate space for student responses"
            },
            footer: {
                timeAllowed: "{{timeAllowed}}",
                additionalResources: "{{additionalResources}}",
                teacherContact: "{{teacherContact}}"
            }
        },
        formatting: {
            spacing: "Double-spaced for written responses",
            margins: "1-inch margins on all sides",
            font: "12-point Times New Roman or Arial"
        }
    });
};

const generateRubricSystemPrompt = () => {
    return JSON.stringify({
        type: "RUBRIC",
        structure: {
            rubricHeader: {
                assignmentTitle: "{{assignmentTitle}}",
                courseInformation: "{{courseTitle}} - {{subjectName}}",
                totalPoints: "{{totalPoints}}"
            },
            gradingCriteria: {
                categories: [
                    {
                        name: "Content Understanding",
                        description: "Demonstrates comprehensive understanding of the subject matter",
                        levels: [
                            {
                                score: "Excellent (90-100%)",
                                description: "{{excellentCriteria}}"
                            },
                            {
                                score: "Good (80-89%)",
                                description: "{{goodCriteria}}"
                            },
                            {
                                score: "Satisfactory (70-79%)",
                                description: "{{satisfactoryCriteria}}"
                            },
                            {
                                score: "Needs Improvement (Below 70%)",
                                description: "{{improvementCriteria}}"
                            }
                        ]
                    }
                ],
                weightage: {
                    distribution: "{{weightageDistribution}}"
                }
            },
            feedbackSection: {
                structure: [
                    "Strengths:",
                    "Areas for Improvement:",
                    "Additional Comments:"
                ]
            }
        }
    });
};

const generateMCQSystemPrompt = () => {
    return JSON.stringify({
        type: "MCQ",
        structure: {
            questionFormat: {
                stem: "Clear and concise question statement",
                options: {
                    count: 4,
                    format: ["A", "B", "C", "D"],
                    distribution: "One correct answer, three plausible distractors"
                },
                difficulty: {
                    levels: ["Easy", "Medium", "Hard"],
                    distribution: "{{difficultyDistribution}}"
                }
            },
            contentGuidelines: {
                alignment: "Must align with {{learningObjectives}}",
                coverage: "Cover key concepts from {{courseContent}}",
                cognitive: {
                    levels: [
                        "Knowledge",
                        "Comprehension",
                        "Application",
                        "Analysis"
                    ],
                    distribution: "{{cognitiveDistribution}}"
                }
            },
            formatting: {
                questionNumbering: "Sequential numbering (1, 2, 3...)",
                optionLayout: "Vertical alignment",
                spacing: "Consistent spacing between questions"
            },
            answerKey: {
                format: "Separate answer key with explanations",
                elements: [
                    "Correct answer",
                    "Explanation for correct answer",
                    "Common misconceptions addressed by distractors"
                ]
            }
        }
    });
};

export { generateInstructionSystemPrompt, generateRubricSystemPrompt, generateMCQSystemPrompt };