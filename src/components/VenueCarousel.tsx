/*
ImmersiMoments - Phase 2: Venue Recommendations Carousel
Context: Display top 3 venue matches based on extracted parameters
Features: Visual carousel, venue selection, booking integration
*/

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Star, ExternalLink, Sparkles } from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  capacity: number;
  imageUrl: string;
  bookingUrl: string;
  description: string;
  amenities: string[];
  rating: number;
  priceRange: string;
  location: string;
}

interface VenueCarouselProps {
  venues: Venue[];
  onSelect: (venueId: string) => void;
  isGenerating?: boolean;
}

const VenueCarousel: React.FC<VenueCarouselProps> = ({ venues, onSelect, isGenerating = false }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelect = (venueId: string) => {
    if (!isGenerating) {
      onSelect(venueId);
    }
  };

  if (venues.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Searching for perfect venues...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Venue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {venues.map((venue, index) => (
          <Card
            key={venue.id}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-soft cursor-pointer ${
              selectedIndex === index ? 'ring-2 ring-primary shadow-glow' : 'hover:scale-105'
            } ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => {
              setSelectedIndex(index);
              handleSelect(venue.id);
            }}
          >
            {/* Loading Overlay */}
            {isGenerating && selectedIndex === index && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <div className="text-white text-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm">Generating visualization...</p>
                </div>
              </div>
            )}

            {/* Venue Image */}
            <div className="relative aspect-video bg-muted">
              <img
                src={venue.imageUrl}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  ⭐ {venue.rating}
                </Badge>
              </div>
            </div>

            {/* Venue Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{venue.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {venue.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="font-medium">{venue.capacity} people</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{venue.location}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">{venue.priceRange}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {venue.amenities.slice(0, 3).map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                  {venue.amenities.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{venue.amenities.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Select Button */}
              <Button
                className="w-full mt-4 bg-gradient-primary hover:shadow-glow"
                disabled={isGenerating}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(venue.id);
                }}
              >
                {isGenerating && selectedIndex === index ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Select & Visualize
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Selection Info */}
      {venues.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isGenerating 
              ? "🎨 Generating AI visualization with Runware.ai..." 
              : "Click a venue to see it visualized with AI"
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default VenueCarousel;