# ImmersiMoments

**"Imagine your moment — live before you book."**

## Project Summary

**Mission:**  
Empower anyone to co-create unforgettable experiences through seamless, AI-driven conversational design—no forms, no guesswork.

**Vision:**  
To redefine how events are planned by making every step an intuitive, collaborative, and visually rich dialogue between human creativity and multimodal AI.

## Core Features

### Phase 1: Natural-Language Parameter Extraction
- Conversational AI interface that extracts event essentials through natural dialogue
- Captures: date/time, guest count, event type, location, budget, mood, must-haves
- No visible forms - just intuitive conversation
- **AI-Powered Intelligence:** Uses Claude to intelligently parse natural language into structured data

### Phase 2: AI-Powered Venue Recommendations  
- Visual carousel showcasing top 3 venue matches
- Smart filtering based on extracted parameters
- Interactive venue selection interface

### Phase 3: Iterative Image Generation
- Real-time venue visualization using **Runware.ai**
- Conversational image editing ("add fairy lights", "make it more formal")
- Visual iteration history and comparison tools

### Phase 4: Animated Walkthrough Videos
- Short video generation via **Runware.ai** 
- Multi-stage venue tour (arrival, networking, finale)
- Cinematic preview of the complete event experience

### Phase 5: Voice-Narrated Export Bundle
- Optional audio tour via **ElevenLabs** text-to-speech
- Complete media package download (images, video, audio)
- Direct booking links and venue contact information

## API Integrations

- **Claude (Anthropic)** - Intelligent natural language parameter extraction
- **Memories.ai** - Semantic tagging of user-uploaded media
- **Runware.ai** - Image and video generation for venue visualization
- **VenueDB** - Venue listing and booking management
- **ElevenLabs** - High-quality voice narration with SSML support

## Judging Criteria Alignment

**Future Potential:** Modular architecture designed for seamless integration of new AI services and event planning tools.

**Demo Quality:** Fully functional conversational flow demonstrated through "Zoe's Hackathon" example scenario.

**Creativity:** Revolutionary approach eliminating traditional forms in favor of natural language interaction with intelligent AI nudges.

**Pitch Quality:** Clear documentation, live demo capabilities, and comprehensive feature showcase.

## Technology Stack

- **Frontend:** React + Vite + TypeScript
- **Styling:** Tailwind CSS with custom design system
- **UI Components:** Shadcn/ui with premium customizations
- **State Management:** React hooks and context
- **Animations:** Framer Motion for smooth transitions
- **AI Integration:** Claude 3.5 Sonnet for intelligent parameter extraction

## Setup & Installation

### Prerequisites
- Node.js 18+ 
- API keys for the following services:
  - **Claude** (Required): [console.anthropic.com](https://console.anthropic.com/)
  - **ElevenLabs** (Optional): [elevenlabs.io](https://elevenlabs.io/)
  - **Runware** (Optional): [runware.ai](https://runware.ai/)
  - **Memories AI** (Optional): [memories.ai](https://memories.ai/)

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd immersi-moments-ai-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```
   VITE_CLAUDE_API_KEY=sk-ant-your-actual-api-key-here
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   VITE_RUNWARE_API_KEY=your_runware_api_key_here
   VITE_MEMORIES_API_KEY=your_memories_api_key_here
   ```

4. **Start the development servers:**
   ```bash
   npm run dev:full
   ```
   
   This starts both:
   - Backend server on `http://localhost:3001` (API proxy)
   - Frontend server on `http://localhost:8080` (React app)

5. **Visit the application:**
   Open `http://localhost:8080` in your browser

### Development Commands

```bash
# Run both frontend and backend
npm run dev:full

# Run only the frontend (with mock APIs)
npm run dev

# Run only the backend server
npm run server

# Build for production
npm run build
```

## Example Scenario: Zoe's Hackathon

**User:** "I'm organizing a hackathon next month, need a cool space for about 50 people."

**ImmersiMoments Flow:**
1. **Extract Parameters** - AI naturally discovers date, budget, mood, must-haves
2. **Recommend Venues** - Shows 3 tech-forward spaces with maker amenities  
3. **Visualize Setup** - Generates images of the venue with stage, networking areas
4. **Refine Vision** - "Add more whiteboards", "Make the lighting more energetic"
5. **Create Walkthrough** - Animated tour showing arrival through closing ceremony
6. **Export Package** - Complete bundle ready for team review and booking

## AI-Powered Features

### Smart Parameter Extraction
- **Date Parsing:** "July" → "July 2026", "next month" → "March 2026"
- **Natural Language:** Understands conversational context and intent
- **Intelligent Follow-ups:** Asks targeted questions based on missing information
- **Real-time Analysis:** Processes each message with Claude AI for optimal extraction

### Example Conversations
```
"I'm organizing a hackathon next month for 50 people"
→ Extracts: eventType: "hackathon", headcount: 50, dateTime: "next month"

"Wedding in July, about 100 guests, formal mood"
→ Extracts: eventType: "wedding", headcount: 100, dateTime: "July 2026", mood: "formal"

"Birthday party next weekend, maybe 30 friends"
→ Extracts: eventType: "birthday party", headcount: 30, dateTime: "next weekend"
```

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:8080` to experience ImmersiMoments.

---

*Built for the future of event planning - where imagination meets reality through AI.*