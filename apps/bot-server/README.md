# Bot Server - LiveKit Trivia Voice AI Agent

A LiveKit Agent that serves as an entertaining trivia host using OpenAI Realtime API and MCP (Model Context Protocol) for trivia questions.

## 🎯 Features

- 🎙️ **Voice AI Trivia Host** - Interactive voice conversations using OpenAI Realtime API
- 🎭 **Personality-driven** - Mia, the entertaining trivia host with humor and enthusiasm
- 🔗 **MCP Integration** - Connects to trivia-mcp server for fresh questions
- 🎚️ **Adaptive Difficulty** - Easy trivia by default, adjustable based on user preference
- 🎉 **Engaging Experience** - Celebrates correct answers, provides encouraging hints
- 🔧 **Function Tools** - Built-in call management and trivia flow control

## 🏗️ Architecture

The bot-server is a LiveKit Agent that:
- Uses OpenAI's GPT-4o-mini-realtime-preview model with "coral" voice
- Connects to MCP servers for trivia question data
- Handles voice interactions with semantic VAD for natural conversations
- Manages call flow with function tools for ending conversations

## 📦 Installation

### Prerequisites

- Python 3.13+
- Poetry for dependency management
- Docker (for deployment)
- Google Cloud SDK (for GCP deployment)

### Local Development

```bash
# Install dependencies
poetry install

# Copy environment variables
cp .env.example .env

# Configure your environment variables
# LIVEKIT_URL=ws://localhost:7880
# LIVEKIT_API_KEY=your-api-key
# LIVEKIT_API_SECRET=your-api-secret
# OPENAI_API_KEY=your-openai-key
# TRIVIA_MCP_URL=http://localhost:8080/sse

# Run the agent in development mode
poetry run python agent.py dev
```

### Available Commands

```bash
# Development mode (auto-reload)
poetry run python agent.py dev

# Production mode
poetry run python agent.py start

# Connect to specific room
poetry run python agent.py connect --room my-room

# Console chat mode
poetry run python agent.py console

# Download dependencies
poetry run python agent.py download-files
```

## 🚀 Deployment to Google Cloud Run

### Prerequisites

1. **Google Cloud SDK** installed and configured
2. **Docker** installed
3. **Google Cloud Project** with Container Registry and Cloud Run APIs enabled
4. **Secret Manager** configured with required secrets

### Step 1: Configure Google Cloud Secrets

Create the following secrets in Google Secret Manager:

```bash
# Set your project ID
export PROJECT_ID="your-project-id"

# Create secrets (replace with your actual values)
echo "wss://your-livekit-server.com" | gcloud secrets create LIVEKIT_URL --data-file=-
echo "your-livekit-api-key" | gcloud secrets create LIVEKIT_API_KEY --data-file=-
echo "your-livekit-api-secret" | gcloud secrets create LIVEKIT_API_SECRET --data-file=-
echo "https://your-trivia-mcp-server.com/sse" | gcloud secrets create TRIVIA_MCP_URL --data-file=-
echo "your-openai-api-key" | gcloud secrets create OPENAI_API_KEY --data-file=-
```

### Step 2: Grant Secret Manager Access

```bash
# Get your project number
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

# Grant Secret Manager access to the default compute service account
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Step 3: Build Docker Image

From the workspace root:

```bash
# Build for Cloud Run (AMD64 architecture)
docker build -f apps/bot-server/Dockerfile --platform linux/amd64 -t gcr.io//bot-server:latest .
```

### Step 4: Configure Docker Authentication

```bash
# Configure Docker to authenticate with Google Cloud
gcloud auth configure-docker
```

### Step 5: Push Image to Container Registry

```bash
# Push the image to Google Container Registry
docker push gcr.io/trivia-maxbarinov-com/bot-server:latest
```

### Step 6: Deploy to Cloud Run

```bash
# Deploy to Cloud Run with secrets and proper configuration
gcloud run deploy bot-server \
  --image gcr.io/trivia-maxbarinov-com/bot-server:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port=8081 \
  --memory=4Gi \
  --cpu=2 \
  --timeout=600 \
  --max-instances=10 \
  --min-instances=0 \
  --update-secrets="LIVEKIT_URL=LIVEKIT_URL:latest,LIVEKIT_API_KEY=LIVEKIT_API_KEY:latest,LIVEKIT_API_SECRET=LIVEKIT_API_SECRET:latest,TRIVIA_MCP_URL=TRIVIA_MCP_URL:latest,OPENAI_API_KEY=OPENAI_API_KEY:latest" \
  --no-use-http2
