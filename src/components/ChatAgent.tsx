/*
ImmersiMoments - Phase 1: Natural-Language Parameter Extraction
Context: Extract seven essential event parameters purely through conversation:
1. dateTime (e.g. "Saturday, 12 March 2026 at 6 PM")
2. headcount (approximate number of guests)
3. eventType (birthday, hackathon, wedding, corporate dinner, etc.)
4. location (city or indoor/outdoor preference)
5. budget (high, medium, low)
6. mood (formal, casual, festive, cinematic, tech-forward)
7. mustHaves (DJ, florist, photo booth, panel stage, etc.)
*/

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Sparkles, Calendar, Users, MapPin, DollarSign, Palette, Star, Check, Loader2 } from 'lucide-react';
import ClaudeExtractionService from '@/api/claude';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface SessionState {
  dateTime: string | null;
  headcount: number | null;
  eventType: string | null;
  location: string | null;
  budget: string | null;
  mood: string | null;
  mustHaves: string[] | null;
  selectedVenue?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  parameters?: Partial<SessionState>;
  reasoning?: string;
  confidence?: number;
  venues?: any[]; // Changed from Venue[] to any[] as Venue type is removed
}

interface ChatAgentProps {
  onPhaseChange?: (phase: string) => void;
  onSessionUpdate?: (session: SessionState) => void;
  claudeApiKey?: string;
  colorScheme?: 'default' | 'ai-engine';
}

// Color scheme configurations
const colorSchemes = {
  default: {
    background: 'bg-gradient-to-br from-background to-secondary/20',
    card: 'bg-gradient-card',
    primary: 'bg-primary',
    primaryText: 'text-primary-foreground',
    secondary: 'bg-muted',
    secondaryText: 'text-muted-foreground',
    userMessage: 'bg-gradient-primary text-primary-foreground',
    aiMessage: 'bg-gradient-card',
    input: 'bg-gradient-card',
    sendButton: 'bg-gradient-primary hover:shadow-glow',
    parameterSelected: 'bg-primary text-primary-foreground shadow-glow',
    parameterUnselected: 'bg-muted text-muted-foreground',
    badge: 'border-border text-muted-foreground',
    typing: 'bg-primary',
    title: 'text-muted-foreground',
    reasoning: 'text-muted-foreground'
  },
  'ai-engine': {
    background: 'bg-[#1A0A3D]',
    card: 'bg-white',
    primary: 'bg-[#1A0A3D]',
    primaryText: 'text-white',
    secondary: 'bg-gray-200',
    secondaryText: 'text-gray-600',
    userMessage: 'bg-[#1A0A3D] text-white',
    aiMessage: 'bg-white text-gray-700',
    input: 'bg-white',
    sendButton: 'bg-[#99FF00] hover:bg-[#99FF00]/80 text-[#1A0A3D]',
    parameterSelected: 'bg-[#1A0A3D] text-white',
    parameterUnselected: 'bg-gray-200 text-gray-600',
    badge: 'border-gray-300 text-gray-600',
    typing: 'bg-[#99FF00]',
    title: 'text-gray-700',
    reasoning: 'text-gray-300'
  }
};

