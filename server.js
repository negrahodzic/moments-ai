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
    const { apiKey, ...requestBody } = req.body;
    
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error calling ElevenLabs API:', error);
    res.status(500).json({ error: 'Failed to call ElevenLabs API' });
  }
});

// Runware API proxy endpoint
app.post('/api/runware', async (req, res) => {
  try {
    const requestData = Array.isArray(req.body) ? req.body[0] : req.body;
    const { apiKey, ...requestBody } = requestData;
    
    console.log('Runware API key received:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT PROVIDED');
    console.log('Runware API request:', {
      taskType: requestBody.taskType || 'imageInference',
      taskUUID: requestBody.taskUUID || 'NOT_PROVIDED',
      type: requestBody.type || 'image',
      positivePrompt: requestBody.positivePrompt?.substring(0, 100) + '...', // Updated to positivePrompt
      model: requestBody.model,
      width: requestBody.width,
      height: requestBody.height,
      duration: requestBody.duration, // Added for video
      fps: requestBody.fps // Added for video
    });
    
    console.log('Sending to Runware API:', JSON.stringify([requestBody], null, 2));
    
    const response = await fetch('https://api.runware.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify([requestBody]) // Fixed: ensure payload is an array
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Runware API error:', errorData);
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    console.log('Runware API response:', {
      success: true,
      hasImage: !!data.data?.[0]?.imageURL || !!data.data?.[0]?.imageUrl || !!data.data?.[0]?.image_url || !!data.data?.[0]?.url,
      hasVideo: !!data.data?.[0]?.videoURL || !!data.data?.[0]?.videoUrl || !!data.data?.[0]?.video_url,
      cost: data.data?.[0]?.cost,
      responseStructure: Array.isArray(data.data) ? 'data array' : Array.isArray(data) ? 'direct array' : 'unknown'
    });
    
    res.json(data);
  } catch (error) {
    console.error('Error calling Runware API:', error);
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

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  - POST /api/claude (Claude API)');
  console.log('  - POST /api/elevenlabs (ElevenLabs API)');
  console.log('  - POST /api/runware (Runware API)');
  console.log('  - POST /api/memories (Memories AI API)');
}); 