```

### Step 7: Verify Deployment

```bash
# Check service status
gcloud run services describe bot-server --region=us-central1

# Test health check
curl -v https://your-service-url

# View logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=bot-server" --limit=10
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `LIVEKIT_URL` | LiveKit server WebSocket URL | ✅ |
| `LIVEKIT_API_KEY` | LiveKit API key | ✅ |
| `LIVEKIT_API_SECRET` | LiveKit API secret | ✅ |
| `OPENAI_API_KEY` | OpenAI API key for Realtime API | ✅ |
| `TRIVIA_MCP_URL` | MCP server URL for trivia questions | ✅ |

### Resource Requirements

Based on [LiveKit's recommendations](https://docs.livekit.io/agents/ops/deployment/#memory-and-cpu):

- **Memory**: 4GB (supports ~25 concurrent sessions)
- **CPU**: 2 cores
- **Storage**: 10GB ephemeral storage
- **Timeout**: 10+ minutes for conversation completion

### Scaling Configuration

The agent automatically scales based on:
- **CPU Utilization**: Default threshold 75%
- **Load Function**: CPU-based load detection
- **Geographic Affinity**: LiveKit Cloud optimizes for lowest latency

## 🏭 Production Considerations

### Worker Pool Model

This agent uses LiveKit's worker pool architecture:
- Each Cloud Run instance registers as a worker with LiveKit server
- LiveKit server distributes room assignments across available workers
- Each conversation spawns a new sub-process
- Workers automatically scale based on demand

### Networking

- **WebSocket Connection**: Workers connect to LiveKit server (no inbound ports needed)
- **Health Check**: Exposed on port 8081 for monitoring
- **No Public HTTP**: Agent doesn't serve web requests, only processes LiveKit jobs

### Monitoring

```bash
# View real-time logs
gcloud logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=bot-server"

# Check metrics in Cloud Console
https://console.cloud.google.com/run/detail/us-central1/bot-server/metrics
```

## 🧪 Local Testing

### With Docker

```bash
# Test locally with Docker
docker build -f apps/bot-server/Dockerfile -t bot-server:local .

# Run with environment variables
docker run --rm \
  -e LIVEKIT_URL="ws://localhost:7880" \
  -e LIVEKIT_API_KEY="your-key" \
  -e LIVEKIT_API_SECRET="your-secret" \
  -e OPENAI_API_KEY="your-openai-key" \
  -e TRIVIA_MCP_URL="http://localhost:8080/sse" \
  bot-server:local
```

### Health Check Testing

```bash
# Test health endpoint (should return "OK")
curl http://localhost:8081/
```

## 🔒 Security

- **Secret Management**: All sensitive data stored in Google Secret Manager
- **Non-root User**: Container runs as unprivileged user (UID 10001)
- **No Public Ports**: Only health check endpoint exposed
- **Secure Communication**: WebSocket connections to LiveKit server

## 🎮 Usage

Once deployed, your agent will:

1. **Register with LiveKit**: Automatically connects to your LiveKit server
2. **Wait for Assignments**: Listens for room assignments from LiveKit server
3. **Join Conversations**: When users join a room, agent joins and introduces itself
4. **Host Trivia**: Provides engaging trivia experience with voice interaction
5. **Scale Automatically**: Cloud Run scales instances based on demand

## 🛠️ Troubleshooting

### Common Issues

**Container fails to start:**
- Check memory allocation (minimum 4GB recommended)
- Verify all secrets are properly configured
- Ensure LiveKit server is accessible

**Agent not receiving jobs:**
- Verify LIVEKIT_URL, API key, and secret
- Check LiveKit server logs for worker registration
- Confirm network connectivity

**High memory usage:**
- Normal for voice AI workloads
- Monitor and adjust memory limits if needed
- Consider reducing concurrent sessions

### Debug Commands

```bash
# Check container logs
gcloud logging read "resource.type=cloud_run_revision" --limit=20

# Test secret access
gcloud secrets versions access latest --secret="LIVEKIT_URL"

# Verify service configuration
gcloud run services describe bot-server --region=us-central1 --format=export
```

## 📚 References

- [LiveKit Agents Documentation](https://docs.livekit.io/agents/)
- [LiveKit Deployment Guide](https://docs.livekit.io/agents/ops/deployment/)
- [OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## 🙏 Acknowledgments

- [LiveKit](https://livekit.io/) for the excellent real-time infrastructure
- [OpenAI](https://openai.com/) for the Realtime API
- [MCP](https://modelcontextprotocol.io/) for the protocol specification