// Mock LLM function that simulates parameter extraction
const mockLLMCall = async (message: string, currentSession: SessionState) => {
  // Simple pattern matching for demo - in real app would use actual LLM
  const response: { content: string; extractedParams: Partial<SessionState> } = {
    content: '',
    extractedParams: {}
  };

  const lowerMessage = message.toLowerCase();

  // Extract parameters using basic pattern matching
  if (lowerMessage.includes('hackathon')) {
    response.extractedParams.eventType = 'hackathon';
    response.extractedParams.mood = 'tech-forward';
  }
  if (lowerMessage.includes('wedding')) {
    response.extractedParams.eventType = 'wedding';
    response.extractedParams.mood = 'formal';
  }
  if (lowerMessage.includes('birthday')) {
    response.extractedParams.eventType = 'birthday party';
    response.extractedParams.mood = 'festive';
  }

  // Extract headcount
  const headcountMatch = lowerMessage.match(/(\d+)\s+(people|guests|attendees)/);
  if (headcountMatch) {
    response.extractedParams.headcount = parseInt(headcountMatch[1]);
  }

  // Extract budget hints
  if (lowerMessage.includes('budget') || lowerMessage.includes('expensive') || lowerMessage.includes('cheap')) {
    if (lowerMessage.includes('high') || lowerMessage.includes('expensive') || lowerMessage.includes('premium')) {
      response.extractedParams.budget = 'high';
    } else if (lowerMessage.includes('low') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
      response.extractedParams.budget = 'low';
    } else {
      response.extractedParams.budget = 'medium';
    }
  }

  // Extract location
  if (lowerMessage.includes('downtown') || lowerMessage.includes('city') || lowerMessage.includes('urban')) {
    response.extractedParams.location = 'downtown';
  }
  if (lowerMessage.includes('outdoor') || lowerMessage.includes('garden') || lowerMessage.includes('park')) {
    response.extractedParams.location = 'outdoor';
  }

  // Extract must-haves
  const mustHaves = [];
  if (lowerMessage.includes('dj') || lowerMessage.includes('music')) mustHaves.push('DJ');
  if (lowerMessage.includes('stage') || lowerMessage.includes('presentation')) mustHaves.push('Stage');
  if (lowerMessage.includes('catering') || lowerMessage.includes('food')) mustHaves.push('Catering');
  if (lowerMessage.includes('photo') || lowerMessage.includes('booth')) mustHaves.push('Photo Booth');
  if (lowerMessage.includes('lighting')) mustHaves.push('Professional Lighting');
  if (mustHaves.length > 0) {
    response.extractedParams.mustHaves = mustHaves;
  }

  // Extract date/time hints
  if (lowerMessage.includes('next month') || lowerMessage.includes('march') || lowerMessage.includes('weekend')) {
    response.extractedParams.dateTime = 'Next month (March 2026)';
  }

  return response;
};

