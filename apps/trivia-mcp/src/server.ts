import { FastMCP } from "fastmcp";
import { z } from "zod";
import { getTrivia } from "./tools/getTrivia.js";
import { checkAnswer } from "./tools/checkAnswer.js";

/**
 * Trivia MCP Server
 *
 * Provides two main tools for playing trivia games:
 * 1. get_trivia_question - Fetches questions from OpenTDB API
 * 2. check_trivia_answer - Validates user answers
 *
 * The server uses the Open Trivia Database (https://opentdb.com/)
 * to provide fresh trivia questions across multiple categories and difficulties.
 */

const mcp = new FastMCP({
  name: "Trivia-MCP",
  version: "1.0.0",
});

mcp.addTool({
  name: "get_trivia_question",
  description: "Get a new trivia question",
  parameters: z.object({
    category: z
      .number()
      .min(9)
      .max(32)
      .optional()
      .describe(
        "Category ID (9-32) for trivia questions. Optional. See OpenTDB docs for category mapping."
      ),
    difficulty: z
      .enum(["easy", "medium", "hard"])
      .optional()
      .describe("Difficulty level: easy, medium, or hard. Optional."),
    type: z
      .enum(["multiple", "boolean"])
      .optional()
      .describe(
        "Question type: multiple choice or boolean (true/false). Optional."
      ),
  }),
  annotations: {
    title: "Get Trivia Question",
    readOnlyHint: true,
    openWorldHint: true,
  },
  execute: async (args) => {
    console.debug("[get_trivia_question] called with args:", args);
    try {
      const question = await getTrivia(
        args.category,
        args.difficulty,
        args.type
      );
      console.debug("[get_trivia_question] result:", question);
      return JSON.stringify(question, null, 2);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error(`[get_trivia_question] error: ${errorMessage}`);
      throw new Error(`Failed to get trivia question: ${errorMessage}`);
    }
  },
});

mcp.addTool({
  name: "check_trivia_answer",
  description:
    "Check your answer to a previously issued trivia question. Requires the question ID and your answer.",
  parameters: z.object({
    id: z
      .string()
      .describe("The unique ID of the trivia question you are answering."),
    answer: z.string().describe("Your answer to the trivia question."),
  }),
  annotations: {
    title: "Check Trivia Answer",
    readOnlyHint: true,
    openWorldHint: false,
  },
  execute: async (args) => {
    console.debug("[check_trivia_answer] called with args:", args);
    try {
      const result = await checkAnswer(args.id, args.answer);
      console.debug("[check_trivia_answer] result:", result);
      return JSON.stringify(result, null, 2);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error(`[check_trivia_answer] error: ${errorMessage}`);
      throw new Error(`Failed to check answer: ${errorMessage}`);
    }
  },
});

async function startServer() {
  try {
    const port = parseInt(process.env["PORT"] || "8080");

    await mcp.start({
      transportType: "httpStream",
      httpStream: { port },
    });

    console.log("🎯 Trivia MCP Server started successfully!");
    console.log(`📡 Listening on: http://localhost:${port}/stream`);
    console.log("🛠️  Available tools:");
    console.log("   • get_trivia_question - Get a new trivia question");
    console.log("   • check_trivia_answer - Check your answer to a question");
    console.log("📚 Powered by Open Trivia Database (https://opentdb.com/)");
  } catch (error) {
    console.error("❌ Failed to start Trivia MCP Server:", error);
    process.exit(1);
  }
}

// Start server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export { mcp };
