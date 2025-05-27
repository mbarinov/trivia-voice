import { randomUUID } from "crypto";

/**
 * Represents a trivia question with all necessary metadata
 */
export interface TriviaQ {
  /** Unique identifier for the question */
  id: string;
  /** Category name (e.g., "Science & Nature") */
  category: string;
  /** Difficulty level */
  difficulty: "easy" | "medium" | "hard";
  /** The question text */
  question: string;
  /** Question type */
  type: "multiple" | "boolean";
  /** Array of possible answers (shuffled for multiple choice) */
  options: string[];
}

/**
 * Response structure from OpenTDB API
 */
interface OpenTDBResponse {
  response_code: number;
  results: Array<{
    category: string;
    type: "multiple" | "boolean";
    difficulty: "easy" | "medium" | "hard";
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  }>;
}

/**
 * Parameters for fetching trivia questions
 */
interface FetchTriviaParams {
  /** OpenTDB category ID (9-32) */
  category?: number;
  /** Question difficulty level */
  difficulty?: "easy" | "medium" | "hard";
  /** Question type */
  type?: "multiple" | "boolean";
}

/**
 * OpenTDB API response codes and their meanings
 */
const OPENTDB_RESPONSE_CODES = {
  0: "Success",
  1: "No Results - Could not return results. The API doesn't have enough questions for your query.",
  2: "Invalid Parameter - Contains an invalid parameter. Arguments passed in aren't valid.",
  3: "Token Not Found - Session Token does not exist.",
  4: "Token Empty - Session Token has returned all possible questions for the specified query.",
} as const;

/**
 * Decodes HTML entities commonly found in OpenTDB responses
 * @param str - String containing HTML entities
 * @returns Decoded string
 */
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'");
}

/**
 * Fetches a trivia question from the Open Trivia Database API
 * @param params - Optional parameters to filter questions
 * @returns Promise resolving to question data and correct answer
 * @throws Error if API request fails or returns invalid data
 */
export async function fetchTrivia(
  params: FetchTriviaParams = {}
): Promise<{ question: TriviaQ; correctAnswer: string }> {
  const url = new URL("https://opentdb.com/api.php");
  url.searchParams.set("amount", "1");

  // Add optional parameters
  if (params.category) {
    if (params.category < 9 || params.category > 32) {
      throw new Error("Category must be between 9 and 32");
    }
    url.searchParams.set("category", params.category.toString());
  }

  if (params.difficulty) {
    url.searchParams.set("difficulty", params.difficulty);
  }

  if (params.type) {
    url.searchParams.set("type", params.type);
  }

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(
        `OpenTDB API HTTP error: ${response.status} ${response.statusText}`
      );
    }

    const data: OpenTDBResponse = await response.json();

    if (data.response_code !== 0) {
      const errorMessage =
        OPENTDB_RESPONSE_CODES[
          data.response_code as keyof typeof OPENTDB_RESPONSE_CODES
        ] || `Unknown error code: ${data.response_code}`;
      throw new Error(`OpenTDB API error: ${errorMessage}`);
    }

    if (!data.results || data.results.length === 0) {
      throw new Error("No trivia questions returned from API");
    }

    const result = data.results[0];

    if (!result?.question || !result.correct_answer) {
      throw new Error("Invalid question data received from API");
    }

    const correctAnswer = decodeHtmlEntities(result.correct_answer);

    const allAnswers = [...result.incorrect_answers, result.correct_answer];
    const options = allAnswers
      .map(decodeHtmlEntities)
      .sort(() => Math.random() - 0.5);

    const question: TriviaQ = {
      id: randomUUID(),
      category: decodeHtmlEntities(result.category),
      difficulty: result.difficulty,
      question: decodeHtmlEntities(result.question),
      type: result.type,
      options,
    };

    return { question, correctAnswer };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch trivia question: ${error.message}`);
    }
    throw new Error("Failed to fetch trivia question: Unknown error occurred");
  }
}
