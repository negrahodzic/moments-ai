/*
ImmersiMoments - VenueDB API Client
Mock venue database with realistic data for event planning
*/

export interface Venue {
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
  style: string[];
  availableDates: string[];
}

// Mock venue data - in production would come from real API
const mockVenues: Venue[] = [
  // Tech & Innovation Venues
  {
    id: 'tech-hub-1',
    name: 'Innovation Loft',
    capacity: 75,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/innovation-loft',
    description: 'Modern tech space with exposed brick, industrial lighting, and state-of-the-art AV equipment perfect for hackathons and tech events.',
    amenities: ['High-speed WiFi', 'Stage & AV', 'Whiteboards', 'Kitchen', 'Parking'],
    rating: 4.8,
    priceRange: '$2,500 - $4,000',
    location: 'Downtown Tech District',
    style: ['tech-forward', 'industrial', 'modern'],
    availableDates: ['2026-03-15', '2026-03-22', '2026-03-29']
  },
  {
    id: 'maker-space-1',
    name: 'The Collective Workspace',
    capacity: 60,
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/collective-workspace',
    description: 'Collaborative maker space with flexible layouts, 3D printers, and presentation areas. Ideal for creative tech gatherings.',
    amenities: ['3D Printers', 'Flexible Seating', 'Project Space', 'Cafe', 'Rooftop Access'],
    rating: 4.6,
    priceRange: '$1,800 - $3,200',
    location: 'Arts District',
    style: ['creative', 'tech-forward', 'collaborative'],
    availableDates: ['2026-03-16', '2026-03-23', '2026-03-30']
  },
  {
    id: 'startup-hub-1',
    name: 'Venture Hall',
    capacity: 80,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/venture-hall',
    description: 'Premium startup venue with glass conference rooms, demo stage, and networking lounges. Perfect for pitch competitions.',
    amenities: ['Demo Stage', 'Glass Rooms', 'Networking Lounge', 'Catering Kitchen', 'Valet'],
    rating: 4.9,
    priceRange: '$3,500 - $5,500',
    location: 'Financial District',
    style: ['professional', 'tech-forward', 'premium'],
    availableDates: ['2026-03-14', '2026-03-21', '2026-03-28']
  },
  {
    id: 'coworking-1',
    name: 'Spark Innovation Center',
    capacity: 45,
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/spark-innovation',
    description: 'Modern coworking space with meeting rooms, event space, and networking areas. Perfect for small tech meetups.',
    amenities: ['Meeting Rooms', 'Event Space', 'High-speed WiFi', 'Coffee Bar', 'Parking'],
    rating: 4.4,
    priceRange: '$1,200 - $2,500',
    location: 'Midtown',
    style: ['tech-forward', 'modern', 'professional'],
    availableDates: ['2026-03-17', '2026-03-24', '2026-03-31']
  },

  // Wedding & Elegant Venues
  {
    id: 'ballroom-1',
    name: 'Grand Metropolitan Ballroom',
    capacity: 200,
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/grand-ballroom',
    description: 'Classic elegance with crystal chandeliers, marble floors, and panoramic city views. Perfect for formal celebrations.',
    amenities: ['Crystal Chandeliers', 'City Views', 'Full Service Bar', 'Valet Parking', 'Bridal Suite'],
    rating: 4.9,
    priceRange: '$5,000 - $8,000',
    location: 'Downtown Historic',
    style: ['formal', 'elegant', 'classic'],
    availableDates: ['2026-03-20', '2026-03-27', '2026-04-03']
  },
  {
    id: 'garden-venue-1',
    name: 'Botanical Event Garden',
    capacity: 120,
    imageUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/botanical-garden',
    description: 'Stunning outdoor botanical garden with covered pavilions, perfect for elegant celebrations and corporate retreats.',
    amenities: ['Garden Setting', 'Covered Pavilion', 'Catering Kitchen', 'Photography Areas', 'Parking'],
    rating: 4.7,
    priceRange: '$2,000 - $4,500',
    location: 'Garden District',
    style: ['outdoor', 'elegant', 'natural'],
    availableDates: ['2026-03-15', '2026-03-22', '2026-03-29']
  },
  {
    id: 'historic-mansion-1',
    name: 'Riverside Manor',
    capacity: 150,
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/riverside-manor',
    description: 'Historic mansion with period architecture, manicured gardens, and river views. Ideal for sophisticated weddings.',
    amenities: ['Historic Architecture', 'River Views', 'Garden Ceremony', 'Full Catering', 'Bridal Suite'],
    rating: 4.8,
    priceRange: '$4,500 - $7,500',
    location: 'Riverside Historic',
    style: ['elegant', 'historic', 'formal'],
    availableDates: ['2026-03-18', '2026-03-25', '2026-04-01']
  },
  {
    id: 'rooftop-venue-1',
    name: 'Skyline Rooftop',
    capacity: 80,
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/skyline-rooftop',
    description: 'Exclusive rooftop venue with panoramic city views, perfect for intimate weddings and corporate events.',
    amenities: ['City Views', 'Rooftop Setting', 'Full Bar', 'Catering', 'Valet'],
    rating: 4.6,
    priceRange: '$3,500 - $6,000',
    location: 'Downtown',
    style: ['elegant', 'modern', 'premium'],
    availableDates: ['2026-03-19', '2026-03-26', '2026-04-02']
  },

  // Creative & Industrial Venues
  {
    id: 'warehouse-1',
    name: 'Urban Warehouse Collective',
    capacity: 150,
    imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/warehouse-collective',
    description: 'Raw industrial space with soaring ceilings, perfect for creative events, art shows, and unique celebrations.',
    amenities: ['High Ceilings', 'Loading Dock', 'Flexible Space', 'Lighting Rigs', 'Sound System'],
    rating: 4.5,
    priceRange: '$1,500 - $3,500',
    location: 'Industrial District',
    style: ['industrial', 'creative', 'flexible'],
    availableDates: ['2026-03-16', '2026-03-23', '2026-03-30']
  },
  {
    id: 'art-gallery-1',
    name: 'Contemporary Art Space',
    capacity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/contemporary-art',
    description: 'Modern art gallery with white walls, track lighting, and rotating exhibitions. Perfect for creative events.',
    amenities: ['Art Exhibitions', 'Track Lighting', 'Flexible Layout', 'Catering', 'Parking'],
    rating: 4.4,
    priceRange: '$2,000 - $4,000',
    location: 'Arts District',
    style: ['creative', 'modern', 'artistic'],
    availableDates: ['2026-03-17', '2026-03-24', '2026-03-31']
  },
  {
    id: 'brewery-1',
    name: 'Craft Brewery & Events',
    capacity: 120,
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/craft-brewery',
    description: 'Industrial brewery with exposed tanks, rustic charm, and craft beer. Great for casual celebrations.',
    amenities: ['Craft Beer', 'Industrial Setting', 'Outdoor Patio', 'Food Trucks', 'Parking'],
    rating: 4.3,
    priceRange: '$1,800 - $3,200',
    location: 'Brewery District',
    style: ['casual', 'industrial', 'festive'],
    availableDates: ['2026-03-18', '2026-03-25', '2026-04-01']
  },

  // Corporate & Professional Venues
  {
    id: 'conference-center-1',
    name: 'Business Innovation Center',
    capacity: 200,
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/business-innovation',
    description: 'State-of-the-art conference center with multiple meeting rooms, auditorium, and business amenities.',
    amenities: ['Conference Rooms', 'Auditorium', 'AV Equipment', 'Catering', 'Business Center'],
    rating: 4.7,
    priceRange: '$3,000 - $6,000',
    location: 'Business District',
    style: ['professional', 'modern', 'corporate'],
    availableDates: ['2026-03-20', '2026-03-27', '2026-04-03']
  },
  {
    id: 'hotel-ballroom-1',
    name: 'Luxury Hotel Grand Ballroom',
    capacity: 300,
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/luxury-hotel',
    description: 'Five-star hotel ballroom with luxury amenities, professional service, and elegant atmosphere.',
    amenities: ['Luxury Service', 'Full Catering', 'Valet Parking', 'Hotel Rooms', 'Spa Access'],
    rating: 4.9,
    priceRange: '$6,000 - $12,000',
    location: 'Downtown Luxury',
    style: ['luxury', 'elegant', 'professional'],
    availableDates: ['2026-03-21', '2026-03-28', '2026-04-04']
  },
  {
    id: 'training-center-1',
    name: 'Professional Training Center',
    capacity: 80,
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/training-center',
    description: 'Modern training facility with flexible classrooms, presentation equipment, and breakout spaces.',
    amenities: ['Training Rooms', 'AV Equipment', 'Breakout Spaces', 'Catering', 'Parking'],
    rating: 4.5,
    priceRange: '$2,500 - $4,500',
    location: 'Corporate Park',
    style: ['professional', 'modern', 'educational'],
    availableDates: ['2026-03-22', '2026-03-29', '2026-04-05']
  },

  // Outdoor & Natural Venues
  {
    id: 'park-pavilion-1',
    name: 'Central Park Pavilion',
    capacity: 150,
    imageUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/central-park',
    description: 'Beautiful park pavilion surrounded by nature, perfect for outdoor celebrations and community events.',
    amenities: ['Park Setting', 'Covered Pavilion', 'Nature Views', 'Catering', 'Parking'],
    rating: 4.6,
    priceRange: '$1,500 - $3,000',
    location: 'Central Park',
    style: ['outdoor', 'natural', 'casual'],
    availableDates: ['2026-03-23', '2026-03-30', '2026-04-06']
  },
  {
    id: 'beach-club-1',
    name: 'Oceanfront Beach Club',
    capacity: 200,
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/beach-club',
    description: 'Exclusive beachfront venue with ocean views, perfect for destination weddings and summer events.',
    amenities: ['Ocean Views', 'Beach Access', 'Full Service', 'Catering', 'Valet'],
    rating: 4.8,
    priceRange: '$4,000 - $8,000',
    location: 'Beachfront',
    style: ['outdoor', 'luxury', 'destination'],
    availableDates: ['2026-03-24', '2026-03-31', '2026-04-07']
  },
  {
    id: 'vineyard-1',
    name: 'Sunset Vineyard Estate',
    capacity: 120,
    imageUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/vineyard-estate',
    description: 'Picturesque vineyard with rolling hills, perfect for romantic weddings and wine-tasting events.',
    amenities: ['Vineyard Views', 'Wine Tasting', 'Outdoor Ceremony', 'Catering', 'Parking'],
    rating: 4.7,
    priceRange: '$3,500 - $6,500',
    location: 'Wine Country',
    style: ['outdoor', 'elegant', 'romantic'],
    availableDates: ['2026-03-25', '2026-04-01', '2026-04-08']
  },

  // Budget-Friendly Venues
  {
    id: 'community-center-1',
    name: 'Community Event Center',
    capacity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/community-center',
    description: 'Affordable community center with flexible space, perfect for local events and celebrations.',
    amenities: ['Flexible Space', 'Kitchen', 'Parking', 'Basic AV', 'Tables & Chairs'],
    rating: 4.2,
    priceRange: '$500 - $1,500',
    location: 'Community District',
    style: ['casual', 'affordable', 'community'],
    availableDates: ['2026-03-26', '2026-04-02', '2026-04-09']
  },
  {
    id: 'restaurant-private-1',
    name: 'Private Dining Room',
    capacity: 40,
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/private-dining',
    description: 'Intimate private dining room in upscale restaurant, perfect for small gatherings and celebrations.',
    amenities: ['Private Room', 'Full Service', 'Catering', 'Bar Service', 'Valet'],
    rating: 4.4,
    priceRange: '$1,200 - $2,500',
    location: 'Restaurant Row',
    style: ['intimate', 'elegant', 'casual'],
    availableDates: ['2026-03-27', '2026-04-03', '2026-04-10']
  },
  {
    id: 'library-event-1',
    name: 'Historic Library Hall',
    capacity: 80,
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/library-hall',
    description: 'Beautiful historic library with classic architecture, perfect for intellectual gatherings and book clubs.',
    amenities: ['Historic Setting', 'Classic Architecture', 'Catering', 'Parking', 'Library Access'],
    rating: 4.3,
    priceRange: '$800 - $2,000',
    location: 'Historic District',
    style: ['historic', 'elegant', 'intellectual'],
    availableDates: ['2026-03-28', '2026-04-04', '2026-04-11']
  },

  // Unique & Specialized Venues
  {
    id: 'museum-event-1',
    name: 'Modern Art Museum',
    capacity: 150,
    imageUrl: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/art-museum',
    description: 'Contemporary art museum with stunning exhibits, perfect for cultural events and sophisticated gatherings.',
    amenities: ['Art Exhibitions', 'Modern Architecture', 'Catering', 'Valet', 'Museum Access'],
    rating: 4.6,
    priceRange: '$3,000 - $6,000',
    location: 'Cultural District',
    style: ['cultural', 'modern', 'sophisticated'],
    availableDates: ['2026-03-29', '2026-04-05', '2026-04-12']
  },
  {
    id: 'theater-event-1',
    name: 'Historic Theater',
    capacity: 200,
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/historic-theater',
    description: 'Restored historic theater with stage, balcony, and vintage charm. Perfect for performances and events.',
    amenities: ['Stage', 'Balcony', 'Vintage Charm', 'Catering', 'Valet'],
    rating: 4.5,
    priceRange: '$2,500 - $5,000',
    location: 'Theater District',
    style: ['historic', 'theatrical', 'elegant'],
    availableDates: ['2026-03-30', '2026-04-06', '2026-04-13']
  },
  {
    id: 'rooftop-garden-1',
    name: 'Urban Rooftop Garden',
    capacity: 60,
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
    bookingUrl: 'https://example.com/book/rooftop-garden',
    description: 'Intimate rooftop garden with city views, perfect for small weddings and intimate gatherings.',
    amenities: ['Rooftop Setting', 'Garden Views', 'City Skyline', 'Catering', 'Intimate Space'],
    rating: 4.4,
    priceRange: '$2,000 - $4,000',
    location: 'Downtown',
    style: ['intimate', 'outdoor', 'urban'],
    availableDates: ['2026-03-31', '2026-04-07', '2026-04-14']
  }
];

