/*
ImmersiMoments - Visualization Canvas Component
Real-time venue visualization with Runware.ai image generation
*/

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { 
  Download, 
  RotateCcw, 
  Play, 
  Volume2, 
  Image as ImageIcon,
  Sparkles,
  Video
} from 'lucide-react';
import { generateImage, generateVideo, buildVenuePrompt, enhanceTweakWithAnchors } from '../api/runware';
import { synthesizeSpeech, createVenueNarration } from '../api/elevenlabs';
import VideoWalkthroughModal from './VideoWalkthroughModal';

interface VisualizationCanvasProps {
  venueName: string;
  eventType: string;
  mood: string;
  mustHaves: string[];
  originalVenueImage: string;
  onImageGenerated?: (imageUrl: string) => void;
}

export default function VisualizationCanvas({ 
  venueName, 
  eventType, 
  mood, 
  mustHaves, 
  originalVenueImage,
  onImageGenerated 
}: VisualizationCanvasProps) {
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(originalVenueImage);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tweakCommand, setTweakCommand] = useState('');
  const [imageHistory, setImageHistory] = useState<string[]>([originalVenueImage]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [showOriginal, setShowOriginal] = useState(true);
  
  // Video and audio states
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleApplyTweak = async () => {
    if (!tweakCommand.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Build the base prompt for the venue
      const { positivePrompt: basePositivePrompt, negativePrompt: baseNegativePrompt } = buildVenuePrompt(venueName, eventType, 50, mood, mustHaves);
      
      // Enhance the tweak with anchor prompting for precise changes
      const { positivePrompt: fullPrompt, negativePrompt: enhancedNegativePrompt } = enhanceTweakWithAnchors(
        basePositivePrompt,
        tweakCommand,
        venueName
      );
      
      console.log('Generating image with enhanced prompt:', fullPrompt);
      console.log('User tweak request:', tweakCommand);
      
      const result = await generateImage({
        prompt: fullPrompt,
        negativePrompt: enhancedNegativePrompt,
        initImageUrl: currentImageUrl, // Always use the current image as base
        strength: 0.7, // Lower strength to preserve more of original
        width: 1024,
        height: 768,
        model: 'rundiffusion:130@100',
        steps: 30,
        CFGScale: 8.5,
        scheduler: 'DPM++ 2M Karras'
      });
      
      if (result.imageUrl) {
        // Add to history
        const newHistory = [...imageHistory, result.imageUrl];
        setImageHistory(newHistory);
        setCurrentHistoryIndex(newHistory.length - 1);
        
        // Update current image
        setCurrentImageUrl(result.imageUrl);
        setGeneratedImages(prev => [...prev, result.imageUrl]);
        setShowOriginal(false);
        
        // Notify parent
        onImageGenerated?.(result.imageUrl);
        
        // Clear tweak command
        setTweakCommand('');
        
        console.log('Image generated successfully:', result.imageUrl);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRevertToImage = (index: number) => {
    setCurrentImageUrl(imageHistory[index]);
    setCurrentHistoryIndex(index);
    setShowOriginal(index === 0);
  };

  const handleGenerateVideo = () => {
    setIsVideoModalOpen(true);
  };

  const handleGenerateAudio = async () => {
    setIsGeneratingAudio(true);
    
    try {
      const narration = `Welcome to ${venueName}. This beautiful venue is perfect for your ${eventType}. 
      The ${mood} atmosphere creates the ideal setting for your special day. 
      ${mustHaves.join(', ')} 
      Thank you for considering ${venueName} for your ${eventType}.`;
      
      const result = await synthesizeSpeech({
        text: narration,
        voice_id: 'pNInz6obpgDQGcFmaJgB', // Adam voice
        model_id: 'eleven_monolingual_v1'
      });
      
      if (result.audioUrl) {
        setAudioUrl(result.audioUrl);
        console.log('Audio generated successfully:', result.audioUrl);
      }
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = currentImageUrl;
    link.download = `${venueName}-visualization.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Main Visualization Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Venue Visualization
            {showOriginal && (
              <span className="text-sm text-muted-foreground font-normal">
                (Original Venue Image)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {isGenerating ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground">Generating visualization...</p>
                </div>
              </div>
            ) : (
              <img
                src={currentImageUrl}
                alt={`${venueName} visualization`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Image History */}
          {imageHistory.length > 1 && (
            <div className="mt-4">
              <Label className="text-sm font-medium">Image History</Label>
              <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                {imageHistory.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleRevertToImage(index)}
                    className={`relative flex-shrink-0 w-16 h-12 rounded border-2 transition-colors ${
                      index === currentHistoryIndex 
                        ? 'border-primary' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Version ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                    {index === 0 && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-1 rounded-bl">
                        OG
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tweak Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Customize Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add fairy lights, change lighting to warm, add more seating..."
              value={tweakCommand}
              onChange={(e) => setTweakCommand(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleApplyTweak()}
              disabled={isGenerating}
            />
            <Button 
              onClick={handleApplyTweak}
              disabled={!tweakCommand.trim() || isGenerating}
              className="flex-shrink-0"
            >
              {isGenerating ? 'Generating...' : 'Apply'}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>💡 Try these precise examples:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>"Add fairy lights around the ceiling perimeter"</li>
              <li>"Change the lighting to warm white bulbs"</li>
              <li>"Add more chairs around the existing tables"</li>
              <li>"Make the walls a lighter shade of gray"</li>
              <li>"Add a projector screen on the front wall"</li>
              <li>"Change the tablecloths to white linen"</li>
              <li>"Add potted plants in the corners"</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleDownloadImage} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Image
        </Button>
        
        <Button 
          onClick={handleGenerateVideo}
          disabled={isGenerating}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Video className="h-4 w-4" />
          Create Video Walkthrough
        </Button>
        
        <Button 
          onClick={handleGenerateAudio} 
          disabled={isGeneratingAudio}
          variant="outline"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          {isGeneratingAudio ? 'Generating...' : 'Generate Narration'}
        </Button>
      </div>

      {/* Video Player */}
      {videoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Walkthrough</CardTitle>
          </CardHeader>
          <CardContent>
            <video
              ref={videoRef}
              controls
              className="w-full rounded-lg"
              src={videoUrl}
            />
          </CardContent>
        </Card>
      )}

      {/* Audio Player */}
      {audioUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Narration</CardTitle>
          </CardHeader>
          <CardContent>
            <audio
              ref={audioRef}
              controls
              className="w-full"
              src={audioUrl}
            />
          </CardContent>
        </Card>
      )}
      
      {/* Video Walkthrough Modal */}
      <VideoWalkthroughModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        baseImageUrl={currentImageUrl}
        venueName={venueName}
        eventType={eventType}
      />
    </div>
  );
}