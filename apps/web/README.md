# Voice AI Trivia Game - Web Frontend

A sleek, hacker-themed frontend for demonstrating voice AI technology in tech talks and presentations.

## 🎯 Overview

This Next.js application provides an interactive voice AI trivia game experience with:
- **Real-time voice interaction** powered by LiveKit Agents
- **Live audio visualization** and transcription
- **Professional tech demo presentation** format

## 🚀 Features

### 🎮 Interactive Voice Game
- Real-time voice recognition and AI responses
- Live audio visualization with custom terminal styling
- Dynamic transcription display
- Smooth state management for connection flow

### 🎨 Hacker Aesthetic Design
- Matrix rain background animation
- Terminal-style interfaces throughout
- Green/amber color scheme with monospace fonts
- Typewriter text animations
- ASCII art and command-line styling

### 📱 Tech Demo Ready
- Professional landing page for presentations
- Resource links section (slides, articles, GitHub, contact)
- System status indicators
- Mobile-responsive design

### ⚡ Performance Optimized
- Shared component architecture
- Memoized renders and optimized animations
- Error boundaries for graceful failure handling
- TypeScript for type safety

## 🏗️ Architecture

```
src/
├── app/                    # Next.js app router
│   ├── page.tsx           # Landing page
│   ├── room/              # Voice game interface
│   ├── globals.css        # Global styles & LiveKit overrides
│   └── layout.tsx         # Root layout with metadata
├── components/
│   ├── shared/            # Reusable components
│   │   ├── matrix-rain.tsx
│   │   ├── typewriter-text.tsx
│   │   ├── terminal-header.tsx
│   │   └── error-boundary.tsx
│   └── transcription-view.tsx
└── lib/
    ├── constants.ts       # App constants & configuration
    ├── types.ts          # TypeScript type definitions
    ├── utils.ts          # Utility functions
    └── performance.ts    # Performance monitoring
```

## 🛠️ Development

### Prerequisites
- Node.js >= 18
- npm, yarn, or pnpm

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables
Create `.env.local` in the web app root:
```env
NEXT_PUBLIC_CONN_DETAILS_ENDPOINT=/api/token
```

### Development Commands
```bash
# Development with hot reload
npm run dev

# Type checking
npm run check-types

# Linting
npm run lint

# Build production bundle
npm run build
```

## 🎨 Styling System

### Color Palette
- **Primary**: `#22c55e` (Green 400)
- **Secondary**: `#16a34a` (Green 600)
- **Accent**: `#fbbf24` (Amber 400)
- **Background**: `#000000` (Black)
- **Error**: `#ef4444` (Red 400)

### Typography
- **Monospace**: Geist Mono for terminal styling
- **Sans-serif**: Geist for UI elements
- **Terminal aesthetic**: Consistent monospace usage

### Component Styling
- **Matrix Rain**: Configurable opacity and character generation
- **Typewriter Effect**: Smooth character-by-character typing
- **Terminal Interfaces**: Authentic command-line appearance
- **LiveKit Overrides**: Custom styling for voice components

## 🔧 Customization

### Matrix Rain
```typescript
// Adjust opacity and performance
<MatrixRain opacity={0.1} />
```

### Typewriter Text
```typescript
// Control timing and appearance
<TypewriterText 
  text="Your text here"
  delay={0.5}
  className="custom-styles"
/>
```

### Resource Links
Update `RESOURCES` in `lib/constants.ts`:
```typescript
export const RESOURCES = [
  { 
    name: "slides", 
    desc: "Your presentation",
    icon: "📊",
    url: "https://your-slides-url.com"
  },
  // ... more resources
];
```

### Contact Information
Update the contact section in `page.tsx` with your details:
```typescript
// In ContactSection component
│  Email:    your.email@domain.com        │
│  GitHub:   github.com/yourusername      │
│  LinkedIn: linkedin.com/in/yourprofile  │
│  Twitter:  @yourusername                │
```

## 🎯 Performance

### Optimizations Included
- **Component memoization** to prevent unnecessary re-renders
- **Debounced/throttled animations** for smooth performance
- **Lazy loading** and code splitting
- **Optimized bundle size** with tree shaking

### Performance Monitoring
```typescript
import { usePerformanceMonitor } from '@/lib/performance';

// In your components
const { startTiming, endTiming } = usePerformanceMonitor('ComponentName');
```

## 🛡️ Error Handling

### Error Boundaries
All major components are wrapped with error boundaries that:
- Display hacker-themed error messages
- Provide recovery options
- Log errors for debugging
- Maintain application stability

### Connection Error Handling
- Graceful WebRTC connection failures
- User-friendly permission request handling
- Automatic retry mechanisms
- Clear error messaging

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Touch-friendly button sizes
- Optimized terminal interfaces
- Reduced animation complexity
- Compressed transcription display

## 🧪 Testing

### Testing Strategy
- Component unit tests with Jest/React Testing Library
- Integration tests for voice functionality
- Visual regression testing
- Performance benchmarking

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Build Process
```bash
# Production build
npm run build

# Analyze bundle
npm run analyze
```

### Deployment Platforms
- **Vercel**: Optimized for Next.js (recommended)
- **Netlify**: Static deployment with edge functions
- **Docker**: Containerized deployment

### Performance Checklist
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

## 🤝 Contributing

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Implement proper error handling
- Add JSDoc comments for utilities
- Use consistent naming conventions

### Component Guidelines
- Keep components focused and single-responsibility
- Use proper TypeScript interfaces
- Implement error boundaries where needed
- Optimize for performance and accessibility

## 📝 License

This project is part of a tech demonstration and follows the same license as the parent repository.

---

**Built with**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion, LiveKit
**Performance**: Optimized for smooth 60fps animations and minimal bundle size
**Accessibility**: WCAG 2.1 compliant with proper ARIA labels and keyboard navigation
