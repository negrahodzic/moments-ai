import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Brain, Zap, Users, Calendar, MapPin, Play, Download } from 'lucide-react';
import { toast } from 'sonner';
import MomentsAITool from '@/components/MomentsAITool';

const AIEngineHome = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showMomentsAI, setShowMomentsAI] = useState(false);

  const handleMomentsAIClick = () => {
    setActiveTab('moments');
    toast.success('Opening Moments.AI integration...');
  };

  return (
    <div className="min-h-screen bg-[#1A0A3D]">
      {/* Header */}
      <header className="border-b border-[#2C0B4F]/30 bg-[#1A0A3D]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-[#99FF00] rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-[#1A0A3D]" />
                </div>
                <span className="text-2xl font-bold text-[#99FF00]">AI ENGINE</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#A090B0] text-sm">Photos From Our Past Events</span>
                <div className="w-px h-4 bg-[#99FF00]"></div>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-[#A090B0] hover:text-white transition-colors">Home</a>
              <a href="#" className="text-[#A090B0] hover:text-white transition-colors">Events</a>
              <a href="#" className="text-[#A090B0] hover:text-white transition-colors">About</a>
              <a href="#" className="text-[#A090B0] hover:text-white transition-colors">Contact</a>
              <a 
                href="#" 
                className="text-[#A090B0] hover:text-white transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('moments');
                }}
              >
                Moments
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'home' && (
          <div className="text-center">
            {/* Supported by Section */}
            <div className="mb-12">
              <h2 className="text-[#99FF00] text-xl font-semibold mb-6">Supported by</h2>
              <div className="flex flex-wrap justify-center items-center space-x-8 md:space-x-12 mb-8">
                <div className="text-white font-semibold">Bessemer Venture Partners</div>
                <div className="text-white font-semibold">Chapter One</div>
                <div className="text-white font-semibold">dawn.</div>
                <div className="text-white font-semibold">SEEDCAMP</div>
              </div>
            </div>

            {/* Anchor sponsored by Section */}
            <div className="mb-12">
              <h2 className="text-[#99FF00] text-xl font-semibold mb-6">Anchor sponsored by</h2>
              <div className="flex flex-wrap justify-center items-center space-x-8 md:space-x-12 mb-8">
                <div className="text-white font-semibold">UCL CENTRE FOR ARTIFICIAL INTELLIGENCE</div>
                <div className="text-white font-semibold">Google Cloud</div>
              </div>
            </div>

            {/* Main Event Title */}
            <div className="mb-12">
              <h1 className="text-6xl md:text-8xl font-bold text-[#99FF00] mb-6">
                AI ENGINE: UK UNIVERSITY HACKATHON
              </h1>
            </div>

            {/* Event Details */}
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-12">
              <div className="flex items-center space-x-2 text-white">
                <MapPin className="w-5 h-5 text-[#99FF00]" />
                <span>UCL East</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Calendar className="w-5 h-5 text-[#99FF00]" />
                <span>15.02.25</span>
              </div>
            </div>

            {/* Participating Societies */}
            <div className="mb-12">
              <p className="text-white mb-6">AI and Entrepreneurial Societies from</p>
              <div className="flex flex-wrap justify-center items-center space-x-8 md:space-x-12">
                <div className="text-white font-semibold">UNIVERSITY OF CAMBRIDGE</div>
                <div className="text-white font-semibold">UNIVERSITY OF OXFORD</div>
                <div className="text-white font-semibold">Imperial College London</div>
                <div className="text-white font-semibold">UCL</div>
              </div>
            </div>
          </div>
        )}

        {/* Moments.AI Tab Content */}
        {activeTab === 'moments' && (
          <div className="h-screen">
            <MomentsAITool />
          </div>
        )}
      </main>

      {/* Footer */}
      {activeTab === 'home' && (
        <footer className="border-t border-[#2C0B4F]/30 bg-[#1A0A3D]/50 mt-16">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center">
              <p className="text-[#A090B0]">
                AI and Entrepreneurial Societies from universities across the UK
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default AIEngineHome; 