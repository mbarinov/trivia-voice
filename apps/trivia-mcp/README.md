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

## 🚀 Deployment

### Google Cloud Run Deployment

The Trivia MCP Server can be deployed to Google Cloud Run for production use. Here's how to deploy it:

#### Prerequisites

1. **Google Cloud SDK** installed and configured
2. **Docker** installed
3. **Google Cloud Project** with Container Registry and Cloud Run APIs enabled

#### Step 1: Build Docker Image

From the root of the monorepo, build the Docker image with the correct platform:

```bash
# Build for Cloud Run (AMD64 architecture)
docker build -f apps/trivia-mcp/Dockerfile --platform linux/amd64 -t gcr.io/YOUR-PROJECT-ID/trivia-mcp:latest .
```

#### Step 2: Configure Docker Authentication

```bash
# Configure Docker to authenticate with Google Cloud
gcloud auth configure-docker
```

#### Step 3: Push Image to Container Registry

```bash
# Push the image to Google Container Registry
docker push gcr.io/YOUR-PROJECT-ID/trivia-mcp:latest
```

#### Step 4: Deploy to Cloud Run

```bash
# Deploy to Cloud Run
gcloud run deploy trivia-mcp \
  --image gcr.io/YOUR-PROJECT-ID/trivia-mcp:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

#### Step 5: Get Service URL

After deployment, you'll receive a service URL like:
```
https://trivia-mcp-123456789.us-central1.run.app
```

Your MCP endpoint will be available at:
```
https://trivia-mcp-123456789.us-central1.run.app/stream
```

### Local Docker Testing

To test the Docker image locally before deploying:

```bash
# Build the image
docker build -f apps/trivia-mcp/Dockerfile -t trivia-mcp:local .

# Run locally
docker run --rm -p 8080:8080 trivia-mcp:local

# Test the endpoint
curl -v http://localhost:8080/stream
```

Expected response: `No sessionId` (this is normal for MCP servers)

### Environment Variables

The server automatically configures itself for Cloud Run deployment:

- **PORT**: Automatically set by Cloud Run (defaults to 8080)
- **NODE_ENV**: Set to "production" for optimized performance

### Deployment Verification

To verify your deployment is working:

```bash
# Check service status
gcloud run services describe trivia-mcp --region=us-central1

# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=trivia-mcp" --limit=10

# Test the endpoint
curl -v https://YOUR-SERVICE-URL/stream
```

### Connecting to Your Deployed Server

Once deployed, you can connect to your server using any MCP client:

**For Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "trivia": {
      "url": "https://YOUR-SERVICE-URL/stream",
      "transport": "streamable-http"
    }
  }
}
```

**For FastMCP Client**:
```python
from fastmcp import Client

client = Client("https://YOUR-SERVICE-URL/stream")
```

### Update Deployment

To update your deployment with new changes:

```bash
# Rebuild and push
docker build -f apps/trivia-mcp/Dockerfile --platform linux/amd64 -t gcr.io/YOUR-PROJECT-ID/trivia-mcp:latest .
docker push gcr.io/YOUR-PROJECT-ID/trivia-mcp:latest

# Redeploy
gcloud run deploy trivia-mcp --image gcr.io/YOUR-PROJECT-ID/trivia-mcp:latest
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