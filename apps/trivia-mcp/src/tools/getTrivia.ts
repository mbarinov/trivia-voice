import { fetchTrivia } from "../utils/opentdb.js";

/**
 * Cache to store correct answers for trivia questions
 * Maps question ID to the correct answer string
 */
export const questionCache = new Map<string, string>();

/**
 * Fetches a new trivia question from the Open Trivia Database
 *
 * @param category - Optional OpenTDB category ID (9-32)
 * @param difficulty - Optional difficulty level
 * @param type - Optional question type
 * @returns Promise resolving to a trivia question object
 * @throws Error if the API request fails or returns invalid data
 *
 * @example
 * ```typescript
 * // Get any random question
 * const question = await getTrivia();
 *
 * // Get a specific type of question
 * const easyQuestion = await getTrivia(9, "easy", "multiple");
 * ```
 */
export async function getTrivia(
  category: number = 9,
  difficulty: "easy" | "medium" | "hard" = "easy",
  type: "multiple" | "boolean" = "multiple"
) {
  try {
    const { question, correctAnswer } = await fetchTrivia({
      category,
      difficulty,
      type,
    });

    questionCache.set(question.id, correctAnswer);

    return question;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    throw new Error(`Failed to get trivia question: ${errorMessage}`);
  }
}