interface VenueSearchParams {
  capacity?: number;
  style?: string;
  location?: string;
  budget?: string;
  eventType?: string;
}

export const listVenues = async (params: VenueSearchParams): Promise<Venue[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filteredVenues = [...mockVenues];
  
  // Filter by capacity (with some flexibility)
  if (params.capacity) {
    filteredVenues = filteredVenues.filter(venue => 
      venue.capacity >= params.capacity! * 0.8 && venue.capacity <= params.capacity! * 1.5
    );
  }
  
  // Filter by style/mood
  if (params.style) {
    filteredVenues = filteredVenues.filter(venue =>
      venue.style.includes(params.style!)
    );
  }
  
  // Filter by event type
  if (params.eventType) {
    const eventType = params.eventType.toLowerCase();
    
    // Map event types to venue styles
    const eventTypeMappings: { [key: string]: string[] } = {
      'hackathon': ['tech-forward', 'industrial', 'modern', 'creative'],
      'wedding': ['elegant', 'formal', 'romantic', 'outdoor', 'historic'],
      'birthday': ['casual', 'festive', 'creative', 'intimate'],
      'corporate': ['professional', 'modern', 'corporate', 'elegant'],
      'conference': ['professional', 'modern', 'corporate', 'educational'],
      'party': ['casual', 'festive', 'creative', 'intimate'],
      'meeting': ['professional', 'modern', 'corporate'],
      'celebration': ['elegant', 'casual', 'festive', 'creative'],
      'reception': ['elegant', 'formal', 'casual'],
      'seminar': ['professional', 'modern', 'educational'],
      'workshop': ['creative', 'professional', 'modern', 'educational'],
      'gala': ['elegant', 'formal', 'luxury'],
      'reunion': ['casual', 'elegant', 'intimate'],
      'anniversary': ['elegant', 'romantic', 'intimate'],
      'graduation': ['elegant', 'casual', 'formal'],
      'retirement': ['elegant', 'casual', 'intimate'],
      'holiday': ['festive', 'elegant', 'casual'],
      'team building': ['casual', 'creative', 'outdoor'],
      'product launch': ['modern', 'tech-forward', 'professional'],
      'networking': ['modern', 'professional', 'casual']
    };
    
    const preferredStyles = eventTypeMappings[eventType] || ['modern', 'casual'];
    filteredVenues = filteredVenues.filter(venue =>
      venue.style.some(style => preferredStyles.includes(style))
    );
  }
  
  // Filter by location preference
  if (params.location) {
    const location = params.location.toLowerCase();
    
    if (location.includes('downtown') || location.includes('city')) {
      filteredVenues = filteredVenues.filter(venue =>
        venue.location.toLowerCase().includes('downtown') || 
        venue.location.toLowerCase().includes('district') ||
        venue.location.toLowerCase().includes('financial')
      );
    } else if (location.includes('outdoor') || location.includes('garden')) {
      filteredVenues = filteredVenues.filter(venue =>
        venue.style.includes('outdoor') || 
        venue.style.includes('natural') ||
        venue.name.toLowerCase().includes('garden') ||
        venue.name.toLowerCase().includes('park')
      );
    } else if (location.includes('historic') || location.includes('classic')) {
      filteredVenues = filteredVenues.filter(venue =>
        venue.style.includes('historic') || 
        venue.style.includes('classic') ||
        venue.name.toLowerCase().includes('historic')
      );
    } else if (location.includes('industrial') || location.includes('warehouse')) {
      filteredVenues = filteredVenues.filter(venue =>
        venue.style.includes('industrial') || 
        venue.name.toLowerCase().includes('warehouse')
      );
    }
  }
  
  // Filter by budget
  if (params.budget) {
    const budget = params.budget.toLowerCase();
    
    if (budget === 'low') {
      filteredVenues = filteredVenues.filter(venue =>
        venue.priceRange.includes('$500') || 
        venue.priceRange.includes('$800') ||
        venue.priceRange.includes('$1,200') ||
        venue.priceRange.includes('$1,500')
      );
    } else if (budget === 'medium') {
      filteredVenues = filteredVenues.filter(venue =>
        venue.priceRange.includes('$1,800') || 
        venue.priceRange.includes('$2,000') ||
        venue.priceRange.includes('$2,500') ||
        venue.priceRange.includes('$3,000') ||
        venue.priceRange.includes('$3,500')
      );
    } else if (budget === 'high') {
      filteredVenues = filteredVenues.filter(venue =>
        venue.priceRange.includes('$4,000') || 
        venue.priceRange.includes('$4,500') ||
        venue.priceRange.includes('$5,000') ||
        venue.priceRange.includes('$6,000') ||
        venue.priceRange.includes('$8,000') ||
        venue.priceRange.includes('$12,000')
      );
    }
  }
  
  // Sort by relevance (rating + capacity match + style match)
  filteredVenues.sort((a, b) => {
    let scoreA = a.rating;
    let scoreB = b.rating;
    
    // Bonus for capacity match
    if (params.capacity) {
      const capacityDiffA = Math.abs(a.capacity - params.capacity);
      const capacityDiffB = Math.abs(b.capacity - params.capacity);
      scoreA += (100 - capacityDiffA) / 100;
      scoreB += (100 - capacityDiffB) / 100;
    }
    
    // Bonus for style match
    if (params.style) {
      if (a.style.includes(params.style)) scoreA += 0.5;
      if (b.style.includes(params.style)) scoreB += 0.5;
    }
    
    return scoreB - scoreA;
  });
  
  return filteredVenues.slice(0, 3);
};

export const getVenue = async (venueId: string): Promise<Venue | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const venue = mockVenues.find(v => v.id === venueId);
  return venue || null;
};

export const checkAvailability = async (venueId: string, date: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const venue = mockVenues.find(v => v.id === venueId);
  return venue?.availableDates.includes(date) || false;
};