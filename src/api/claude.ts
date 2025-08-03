/*
ImmersiMoments - AI Parameter Extraction Service
Uses Claude to intelligently parse natural language into structured event parameters
Enhanced with better date parsing, context awareness, and sophisticated parameter extraction
*/

interface ParameterExtractionResult {
  parameters: {
    dateTime?: string;
    headcount?: number;
    eventType?: string;
    location?: string;
    budget?: 'low' | 'medium' | 'high';
    mood?: string;
    mustHaves?: string[];
  };
  followUpQuestion?: string;
  confidence: number;
  reasoning?: string;
}

class ClaudeExtractionService {
  private apiKey: string | null = null;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || null;
  }

  async extractParameters(
    userMessage: string, 
    currentSession: any,
    conversationHistory: string[] = []
  ): Promise<ParameterExtractionResult> {
    
    if (!this.apiKey) {
      throw new Error('Claude API key not provided');
    }

    const systemPrompt = `You are an expert event planning assistant that extracts structured information from natural conversation.

Your job is to analyze user messages and extract these 7 key parameters:
1. dateTime - Convert natural language to specific dates (e.g., "July" → "July 2026", "next month" → "March 2026", "weekend" → "weekend in March 2026", "next week" → "next week", "tomorrow" → "tomorrow")
2. headcount - Number of expected guests/attendees
3. eventType - Type of event (birthday, wedding, hackathon, corporate dinner, conference, party, etc.)
4. location - Geographic preference or venue type (downtown, outdoor, specific city, indoor, etc.)
5. budget - Categorize as 'low', 'medium', or 'high' based on hints
6. mood - Event atmosphere (formal, casual, festive, tech-forward, elegant, relaxed, energetic, etc.)
7. mustHaves - Required amenities/features (DJ, stage, catering, photo booth, etc.)

CURRENT SESSION STATE: ${JSON.stringify(currentSession)}

CONVERSATION HISTORY: ${conversationHistory.join(' | ')}

INSTRUCTIONS:
- Extract ANY parameters you can identify from the user's message
- For dates, be intelligent: "July" means "July 2026", "next month" could be "March 2026", etc.
- Use context from conversation history to improve extraction
- Only ask ONE follow-up question for the most important missing parameter
- If all parameters are extracted, set followUpQuestion to null
- Rate your confidence 0-1 based on how clear the extraction was
- Provide brief reasoning for your extraction decisions

Respond in this EXACT JSON format:
{
  "parameters": {
    "dateTime": "extracted date or null",
    "headcount": extracted_number_or_null,
    "eventType": "extracted type or null", 
    "location": "extracted location or null",
    "budget": "low/medium/high or null",
    "mood": "extracted mood or null",
    "mustHaves": ["array", "of", "requirements"] or null
  },
  "followUpQuestion": "single targeted question or null",
  "confidence": 0.85,
  "reasoning": "brief explanation of extraction decisions"
}`;

    try {
      const response = await fetch('http://localhost:3001/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: this.apiKey,
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `${systemPrompt}\n\nUser message to analyze: "${userMessage}"`
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content[0].text;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        console.error('Error parsing Claude response:', content);
        throw new Error('Invalid response format from Claude');
      }
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw error;
    }
  }

  // Enhanced method for better date parsing
  private parseDateIntelligently(dateString: string): string {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Handle "next month"
    if (dateString.toLowerCase().includes('next month')) {
      const nextMonth = (currentMonth + 1) % 12;
      return `${monthNames[nextMonth]} ${currentYear}`;
    }

    // Handle "last month"
    if (dateString.toLowerCase().includes('last month')) {
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const year = currentMonth === 0 ? currentYear - 1 : currentYear;
      return `${monthNames[lastMonth]} ${year}`;
    }

    // Handle specific months
    for (let i = 0; i < monthNames.length; i++) {
      if (dateString.toLowerCase().includes(monthNames[i].toLowerCase())) {
        return `${monthNames[i]} ${currentYear}`;
      }
    }

    // Handle relative dates
    if (dateString.toLowerCase().includes('next week')) {
      return 'next week';
    }
    if (dateString.toLowerCase().includes('tomorrow')) {
      return 'tomorrow';
    }
    if (dateString.toLowerCase().includes('today')) {
      return 'today';
    }

    return dateString;
  }
}

export default ClaudeExtractionService;