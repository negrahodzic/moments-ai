import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, MapPin, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import ChatAgent from '@/components/ChatAgent';
import { listVenues, getVenue, type Venue } from '@/api/venueDb';

const Engine = () => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'POSTER' | 'DISCOVERY' | 'VENUES' | 'VISUALIZATION'>('POSTER');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(false);
  
  // Read Claude API key from environment variable
  const claudeApiKey = import.meta.env.VITE_CLAUDE_API_KEY || '';

  const handleMomentsClick = () => {
    setCurrentPhase('DISCOVERY');
  };

  const handleBackToPoster = () => {
    setCurrentPhase('POSTER');
  };

  const handlePhaseChange = async (phase: string) => {
    if (phase === 'PHASE1_COMPLETE') {
      // Load venues when transitioning to venue selection
      setIsLoadingVenues(true);
      try {
        const foundVenues = await listVenues();
        setVenues(foundVenues);
      } catch (error) {
        console.error('Error loading venues:', error);
      } finally {
        setIsLoadingVenues(false);
      }
      setCurrentPhase('VENUES');
    }
  };

  const handleVenueSelect = async (venueId: string) => {
    try {
      const venue = await getVenue(venueId);
      if (venue) {
        // Navigate to visualization phase
        setCurrentPhase('VISUALIZATION');
      }
    } catch (error) {
      console.error('Error selecting venue:', error);
    }
  };

  const renderContent = () => {
    switch (currentPhase) {
      case 'POSTER':
        return (
          <>
            {/* Header Overlay */}
            <div className="absolute top-0 left-0 right-0 z-10 p-6">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="text-[#99FF00] font-mono text-2xl font-bold">
                  AI ENGINE
                </div>
                
                {/* Right side with text and button */}
                <div className="flex items-center space-x-6">
                  <div className="text-[#99FF00] font-mono text-lg">
                    Photos From Our Past Events
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleMomentsClick}
                    className="text-[#99FF02] text-lg hover:text-[#99FF02]/80 bg-[#99FF02]/10 hover:bg-[#99FF02]/5 font-mono"
                  >
                    Moments
                  </Button>
                </div>
              </div>
            </div>

            {/* Full Screen Image with Top and Bottom Margin */}
            <div className="w-full h-screen flex items-center justify-center mt-12 pt-20">
              <div className="w-full h-full my-8">
                {!imageError ? (
                  <img 
                    src="/ai-engine-poster.jpg" 
                    alt="AI ENGINE: UK UNIVERSITY HACKATHON" 
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-[#1A0A3D] flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-[#99FF00] text-2xl font-bold mb-4">
                        AI ENGINE: UK UNIVERSITY HACKATHON
                      </p>
                      <p className="text-white text-sm">
                        Please add the promotional poster image as "ai-engine-poster.jpg" in the public directory
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        );

      case 'DISCOVERY':
        return (
          <div className="min-h-screen bg-[#1A0A3D] p-6">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8 text-center">
                <Button
                  variant="ghost"
                  onClick={handleBackToPoster}
                  className="text-[#99FF00] hover:text-[#99FF00]/80 hover:bg-[#99FF00]/10 mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to AI Engine
                </Button>
                <Badge variant="outline" className="mb-4 border-[#99FF00] text-[#99FF00]">
                  Phase 1: Event Discovery
                </Badge>
                <h2 className="text-3xl font-bold text-[#99FF00]">
                  Let's Design Your Perfect Event
                </h2>
              </div>
              
              <ChatAgent 
                onPhaseChange={handlePhaseChange}
                onSessionUpdate={() => {}}
                claudeApiKey={claudeApiKey}
                colorScheme="ai-engine"
              />
            </div>
          </div>
        );

      case 'VENUES':
        return (
          <div className="min-h-screen bg-[#1A0A3D] p-6">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-8 text-center">
                <Button
                  variant="ghost"
                  onClick={handleBackToPoster}
                  className="text-[#99FF00] hover:text-[#99FF00]/80 hover:bg-[#99FF00]/10 mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to AI Engine
                </Button>
                <Badge variant="outline" className="mb-4 border-[#99FF00] text-[#99FF00]">
                  Phase 2: Venue Selection
                </Badge>
                <h2 className="text-3xl font-bold text-[#99FF00]">
                  Choose Your Perfect Venue
                </h2>
                <p className="text-white/80 mt-2">
                  Here are the venues that match your requirements
                </p>
              </div>
              
              {/* Loading State */}
              {isLoadingVenues && (
                <div className="flex justify-center items-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#99FF00] mx-auto mb-4"></div>
                    <p className="text-[#99FF00] text-lg">Loading venues...</p>
                  </div>
                </div>
              )}
              
              {/* Venue Options */}
              {!isLoadingVenues && venues.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {venues.map((venue) => (
                    <div key={venue.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={venue.imageUrl} 
                          alt={venue.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-800">{venue.name}</h3>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">{venue.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{venue.location}</span>
                        </div>
                        
                        <div className="flex items-center text-gray-600 mb-3">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="text-sm">{venue.capacity} guests</span>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-4 line-clamp-3">
                          {venue.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {venue.amenities.slice(0, 3).map((amenity, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                            >
                              {amenity}
                            </span>
                          ))}
                          {venue.amenities.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              +{venue.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-semibold text-gray-800">{venue.priceRange}</span>
                          <div className="flex gap-1">
                            {venue.style.slice(0, 2).map((style, index) => (
                              <span 
                                key={index} 
                                className="px-2 py-1 bg-[#99FF00]/10 text-[#1A0A3D] text-xs rounded font-medium"
                              >
                                {style}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleVenueSelect(venue.id)}
                            className="flex-1 bg-[#99FF00] hover:bg-[#99FF00]/80 text-[#1A0A3D] font-semibold"
                          >
                            Select Venue
                          </Button>
                          <Button 
                            variant="outline" 
                            className="border-gray-300 text-gray-600 hover:border-[#99FF00]"
                            onClick={() => window.open(venue.bookingUrl, '_blank')}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* No Venues State */}
              {!isLoadingVenues && venues.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-white/60 text-lg">No venues found. Please try adjusting your requirements.</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1A0B3C] relative">
      {renderContent()}
    </div>
  );
};

export default Engine; 