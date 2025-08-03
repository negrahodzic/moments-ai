import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Play, 
  Pause, 
  Download, 
  Loader2, 
  Video, 
  Sparkles,
  Clock,
  Users,
  Lightbulb,
  Camera,
  Volume2
} from 'lucide-react';
import { generateVideo, pollVideoResult } from '../api/runware';
import { synthesizeSpeech } from '../api/elevenlabs';
import { uploadVideoForAnalysis, getVideoAnalysis } from '../api/memories';
import { useToast } from './ui/use-toast';

interface VideoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseImageUrl: string;
  venueName: string;
  eventType: string;
}

export default function VideoWalkthroughModal({
  isOpen,
  onClose,
  baseImageUrl,
  venueName,
  eventType
}: VideoWalkthroughModalProps) {
  const { toast } = useToast();
  const [animationPrompt, setAnimationPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [taskUUID, setTaskUUID] = useState('');
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Audio generation states
  const [audioUrl, setAudioUrl] = useState('');
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [narratedVideoUrl, setNarratedVideoUrl] = useState('');
  const [isMergingAudio, setIsMergingAudio] = useState(false);
  
  // Memories.ai integration states
  const [isAnalyzingVideo, setIsAnalyzingVideo] = useState(false);
  const [videoAnalysis, setVideoAnalysis] = useState<{ description: string; summary: string; tags: string[] } | null>(null);
  const [memoriesVideoNo, setMemoriesVideoNo] = useState('');

  // Example animation prompts
  const examplePrompts = [
    {
      title: "Panel Discussion",
      prompt: "5 panelists walking and talking around the venue, natural conversation movements, professional atmosphere",
      icon: Users
    },
    {
      title: "Event Setup",
      prompt: "Staff setting up tables and chairs, moving equipment, preparing the venue for the event",
      icon: Lightbulb
    },
    {
      title: "Guests Arriving",
      prompt: "Guests entering the venue, mingling, networking, natural social interactions",
      icon: Users
    },
    {
      title: "Presentation Mode",
      prompt: "Speaker presenting at the front, audience engaged, professional presentation atmosphere",
      icon: Camera
    },
    {
      title: "Networking Session",
      prompt: "Guests networking in small groups, conversations, handshakes, professional networking atmosphere",
      icon: Users
    },
    {
      title: "Custom Animation",
      prompt: "",
      icon: Sparkles
    }
  ];

  // Analyze video with Memories.ai to get intelligent description
  const analyzeVideoWithMemories = async (videoUrl: string) => {
    console.log('🧠 [VideoModal] Starting Memories.ai video analysis for:', videoUrl);
    setIsAnalyzingVideo(true);
    
    try {
      // Step 1: Upload video to Memories.ai
      console.log('🧠 [VideoModal] Uploading video to Memories.ai...');
      const uploadResult = await uploadVideoForAnalysis(videoUrl);
      console.log('🧠 [VideoModal] Upload result:', uploadResult);
      
      setMemoriesVideoNo(uploadResult.videoNo);
      
      // Step 2: Get video analysis
      console.log('🧠 [VideoModal] Getting video analysis...');
      const analysis = await getVideoAnalysis(uploadResult.videoNo);
      console.log('🧠 [VideoModal] Analysis result:', analysis);
      
      setVideoAnalysis(analysis);
      
      toast({
        title: "Video Analyzed!",
        description: "AI has analyzed your video and generated an intelligent description.",
      });
      
      // Step 3: Automatically generate audio based on the AI analysis
      console.log('🧠 [VideoModal] Auto-generating audio based on AI analysis...');
      await handleGenerateAudioFromAnalysis(analysis);
      
    } catch (error) {
      console.error('🧠 [VideoModal] Error analyzing video:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze video with AI. You can still add audio manually.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzingVideo(false);
    }
  };

  // Generate audio based on Memories.ai analysis
  const handleGenerateAudioFromAnalysis = async (analysis: { description: string; summary: string; tags: string[] }) => {
    console.log('🎵 [VideoModal] Starting audio generation from AI analysis...');
    setIsGeneratingAudio(true);

    try {
      // Create professional narration based on the AI analysis
      const narrationText = `Welcome to ${venueName}, the perfect venue for your ${eventType}.
      
      Our AI analysis reveals: ${analysis.description}
      
      This space embodies ${analysis.tags.slice(0, 3).join(', ')} qualities, making it ideal for your upcoming event.
      
      ${analysis.summary}
      
      Experience the possibilities of hosting your ${eventType} at ${venueName}, where every detail comes together to create unforgettable moments.`;

      console.log('🎵 [VideoModal] Generating AI-powered narration:', narrationText);

      const audioResult = await synthesizeSpeech({
        text: narrationText,
        voice_id: 'pNInz6obpgDQGcFmaJgB', // Professional male voice
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.8,
          style: 0.1,
          use_speaker_boost: true
        }
      });

      console.log('🎵 [VideoModal] AI-powered audio generated successfully:', audioResult);
      console.log('🎵 [VideoModal] audioResult.audioUrl:', audioResult.audioUrl);
      console.log('🎵 [VideoModal] audioResult full object:', audioResult);
      
      // Handle different possible response structures
      const extractedAudioUrl = audioResult.audioUrl || audioResult.audio || audioResult.url || audioResult;
      console.log('🎵 [VideoModal] Extracted audio URL:', extractedAudioUrl);
      
      setAudioUrl(extractedAudioUrl);

      toast({
        title: "AI-Generated Audio Ready!",
        description: "Professional narration created based on video analysis.",
      });

      // Automatically merge video and audio
      console.log('🎬 [VideoModal] Auto-merging video with AI-generated audio...');
      console.log('🎬 [VideoModal] Current videoUrl:', videoUrl ? `${videoUrl.substring(0, 50)}...` : 'null');
      console.log('🎬 [VideoModal] Current audioUrl:', extractedAudioUrl ? `${extractedAudioUrl.substring(0, 50)}...` : 'null');
      
      // Wait a moment for state to update, then merge
      setTimeout(async () => {
        console.log('🎬 [VideoModal] Delayed merge attempt...');
        console.log('🎬 [VideoModal] videoUrl after delay:', videoUrl ? `${videoUrl.substring(0, 50)}...` : 'null');
        console.log('🎬 [VideoModal] audioUrl after delay:', audioUrl ? `${audioUrl.substring(0, 50)}...` : 'null');
        
        // If state is still not ready, use the direct values
        if (!videoUrl || !audioUrl) {
          console.log('🎬 [VideoModal] State not ready, calling direct merge with values...');
          // Get current video URL from video element or use the last known video URL
          const currentVideoEl = document.querySelector('video[src*="runware"]') as HTMLVideoElement;
          const currentVideoUrl = currentVideoEl?.src || videoUrl || '';
          console.log('🎬 [VideoModal] Found current video URL:', currentVideoUrl ? `${currentVideoUrl.substring(0, 50)}...` : 'none');
          await handleDirectMerge(currentVideoUrl, extractedAudioUrl || '');
        } else {
          await handleMergeVideoAudio();
        }
      }, 100);

    } catch (error) {
      console.error('🎵 [VideoModal] Error generating AI-powered audio:', error);
      toast({
        title: "Audio Generation Failed",
        description: "Failed to generate AI-powered narration. You can try manual audio generation.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Generate professional narration for the video (manual method)
  const handleGenerateAudio = async () => {
    if (!animationPrompt.trim()) {
      toast({
        title: "Missing Animation Prompt",
        description: "Please enter an animation description first.",
        variant: "destructive"
      });
      return;
    }

    console.log('🎵 [VideoModal] Starting audio generation...');
    setIsGeneratingAudio(true);

    try {
      // Create professional narration based on the animation prompt and venue context
      const narrationText = `Welcome to ${venueName}, where your ${eventType} comes to life. 
      
      In this visualization, you can see ${animationPrompt}. 
      
      This ${venueName} offers the perfect setting for your ${eventType}, with its professional atmosphere and versatile layout. 
      
      The scene demonstrates how your event will unfold naturally in this beautiful space, creating memorable moments for all attendees.
      
      Experience the possibilities of hosting your ${eventType} at ${venueName}.`;

      console.log('🎵 [VideoModal] Generating narration:', narrationText);

      const audioResult = await synthesizeSpeech({
        text: narrationText,
        voice_id: 'pNInz6obpgDQGcFmaJgB', // Professional male voice
        voice_settings: {
          stability: 0.7,
          similarity_boost: 0.8,
          style: 0.1,
          use_speaker_boost: true
        }
      });

      console.log('🎵 [VideoModal] Audio generated successfully:', audioResult.audioUrl);
      setAudioUrl(audioResult.audioUrl);

      toast({
        title: "Audio Generated!",
        description: "Professional narration created successfully.",
      });

    } catch (error) {
      console.error('🎵 [VideoModal] Error generating audio:', error);
      toast({
        title: "Audio Generation Failed",
        description: "Failed to generate narration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  // Merge video and audio using Web APIs
  const handleMergeVideoAudio = async () => {
    console.log('🎬 [VideoModal] ⭐ MERGE FUNCTION CALLED!');
    console.log('🎬 [VideoModal] Checking required media...');
    console.log('🎬 [VideoModal] videoUrl available:', !!videoUrl, videoUrl ? `${videoUrl.substring(0, 50)}...` : 'null');
    console.log('🎬 [VideoModal] audioUrl available:', !!audioUrl, audioUrl ? `${audioUrl.substring(0, 50)}...` : 'null');
    
    if (!videoUrl || !audioUrl) {
      console.error('🎬 [VideoModal] ❌ Missing media for merge!');
      toast({
        title: "Missing Content",
        description: "Both video and audio must be generated first.",
        variant: "destructive"
      });
      return;
    }

    console.log('🎬 [VideoModal] ✅ Both media available, starting video + audio merge...');
    setIsMergingAudio(true);

    try {
      // Create video and audio elements
      const video = document.createElement('video');
      const audio = document.createElement('audio');
      
      video.src = videoUrl;
      audio.src = audioUrl;
      video.crossOrigin = 'anonymous';
      audio.crossOrigin = 'anonymous';

      console.log('🎬 [VideoModal] Loading video and audio...');

      // Wait for both to load
      await Promise.all([
        new Promise((resolve, reject) => {
          video.addEventListener('loadeddata', resolve);
          video.addEventListener('error', reject);
        }),
        new Promise((resolve, reject) => {
          audio.addEventListener('loadeddata', resolve);
          audio.addEventListener('error', reject);
        })
      ]);

      console.log('🎬 [VideoModal] Media loaded, starting merge process...');

      // Create canvas for video rendering
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      console.log('🎬 [VideoModal] Canvas dimensions:', canvas.width, 'x', canvas.height);

      // Create streams
      const videoStream = canvas.captureStream(24); // 24 fps
      const audioContext = new AudioContext();
      const audioSource = audioContext.createMediaElementSource(audio);
      const destination = audioContext.createMediaStreamDestination();
      audioSource.connect(destination);

      // Combine video and audio streams
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...destination.stream.getAudioTracks()
      ]);

      console.log('🎬 [VideoModal] Streams combined, starting recording...');

      // Record the combined stream
      const recorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);

      const mergedVideoPromise = new Promise<string>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          resolve(url);
        };
      });

      // Start recording and playback
      recorder.start();
      
      video.currentTime = 0;
      audio.currentTime = 0;

      // Render video frames to canvas
      const renderFrame = () => {
        if (video.currentTime < video.duration) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(renderFrame);
        } else {
          console.log('🎬 [VideoModal] Video rendering complete, stopping recording...');
          recorder.stop();
        }
      };

      video.play();
      audio.play();
      renderFrame();

      const mergedUrl = await mergedVideoPromise;
      console.log('🎬 [VideoModal] Merge complete! URL:', mergedUrl);

      console.log('🎬 [VideoModal] Setting narrated video URL:', mergedUrl);
      setNarratedVideoUrl(mergedUrl);

      toast({
        title: "Video + Audio Merged!",
        description: "Your narrated video walkthrough is ready.",
      });

    } catch (error) {
      console.error('🎬 [VideoModal] Error merging video and audio:', error);
      toast({
        title: "Merge Failed",
        description: "Failed to combine video and audio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsMergingAudio(false);
    }
  };

  // Direct merge function that takes URLs as parameters (fallback for state issues)
  const handleDirectMerge = async (directVideoUrl: string, directAudioUrl: string) => {
    console.log('🎬 [VideoModal] ⭐ DIRECT MERGE FUNCTION CALLED!');
    console.log('🎬 [VideoModal] Direct video URL:', directVideoUrl ? `${directVideoUrl.substring(0, 50)}...` : 'null');
    console.log('🎬 [VideoModal] Direct audio URL:', directAudioUrl ? `${directAudioUrl.substring(0, 50)}...` : 'null');
    
    if (!directVideoUrl || !directAudioUrl) {
      console.error('🎬 [VideoModal] ❌ Missing media for direct merge!');
      toast({
        title: "Missing Media",
        description: "Cannot merge: video or audio not available.",
        variant: "destructive"
      });
      return;
    }

    console.log('🎬 [VideoModal] ✅ Direct merge starting...');
    setIsMergingAudio(true);

    try {
      // Create video and audio elements with direct URLs
      const video = document.createElement('video');
      const audio = document.createElement('audio');
      
      video.src = directVideoUrl;
      audio.src = directAudioUrl;
      video.crossOrigin = 'anonymous';
      audio.crossOrigin = 'anonymous';

      console.log('🎬 [VideoModal] Loading direct media...');

      // Wait for both to load
      await Promise.all([
        new Promise((resolve, reject) => {
          video.addEventListener('loadeddata', resolve);
          video.addEventListener('error', reject);
        }),
        new Promise((resolve, reject) => {
          audio.addEventListener('loadeddata', resolve);
          audio.addEventListener('error', reject);
        })
      ]);

      console.log('🎬 [VideoModal] Direct media loaded, starting merge process...');

      // Create canvas for video rendering
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      console.log('🎬 [VideoModal] Canvas dimensions:', canvas.width, 'x', canvas.height);

      // Create streams
      const videoStream = canvas.captureStream(24); // 24 fps
      const audioContext = new AudioContext();
      const audioSource = audioContext.createMediaElementSource(audio);
      const destination = audioContext.createMediaStreamDestination();
      audioSource.connect(destination);

      // Combine video and audio streams
      const combinedStream = new MediaStream([
        ...videoStream.getVideoTracks(),
        ...destination.stream.getAudioTracks()
      ]);

      console.log('🎬 [VideoModal] Streams combined, starting recording...');

      // Record the combined stream
      const recorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);

      const mergedVideoPromise = new Promise<string>((resolve) => {
        recorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          resolve(url);
        };
      });

      // Start recording and playback
      recorder.start();
      
      video.currentTime = 0;
      audio.currentTime = 0;

      // Render video frames to canvas
      const renderFrame = () => {
        if (video.currentTime < video.duration) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          requestAnimationFrame(renderFrame);
        } else {
          console.log('🎬 [VideoModal] Direct merge rendering complete, stopping recording...');
          recorder.stop();
        }
      };

      video.play();
      audio.play();
      renderFrame();

      const mergedUrl = await mergedVideoPromise;
      console.log('🎬 [VideoModal] Direct merge complete! URL:', mergedUrl);
      console.log('🎬 [VideoModal] Setting narrated video URL from direct merge:', mergedUrl);
      setNarratedVideoUrl(mergedUrl);

      toast({
        title: "Video + Audio Merged!",
        description: "Your narrated video walkthrough is ready.",
      });

    } catch (error) {
      console.error('🎬 [VideoModal] Error in direct merge:', error);
      toast({
        title: "Merge Failed",
        description: "Failed to combine video and audio. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsMergingAudio(false);
    }
  };

  const handleGenerateVideo = async () => {
    console.log('🎬 [VideoModal] Starting video generation process...');
    console.log('🎬 [VideoModal] Animation prompt:', animationPrompt);
    console.log('🎬 [VideoModal] Base image URL:', baseImageUrl);
    console.log('🎬 [VideoModal] Venue name:', venueName);
    console.log('🎬 [VideoModal] Event type:', eventType);

    if (!animationPrompt.trim()) {
      console.warn('🎬 [VideoModal] No animation prompt provided');
      toast({
        title: "Missing Animation Prompt",
        description: "Please describe what you want to animate in the video.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setVideoUrl('');
    console.log('🎬 [VideoModal] Set generating state to true, cleared video URL');

    try {
      console.log('🎬 [VideoModal] Calling generateVideo API with parameters:', {
        baseImageUrl,
        animationPrompt,
        duration: 5,
        width: 1920,
        height: 1080,
        model: 'klingai:5@3',
        fps: 24,
        CFGScale: 0.8
      });

      const result = await generateVideo({
        baseImageUrl,
        animationPrompt,
        duration: 5, // 5 seconds as requested
        width: 1920,
        height: 1080,
        model: 'klingai:5@3',
        fps: 24,
        CFGScale: 0.8
      });

      console.log('🎬 [VideoModal] generateVideo result:', result);
      console.log('🎬 [VideoModal] Task UUID received:', result.taskUUID);

      setTaskUUID(result.taskUUID);
      toast({
        title: "Video Generation Started",
        description: "Your video is being generated. This may take a few minutes.",
      });

      // Start polling for results
      console.log('🎬 [VideoModal] Starting polling for task:', result.taskUUID);
      startPolling(result.taskUUID);
    } catch (error) {
      console.error('🎬 [VideoModal] Error generating video:', error);
      console.error('🎬 [VideoModal] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      toast({
        title: "Generation Failed",
        description: "Failed to start video generation. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const startPolling = (uuid: string) => {
    console.log('🔄 [VideoModal] Starting polling interval for UUID:', uuid);
    
    const interval = setInterval(async () => {
      try {
        console.log('🔄 [VideoModal] Polling video result for UUID:', uuid);
        const result = await pollVideoResult(uuid);
        console.log('🔄 [VideoModal] Poll result:', result);
        
        if (result.status === 'completed' && result.videoUrl) {
          console.log('✅ [VideoModal] Video generation completed!');
          console.log('✅ [VideoModal] Final video URL:', result.videoUrl);
          
          // Test if video URL is accessible
          console.log('✅ [VideoModal] Testing video URL accessibility...');
          fetch(result.videoUrl, { method: 'HEAD' })
            .then(response => {
              console.log('✅ [VideoModal] Video URL test response:', response.status, response.headers.get('content-type'));
              if (!response.ok) {
                console.error('✅ [VideoModal] Video URL not accessible:', response.status);
              }
            })
            .catch(error => {
              console.error('✅ [VideoModal] Video URL test failed:', error);
            });
          
          setVideoUrl(result.videoUrl);
          setIsGenerating(false);
          clearInterval(interval);
          setPollingInterval(null);
          
          console.log('✅ [VideoModal] Updated state - videoUrl set, generating=false');
          
          toast({
            title: "Video Generated!",
            description: "Starting AI analysis and narration...",
          });

          // Automatically analyze video with Memories.ai and generate intelligent audio
          console.log('🧠 [VideoModal] Auto-starting Memories.ai analysis workflow...');
          analyzeVideoWithMemories(result.videoUrl);
        } else if (result.status === 'error') {
          console.error('❌ [VideoModal] Video generation failed with error status');
          setIsGenerating(false);
          clearInterval(interval);
          setPollingInterval(null);
          toast({
            title: "Generation Failed",
            description: "Video generation failed. Please try again.",
            variant: "destructive"
          });
        } else {
          console.log('⏳ [VideoModal] Video still generating, status:', result.status);
        }
        // If status is 'pending', continue polling
      } catch (error) {
        console.error('❌ [VideoModal] Error polling video result:', error);
        console.error('❌ [VideoModal] Polling error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
        setIsGenerating(false);
        clearInterval(interval);
        setPollingInterval(null);
        toast({
          title: "Polling Error",
          description: "Failed to check video status. Please try again.",
          variant: "destructive"
        });
      }
    }, 5000); // Poll every 5 seconds

    setPollingInterval(interval);
    console.log('🔄 [VideoModal] Polling interval set, will check every 5 seconds');
  };

  const handleExampleClick = (prompt: string) => {
    setAnimationPrompt(prompt);
  };

  const handleDownload = async () => {
    if (!videoUrl) return;

    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${venueName}-walkthrough.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: "Video walkthrough download started.",
      });
    } catch (error) {
      console.error('Error downloading video:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download video. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [pollingInterval]);

  // Debug state changes
  useEffect(() => {
    console.log('📺 [VideoModal] videoUrl state changed:', videoUrl);
  }, [videoUrl]);

  useEffect(() => {
    console.log('📺 [VideoModal] isGenerating state changed:', isGenerating);
  }, [isGenerating]);

  useEffect(() => {
    console.log('📺 [VideoModal] taskUUID state changed:', taskUUID);
  }, [taskUUID]);

  // Debug audio states
  useEffect(() => {
    console.log('🎵 [VideoModal] audioUrl state changed:', audioUrl);
  }, [audioUrl]);

  useEffect(() => {
    console.log('🎬 [VideoModal] ⭐ NARRATED VIDEO URL STATE CHANGED:', narratedVideoUrl);
    if (narratedVideoUrl) {
      console.log('🎬 [VideoModal] ✅ Narrated video is now available! Video player should display this URL with audio.');
      console.log('🎬 [VideoModal] ✅ URL preview:', narratedVideoUrl.substring(0, 100) + '...');
    } else {
      console.log('🎬 [VideoModal] ❌ Narrated video URL is null/empty - will show original video');
    }
  }, [narratedVideoUrl]);

  // Debug API key on component mount
  useEffect(() => {
    const runwareApiKey = import.meta.env.VITE_RUNWARE_API_KEY;
    const elevenlabsApiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    
    console.log('📺 [VideoModal] Component mounted - API key status:');
    console.log('  Runware:', runwareApiKey ? `Present (${runwareApiKey.substring(0, 10)}...)` : 'NOT FOUND');
    console.log('  ElevenLabs:', elevenlabsApiKey ? `Present (${elevenlabsApiKey.substring(0, 10)}...)` : 'NOT FOUND');
    
    console.log('📺 [VideoModal] Environment variables:', {
      VITE_RUNWARE_API_KEY: runwareApiKey ? 'PRESENT' : 'MISSING',
      VITE_ELEVENLABS_API_KEY: elevenlabsApiKey ? 'PRESENT' : 'MISSING',
      NODE_ENV: import.meta.env.NODE_ENV,
      MODE: import.meta.env.MODE,
      DEV: import.meta.env.DEV
    });
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-purple-600" />
            <span>Create Video Walkthrough</span>
          </DialogTitle>
          <DialogDescription>
            Describe the scene you want to animate and we'll create a video walkthrough for you.
          </DialogDescription>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Panel - Input and Examples */}
          <div className="space-y-6">
            {/* Base Image Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Base Image</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={baseImageUrl} 
                    alt="Base image for video" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This image will be used as the starting frame for your video animation.
                </p>
              </CardContent>
            </Card>

            {/* Animation Prompt Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Animation Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="animation-prompt">What should happen in the video?</Label>
                  <Textarea
                    id="animation-prompt"
                    value={animationPrompt}
                    onChange={(e) => setAnimationPrompt(e.target.value)}
                    placeholder="Describe the animation you want to see (e.g., '5 panelists walking and talking around the venue')"
                    className="mt-2 min-h-[100px]"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Duration: 5 seconds</span>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleGenerateVideo}
                    disabled={isGenerating || !animationPrompt.trim()}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Video...
                      </>
                    ) : (
                      <>
                        <Video className="h-4 w-4 mr-2" />
                        Generate Video Walkthrough
                      </>
                    )}
                  </Button>

                  {/* Audio generation button - only show after video is generated */}
                  {videoUrl && !audioUrl && (
                    <Button 
                      onClick={handleGenerateAudio}
                      disabled={isGeneratingAudio}
                      variant="outline"
                      className="w-full"
                    >
                      {isGeneratingAudio ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Audio...
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-4 w-4 mr-2" />
                          Add Professional Narration
                        </>
                      )}
                    </Button>
                  )}

                  {/* Merge button - only show when both video and audio are ready */}
                  {videoUrl && audioUrl && !narratedVideoUrl && (
                    <Button 
                      onClick={handleMergeVideoAudio}
                      disabled={isMergingAudio}
                      variant="default"
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      {isMergingAudio ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Merging Video + Audio...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Create Narrated Video
                        </>
                      )}
                    </Button>
                  )}

                  {/* Success message when narrated video is ready */}
                  {narratedVideoUrl && (
                    <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 font-medium">
                        ✨ Professional narrated video ready!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* AI Video Analysis Results */}
            {videoAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-blue-600" />
                    AI Video Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs font-medium text-gray-600 mb-1">Summary</h4>
                      <p className="text-sm text-gray-700">{videoAnalysis.summary}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-gray-600 mb-1">AI Description</h4>
                      <p className="text-xs text-gray-600 leading-relaxed">{videoAnalysis.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-medium text-gray-600 mb-1">Detected Elements</h4>
                      <div className="flex flex-wrap gap-1">
                        {videoAnalysis.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Example Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Quick Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {examplePrompts.map((example, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExampleClick(example.prompt)}
                      className="justify-start h-auto p-3"
                      disabled={isGenerating}
                    >
                      <example.icon className="h-4 w-4 mr-2 text-purple-600" />
                      <div className="text-left">
                        <div className="font-medium">{example.title}</div>
                        {example.prompt && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {example.prompt}
                          </div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Video Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Video Preview {narratedVideoUrl && "(With Audio)"}</span>
                  <div className="flex gap-2">
                    {videoUrl && (
                      <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-1" />
                        {narratedVideoUrl ? "Original" : "Download"}
                      </Button>
                    )}
                    {narratedVideoUrl && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = narratedVideoUrl;
                          link.download = `${venueName}-narrated-walkthrough.webm`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          toast({
                            title: "Download Started",
                            description: "Narrated video walkthrough download started.",
                          });
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Narrated
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {isGenerating ? (
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
                      <p className="text-gray-600">Generating video walkthrough...</p>
                      <p className="text-sm text-gray-500 mt-1">This may take 2-3 minutes</p>
                      <Badge variant="secondary" className="mt-2">
                        Task ID: {taskUUID.substring(0, 8)}...
                      </Badge>
                    </div>
                  ) : isAnalyzingVideo || isGeneratingAudio ? (
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                      {isAnalyzingVideo ? (
                        <>
                          <p className="text-gray-600">🧠 AI is analyzing your video...</p>
                          <p className="text-sm text-gray-500 mt-1">Creating intelligent narration</p>
                          {memoriesVideoNo && (
                            <Badge variant="secondary" className="mt-2">
                              Video No: {memoriesVideoNo.substring(0, 12)}...
                            </Badge>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="text-gray-600">🎵 Generating AI-powered narration...</p>
                          <p className="text-sm text-gray-500 mt-1">Based on video analysis</p>
                          {videoAnalysis && (
                            <Badge variant="secondary" className="mt-2">
                              Tags: {videoAnalysis.tags.slice(0, 2).join(', ')}
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  ) : isMergingAudio ? (
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                      <p className="text-gray-600">🎬 Merging video with AI narration...</p>
                      <p className="text-sm text-gray-500 mt-1">Creating final video</p>
                      <Badge variant="secondary" className="mt-2">
                        Format: WebM with Audio
                      </Badge>
                      
                      {/* Debug button for manual testing */}
                      {taskUUID && (
                        <div className="mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={async () => {
                              console.log('🔧 [VideoModal] Manual poll test for:', taskUUID);
                              try {
                                const result = await pollVideoResult(taskUUID);
                                console.log('🔧 [VideoModal] Manual poll result:', result);
                                if (result.videoUrl) {
                                  setVideoUrl(result.videoUrl);
                                  setIsGenerating(false);
                                }
                              } catch (error) {
                                console.error('🔧 [VideoModal] Manual poll error:', error);
                              }
                            }}
                          >
                            🔧 Test Poll
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (narratedVideoUrl || videoUrl) ? (
                    <div className="relative w-full h-full">
                      {console.log('📺 [VideoModal] Video display logic:', { 
                        narratedVideoUrl: narratedVideoUrl ? `${narratedVideoUrl.substring(0, 50)}...` : null, 
                        videoUrl: videoUrl ? `${videoUrl.substring(0, 50)}...` : null,
                        displayingUrl: narratedVideoUrl || videoUrl
                      })}
                      <video
                        key={`${narratedVideoUrl || videoUrl}-${Date.now()}`} // Force re-render with timestamp
                        src={narratedVideoUrl || videoUrl}
                        controls
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                        preload="metadata"
                        onPlay={() => {
                          console.log('📺 [VideoModal] Video started playing');
                          setIsPlaying(true);
                        }}
                        onPause={() => {
                          console.log('📺 [VideoModal] Video paused');
                          setIsPlaying(false);
                        }}
                        onLoadStart={() => {
                          console.log('📺 [VideoModal] Video load started for URL:', narratedVideoUrl || videoUrl);
                          console.log('📺 [VideoModal] Video element properties:', {
                            src: (narratedVideoUrl || videoUrl),
                            duration: 'loading...',
                            videoWidth: 'loading...',
                            videoHeight: 'loading...'
                          });
                        }}
                        onLoadedMetadata={(e) => {
                          console.log('📺 [VideoModal] Video metadata loaded');
                          const video = e.target as HTMLVideoElement;
                          console.log('📺 [VideoModal] Video metadata:', {
                            duration: video.duration,
                            videoWidth: video.videoWidth,
                            videoHeight: video.videoHeight,
                            readyState: video.readyState,
                            networkState: video.networkState
                          });
                        }}
                        onLoadedData={() => {
                          console.log('📺 [VideoModal] Video data loaded successfully');
                        }}
                        onError={(e) => {
                          console.error('📺 [VideoModal] Video error:', e);
                          const video = e.target as HTMLVideoElement;
                          console.error('📺 [VideoModal] Video error details:', {
                            error: video.error?.code,
                            message: video.error?.message,
                            src: video.src,
                            networkState: video.networkState,
                            readyState: video.readyState,
                            currentSrc: video.currentSrc
                          });
                        }}
                        onCanPlay={() => {
                          console.log('📺 [VideoModal] Video can start playing');
                        }}
                        onWaiting={() => {
                          console.log('📺 [VideoModal] Video is waiting for data');
                        }}
                        onStalled={() => {
                          console.log('📺 [VideoModal] Video stalled - network issues?');
                        }}
                        onSuspend={() => {
                          console.log('📺 [VideoModal] Video loading suspended');
                        }}
                        onAbort={() => {
                          console.log('📺 [VideoModal] Video loading aborted');
                        }}
                        onEmptied={() => {
                          console.log('📺 [VideoModal] Video emptied');
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Video will appear here</p>
                      <p className="text-sm mt-1">Enter a description and generate</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Audio Player */}
            {audioUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Generated Narration</CardTitle>
                </CardHeader>
                <CardContent>
                  <audio
                    controls
                    className="w-full"
                    src={audioUrl}
                    onLoadStart={() => {
                      console.log('🎵 [VideoModal] Audio load started');
                    }}
                    onLoadedData={() => {
                      console.log('🎵 [VideoModal] Audio loaded successfully');
                    }}
                    onError={(e) => {
                      console.error('🎵 [VideoModal] Audio error:', e);
                    }}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Professional narration describing the venue walkthrough
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Video Info */}
            {videoUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {narratedVideoUrl ? "Narrated Video Details" : "Video Details"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Duration:</span>
                    <span>5 seconds</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Resolution:</span>
                    <span>1920 × 1080</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Frame Rate:</span>
                    <span>24 fps</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Format:</span>
                    <span>{narratedVideoUrl ? "WebM (with audio)" : "MP4 (silent)"}</span>
                  </div>
                  {narratedVideoUrl && (
                    <div className="flex justify-between text-sm">
                      <span>Audio:</span>
                      <span>Professional narration</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 