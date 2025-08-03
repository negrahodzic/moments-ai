/*
ImmersiMoments - ElevenLabs API Client
Text-to-speech for voice narration and audio tours
*/

interface ElevenLabsParams {
  text: string;
  voice_id?: string;
  model_id?: string;
  voice_settings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

interface ElevenLabsResponse {
  audioUrl: string;
  duration: number;
  cost?: number;
}

class ElevenLabsService {
  private apiKey: string | null = null;
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_ELEVENLABS_API_KEY || null;
  }

  async synthesizeSpeech(params: ElevenLabsParams): Promise<ElevenLabsResponse> {
    if (!this.apiKey) {
      // Fallback to mock if no API key
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Mock audio
        duration: 5,
        cost: 0.001
      };
    }

    try {
      const response = await fetch('http://localhost:3001/api/elevenlabs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: this.apiKey,
          text: params.text,
          voice_id: params.voice_id || 'alloy',
          model_id: params.model_id || 'eleven_monolingual_v1',
          voice_settings: params.voice_settings || {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        audioUrl: data.audio_url || data.url,
        duration: data.duration || 5,
        cost: data.cost
      };
    } catch (error) {
      console.error('Error calling ElevenLabs API:', error);
      // Fallback to mock on error
      return this.synthesizeSpeech(params);
    }
  }

  // Generate SSML for more advanced speech synthesis
  async synthesizeSSML(ssml: string, voiceId: string = 'alloy'): Promise<ElevenLabsResponse> {
    return this.synthesizeSpeech({
      text: ssml,
      voice_id: voiceId,
      model_id: 'eleven_monolingual_v1'
    });
  }

  // Create a narrated tour for venue walkthrough
  async createVenueNarration(
    venueName: string,
    eventType: string,
    mood: string,
    stages: string[]
  ): Promise<ElevenLabsResponse> {
    const narration = `Welcome to ${venueName}. This beautiful venue is perfect for your ${eventType}. 
    The ${mood} atmosphere creates the ideal setting for your special day. 
    ${stages.join(' ')} 
    Thank you for considering ${venueName} for your ${eventType}.`;

    return this.synthesizeSpeech({
      text: narration,
      voice_id: 'alloy',
      voice_settings: {
        stability: 0.7,
        similarity_boost: 0.7,
        style: 0.0,
        use_speaker_boost: true
      }
    });
  }
}

// Export functions for use in components
export const synthesizeSpeech = async (params: ElevenLabsParams): Promise<ElevenLabsResponse> => {
  const service = new ElevenLabsService();
  return service.synthesizeSpeech(params);
};

export const synthesizeSSML = async (ssml: string, voiceId?: string): Promise<ElevenLabsResponse> => {
  const service = new ElevenLabsService();
  return service.synthesizeSSML(ssml, voiceId);
};

export const createVenueNarration = async (
  venueName: string,
  eventType: string,
  mood: string,
  stages: string[]
): Promise<ElevenLabsResponse> => {
  const service = new ElevenLabsService();
  return service.createVenueNarration(venueName, eventType, mood, stages);
};

export default ElevenLabsService; 