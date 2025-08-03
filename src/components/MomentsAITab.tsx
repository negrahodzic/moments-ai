import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sparkles, Send, Brain, MapPin, Calendar, Users, Zap, Play } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const MomentsAITab = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your AI event planning assistant. Tell me about your event and I\'ll help you find the perfect venue and create amazing visualizations.',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'chat' | 'venues' | 'visualization'>('chat');

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I understand you\'re planning an event! Let me help you find the perfect venue. I\'ll search for options that match your requirements.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // After a few messages, transition to venue selection
      if (messages.length >= 3) {
        setTimeout(() => {
          setCurrentPhase('venues');
          toast.success('Found some great venues for you!');
        }, 2000);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleLaunchFullApp = () => {
    window.location.href = '/';
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
                <h2 className="text-lg font-semibold text-white">Moments.AI</h2>
                <p className="text-sm text-[#A090B0]">AI-Powered Event Planning</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-[#99FF00]/20 text-[#99FF00] border-[#99FF00]/30">
                {currentPhase === 'chat' && 'Planning'}
                {currentPhase === 'venues' && 'Venues'}
                {currentPhase === 'visualization' && 'Visualization'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="border-[#99FF00]/30 text-[#99FF00] hover:bg-[#99FF00]/20"
                onClick={() => window.history.back()}
              >
                Back to AI Engine
              </Button>
            </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isUser
                  ? 'bg-[#99FF00] text-[#1A0A3D]'
                  : 'bg-[#2C0B4F]/30 border border-[#2C0B4F]/50 text-white'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#2C0B4F]/30 border border-[#2C0B4F]/50 text-white px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#99FF00] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#99FF00] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-[#99FF00] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {currentPhase === 'chat' && messages.length === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
            <Button
              variant="outline"
              className="border-[#99FF00]/30 text-[#99FF00] hover:bg-[#99FF00]/20"
              onClick={() => {
                setInputValue('I need a venue for a corporate event with 50 people');
                handleSendMessage();
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Corporate Event
            </Button>
            <Button
              variant="outline"
              className="border-[#99FF00]/30 text-[#99FF00] hover:bg-[#99FF00]/20"
              onClick={() => {
                setInputValue('Looking for a wedding venue for 150 guests');
                handleSendMessage();
              }}
            >
              <Users className="w-4 h-4 mr-2" />
              Wedding Venue
            </Button>
            <Button
              variant="outline"
              className="border-[#99FF00]/30 text-[#99FF00] hover:bg-[#99FF00]/20"
              onClick={() => {
                setInputValue('Need a modern space for a tech conference');
                handleSendMessage();
              }}
            >
              <Zap className="w-4 h-4 mr-2" />
              Tech Conference
            </Button>
            <Button
              variant="outline"
              className="border-[#99FF00]/30 text-[#99FF00] hover:bg-[#99FF00]/20"
              onClick={() => {
                setInputValue('Birthday party venue for 30 people');
                handleSendMessage();
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Birthday Party
            </Button>
          </div>
        )}

        {/* Venue Selection Phase */}
        {currentPhase === 'venues' && (
          <div className="mt-6">
            <Card className="bg-[#2C0B4F]/30 border-[#2C0B4F]/50">
              <CardHeader>
                <CardTitle className="text-white">Recommended Venues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'The Grand Ballroom', location: 'Downtown', capacity: '50-100', style: 'Elegant' },
                    { name: 'Tech Hub Conference Center', location: 'Innovation District', capacity: '30-80', style: 'Modern' },
                    { name: 'Garden Terrace', location: 'City Center', capacity: '20-60', style: 'Intimate' }
                  ].map((venue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-[#2C0B4F]/20 rounded-lg border border-[#2C0B4F]/30">
                      <div>
                        <h3 className="font-semibold text-white">{venue.name}</h3>
                        <p className="text-sm text-[#A090B0]">{venue.location} • {venue.capacity} guests</p>
                        <Badge variant="outline" className="text-xs border-[#99FF00]/30 text-[#99FF00]">
                          {venue.style}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        className="bg-[#99FF00] text-[#1A0A3D] hover:bg-[#A0FF00]"
                        onClick={() => {
                          setCurrentPhase('visualization');
                          toast.success(`Selected ${venue.name}! Generating visualization...`);
                        }}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Select
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Visualization Phase */}
        {currentPhase === 'visualization' && (
          <div className="mt-6">
            <Card className="bg-[#2C0B4F]/30 border-[#2C0B4F]/50">
              <CardHeader>
                <CardTitle className="text-white">AI-Generated Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="w-full h-48 bg-gradient-to-br from-[#2C0B4F] to-[#1A0A3D] rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-[#99FF00] mx-auto mb-2" />
                      <p className="text-white">AI Visualization Loading...</p>
                    </div>
                  </div>
                  <p className="text-[#A090B0] text-sm mb-4">
                    Our AI is creating a custom visualization of your event space
                  </p>
                  <Button
                    className="bg-[#99FF00] text-[#1A0A3D] hover:bg-[#A0FF00]"
                    onClick={handleLaunchFullApp}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Launch Full Moments.AI Experience
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-[#2C0B4F]/30 bg-[#1A0A3D]/50 p-4">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tell me about your event..."
            className="flex-1 bg-[#2C0B4F]/30 border-[#2C0B4F]/50 text-white placeholder:text-[#A090B0]"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="bg-[#99FF00] text-[#1A0A3D] hover:bg-[#A0FF00]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MomentsAITab; 