import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { cn } from '../lib/utils';
import { Heart, X, MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { PaperCutout } from './PaperCutout';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

interface UserProfile {
  id: number;
  name: string;
  age: number;
  origin: string;
  bio: string;
  color: string;
  skin: string;
}

const MOCK_USERS: UserProfile[] = [
  { id: 1, name: 'Amira', age: 28, origin: 'Syria', bio: 'Love traditional dance and teaching Arabic. Looking for someone to cook with!', color: 'bg-[#FFB7B2]', skin: '#8D5524' },
  { id: 2, name: 'Sonia', age: 34, origin: 'Mexico', bio: 'Graphic designer. I miss the street food back home. Let’s explore local markets!', color: 'bg-[#FFDAC1]', skin: '#C68642' },
  { id: 3, name: 'Ji-won', age: 24, origin: 'South Korea', bio: 'Student in NYC. Looking for language exchange and cafe hopping partners.', color: 'bg-[#E2F0CB]', skin: '#F1C27D' },
  { id: 4, name: 'Fatima', age: 31, origin: 'Nigeria', bio: 'Hospital administrator and avid gardener. I have too many plants, want some?', color: 'bg-[#B5EAD7]', skin: '#8D5524' },
  { id: 5, name: 'Marta', age: 29, origin: 'Poland', bio: 'Software engineer. I love hiking and outdoor activities. New in the city!', color: 'bg-[#C7CEEA]', skin: '#FFDBAC' },
];

export const SwipeProfiles: React.FC<{ cityName: string }> = ({ cityName }) => {
  const { t } = useLanguage();
  const [users, setUsers] = useState(MOCK_USERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isChatting, setIsChatting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleSwipe = (direction: 'left' | 'right') => {
    // In a real app, send swipe to backend
    setCurrentIndex(prev => prev + 1);
    x.set(0);
  };

  const currentUser = users[currentIndex];

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-[500px]">
        <h3 className="text-3xl font-display mb-4">{t('swipe.end_reached')}</h3>
        <p className="font-hand text-xl text-[#8E9299]">{t('swipe.check_later')} {cityName}.</p>
        <button 
          onClick={() => setCurrentIndex(0)}
          className="mt-8 px-8 py-3 bg-[#B5EAD7] rounded-full font-display paper-shadow"
        >
          {t('swipe.see_again')}
        </button>
      </div>
    );
  }

  if (isChatting && currentUser) {
    return (
      <div className="w-full max-w-md mx-auto h-[600px] flex flex-col bg-white rough-border paper-shadow overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b bg-[#FFB7B2]/10 flex items-center justify-between">
          <button 
            onClick={() => setIsChatting(false)}
            className="p-2 hover:bg-[#FFB7B2]/20 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-[#5A5A40]" />
          </button>
          <div className="flex flex-col items-center">
            <span className="font-display text-xl text-[#5A5A40]">{currentUser.name}</span>
            <span className="text-[10px] font-hand text-green-500 uppercase tracking-widest">{t('swipe.online')}</span>
          </div>
          <div className="relative w-10 h-10 rounded-full overflow-hidden paper-shadow border-2 border-white">
            <div className={cn("w-full h-full", currentUser.color)} />
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FDFBF7]/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40">
                <MessageCircle size={48} className="mb-2" />
                <p className="font-hand text-lg">{t('swipe.start_convo')}</p>
            </div>
          ) : (
            messages.map(msg => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex flex-col max-w-[80%] gap-1",
                  msg.sender === 'me' ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div className={cn(
                  "p-3 rounded-2xl rough-border font-hand text-lg",
                  msg.sender === 'me' ? "bg-[#B5EAD7] text-[#4A4A4A]" : "bg-white text-[#4A4A4A] paper-shadow"
                )}>
                  {msg.text}
                </div>
                <span className="text-[10px] font-hand opacity-50 px-2">{msg.timestamp}</span>
              </div>
            ))
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t bg-white flex gap-2">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('swipe.send_placeholder')}
            className="flex-1 p-3 bg-[#FDFBF7] rough-border font-hand text-lg focus:outline-none focus:border-[#FFB7B2]"
          />
          <button 
            onClick={handleSendMessage}
            className="w-12 h-12 bg-[#FFB7B2] rounded-full flex items-center justify-center text-white paper-shadow hover:scale-105 active:scale-95 transition-transform"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-sm mx-auto h-[440px] md:h-[500px] flex flex-col items-center">
      <AnimatePresence>
        <motion.div
          key={currentUser.id}
          style={{ x, rotate, opacity }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 100) handleSwipe('right');
            else if (info.offset.x < -100) handleSwipe('left');
          }}
          className="absolute w-full px-4"
        >
          <PaperCutout color="bg-white" className="w-full cursor-grab active:cursor-grabbing">
            <div className="flex flex-col items-center gap-2 pt-4 pb-12 px-4">
              {/* Profile Avatar */}
              <div 
                className={cn("w-24 h-24 md:w-40 md:h-40 paper-shadow border-4 border-white flex items-center justify-center overflow-hidden", currentUser.color)}
                style={{ clipPath: 'polygon(10% 0, 95% 5%, 100% 40%, 85% 90%, 15% 100%, 0 50%)' }}
              >
                 <div 
                    className={cn("w-14 h-14 md:w-24 md:h-24 rounded-full", currentUser.color)} 
                 />
              </div>
 
              {/* Info */}
              <div className="text-center space-y-1">
                <h3 className="text-xl md:text-4xl font-display">{currentUser.name}, {currentUser.age}</h3>
                <p className="text-base md:text-xl font-hand text-[#FFB7B2] font-bold">{t('swipe.from')} {currentUser.origin}</p>
                <div className="w-8 h-1 bg-[#D1D1D1] mx-auto my-2" />
                <p className="font-hand text-sm md:text-lg leading-relaxed text-[#4A4A40] line-clamp-2 md:line-clamp-3">
                  "{currentUser.bio}"
                </p>
              </div>
            </div>
          </PaperCutout>
        </motion.div>
      </AnimatePresence>
 
      {/* Action Buttons - Pin to specific bottom area */}
      <div className="absolute bottom-0 flex gap-6 md:gap-8 p-3">
          <button 
            onClick={() => handleSwipe('left')}
            className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full paper-shadow flex items-center justify-center text-red-500 hover:scale-110 active:scale-90 transition-all rough-border border-2 border-red-50"
          >
            <X size={24} className="md:size-32" />
          </button>
          <button 
            onClick={() => {
                setMessages([]);
                setIsChatting(true);
            }}
            className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full paper-shadow flex items-center justify-center text-blue-500 hover:scale-110 active:scale-90 transition-all rough-border border-2 border-blue-50"
          >
            <MessageCircle size={24} className="md:size-32" />
          </button>
          <button 
            onClick={() => handleSwipe('right')}
            className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full paper-shadow flex items-center justify-center text-green-500 hover:scale-110 active:scale-90 transition-all rough-border border-2 border-green-50"
          >
            <Heart size={24} className="md:size-32" />
          </button>
      </div>
    </div>
  );
};
