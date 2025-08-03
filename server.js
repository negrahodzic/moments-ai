import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Claude API proxy endpoint
app.post('/api/claude', async (req, res) => {
  try {
    const { apiKey, ...requestBody } = req.body;
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling Claude API:', error);
    res.status(500).json({ error: 'Failed to call Claude API' });
  }
});

// ElevenLabs API proxy endpoint
app.post('/api/elevenlabs', async (req, res) => {
  try {
    console.log('🎵 [Server] Received ElevenLabs API request');
    const { apiKey, voice_id, text, voice_settings, model_id, ...otherParams } = req.body;
    
    console.log('🎵 [Server] ElevenLabs API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT PROVIDED');
    console.log('🎵 [Server] Voice ID:', voice_id);
    console.log('🎵 [Server] Text length:', text ? text.length : 0);
    console.log('🎵 [Server] Model ID:', model_id);
    
    const voiceId = voice_id || 'pNInz6obpgDQGcFmaJgB'; // Default professional voice
    const requestUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
    
    console.log('🎵 [Server] Request URL:', requestUrl);
    
    const requestPayload = {
      text: text,
      model_id: model_id || 'eleven_monolingual_v1',
      voice_settings: voice_settings || {
        stability: 0.5,
        similarity_boost: 0.5,
        style: 0.0,
        use_speaker_boost: true
      }
    };
    
    console.log('🎵 [Server] Request payload:', JSON.stringify(requestPayload, null, 2));
    
    const response = await fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify(requestPayload)
    });

    console.log('🎵 [Server] ElevenLabs response status:', response.status);
    console.log('🎵 [Server] ElevenLabs response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🎵 [Server] ElevenLabs error response:', errorText);
      return res.status(response.status).json({ error: errorText });
    }

    // ElevenLabs returns audio data as a blob, not JSON
    const audioBuffer = await response.arrayBuffer();
    console.log('🎵 [Server] Audio buffer size:', audioBuffer.byteLength);
    
    // Convert to base64 for JSON response
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    const audioDataUri = `data:audio/mpeg;base64,${audioBase64}`;
    
    console.log('🎵 [Server] Audio converted to data URI, length:', audioDataUri.length);
    
    res.json({
      audioUrl: audioDataUri,
      duration: 5, // Approximate duration
      cost: 0.001 // Mock cost
    });
    
  } catch (error) {
    console.error('🎵 [Server] Error calling ElevenLabs API:', error);
    console.error('🎵 [Server] Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to call ElevenLabs API', details: error.message });
  }
});

// Runware API proxy endpoint
app.post('/api/runware', async (req, res) => {
  try {
    console.log('🌐 [Server] Received Runware API request');
    console.log('🌐 [Server] Request headers:', req.headers);
    console.log('🌐 [Server] Raw request body type:', typeof req.body);
    console.log('🌐 [Server] Raw request body:', JSON.stringify(req.body, null, 2));
    
    const requestData = Array.isArray(req.body) ? req.body[0] : req.body;
    const { apiKey, ...requestBody } = requestData;
    
    console.log('🌐 [Server] Runware API key received:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT PROVIDED');
    console.log('🌐 [Server] Extracted request body:', {
      taskType: requestBody.taskType,
      taskUUID: requestBody.taskUUID,
      type: requestBody.type,
      positivePrompt: requestBody.positivePrompt?.substring(0, 100) + '...',
      model: requestBody.model,
      width: requestBody.width,
      height: requestBody.height,
      duration: requestBody.duration,
      fps: requestBody.fps,
      deliveryMethod: requestBody.deliveryMethod,
      frameImages: requestBody.frameImages ? `[${requestBody.frameImages.length} frame images]` : 'none'
    });
    
    console.log('🌐 [Server] Sending to Runware API...');
    console.log('🌐 [Server] Payload being sent:', JSON.stringify([requestBody], null, 2).substring(0, 1000) + '...');
    
    const response = await fetch('https://api.runware.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify([requestBody])
    });

    console.log('🌐 [Server] Runware API response status:', response.status);
    console.log('🌐 [Server] Runware API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🌐 [Server] Runware API error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: errorText };
      }
      
      console.error('🌐 [Server] Parsed error data:', errorData);
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    console.log('🌐 [Server] Runware API success response:', {
      success: true,
      dataStructure: Array.isArray(data.data) ? `data array with ${data.data.length} items` : 'not data array',
      firstItem: data.data?.[0] ? {
        status: data.data[0].status,
        taskUUID: data.data[0].taskUUID,
        hasImageURL: !!data.data[0].imageURL,
        hasVideoURL: !!data.data[0].videoURL,
        allKeys: Object.keys(data.data[0]),
        cost: data.data[0].cost
      } : 'no first item',
      fullResponse: data
    });
    
    // Log the exact first item for debugging
    if (data.data && data.data[0]) {
      console.log('🌐 [Server] EXACT first item structure:', JSON.stringify(data.data[0], null, 2));
    }
    
    console.log('🌐 [Server] Sending response back to frontend...');
    res.json(data);
  } catch (error) {
    console.error('🌐 [Server] Error calling Runware API:', error);
    console.error('🌐 [Server] Error stack:', error.stack);
    res.status(500).json({ error: 'Failed to call Runware API', details: error.message });
  }
});

