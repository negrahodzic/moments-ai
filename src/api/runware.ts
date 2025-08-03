/*
ImmersiMoments - Runware.ai API Client
Image and video generation for venue visualization
*/

interface RunwareImageParams {
  prompt: string;
  negativePrompt?: string;
  initImageUrl?: string;
  strength?: number;
  model?: string;
  width?: number;
  height?: number;
  steps?: number;
  CFGScale?: number;
  scheduler?: string;
  seed?: number;
  clipSkip?: number;
  lora?: string;
  loraStrength?: number;
  embeddings?: string;
  hiresFix?: boolean;
  hiresUpscaler?: string;
  hiresSteps?: number;
  hiresStrength?: number;
  karrasNoise?: boolean;
  tiling?: boolean;
  controlNetType?: string;
  controlNetConditioningScale?: number;
}

interface RunwareVideoParams {
  stages: {
    prompt: string;
    duration: number;
  }[];
  style?: string;
}

interface GeneratedImage {
  imageUrl: string;
  seed?: number;
  cost?: number;
}

interface GeneratedVideo {
  videoUrl: string;
  duration: number;
  cost?: number;
}

// Mock implementation - replace with actual Runware API calls
class RunwareService {
  private apiKey: string | null = null;
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_RUNWARE_API_KEY || null;
    console.log('Runware API key loaded:', this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NOT FOUND');
  }

  async generateImage(params: RunwareImageParams): Promise<GeneratedImage> {
    if (!this.apiKey) {
      // Fallback to mock if no API key
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockImages = [
        'https://images.unsplash.com/photo-1511795409834-432f7b01b89b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop'
      ];
      
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      
      return {
        imageUrl: randomImage,
        seed: Math.floor(Math.random() * 1000000),
        cost: 0.005
      };
    }

    try {
      // Prepare the request payload
      const payload: any = {
        apiKey: this.apiKey,
        taskType: 'imageInference',
        taskUUID: generateTaskUUID(),
        positivePrompt: params.prompt,
        negativePrompt: params.negativePrompt,
        strength: params.strength || 0.8,
        model: params.model || 'rundiffusion:130@100',
        width: params.width || 800,
        height: params.height || 600,
        steps: params.steps || 30,
        CFGScale: params.CFGScale || 7,
        scheduler: params.scheduler || 'DPM++ 2M Karras',
        seed: params.seed,
        clipSkip: params.clipSkip || 1,
        lora: params.lora,
        loraStrength: params.loraStrength,
        embeddings: params.embeddings,
        hiresFix: params.hiresFix,
        hiresUpscaler: params.hiresUpscaler,
        hiresSteps: params.hiresSteps,
        hiresStrength: params.hiresStrength,
        karrasNoise: params.karrasNoise,
        tiling: params.tiling,
        controlNetType: params.controlNetType,
        controlNetConditioningScale: params.controlNetConditioningScale
      };

      // If we have an init image, convert it to data URI for seedImage
      if (params.initImageUrl) {
        console.log('Using image-to-image generation with seed image:', params.initImageUrl);
        try {
          const dataUri = await convertImageUrlToDataUri(params.initImageUrl);
          payload.seedImage = dataUri;
          console.log('Successfully converted seed image to data URI');
        } catch (conversionError) {
          console.error('Failed to convert seed image, falling back to text-to-image:', conversionError);
          // If conversion fails, just do text-to-image generation instead
          console.log('Falling back to text-to-image generation');
        }
      } else {
        console.log('Using text-to-image generation (no base image provided)');
      }

      const response = await fetch('http://localhost:3001/api/runware', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([payload])
      });

      if (!response.ok) {
        throw new Error(`Runware API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle the correct Runware response structure
      let results;
      if (data && data.data && Array.isArray(data.data)) {
        results = data.data;
      } else if (Array.isArray(data)) {
        results = data;
      } else {
        console.error('Invalid response structure from Runware API:', data);
        throw new Error("Invalid response from Runware API");
      }
      
      if (results.length === 0) {
        console.error('No results returned from Runware API:', data);
        throw new Error("No results returned from Runware API");
      }

      const result = results[0];
      
      if (result.error) {
        console.error('Runware generation error:', result.error);
        throw new Error(`Image generation failed: ${result.error}`);
      }

      // Check for different possible response field names
      const imageUrl = result.imageURL || result.imageUrl || result.image_url || result.url;
      
      if (!imageUrl) {
        console.error('No image URL found in response:', result);
        throw new Error("No image URL returned from Runware API");
      }

      console.log('Successfully generated image:', imageUrl);
      
      return {
        imageUrl: imageUrl,
        seed: result.seed,
        cost: result.cost
      };
    } catch (error) {
      console.error('Error calling Runware API:', error);
      console.error('Request payload:', {
        taskType: 'imageInference',
        taskUUID: generateTaskUUID(),
        positivePrompt: params.prompt,
        initImageUrl: params.initImageUrl,
        strength: params.strength || 0.7,
        model: params.model || 'rundiffusion:130@100',
        width: params.width || 800,
        height: params.height || 600
      });
      // Fallback to mock on error
      return this.generateImage(params);
    }
  }

  async generateVideo(params: RunwareVideoParams): Promise<GeneratedVideo> {
    if (!this.apiKey) {
      // Fallback to mock if no API key
      await new Promise(resolve => setTimeout(resolve, 5000));
      const mockVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      
      return {
        videoUrl: mockVideoUrl,
        duration: 30,
        cost: 0.025
      };
    }

    try {
      const response = await fetch('http://localhost:3001/api/runware', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          apiKey: this.apiKey,
          taskType: 'videoInference',
          taskUUID: generateTaskUUID(),
          type: 'video',
          stages: params.stages,
          style: params.style
        }])
      });

      if (!response.ok) {
        throw new Error(`Runware API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        videoUrl: data.video_url || data.url || data.result?.url || data.media?.[0]?.url,
        duration: data.duration || 30,
        cost: data.cost
      };
    } catch (error) {
      console.error('Error calling Runware API:', error);
      console.error('Video request payload:', {
        taskType: 'videoInference',
        taskUUID: generateTaskUUID(),
        type: 'video',
        stages: params.stages,
        style: params.style
      });
      // Fallback to mock on error
      return this.generateVideo(params);
    }
  }
}

