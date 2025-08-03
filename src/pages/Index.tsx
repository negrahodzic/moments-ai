/*
ImmersiMoments - Main Application Interface
Product: ImmersiMoments - "Imagine your moment — live before you book."
Mission: Empower anyone to co-create unforgettable experiences through seamless, AI-driven conversational design

Phase Implementation:
1. Natural-language parameter extraction (7 parameters)
2. AI-powered venue recommendations (top 3 spaces)
3. Iterative image generation via Runware.ai
4. Short animated walkthrough video generation
5. Voice-narrated tour via ElevenLabs and export bundle
*/

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import ChatAgent from '@/components/ChatAgent';
import VenueCarousel from '@/components/VenueCarousel';
import VisualizationCanvas from '@/components/VisualizationCanvas';
import { listVenues, getVenue, type Venue } from '@/api/venueDb';
import { generateImage, buildVenuePrompt } from '@/api/runware';
import { Sparkles, Calendar, Users, MapPin, Wand2, Video, Download, Play, Brain } from 'lucide-react';
import { toast } from 'sonner';

type AppPhase = 'INTRO' | 'CHAT' | 'VENUES' | 'VISUALIZATION' | 'VIDEO' | 'EXPORT';

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

const Index = () => {
  const [currentPhase, setCurrentPhase] = useState<AppPhase>('INTRO');
  const [sessionState, setSessionState] = useState<SessionState>({
    dateTime: null,
    headcount: null,
    eventType: null,
    location: null,
    budget: null,
    mood: null,
    mustHaves: null
  });
  
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Read Claude API key from environment variable
  const claudeApiKey = import.meta.env.VITE_CLAUDE_API_KEY || '';

  const handleStartPlanning = () => {
    if (!claudeApiKey) {
      toast.error('Claude API key not configured. Please set VITE_CLAUDE_API_KEY environment variable.');
      return;
    }
    setCurrentPhase('CHAT');
    toast.success('Welcome to ImmersiMoments! Let\'s create something amazing together.');
  };

  const handlePhaseChange = async (phase: string) => {
    if (phase === 'PHASE1_COMPLETE') {
      setCurrentPhase('VENUES');
      toast.success('Searching for perfect venues...');
      
      try {
        const foundVenues = await listVenues({
          capacity: sessionState.headcount || undefined,
          style: sessionState.mood || undefined,
          location: sessionState.location || undefined,
          budget: sessionState.budget || undefined,
          eventType: sessionState.eventType || undefined
        });
        setVenues(foundVenues);
      } catch (error) {
        console.error('Error fetching venues:', error);
        toast.error('Unable to fetch venues. Please try again.');
      }
    }
  };

  const handleVenueSelect = async (venueId: string) => {
    try {
      const venue = await getVenue(venueId);
      if (venue) {
        setSelectedVenue(venue);
        setCurrentPhase('VISUALIZATION');
        
        // Generate initial image for the selected venue
        try {
          const { positivePrompt, negativePrompt } = buildVenuePrompt(
            venue.name, 
            sessionState.eventType || 'event', 
            50, 
            sessionState.mood || 'elegant', 
            sessionState.mustHaves || []
          );
          
          const result = await generateImage({
            prompt: positivePrompt,
            negativePrompt: negativePrompt,
            width: 1024,
            height: 768,
            model: 'rundiffusion:130@100',
            steps: 30,
            CFGScale: 8.5,
            scheduler: 'DPM++ 2M Karras'
          });
          
          if (result.imageUrl) {
            setCurrentImageUrl(result.imageUrl);
            toast.success('Initial visualization generated!');
          }
        } catch (error) {
          console.error('Error generating initial image:', error);
          // Fallback to venue image
          setCurrentImageUrl(venue.imageUrl);
          toast.error('Failed to generate visualization. Using venue image.');
        }
      }
    } catch (error) {
      console.error('Error selecting venue:', error);
      toast.error('Unable to select venue. Please try again.');
    }
  };

  const renderPhase = () => {
    switch (currentPhase) {
      case 'INTRO':
        return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
            <div className="text-center max-w-4xl mx-auto px-6">
              {/* Hero Section */}
              <div className="mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-3 rounded-full bg-gradient-primary shadow-glow">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  <span className="bg-gradient-hero bg-clip-text text-transparent">
                    ImmersiMoments
                  </span>
                </h1>
                
                <p className="text-2xl md:text-3xl text-muted-foreground mb-4 font-light">
                  "Imagine your moment — live before you book."
                </p>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                  Co-create unforgettable experiences through AI-driven conversational design.
                  No forms, no guesswork — just pure creative collaboration.
                </p>
                
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={handleStartPlanning}
                  className="mb-12"
                  disabled={!claudeApiKey}
                >
                  <Wand2 className="w-5 h-5 mr-2" />
                  {claudeApiKey ? 'Start Planning Your Event' : 'API Key Required'}
                </Button>
                
                {!claudeApiKey && (
                  <div className="mb-8 p-4 bg-gradient-card rounded-lg border border-border/50">
                    <p className="text-sm text-muted-foreground">
                      <strong>Setup Required:</strong> Set the VITE_CLAUDE_API_KEY environment variable to enable AI-powered planning.
                    </p>
                  </div>
                )}
              </div>

              {/* Feature Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: Calendar, title: 'Natural Conversation', desc: 'Tell us about your event naturally' },
                  { icon: MapPin, title: 'Smart Recommendations', desc: 'AI-curated venue matches' },
                  { icon: Wand2, title: 'Live Visualization', desc: 'See your space come to life' },
                  { icon: Video, title: 'Immersive Preview', desc: 'Walkthrough videos & audio tours' }
                ].map((feature, index) => (
                  <Card key={index} className="p-6 bg-gradient-card hover:shadow-soft transition-spring">
                    <feature.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'CHAT':
        return (
          <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 text-center">
                <Badge variant="outline" className="mb-4">
                  Phase 1: Event Discovery
                </Badge>
                <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Let's Design Your Perfect Event
                </h2>
              </div>
              
              <ChatAgent 
                onPhaseChange={handlePhaseChange}
                onSessionUpdate={setSessionState}
                claudeApiKey={claudeApiKey}
              />
            </div>
          </div>
        );

      case 'VENUES':
        return (
          <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 text-center">
                <Badge variant="outline" className="mb-4">
                  Phase 2: Venue Selection
                </Badge>
                <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Your Curated Venue Matches
                </h2>
              </div>
              
              <VenueCarousel 
                venues={venues}
                onSelect={handleVenueSelect}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        );

      case 'VISUALIZATION':
        return (
          <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 text-center">
                <Badge variant="outline" className="mb-4">
                  Phase 3: AI Visualization
                </Badge>
                <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {selectedVenue?.name} - Your Vision
                </h2>
                <p className="text-muted-foreground mt-2">
                  AI-generated visualization powered by Runware.ai
                </p>
              </div>

              {currentPhase === 'VISUALIZATION' && selectedVenue && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Venue Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Venue Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <Label className="text-sm font-medium">Name</Label>
                            <p className="text-sm text-muted-foreground">{selectedVenue.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Location</Label>
                            <p className="text-sm text-muted-foreground">{selectedVenue.location}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Capacity</Label>
                            <p className="text-sm text-muted-foreground">{selectedVenue.capacity} guests</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Style</Label>
                            <p className="text-sm text-muted-foreground">{selectedVenue.style}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Price</Label>
                            <p className="text-sm text-muted-foreground">{selectedVenue.priceRange}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Venue Amenities */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Venue Amenities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedVenue.amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="text-sm">{amenity}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* AI Generation Status */}
                    <Card>
                      <CardHeader>
                        <CardTitle>AI Generation Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm">Ready for customization</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">Runware AI integration active</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-sm">ElevenLabs audio ready</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Visualization Canvas */}
                  <VisualizationCanvas
                    venueName={selectedVenue.name}
                    eventType={sessionState.eventType || 'event'}
                    mood={sessionState.mood || 'elegant'}
                    mustHaves={sessionState.mustHaves || []}
                    originalVenueImage={selectedVenue.imageUrl}
                    onImageGenerated={(imageUrl) => {
                      console.log('New image generated:', imageUrl);
                    }}
                  />

                  {/* Book This Venue Button */}
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => window.open(selectedVenue.bookingUrl, '_blank')}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Book This Venue
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderPhase();
};

export default Index;