const ChatAgent: React.FC<ChatAgentProps> = ({ onPhaseChange, onSessionUpdate, claudeApiKey, colorScheme = 'default' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm here to help you create an unforgettable event. Tell me about what you're planning! ✨",
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [sessionState, setSessionState] = useState<SessionState>({
    dateTime: null,
    headcount: null,
    eventType: null,
    location: null,
    budget: null,
    mood: null,
    mustHaves: null
  });
  
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingVenues, setIsLoadingVenues] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  // Development mode detection
  const isDevelopment = import.meta.env.DEV;

  const colors = colorSchemes[colorScheme];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    onSessionUpdate?.(sessionState);
  }, [sessionState, onSessionUpdate]);

  const getNextQuestion = (session: SessionState): string => {
    if (!session.dateTime) return "When are you planning this event?";
    if (!session.headcount) return "How many people will be attending?";
    if (!session.eventType) return "What type of event is this?";
    if (!session.location) return "Do you have a location preference - downtown, outdoor, or somewhere specific?";
    if (!session.budget) return "What budget range are you working with - high, medium, or low?";
    if (!session.mood) return "What mood or style are you aiming for?";
    if (!session.mustHaves) return "Are there any must-haves for your event - like a stage, DJ, catering, or special lighting?";
    return "";
  };

  const isSessionComplete = (session: SessionState): boolean => {
    return !!(session.dateTime && session.headcount && session.eventType && 
              session.location && session.budget && session.mood && session.mustHaves);
  };

  const handleVenueSelect = async (venueId: string) => {
    try {
      // Removed venue-related imports, so this function is now a placeholder
      // In a real application, you would fetch venue details here
      toast.info('Venue selection is not yet implemented in this version.');
      // For now, just update the session state
      setSessionState(prev => ({ ...prev, selectedVenue: venueId }));
      
      const venueMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Perfect! I've selected "${venueId}" for your event. This venue has a capacity of 100 guests and is located in downtown. The style is elegant and fits your high budget range.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, venueMessage]);
      
      // Navigate to next phase (venue selection page)
      setTimeout(() => {
        onPhaseChange?.('PHASE1_COMPLETE');
      }, 2000);
    } catch (error) {
      console.error('Error selecting venue:', error);
      toast.error('Unable to select venue. Please try again.');
    }
  };

  const handleUserMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    // Update conversation history
    setConversationHistory(prev => [...prev, inputValue]);

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      let extractionResult;
      
      if (claudeApiKey) {
        // Use Claude for intelligent extraction
        const claudeService = new ClaudeExtractionService(claudeApiKey);
        extractionResult = await claudeService.extractParameters(
          inputValue, 
          sessionState, 
          conversationHistory
        );
        
        // Update session state with extracted parameters
        const updatedSession = { ...sessionState };
        Object.entries(extractionResult.parameters).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            (updatedSession as any)[key] = value;
          }
        });
        setSessionState(updatedSession);

        let aiResponse = "";
        
        if (isSessionComplete(updatedSession)) {
          aiResponse = "Perfect! I've got all the details. Let me find some amazing spaces for you. ✨";
          
          // Show loading message
          const loadingMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
            parameters: extractionResult.parameters
          };
          
          setMessages(prev => [...prev, loadingMessage]);
          
          // Navigate to venue selection page
          setTimeout(() => {
            onPhaseChange?.('PHASE1_COMPLETE');
          }, 2000);
          
        } else if (extractionResult.followUpQuestion) {
          aiResponse = extractionResult.followUpQuestion;
        } else {
          const nextQuestion = getNextQuestion(updatedSession);
          aiResponse = nextQuestion;
        }

        if (!isSessionComplete(updatedSession)) {
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
            parameters: extractionResult.parameters,
            reasoning: extractionResult.reasoning,
            confidence: extractionResult.confidence
          };

          setMessages(prev => [...prev, assistantMessage]);
        }
        
      } else {
        // Fallback to mock implementation
        const response = await mockLLMCall(inputValue, sessionState);
        
        const updatedSession = { ...sessionState, ...response.extractedParams };
        setSessionState(updatedSession);

        let aiResponse = "";
        
        if (isSessionComplete(updatedSession)) {
          aiResponse = "Perfect! I've got all the details. Let me find some amazing spaces for you. ✨";
          
          // Show loading message
          const loadingMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
            parameters: response.extractedParams
          };
          
          setMessages(prev => [...prev, loadingMessage]);
          
          // Navigate to venue selection page
          setTimeout(() => {
            onPhaseChange?.('PHASE1_COMPLETE');
          }, 2000);
          
        } else {
          const nextQuestion = getNextQuestion(updatedSession);
          aiResponse = nextQuestion;
        }

        if (!isSessionComplete(updatedSession)) {
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
            parameters: response.extractedParams
          };

          setMessages(prev => [...prev, assistantMessage]);
        }
      }
    } catch (error) {
      console.error('Error processing message:', error);
      toast.error('Unable to process your message. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleUserMessage();
    }
    
    // Development keyboard shortcuts
    if (isDevelopment) {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case '1':
            e.preventDefault();
            setInputValue("I'm organizing a hackathon next month for 50 people");
            break;
          case '2':
            e.preventDefault();
            setInputValue("Wedding in July, about 100 guests, formal mood");
            break;
          case '3':
            e.preventDefault();
            setInputValue("Birthday party next weekend, maybe 30 friends");
            break;
          case '4':
            e.preventDefault();
            setInputValue("Corporate dinner downtown, high budget, elegant");
            break;
          case '0':
            e.preventDefault();
            onPhaseChange?.('PHASE1_COMPLETE');
            toast.success('Phase 1 completed!');
            break;
        }
      }
    }
  };

  const getParameterIcon = (param: string) => {
    switch (param) {
      case 'dateTime': return <Calendar className="w-4 h-4" />;
      case 'headcount': return <Users className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      case 'budget': return <DollarSign className="w-4 h-4" />;
      case 'mood': return <Palette className="w-4 h-4" />;
      case 'mustHaves': return <Star className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const renderParameterDisplay = () => {
    const extractedParams = Object.entries(sessionState).filter(([key, value]) => 
      value !== null && value !== undefined && key !== 'selectedVenue'
    );

    if (extractedParams.length === 0) return null;

    // For AI Engine scheme, don't show the parameter display
    if (colorScheme === 'ai-engine') return null;

    return (
      <div className={`mb-4 p-4 ${colors.card} rounded-lg border border-border/50`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className={`text-sm font-semibold ${colors.title}`}>AI Extracted Parameters</h4>
          <Badge variant="outline" className={`text-xs ${colors.badge}`}>
            {extractedParams.length}/7 Complete
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {extractedParams.map(([key, value]) => (
            <div key={key} className={`flex items-center space-x-2 p-2 bg-background/50 rounded text-xs`}>
              {getParameterIcon(key)}
              <div>
                <div className="font-medium capitalize">{key}</div>
                <div className="text-muted-foreground truncate">
                  {Array.isArray(value) ? value.join(', ') : String(value)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const suggestedTweaks = [
    "Add fairy lights around the columns",
    "Make the lighting more energetic",
    "Add more whiteboards for collaboration",
    "Include a photo booth area",
    "Add a DJ setup in the corner",
    "Make the decor more formal",
    "Add floral arrangements",
    "Include a stage for presentations"
  ];

  // Development hints for easier testing
  const devHints = [
    "💡 Try: 'I'm organizing a hackathon next month for 50 people'",
    "💡 Try: 'Wedding in July, about 100 guests, formal mood'",
    "💡 Try: 'Birthday party next weekend, maybe 30 friends'",
    "💡 Try: 'Corporate dinner downtown, high budget, elegant'",
    "💡 Try: 'Team building event, 25 people, casual atmosphere'",
    "💡 Try: 'Product launch, 80 attendees, tech-forward mood'"
  ];

  const getRandomHint = () => {
    return devHints[Math.floor(Math.random() * devHints.length)];
  };

  return (
    <div className="flex flex-col h-screen min-h-screen max-w-4xl mx-auto">
      {/* Fixed Top Section - Session Progress Indicator */}
      <div className={`${colors.card} p-4 rounded-lg shadow-soft mb-4 flex-shrink-0`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-wrap gap-2">
            {Object.entries(sessionState).map(([key, value]) => (
              <div
                key={key}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-smooth ${
                  value 
                    ? `${colors.parameterSelected}` 
                    : `${colors.parameterUnselected}`
                }`}
              >
                {getParameterIcon(key)}
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                {value && <span className="text-xs opacity-80">✓</span>}
              </div>
            ))}
          </div>
          
          {/* Development Debug Toggle - only show for default scheme */}
          {isDevelopment && colorScheme === 'default' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDebugInfo(!showDebugInfo)}
              className="text-xs"
            >
              {showDebugInfo ? '🔽' : '🔼'} Debug
            </Button>
          )}
        </div>

        {/* Debug Information - only show for default scheme */}
        {isDevelopment && showDebugInfo && colorScheme === 'default' && (
          <div className="mt-3 p-3 bg-background/50 rounded border border-border/50">
            <h4 className="text-xs font-semibold mb-2">🔧 Debug Info</h4>
            <div className="text-xs space-y-1">
              <div><strong>Claude API:</strong> {claudeApiKey ? '✅ Connected' : '❌ Missing'}</div>
              <div><strong>Session State:</strong> {JSON.stringify(sessionState, null, 2)}</div>
              <div><strong>Messages:</strong> {messages.length}</div>
              <div><strong>Conversation History:</strong> {conversationHistory.length} entries</div>
            </div>
            
            {/* Development Shortcuts */}
            <div className="mt-3 pt-3 border-t border-border/30">
              <h5 className="text-xs font-semibold mb-2">⚡ Dev Shortcuts</h5>
              <div className="flex flex-wrap gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const mockSession = {
                      dateTime: 'March 15, 2026',
                      headcount: 50,
                      eventType: 'hackathon',
                      location: 'downtown',
                      budget: 'medium',
                      mood: 'tech-forward',
                      mustHaves: ['whiteboards', 'high-speed wifi']
                    };
                    setSessionState(mockSession);
                    toast.success('Mock session loaded!');
                  }}
                  className="text-xs h-6"
                >
                  Load Mock
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSessionState({
                      dateTime: null,
                      headcount: null,
                      eventType: null,
                      location: null,
                      budget: null,
                      mood: null,
                      mustHaves: null
                    });
                    setMessages([]);
                    toast.success('Session cleared!');
                  }}
                  className="text-xs h-6"
                >
                  Clear All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onPhaseChange?.('PHASE1_COMPLETE');
                    toast.success('Phase 1 completed!');
                  }}
                  className="text-xs h-6"
                >
                  Skip to Venues
                </Button>
              </div>
              
              {/* Keyboard Shortcuts Help */}
              <div className="mt-3 pt-3 border-t border-border/30">
                <h6 className="text-xs font-semibold mb-2">⌨️ Keyboard Shortcuts</h6>
                <div className="text-xs space-y-1">
                  <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+1</kbd> Hackathon example</div>
                  <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+2</kbd> Wedding example</div>
                  <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+3</kbd> Birthday example</div>
                  <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+4</kbd> Corporate example</div>
                  <div><kbd className="px-1 py-0.5 bg-muted rounded text-xs">Ctrl+0</kbd> Skip to venues</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Parameter Extraction Display */}
      {renderParameterDisplay()}

      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 min-h-0 max-h-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] p-4 transition-spring hover:shadow-soft ${
              message.role === 'user'
                ? `${colors.userMessage}`
                : `${colors.aiMessage}`
            }`}>
              <p className="text-sm leading-relaxed">{message.content}</p>
              
              {/* Venue options */}
              {/* Removed venue-related code */}
              
              {/* Remove parameter display and reasoning for AI Engine scheme */}
              {colorScheme === 'default' && message.parameters && Object.keys(message.parameters).length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/20">
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(message.parameters).map(([key, value]) => (
                      <span key={key} className="text-xs bg-white/20 px-2 py-1 rounded">
                        {key}: {Array.isArray(value) ? value.join(', ') : String(value)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {colorScheme === 'default' && message.reasoning && (
                <div className="mt-2 pt-2 border-t border-white/20">
                  <div className={`text-xs ${colors.reasoning}`}>
                    <strong>AI Reasoning:</strong> {message.reasoning}
                  </div>
                  {message.confidence && (
                    <div className={`text-xs ${colors.reasoning} mt-1`}>
                      <strong>Confidence:</strong> {Math.round(message.confidence * 100)}%
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <Card className={`${colors.card} p-4`}>
              <div className="flex space-x-1">
                <div className={`w-2 h-2 ${colors.typing} rounded-full animate-bounce`}></div>
                <div className={`w-2 h-2 ${colors.typing} rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
                <div className={`w-2 h-2 ${colors.typing} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
              </div>
            </Card>
          </div>
        )}
        
        {isLoadingVenues && (
          <div className="flex justify-start">
            <Card className={`${colors.card} p-4`}>
              <div className="flex items-center space-x-2">
                <Loader2 className={`w-4 h-4 ${colors.typing} animate-spin`} />
                <span className="text-sm">Finding perfect venues for you...</span>
              </div>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input at Bottom */}
      <div className={`p-4 ${colors.input} rounded-lg shadow-soft flex-shrink-0 sticky bottom-0`}>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your event idea..."
            className="flex-1 transition-smooth focus:shadow-glow"
          />
          <Button 
            onClick={handleUserMessage}
            disabled={!inputValue.trim() || isTyping || isLoadingVenues}
            className={`${colors.sendButton} transition-spring`}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Development Hints - only show for default scheme */}
        {messages.length === 0 && colorScheme === 'default' && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium">🧪 Development Hints</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInputValue(getRandomHint().replace('💡 Try: ', ''))}
                className="text-xs h-6 px-2"
              >
                Random Hint
              </Button>
            </div>
            
            <div className="space-y-2">
              {devHints.map((hint, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(hint.replace('💡 Try: ', ''))}
                  className="text-xs bg-background/50 hover:bg-background px-3 py-1 rounded-full transition-smooth w-full text-left"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Example Prompts - only show for default scheme */}
        {messages.length === 0 && colorScheme === 'default' && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Quick Examples:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "I'm organizing a hackathon next month for 50 people",
                "Wedding in July, about 100 guests, formal mood",
                "Birthday party next weekend, maybe 30 friends",
                "Corporate dinner downtown, high budget, elegant"
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(example)}
                  className="text-xs bg-background/50 hover:bg-background px-3 py-1 rounded-full transition-smooth"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Parameter Status - only show for default scheme */}
        {messages.length > 0 && colorScheme === 'default' && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium">📊 Parameter Status</p>
              <Badge variant="outline" className="text-xs">
                {Object.values(sessionState).filter(v => v !== null && v !== undefined).length}/7
              </Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
              {Object.entries(sessionState).map(([key, value]) => (
                <div key={key} className="flex items-center gap-1 text-xs">
                  <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Simple suggestion hints for AI Engine scheme */}
        {messages.length === 0 && colorScheme === 'ai-engine' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "I'm organizing a hackathon next month for 50 people",
                "Wedding in July, about 100 guests, formal mood",
                "Birthday party next weekend, maybe 30 friends",
                "Corporate dinner downtown, high budget, elegant"
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(example)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors text-gray-700"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatAgent;