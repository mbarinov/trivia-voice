import { questionCache } from "./getTrivia.js";

/**
 * Result of checking a trivia answer
 */
export interface AnswerCheckResult {
  /** Whether the answer was correct */
  correct: boolean;
  /** The correct answer */
  correctAnswer: string;
  /** Explanation message for the user */
  explanation: string;
}

/**
 * Normalizes an answer string for comparison by:
 * - Converting to lowercase
 * - Trimming whitespace
 * - Removing punctuation and special characters
 * - Preserving only alphanumeric characters and spaces
 *
 * @param str - The answer string to normalize
 * @returns Normalized string for comparison
 */
function normalizeAnswer(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Validates a user's answer to a previously issued trivia question
 *
 * @param id - The unique ID of the trivia question
 * @param answer - The user's answer to check
 * @returns Promise resolving to the answer check result
 * @throws Error if the question ID is invalid or expired
 *
 * @example
 * ```typescript
 * const result = await checkAnswer("question-uuid", "Paris");
 * if (result.correct) {
 *   console.log("Correct!");
 * } else {
 *   console.log(`Wrong. The answer was: ${result.correctAnswer}`);
 * }
 * ```
 */
export async function checkAnswer(
  id: string,
  answer: string
): Promise<AnswerCheckResult> {
  if (!id || typeof id !== "string") {
    throw new Error("Question ID is required and must be a string");
  }

  if (!answer || typeof answer !== "string") {
    throw new Error("Answer is required and must be a string");
  }

  const correctAnswer = questionCache.get(id);

  if (!correctAnswer) {
    throw new Error(
      "Unknown question ID or question has expired. Please get a new question first."
    );
  }

  const userAnswerNormalized = normalizeAnswer(answer);
  const correctAnswerNormalized = normalizeAnswer(correctAnswer);

  const isCorrect = userAnswerNormalized === correctAnswerNormalized;

  questionCache.delete(id);

  return {
    correct: isCorrect,
    correctAnswer,
    explanation: isCorrect
      ? "🎉 Correct! Well done!"
      : `❌ Incorrect. The correct answer was: "${correctAnswer}"`,
  };
}
