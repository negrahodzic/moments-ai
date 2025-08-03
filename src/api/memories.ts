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

  // Upload video to Memories.ai for analysis
  async uploadVideoForAnalysis(videoUrl: string): Promise<{ videoNo: string; uploadUrl?: string }> {
    console.log('🧠 [Memories] Starting video upload for analysis:', videoUrl);
    
    if (!this.apiKey) {
      console.log('🧠 [Memories] No API key, using mock response');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        videoNo: `mock_video_${Date.now()}`,
        uploadUrl: videoUrl
      };
    }

    try {
      const response = await fetch('http://localhost:3001/api/memories/upload-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: this.apiKey,
          videoUrl: videoUrl,
          type: 'video'
        })
      });

      console.log('🧠 [Memories] Upload response status:', response.status);

      if (!response.ok) {
        throw new Error(`Memories AI upload error: ${response.status}`);
      }

      const data = await response.json();
      console.log('🧠 [Memories] Upload successful:', data);
      
      return {
        videoNo: data.video_no || data.videoNo || `upload_${Date.now()}`,
        uploadUrl: data.url || videoUrl
      };
    } catch (error) {
      console.error('🧠 [Memories] Upload error:', error);
      // Fallback for testing
      return {
        videoNo: `fallback_${Date.now()}`,
        uploadUrl: videoUrl
      };
    }
  }

  // Get intelligent video description from Memories.ai using correct API format
  async getVideoAnalysis(videoNo: string): Promise<{ description: string; summary: string; tags: string[] }> {
    console.log('🧠 [Memories] Getting video analysis for video_no:', videoNo);
    
    if (!this.apiKey) {
      console.log('🧠 [Memories] No API key, using intelligent mock analysis');
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        description: 'A sophisticated venue walkthrough showcasing a modern event space with elegant lighting and contemporary furnishings. The video reveals professional networking areas, comfortable seating arrangements, and an atmosphere designed for corporate gatherings and celebrations.',
        summary: 'Professional event venue with modern amenities, elegant lighting, and networking spaces perfect for corporate events.',
        tags: ['venue', 'professional', 'networking', 'corporate', 'modern', 'elegant']
      };
    }

    try {
      // Use GET request with query parameters as per correct Memories.ai API format
      const url = new URL('http://localhost:3001/api/memories/analyze-video');
      url.searchParams.append('apiKey', this.apiKey);
      url.searchParams.append('video_no', videoNo);
      url.searchParams.append('type', 'summary');

      console.log('🧠 [Memories] Analysis request URL:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'GET'
      });

      console.log('🧠 [Memories] Analysis response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('🧠 [Memories] Analysis error:', errorData);
        throw new Error(`Memories AI analysis error: ${response.status}`);
      }

      const data = await response.json();
      console.log('🧠 [Memories] Analysis successful:', data);
      
      // Parse the Memories.ai response format
      return {
        description: data.summary || data.description || data.transcript || 'AI-analyzed venue walkthrough showing professional event space',
        summary: data.summary || data.short_summary || 'Professional venue walkthrough',
        tags: data.tags || data.keywords || this.extractTagsFromSummary(data.summary) || ['venue', 'walkthrough']
      };
    } catch (error) {
      console.error('🧠 [Memories] Analysis error:', error);
      // Intelligent fallback
      return {
        description: 'A professional venue walkthrough showcasing the space and its atmosphere for event planning purposes.',
        summary: 'Venue walkthrough with professional atmosphere',
        tags: ['venue', 'walkthrough', 'professional']
      };
    }
  }

  // Helper function to extract tags from summary text
  private extractTagsFromSummary(summary: string): string[] {
    if (!summary) return ['venue', 'walkthrough'];
    
    const keywords = summary.toLowerCase();
    const tags = [];
    
    if (keywords.includes('professional') || keywords.includes('business')) tags.push('professional');
    if (keywords.includes('modern') || keywords.includes('contemporary')) tags.push('modern');
    if (keywords.includes('elegant') || keywords.includes('sophisticated')) tags.push('elegant');
    if (keywords.includes('networking') || keywords.includes('social')) tags.push('networking');
    if (keywords.includes('corporate') || keywords.includes('office')) tags.push('corporate');
    if (keywords.includes('celebration') || keywords.includes('party')) tags.push('celebration');
    if (keywords.includes('venue') || keywords.includes('space')) tags.push('venue');
    
    return tags.length > 0 ? tags : ['venue', 'walkthrough'];
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

export const uploadVideoForAnalysis = async (videoUrl: string): Promise<{ videoNo: string; uploadUrl?: string }> => {
  const service = new MemoriesAIService();
  return service.uploadVideoForAnalysis(videoUrl);
};

export const getVideoAnalysis = async (videoNo: string): Promise<{ description: string; summary: string; tags: string[] }> => {
  const service = new MemoriesAIService();
  return service.getVideoAnalysis(videoNo);
};

export default MemoriesAIService; 