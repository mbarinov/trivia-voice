# Trivia MCP Server

A Model Context Protocol (MCP) server for playing trivia games using the Open Trivia Database API.

## 🎯 Features

- 🎲 **Fresh trivia questions** from Open Trivia Database (OpenTDB)
- 🎚️ **Customizable difficulty** - Easy, Medium, Hard
- 📚 **Multiple categories** - 23+ different trivia categories
- 🔀 **Question types** - Multiple choice and True/False
- ✅ **Smart answer validation** - Case-insensitive with punctuation normalization
- 🔒 **Secure answer checking** - Answers cached server-side
- 🚫 **One-time use** - Questions expire after being answered
- 🌐 **HTTP Stream transport** - Compatible with modern MCP clients

## 📦 Installation

```bash
npm install
```

## 🚀 Usage

### Start the server

```bash
npm run dev
```

The server will start on port 8080 and provide an HTTP Stream endpoint at:
- **Endpoint**: `http://localhost:8080/stream`
- **Transport**: HTTP Stream (binary-safe with SSE fallback)

### Available Tools

#### 1. `get_trivia_question`

Fetches a new trivia question with optional filtering parameters.

**Parameters (all optional):**
- `category` (number): OpenTDB category ID (9-32)
- `difficulty` (string): "easy", "medium", or "hard"  
- `type` (string): "multiple" or "boolean"

**Returns:**
```json
{
  "id": "uuid-string",
  "category": "Science & Nature",
  "difficulty": "medium",
  "question": "What is the chemical symbol for gold?",
  "type": "multiple",
  "options": ["Au", "Ag", "Fe", "Cu"]
}
```

#### 2. `check_trivia_answer`

Validates an answer to a previously asked question.

**Parameters:**
- `id` (string, required): The UUID of the question
- `answer` (string, required): Your answer

**Returns:**
```json
{
  "correct": true,
  "correctAnswer": "Au",
  "explanation": "🎉 Correct! Well done!"
}
```

## 🗂️ OpenTDB Categories

Popular category IDs you can use:

| ID | Category |
|----|----------|
| 9  | General Knowledge |
| 10 | Entertainment: Books |
| 11 | Entertainment: Film |
| 12 | Entertainment: Music |
| 17 | Science & Nature |
| 18 | Science: Computers |
| 19 | Science: Mathematics |
| 20 | Mythology |
| 21 | Sports |
| 22 | Geography |
| 23 | History |

[Full list available at OpenTDB](https://opentdb.com/api_config.php)

## 🎮 Example Workflow

1. **Get a question**: Call `get_trivia_question` with optional filters
2. **Receive question**: Get a question object with unique ID and options
3. **Submit answer**: Call `check_trivia_answer` with the question ID and your answer
4. **Get feedback**: Receive validation result with explanation

## 🛠️ Development

### Scripts

```bash
# Development with auto-reload
npm run dev

# Run tests
npm test

# Build TypeScript
npm run build
```

### Testing

The project includes basic functionality tests:

```bash
npm test
```

### Development Tools

For local development and inspection, you can use:

- **MCP Inspector**: `npx @modelcontextprotocol/inspector npm run dev`
- **MCP CLI**: `mcp-cli connect "npm run dev"`
- **Claude Desktop**: Add to your MCP configuration

## 🏗️ Architecture

```
src/
├── server.ts           # Main MCP server setup
├── tools/
│   ├── getTrivia.ts    # Question fetching tool
│   └── checkAnswer.ts  # Answer validation tool
└── utils/
    └── opentdb.ts      # OpenTDB API integration
```

## 🔧 Technical Details

- **Framework**: FastMCP 2.x
- **Language**: TypeScript
- **Transport**: HTTP Stream
- **API**: Open Trivia Database (https://opentdb.com/)
- **Validation**: Zod schemas for type safety
- **Caching**: In-memory Map for answer storage

## 🛡️ Error Handling

- **API failures** are handled gracefully with descriptive error messages
- **Invalid question IDs** return appropriate error responses
- **Network issues** are reported clearly to the client
- **Input validation** ensures data integrity

## 🔒 Security Features

- **Server-side answer storage** - Correct answers never sent to client
- **One-time question use** - Prevents answer reuse
- **Input sanitization** - All user inputs are validated
- **Error message sanitization** - No sensitive data in error responses

## 🙏 Acknowledgments

- [Open Trivia Database](https://opentdb.com/) for providing free trivia questions
- [FastMCP](https://github.com/punkpeye/fastmcp) for the excellent MCP framework
- [Model Context Protocol](https://modelcontextprotocol.io/) for the standardized protocol 