# Trivia Voice AI

A Turborepo monorepo containing a voice AI assistant application with multiple components.

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `web`: a [Next.js](https://nextjs.org/) web application for the frontend
- `bot-server`: a Python-based voice AI assistant using LiveKit Agents and Gemini Live API
- `docs`: documentation site (Next.js app)
- `@repo/ui`: a stub React component library shared by applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

### Technologies

- [TypeScript](https://www.typescriptlang.org/) for static type checking (JavaScript/TypeScript apps)
- [Python](https://www.python.org/) for the voice AI backend
- [LiveKit Agents](https://docs.livekit.io/agents/) for real-time voice processing
- [Google Gemini Live API](https://ai.google.dev/) for AI conversations
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Getting Started

### Prerequisites

- Node.js >= 18
- Python >= 3.8
- npm or yarn or pnpm

### Installation

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Install Python dependencies for the bot-server:
   ```bash
   npm run install-deps
   ```

3. Set up environment variables:
   ```bash
   cp apps/bot-server/env.example apps/bot-server/.env
   # Edit the .env file with your API keys
   ```

### Development

To develop all apps and packages, run the following command:

```bash
npm run dev
```

To develop specific apps:

```bash
# Web app only
npm run dev --filter=web

# Bot server only  
npm run dev --filter=bot-server

# Multiple apps
npm run dev --filter=web --filter=bot-server
```

### Build

To build all apps and packages:

```bash
npm run build
```

### Other Commands

```bash
# Run tests across all packages
npm run test

# Run linting across all packages
npm run lint

# Run type checking across all packages
npm run check-types

# Format code
npm run format
```

## Bot Server Setup

The bot-server requires additional setup for the voice AI functionality:

1. **LiveKit Configuration**: Set up your LiveKit server and get API credentials
2. **Google API Key**: Get a Google API key for Gemini Live API access
3. **Environment Variables**: Configure the `.env` file in `apps/bot-server/`

See `apps/bot-server/README.md` for detailed setup instructions.

## Remote Caching

Turborepo can use [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines.

To enable Remote Caching:

```bash
npx turbo login
npx turbo link
```

## Useful Links

Learn more about the technologies used:

- [Turborepo Documentation](https://turborepo.com/docs)
- [LiveKit Agents](https://docs.livekit.io/agents/)
- [Google Gemini API](https://ai.google.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