// Memories AI API proxy endpoint
app.post('/api/memories', async (req, res) => {
  try {
    const { apiKey, ...requestBody } = req.body;
    
    const response = await fetch('https://api.memories.ai/v1/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling Memories AI API:', error);
    res.status(500).json({ error: 'Failed to call Memories AI API' });
  }
});

// Memories AI video upload endpoint
app.post('/api/memories/upload-video', async (req, res) => {
  try {
    console.log('🧠 [Server] Received Memories AI video upload request');
    const { apiKey, videoUrl, type } = req.body;
    
    console.log('🧠 [Server] Memories AI API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT PROVIDED');
    console.log('🧠 [Server] Video URL:', videoUrl);
    console.log('🧠 [Server] Type:', type);
    
    // For now, we'll simulate upload and return a video_no for analysis
    // The actual upload API endpoint needs to be determined from Memories.ai docs
    const response = await fetch('https://api.memories.ai/serve/api/video/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify({
        url: videoUrl,
        type: type || 'video'
      })
    });

    console.log('🧠 [Server] Memories AI upload response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('🧠 [Server] Memories AI upload error:', errorData);
      
      // If upload fails, generate a mock video_no for testing
      const mockVideoNo = `video_${Date.now()}`;
      console.log('🧠 [Server] Using mock video_no for testing:', mockVideoNo);
      return res.json({ video_no: mockVideoNo, status: 'mock' });
    }

    const data = await response.json();
    console.log('🧠 [Server] Memories AI upload success:', data);
    res.json(data);
  } catch (error) {
    console.error('🧠 [Server] Error calling Memories AI upload:', error);
    // Fallback to mock for testing
    const mockVideoNo = `video_${Date.now()}`;
    console.log('🧠 [Server] Fallback to mock video_no:', mockVideoNo);
    res.json({ video_no: mockVideoNo, status: 'fallback' });
  }
});

// Memories AI video analysis endpoint (using correct API format)
app.get('/api/memories/analyze-video', async (req, res) => {
  try {
    console.log('🧠 [Server] Received Memories AI video analysis request');
    const { apiKey, video_no, type } = req.query;
    
    console.log('🧠 [Server] Memories AI API key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT PROVIDED');
    console.log('🧠 [Server] Video No:', video_no);
    console.log('🧠 [Server] Type:', type);
    
    const url = new URL('https://api.memories.ai/serve/api/video/generate_summary');
    url.searchParams.append('video_no', video_no);
    url.searchParams.append('type', type || 'summary');
    
    console.log('🧠 [Server] Calling Memories AI with URL:', url.toString());
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': apiKey
      }
    });

    console.log('🧠 [Server] Memories AI analysis response status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('🧠 [Server] Memories AI analysis error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to analyze video', 
        details: errorData,
        video_no: video_no 
      });
    }

    const data = await response.json();
    console.log('🧠 [Server] Memories AI analysis success:', data);
    res.json(data);
  } catch (error) {
    console.error('🧠 [Server] Error calling Memories AI analysis:', error);
    res.status(500).json({ error: 'Failed to analyze video with Memories AI', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  - POST /api/claude (Claude API)');
  console.log('  - POST /api/elevenlabs (ElevenLabs API)');
  console.log('  - POST /api/runware (Runware API)');
  console.log('  - POST /api/memories (Memories AI API)');
}); 