import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Engine = () => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="min-h-screen bg-[#1A0B3C] relative">
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-[#99FF00] font-mono text-2xl font-bold">
            AI ENGINE
          </div>
          
          {/* Right side with text and button */}
          <div className="flex items-center space-x-6">
            <div className="text-[#99FF00] font-mono text-lg">
              Photos From Our Past Events
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-[#99FF02] text-lg hover:text-[#99FF02]/80 bg-[#99FF02]/10 hover:bg-[#99FF02]/5 font-mono"
            >
              Moments
            </Button>
          </div>
        </div>
      </div>

      {/* Full Screen Image with Top and Bottom Margin */}
      <div className="w-full h-screen flex items-center justify-center mt-12 pt-20">
        <div className="w-full h-full my-8">
          {!imageError ? (
            <img 
              src="/ai-engine-poster.jpg" 
              alt="AI ENGINE: UK UNIVERSITY HACKATHON" 
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-[#1A0A3D] flex items-center justify-center">
              <div className="text-center">
                <p className="text-[#99FF00] text-2xl font-bold mb-4">
                  AI ENGINE: UK UNIVERSITY HACKATHON
                </p>
                <p className="text-white text-sm">
                  Please add the promotional poster image as "ai-engine-poster.jpg" in the public directory
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Engine; 