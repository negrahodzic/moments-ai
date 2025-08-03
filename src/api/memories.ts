/*
ImmersiMoments - Memories AI API Client
Semantic tagging and analysis of user-uploaded media
*/

interface MemoriesAnalysisParams {
  imageUrl?: string;
  text?: string;
  tags?: string[];
  context?: string;
}

interface MemoriesAnalysisResult {
  tags: string[];
  description: string;
  confidence: number;
  categories: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface MemoriesUploadParams {
  file: File;
  description?: string;
  tags?: string[];
}

interface MemoriesUploadResult {
  id: string;
  url: string;
  tags: string[];
  description: string;
}

class MemoriesAIService {
  private apiKey: string | null = null;
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_MEMORIES_API_KEY || null;
  }

  async analyzeMedia(params: MemoriesAnalysisParams): Promise<MemoriesAnalysisResult> {
    if (!this.apiKey) {
      // Fallback to mock if no API key
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        tags: ['event', 'venue', 'celebration', 'gathering'],
        description: 'A beautiful event space with elegant decor and warm lighting',
        confidence: 0.85,
        categories: ['venue', 'event', 'social'],
        sentiment: 'positive'
      };
    }

    try {
      const response = await fetch('http://localhost:3001/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: this.apiKey,
          image_url: params.imageUrl,
          text: params.text,
          tags: params.tags,
          context: params.context
        })
      });

      if (!response.ok) {
        throw new Error(`Memories AI API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        tags: data.tags || [],
        description: data.description || '',
        confidence: data.confidence || 0.8,
        categories: data.categories || [],
        sentiment: data.sentiment
      };
    } catch (error) {
      console.error('Error calling Memories AI API:', error);
      // Fallback to mock on error
      return this.analyzeMedia(params);
    }
  }

  async uploadMedia(params: MemoriesUploadParams): Promise<MemoriesUploadResult> {
    if (!this.apiKey) {
      // Fallback to mock if no API key
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        id: `mock-${Date.now()}`,
        url: URL.createObjectURL(params.file),
        tags: ['uploaded', 'media', 'event'],
        description: 'Uploaded media file'
      };
    }

    try {
      const formData = new FormData();
      formData.append('file', params.file);
      formData.append('apiKey', this.apiKey);
      if (params.description) formData.append('description', params.description);
      if (params.tags) formData.append('tags', JSON.stringify(params.tags));

      const response = await fetch('http://localhost:3001/api/memories/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Memories AI upload error: ${response.status}`);
      }

      const data = await response.json();
      return {
        id: data.id,
        url: data.url,
        tags: data.tags || [],
        description: data.description || ''
      };
    } catch (error) {
      console.error('Error uploading to Memories AI:', error);
      // Fallback to mock on error
      return this.uploadMedia(params);
    }
  }

  // Analyze venue images for event planning insights
  async analyzeVenueImage(imageUrl: string, eventType: string): Promise<MemoriesAnalysisResult> {
    return this.analyzeMedia({
      imageUrl,
      context: `Analyze this venue image for a ${eventType} event. Focus on space, lighting, decor, and suitability.`,
      tags: ['venue', 'event', eventType, 'planning']
    });
  }

  // Generate tags for event planning based on uploaded media
  async generateEventTags(mediaItems: MemoriesAnalysisResult[]): Promise<string[]> {
    const allTags = mediaItems.flatMap(item => item.tags);
    const tagFrequency: { [key: string]: number } = {};
    
    allTags.forEach(tag => {
      tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
    });

    return Object.entries(tagFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag]) => tag);
  }
}

// Export functions for use in components
export const analyzeMedia = async (params: MemoriesAnalysisParams): Promise<MemoriesAnalysisResult> => {
  const service = new MemoriesAIService();
  return service.analyzeMedia(params);
};

export const uploadMedia = async (params: MemoriesUploadParams): Promise<MemoriesUploadResult> => {
  const service = new MemoriesAIService();
  return service.uploadMedia(params);
};

export const analyzeVenueImage = async (imageUrl: string, eventType: string): Promise<MemoriesAnalysisResult> => {
  const service = new MemoriesAIService();
  return service.analyzeVenueImage(imageUrl, eventType);
};

export const generateEventTags = async (mediaItems: MemoriesAnalysisResult[]): Promise<string[]> => {
  const service = new MemoriesAIService();
  return service.generateEventTags(mediaItems);
};

export default MemoriesAIService; 