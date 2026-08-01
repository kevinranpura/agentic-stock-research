# Frontend Application

React-based frontend for the Agentic Stock Research System.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

   Application will be available at: http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Optional configuration in `.env`:

```env
VITE_API_URL=http://localhost:8000
```

If not set, defaults to `http://localhost:8000`

## Project Structure

```
frontend/
├── src/
│   ├── components/         # React components
│   │   ├── Header.jsx      # App header with branding
│   │   ├── SearchBar.jsx   # Query input and suggestions
│   │   ├── AgentPipeline.jsx   # Real-time agent progress
│   │   ├── Results.jsx     # Results container
│   │   ├── StockCard.jsx   # Individual stock recommendation
│   │   ├── StockTicker.jsx # Animated stock ticker
│   │   └── DataSection.jsx # Reusable data display
│   ├── services/
│   │   └── api.js          # API client
│   ├── App.jsx             # Main application
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Dependencies
```

## Component Overview

### Header
- Displays branding and NSE live status
- Sticky navigation bar

### SearchBar
- Query input with suggestions
- Submit button with loading state
- Suggested queries for quick start

### AgentPipeline
- Visual representation of agent workflow
- Real-time progress tracking
- Shows current running agent

### Results
- Displays trading recommendations
- Shows supporting data (market data, news)
- Organized in responsive grid layout

### StockCard
- Individual stock recommendation
- Action badge (BUY/SELL/HOLD)
- Confidence score visualization
- Target price and risk analysis

## Styling

Built with Tailwind CSS:
- Dark theme optimized for financial data
- Gradient accents and smooth animations
- Fully responsive design
- Custom color palette in `tailwind.config.js`

## API Integration

The frontend communicates with the backend via REST API:

```javascript
import { analyzeStock } from './services/api'

const response = await analyzeStock(query)
```

## Build for Production

```bash
# Build optimized production bundle
npm run build

# Output will be in dist/
# Serve with any static file server
npm run preview
```

## Deployment

The built application can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

Remember to set the `VITE_API_URL` environment variable to your production backend URL.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance

- Code splitting with Vite
- Lazy loading of components
- Optimized asset bundling
- Minimal dependencies
