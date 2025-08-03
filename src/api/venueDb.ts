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

export interface VenueFilters {
  capacity?: number;
  style?: string;
  location?: string;
  budget?: string;
  eventType?: string;
}

const venues: Venue[] = [
  {
    id: 'workstations-grid',
    name: 'TechGrid Workstations',
    capacity: 60,
    imageUrl: '/venues/Workstations-Grid.jpeg',
    bookingUrl: 'https://example.com/book/techgrid-workstations',
    description: 'Quiet, grid-style workstation setup ideal for coding sprints, focused work, or team pods during hackathons.',
    amenities: ['High-Speed WiFi', 'Individual Desks', 'Charging Ports', 'Air Conditioning', 'Ergonomic Chairs'],
    rating: 4.7,
    priceRange: '$1,800 - $3,200',
    location: 'Innovation Zone, Plexal London',
    style: ['tech-forward', 'focused', 'minimal'],
    availableDates: ['2026-04-10', '2026-04-17', '2026-04-24']
  },
  {
    id: 'stair-arena',
    name: 'Staircase Arena',
    capacity: 80,
    imageUrl: '/venues/Stair-Arena.jpeg',
    bookingUrl: 'https://example.com/book/stair-arena',
    description: 'Casual amphitheater-style stair seating perfect for keynotes, team briefings, and informal sessions.',
    amenities: ['Tiered Seating', 'Ambient Lighting', 'Open Stage Area', 'AV System', 'Easy Access'],
    rating: 4.5,
    priceRange: '$2,000 - $3,500',
    location: 'Central Hall, Plexal London',
    style: ['open', 'collaborative', 'casual'],
    availableDates: ['2026-04-08', '2026-04-15', '2026-04-22']
  },
  {
    id: 'seating-audience',
    name: 'Audience Presentation Hub',
    capacity: 100,
    imageUrl: '/venues/Seating-Audience.jpeg',
    bookingUrl: 'https://example.com/book/audience-hub',
    description: 'Neatly arranged audience seating with projector setup, ideal for speaker sessions, demos, and panels.',
    amenities: ['Audience Seating', 'Projector', 'Wireless Mics', 'Stage Lighting', 'Presentation Tools'],
    rating: 4.6,
    priceRange: '$2,500 - $4,000',
    location: 'Main Auditorium, Plexal London',
    style: ['formal', 'professional', 'structured'],
    availableDates: ['2026-04-11', '2026-04-18', '2026-04-25']
  },
  {
    id: 'room-boardroom',
    name: 'Executive Boardroom',
    capacity: 20,
    imageUrl: '/venues/Room-Boardroom.jpeg',
    bookingUrl: 'https://example.com/book/executive-boardroom',
    description: 'Private boardroom setup with a central conference table and LED screen. Ideal for team strategy meetings and VIP sponsor sessions.',
    amenities: ['Central Table', 'Smart Display', 'Power Outlets', 'Whiteboard', 'Privacy Doors'],
    rating: 4.8,
    priceRange: '$1,200 - $2,200',
    location: 'Private Wing, Plexal London',
    style: ['professional', 'private', 'minimal'],
    availableDates: ['2026-04-12', '2026-04-19', '2026-04-26']
  },
  {
    id: 'panel-fullview',
    name: 'Panel Discussion Zone',
    capacity: 90,
    imageUrl: '/venues/Panel-FullView.jpeg',
    bookingUrl: 'https://example.com/book/panel-discussion-zone',
    description: 'Spacious panel discussion hall with audience seating, large projection display, and microphone-ready desks.',
    amenities: ['Panel Desks', 'AV System', 'Audience Seating', 'Projection Screen', 'Sound Control'],
    rating: 4.7,
    priceRange: '$2,200 - $3,800',
    location: 'Tech Hall, Plexal London',
    style: ['collaborative', 'modern', 'functional'],
    availableDates: ['2026-04-13', '2026-04-20', '2026-04-27']
  },
  {
    id: 'tables-canopy',
    name: 'Canopy Tables Zone',
    capacity: 70,
    imageUrl: '/venues/Tables-Canopy.jpeg',
    bookingUrl: 'https://example.com/book/tables-canopy',
    description: 'Open-air inspired indoor area with long tables beneath a styled canopy, ideal for group work, networking, or chill hack breaks.',
    amenities: ['Long Tables', 'Canopy Design', 'Mood Lighting', 'Power Sockets', 'Snack Bar Nearby'],
    rating: 4.4,
    priceRange: '$1,500 - $2,800',
    location: 'Breakout Zone, Plexal London',
    style: ['creative', 'casual', 'group-friendly'],
    availableDates: ['2026-04-14', '2026-04-21', '2026-04-28']
  }
];

export const listVenues = async (filters?: VenueFilters): Promise<Venue[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  let filteredVenues = venues;
  
  if (filters) {
    filteredVenues = venues.filter(venue => {
      if (filters.capacity && venue.capacity < filters.capacity) return false;
      if (filters.style && !venue.style.some(s => s.includes(filters.style!))) return false;
      if (filters.location && !venue.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      return true;
    });
  }
  
  return filteredVenues;
};

export const getVenue = async (id: string): Promise<Venue | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const venue = venues.find(v => v.id === id);
  return venue || null;
};

export const checkAvailability = async (venueId: string, date: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const venue = venues.find(v => v.id === venueId);
  return venue?.availableDates.includes(date) || false;
};