// Export functions for use in components
export const generateImage = async (params: RunwareImageParams): Promise<GeneratedImage> => {
  const service = new RunwareService();
  return service.generateImage(params);
};

export const generateVideo = async (params: {
  baseImageUrl: string;
  animationPrompt: string;
  duration?: number;
  width?: number;
  height?: number;
  model?: string;
  fps?: number;
  steps?: number;
  CFGScale?: number;
}): Promise<{ videoUrl: string; taskUUID: string }> => {
  console.log('🚀 [Runware] Starting video generation...');
  console.log('🚀 [Runware] Input parameters:', params);
  
  const apiKey = import.meta.env.VITE_RUNWARE_API_KEY;
  console.log('🚀 [Runware] API key status:', apiKey ? `Present (${apiKey.substring(0, 10)}...)` : 'NOT FOUND');
  
  if (!apiKey) {
    console.warn('🚀 [Runware] No API key configured, using mock video for testing');
    // Return mock video for testing
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    return { 
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
      taskUUID: generateTaskUUID() 
    };
  }

  const taskUUID = generateTaskUUID();
  console.log('🚀 [Runware] Generated task UUID:', taskUUID);
  
  // Convert base image to data URI for frame constraint
  console.log('🚀 [Runware] Converting base image to data URI...');
  console.log('🚀 [Runware] Base image URL:', params.baseImageUrl);
  
  try {
    const frameImage = await convertImageUrlToDataUri(params.baseImageUrl);
    console.log('🚀 [Runware] Successfully converted image to data URI, length:', frameImage.length);
    
    const payload = {
      taskType: 'videoInference',
      taskUUID: taskUUID,
      deliveryMethod: 'async',
      positivePrompt: params.animationPrompt,
      negativePrompt: 'blurry, low quality, distorted, unrealistic, cartoon, anime, painting, drawing, sketch, watermark, text, logo, signature, oversaturated, underexposed, overexposed, bad anatomy, extra limbs, missing limbs, deformed, mutated, ugly, disgusting, amputation, static, flickering, jittery, unstable',
      frameImages: [
        {
          inputImage: frameImage,
          frame: 'first'
        }
      ],
      width: 1920,
      height: 1080,
      model: params.model || 'klingai:5@3',
      duration: params.duration || 5,
      fps: params.fps || 24,
      CFGScale: params.CFGScale || 0.8,
      numberResults: 1
    };

    console.log('🚀 [Runware] Final payload:', {
      ...payload,
      frameImages: [{ frame: 'first', inputImage: `[DATA_URI_${frameImage.length}_CHARS]` }]
    });

    console.log('🚀 [Runware] Sending request to server...');
    const response = await fetch('http://localhost:3001/api/runware', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        apiKey,
        ...payload
      }])
    });

    console.log('🚀 [Runware] Response status:', response.status);
    console.log('🚀 [Runware] Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🚀 [Runware] API error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      console.error('🚀 [Runware] Parsed error data:', errorData);
      throw new Error(`Video generation failed: ${errorData.errors?.[0]?.message || errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('🚀 [Runware] Success response data:', data);

    // Return the taskUUID for polling
    const result = { videoUrl: '', taskUUID };
    console.log('🚀 [Runware] Returning result:', result);
    return result;
  } catch (error) {
    console.error('🚀 [Runware] Error in video generation:', error);
    console.error('🚀 [Runware] Error stack:', error.stack);
    throw error;
  }
};

// Poll for video generation results
export const pollVideoResult = async (taskUUID: string): Promise<{ videoUrl: string; status: string }> => {
  console.log('🔄 [Runware] Polling video result for UUID:', taskUUID);
  
  const apiKey = import.meta.env.VITE_RUNWARE_API_KEY;
  console.log('🔄 [Runware] API key status:', apiKey ? `Present (${apiKey.substring(0, 10)}...)` : 'NOT FOUND');
  
  if (!apiKey) {
    console.warn('🔄 [Runware] No API key for polling, returning mock completion');
    // For mock mode, immediately return completed status
    return { 
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
      status: 'completed' 
    };
  }

  const payload = {
    taskType: 'getResponse',
    taskUUID: taskUUID
  };

  console.log('🔄 [Runware] Polling payload:', payload);

  try {
    console.log('🔄 [Runware] Sending polling request to server...');
    const response = await fetch('http://localhost:3001/api/runware', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        apiKey,
        ...payload
      }])
    });

    console.log('🔄 [Runware] Polling response status:', response.status);
    console.log('🔄 [Runware] Polling response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔄 [Runware] Polling error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      console.error('🔄 [Runware] Parsed polling error:', errorData);
      throw new Error(`Polling failed: ${errorData.errors?.[0]?.message || errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('🔄 [Runware] Full polling response data:', data);

    if (data.data && data.data.length > 0) {
      const result = data.data[0];
      console.log('🔄 [Runware] First result item:', result);
      console.log('🔄 [Runware] All available fields:', Object.keys(result));
      
      // Try multiple possible video URL field names
      const videoUrl = result.videoURL || result.videoUrl || result.video_url || result.url || result.outputURL;
      console.log('🔄 [Runware] Extracted video URL:', videoUrl);
      
      if (result.status === 'success' && videoUrl) {
        console.log('✅ [Runware] Video completed! URL:', videoUrl);
        return { videoUrl: videoUrl, status: 'completed' };
      } else if (result.status === 'success' && !videoUrl) {
        console.error('❌ [Runware] Success status but no video URL found');
        console.error('❌ [Runware] Full result object:', JSON.stringify(result, null, 2));
        return { videoUrl: '', status: 'error' };
      } else if (result.status === 'pending') {
        console.log('⏳ [Runware] Video still pending...');
        return { videoUrl: '', status: 'pending' };
      } else if (result.status === 'error') {
        console.error('❌ [Runware] Video generation failed:', result.message);
        throw new Error(`Video generation failed: ${result.message || 'Unknown error'}`);
      } else {
        console.log('🔄 [Runware] Unknown status:', result.status);
        console.log('🔄 [Runware] Full result for unknown status:', JSON.stringify(result, null, 2));
        return { videoUrl: '', status: result.status || 'pending' };
      }
    } else {
      console.log('🔄 [Runware] No data in response, treating as pending');
      return { videoUrl: '', status: 'pending' };
    }
  } catch (error) {
    console.error('❌ [Runware] Error polling video result:', error);
    console.error('❌ [Runware] Polling error stack:', error.stack);
    throw error;
  }
};

// Build prompt for venue visualization with anchor prompting
export const buildVenuePrompt = (
  venueName: string,
  eventType: string,
  headcount: number,
  mood: string,
  mustHaves: string[]
): { positivePrompt: string; negativePrompt: string } => {
  // Create structural anchors to preserve room layout
  const structuralAnchors = [
    `Maintain the exact architectural layout of ${venueName}`,
    `Preserve all structural elements: walls, ceiling, floor, windows, doors`,
    `Keep the same spatial proportions and room dimensions`,
    `Maintain the original lighting fixtures and electrical layout`,
    `Preserve the exact furniture arrangement and positioning`,
    `Keep the same color scheme and material finishes`,
    `Maintain the original architectural style and design language`
  ].join(', ');

  // Base prompt with structural preservation
  const basePrompt = `Generate a realistic interior image of ${venueName} set up for a ${eventType} with ${headcount} guests. The atmosphere should be ${mood}. ${structuralAnchors}.`;
  
  let positivePrompt = basePrompt;
  if (mustHaves.length > 0) {
    const amenitiesText = mustHaves.join(', ');
    positivePrompt = `${basePrompt} Include these specific elements: ${amenitiesText}. Ultra high resolution, professional event photography style.`;
  } else {
    positivePrompt = `${basePrompt} Ultra high resolution, professional event photography style.`;
  }
  
  // Enhanced negative prompt to prevent layout changes
  const negativePrompt = `blurry, low quality, distorted, unrealistic, cartoon, anime, painting, drawing, sketch, watermark, text, logo, signature, oversaturated, underexposed, overexposed, bad anatomy, extra limbs, missing limbs, deformed, mutated, ugly, disgusting, amputation, different room layout, changed architecture, modified structure, different furniture arrangement, altered spatial proportions, different lighting setup, changed color scheme, different materials, architectural changes, structural modifications`;
  
  return { positivePrompt, negativePrompt };
};

// Enhance user tweaks with anchor prompting for precise changes
export const enhanceTweakWithAnchors = (
  basePrompt: string,
  userTweak: string,
  venueName: string
): { positivePrompt: string; negativePrompt: string } => {
  // Extract the specific change the user wants
  const changeKeywords = [
    'add', 'remove', 'change', 'make', 'set', 'update', 'modify', 'adjust',
    'increase', 'decrease', 'more', 'less', 'brighter', 'darker', 'warmer', 'cooler'
  ];
  
  // Create preservation anchors based on the tweak type
  const preservationAnchors = [
    `Maintain the EXACT architectural layout and structure of ${venueName}`,
    `Preserve ALL walls, ceiling, floor, windows, and doors EXACTLY as they are`,
    `Keep the SAME spatial proportions and room dimensions`,
    `Maintain the ORIGINAL furniture arrangement and positioning`,
    `Preserve the EXISTING color scheme and material finishes`,
    `Keep the SAME architectural style and design language`,
    `Maintain the EXACT camera angle and perspective`,
    `Preserve ALL structural elements and room geometry`,
    `Keep the SAME lighting setup and electrical layout`,
    `Only modify the specific elements mentioned in the user request`,
    `Apply MINIMAL changes to preserve the original design integrity`
  ].join(', ');

  // Enhanced positive prompt with structural preservation
  const enhancedPositivePrompt = `${basePrompt} ${preservationAnchors}. User request: ${userTweak}. Apply only the requested changes while preserving everything else.`;

  // Enhanced negative prompt to prevent unwanted changes
  const negativePrompt = `blurry, low quality, distorted, unrealistic, cartoon, anime, painting, drawing, sketch, watermark, text, logo, signature, oversaturated, underexposed, overexposed, bad anatomy, extra limbs, missing limbs, deformed, mutated, ugly, disgusting, amputation, DIFFERENT room layout, CHANGED architecture, MODIFIED structure, DIFFERENT furniture arrangement, ALTERED spatial proportions, DIFFERENT lighting setup, CHANGED color scheme, DIFFERENT materials, architectural changes, structural modifications, layout changes, DIFFERENT room shape, MODIFIED floor plan, CHANGED ceiling height, DIFFERENT window placement, ALTERED door positions, DIFFERENT room dimensions, DIFFERENT camera angle, DIFFERENT perspective, DIFFERENT room geometry, DIFFERENT structural elements, DIFFERENT lighting fixtures, DIFFERENT electrical layout, DIFFERENT room proportions, DIFFERENT architectural style, DIFFERENT design language, DIFFERENT spatial arrangement, DIFFERENT room configuration, DIFFERENT building structure, DIFFERENT interior layout, DIFFERENT room design, DIFFERENT venue layout, DIFFERENT space arrangement, DIFFERENT room setup, DIFFERENT venue structure, DIFFERENT building layout, DIFFERENT interior design, DIFFERENT room architecture, DIFFERENT venue design, DIFFERENT space design, DIFFERENT room structure, DIFFERENT venue architecture, DIFFERENT building design, DIFFERENT interior architecture, DIFFERENT room configuration, DIFFERENT venue setup, DIFFERENT space structure, DIFFERENT room layout, DIFFERENT venue layout, DIFFERENT building structure, DIFFERENT interior layout, DIFFERENT room design, DIFFERENT venue structure, DIFFERENT space arrangement, DIFFERENT room setup, DIFFERENT venue design, DIFFERENT space design, DIFFERENT room architecture, DIFFERENT venue architecture, DIFFERENT building design, DIFFERENT interior architecture, DIFFERENT room configuration, DIFFERENT venue setup, DIFFERENT space structure`;

  return { positivePrompt: enhancedPositivePrompt, negativePrompt };
};

// Build video stages for walkthrough
export const buildVideoStages = (
  eventType: string,
  mood: string,
  venueName: string
): RunwareVideoParams => {
  return {
    stages: [
      {
        prompt: `Entrance view of ${venueName} welcoming guests for a ${eventType}, ${mood} lighting, people arriving`,
        duration: 10
      },
      {
        prompt: `Main event space of ${venueName} during a ${eventType}, ${mood} atmosphere, guests networking and engaging`,
        duration: 15
      },
      {
        prompt: `Finale moment at ${venueName} ${eventType}, ${mood} celebration, memorable conclusion`,
        duration: 5
      }
    ],
    style: mood
  };
};

// Generate a UUID for task identification
function generateTaskUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Convert image URL to data URI for browser environment with compression
async function convertImageUrlToDataUri(imageUrl: string): Promise<string> {
  try {
    console.log('Converting image URL to data URI:', imageUrl);
    
    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    // Get the image as blob
    const blob = await response.blob();
    
    // Compress the image to reduce data URI size
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        // Set canvas size (reduce if too large)
        const maxSize = 512; // Reduce size for video generation
        let { width, height } = img;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to compressed data URI
        const compressedDataUri = canvas.toDataURL('image/jpeg', 0.8); // 80% quality
        
        console.log('Successfully converted to compressed data URI, length:', compressedDataUri.length);
        resolve(compressedDataUri);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
      
      // Create object URL for the image
      const objectUrl = URL.createObjectURL(blob);
      img.src = objectUrl;
    });
  } catch (error) {
    console.error('Error converting image to data URI:', error);
    throw error;
  }
}