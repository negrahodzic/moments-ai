import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Upload, Image, Users, MapPin, Calendar, Brain, Zap, Play, Download, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface UploadedImage {
  id: string;
  name: string;
  url: string;
  type: 'venue' | 'sponsor' | 'logo';
}

const MomentsAITool = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [currentStep, setCurrentStep] = useState<'upload' | 'configure' | 'visualize'>('upload');
  const [selectedVenue, setSelectedVenue] = useState<string>('');
  const [eventDetails, setEventDetails] = useState({
    name: '',
    date: '',
    attendees: '',
    description: ''
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'venue' | 'sponsor' | 'logo') => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: UploadedImage = {
            id: Date.now().toString(),
            name: file.name,
            url: e.target?.result as string,
            type
          };
          setUploadedImages(prev => [...prev, newImage]);
          toast.success(`${file.name} uploaded successfully`);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleGenerateVisualization = () => {
    setCurrentStep('visualize');
    toast.success('Generating AI-powered venue visualization...');
  };

  const handleBackToAIEngine = () => {
    window.history.back();
  };

  return (
    <div className="h-full flex flex-col bg-[#1A0A3D]">
      {/* Header */}
      <div className="border-b border-[#2C0B4F]/30 bg-[#1A0A3D]/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-[#99FF00] rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#1A0A3D]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Moments.AI - Space Visualization Tool</h2>
              <p className="text-sm text-[#A090B0]">Enhance your event planning productivity</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-[#99FF00]/20 text-[#99FF00] border-[#99FF00]/30">
              {currentStep === 'upload' && 'Upload'}
              {currentStep === 'configure' && 'Configure'}
              {currentStep === 'visualize' && 'Visualize'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="border-[#99FF00]/30 text-[#99FF00] hover:bg-[#99FF00]/20"
              onClick={handleBackToAIEngine}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to AI Engine
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {currentStep === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Upload Your Venue Spaces</h3>
              <p className="text-[#A090B0]">Upload images of your venue spaces to create AI-powered visualizations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Stage */}
              <Card className="bg-[#2C0B4F]/30 border-[#2C0B4F]/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Image className="w-5 h-5 mr-2 text-[#99FF00]" />
                    Main Stage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-[#2C0B4F] rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-[#99FF00] mx-auto mb-2" />
                      <p className="text-[#A090B0] text-sm mb-2">Upload main stage photos</p>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, 'venue')}
                        className="hidden"
                        id="main-stage-upload"
                      />
                      <Label htmlFor="main-stage-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" className="border-[#99FF00]/30 text-[#99FF00] hover:bg-[#99FF00]/20">
                          Choose Files
                        </Button>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Staircase */}
              <Card className="bg-[#2C0B4F]/30 border-[#2C0B4F]/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-[#99FF00]" />
                    Staircase & Entrances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-[#2C0B4F] rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-[#99FF00] mx-auto mb-2" />
                      <p className="text-[#A090B0] text-sm mb-2">Upload entrance photos</p>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, 'venue')}
                        className="hidden"
                        id="staircase-upload"
                      />
                      <Label htmlFor="staircase-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" className="border-[#99FF00]/30 text-[#99FF00] hover:bg-[#99FF00]/20">
                          Choose Files
                        </Button>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sponsor Materials */}
              <Card className="bg-[#2C0B4F]/30 border-[#2C0B4F]/50">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Users className="w-5 h-5 mr-2 text-[#99FF00]" />
                    Sponsor Materials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-[#2C0B4F] rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-[#99FF00] mx-auto mb-2" />
                      <p className="text-[#A090B0] text-sm mb-2">Upload sponsor logos & materials</p>
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload(e, 'sponsor')}
                        className="hidden"
                        id="sponsor-upload"
                      />
                      <Label htmlFor="sponsor-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" className="border-[#99FF00]/30 text-[#99FF00] hover:bg-[#99FF00]/20">
                          Choose Files
                        </Button>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-white mb-4">Uploaded Materials</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative">
                      <img 
                        src={image.url} 
                        alt={image.name}
                        className="w-full h-24 object-cover rounded-lg border border-[#2C0B4F]/50"
                      />
                      <Badge 
                        variant="outline" 
                        className="absolute top-1 right-1 text-xs border-[#99FF00]/30 text-[#99FF00]"
                      >
                        {image.type}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button 
                    onClick={() => setCurrentStep('configure')}
                    className="bg-[#99FF00] text-[#1A0A3D] hover:bg-[#A0FF00]"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Configure Event Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 'configure' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Configure Your Event</h3>
              <p className="text-[#A090B0]">Add event details to enhance the visualization</p>
            </div>

            <Card className="bg-[#2C0B4F]/30 border-[#2C0B4F]/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Event Name</Label>
                    <Input
                      value={eventDetails.name}
                      onChange={(e) => setEventDetails(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-[#2C0B4F]/30 border-[#2C0B4F]/50 text-white placeholder:text-[#A090B0]"
                      placeholder="AI Engine Hackathon 2025"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Event Date</Label>
                    <Input
                      type="date"
                      value={eventDetails.date}
                      onChange={(e) => setEventDetails(prev => ({ ...prev, date: e.target.value }))}
                      className="bg-[#2C0B4F]/30 border-[#2C0B4F]/50 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Expected Attendees</Label>
                    <Input
                      value={eventDetails.attendees}
                      onChange={(e) => setEventDetails(prev => ({ ...prev, attendees: e.target.value }))}
                      className="bg-[#2C0B4F]/30 border-[#2C0B4F]/50 text-white placeholder:text-[#A090B0]"
                      placeholder="150-200 participants"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Event Description</Label>
                    <textarea
                      value={eventDetails.description}
                      onChange={(e) => setEventDetails(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-[#2C0B4F]/30 border-[#2C0B4F]/50 text-white placeholder:text-[#A090B0] rounded-md p-3 min-h-[100px]"
                      placeholder="Describe your event theme, activities, and special requirements..."
                    />
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleGenerateVisualization}
                    className="bg-[#99FF00] text-[#1A0A3D] hover:bg-[#A0FF00]"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Generate AI Visualization
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'visualize' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">AI-Generated Visualization</h3>
              <p className="text-[#A090B0]">Your enhanced venue visualization is ready</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-[#2C0B4F]/30 border-[#2C0B4F]/50">
                <CardHeader>
                  <CardTitle className="text-white">Main Stage Setup</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-48 bg-gradient-to-br from-[#2C0B4F] to-[#1A0A3D] rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-[#99FF00] mx-auto mb-2" />
                      <p className="text-white">AI-Enhanced Stage Visualization</p>
                    </div>
                  </div>
                  <p className="text-[#A090B0] text-sm">
                    AI has enhanced your main stage with optimal lighting, sponsor placement, and audience flow.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-[#2C0B4F]/30 border-[#2C0B4F]/50">
                <CardHeader>
                  <CardTitle className="text-white">Entrance & Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-48 bg-gradient-to-br from-[#2C0B4F] to-[#1A0A3D] rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-[#99FF00] mx-auto mb-2" />
                      <p className="text-white">Optimized Entry Experience</p>
                    </div>
                  </div>
                  <p className="text-[#A090B0] text-sm">
                    AI has optimized the entrance flow, registration areas, and sponsor booth placement.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center space-y-4">
              <Button 
                className="bg-[#99FF00] text-[#1A0A3D] hover:bg-[#A0FF00]"
                onClick={() => toast.success('Downloading visualization package...')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Visualization Package
              </Button>
              <div>
                <Button 
                  variant="outline"
                  className="border-[#99FF00]/30 text-[#99FF00] hover:bg-[#99FF00]/20"
                  onClick={() => setCurrentStep('upload')}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Create New Visualization
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MomentsAITool; 