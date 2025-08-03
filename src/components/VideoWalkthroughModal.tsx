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
  Camera
} from 'lucide-react';
import { generateVideo, pollVideoResult } from '../api/runware';
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

  const handleGenerateVideo = async () => {
    if (!animationPrompt.trim()) {
      toast({
        title: "Missing Animation Prompt",
        description: "Please describe what you want to animate in the video.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setVideoUrl('');

    try {
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

      setTaskUUID(result.taskUUID);
      toast({
        title: "Video Generation Started",
        description: "Your video is being generated. This may take a few minutes.",
      });

      // Start polling for results
      startPolling(result.taskUUID);
    } catch (error) {
      console.error('Error generating video:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to start video generation. Please try again.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const startPolling = (uuid: string) => {
    const interval = setInterval(async () => {
      try {
        const result = await pollVideoResult(uuid);
        
        if (result.status === 'completed' && result.videoUrl) {
          setVideoUrl(result.videoUrl);
          setIsGenerating(false);
          clearInterval(interval);
          setPollingInterval(null);
          toast({
            title: "Video Generated!",
            description: "Your video walkthrough is ready to play.",
          });
        } else if (result.status === 'error') {
          setIsGenerating(false);
          clearInterval(interval);
          setPollingInterval(null);
          toast({
            title: "Generation Failed",
            description: "Video generation failed. Please try again.",
            variant: "destructive"
          });
        }
        // If status is 'pending', continue polling
      } catch (error) {
        console.error('Error polling video result:', error);
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
              </CardContent>
            </Card>

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
                  <span>Video Preview</span>
                  {videoUrl && (
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  )}
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
                  ) : videoUrl ? (
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full object-cover"
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />
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

            {/* Video Info */}
            {videoUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Video Details</CardTitle>
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
                    <span>MP4</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 