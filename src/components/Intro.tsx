import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';
import { PaperCutout } from './PaperCutout';
import { useLanguage } from '../contexts/LanguageContext';

const PAPER_COLORS = [
    'bg-[#FFB7B2]', // Pink
    'bg-[#FFDAC1]', // Peach
    'bg-[#E2F0CB]', // Green
    'bg-[#B5EAD7]', // Mint
    'bg-[#C7CEEA]', // Blue
    'bg-[#F2AEB4]', // Rose
];

const SKIN_COLORS = [
    '#8D5524', '#C68642', '#E0AC69', '#F1C27D', '#FFDBAC'
];

interface IntroProps {
  onBegin: () => void;
}

export const Intro: React.FC<IntroProps> = ({ onBegin }) => {
  const { t } = useLanguage();
  const [stage, setStage] = useState<'earth' | 'connection' | 'button'>('earth');
  const [handsJoined, setHandsJoined] = useState(false);
  const [textPhase, setTextPhase] = useState<'forward' | 'community'>('forward');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timerText = setTimeout(() => {
      setTextPhase('community');
    }, 4500);

    const timer1 = setTimeout(() => {
      setStage('connection');
    }, 4000);

    const timer2 = setTimeout(() => {
      setHandsJoined(true);
    }, 5500);

    const timer3 = setTimeout(() => {
        setStage('button');
    }, 7500);

    return () => {
      clearTimeout(timerText);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center bg-[#FDFBF7] z-50 overflow-hidden">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 h-full items-center px-8 md:px-20 gap-12">
        {/* Title/Text on the Left */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-start gap-4 z-20 relative max-w-xl"
        >
          <h1 className="text-6xl md:text-8xl font-display text-[#5A5A40] leading-none">Sisterhood<br />Abroad</h1>
          <div className="h-24 md:h-32 flex items-start">
            <AnimatePresence mode="wait">
              {textPhase === 'forward' ? (
                <motion.p 
                  key="forward"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.8 }}
                  className="text-xl md:text-3xl font-hand text-[#8E9299] mt-4 italic"
                >
                  <span dangerouslySetInnerHTML={{ __html: t('intro.quote1') }} />
                </motion.p>
              ) : (
                <motion.p 
                  key="community"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.8 }}
                  className="text-xl md:text-3xl font-hand text-[#5A5A40] mt-4"
                >
                  {t('intro.quote2')} <br />
                  <span className="text-[#B5EAD7] font-bold">{t('intro.quote3')}</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          
          <div className="h-32 mt-8">
            <AnimatePresence>
              {stage === 'button' && (
                <motion.button 
                  key="begin-button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={() => {
                    // Trigger geolocation asynchronously so we don't block the UI transition
                    if ("geolocation" in navigator) {
                      navigator.geolocation.getCurrentPosition(() => {}, () => {});
                    }
                    // Transition to the map/loading screen immediately
                    onBegin();
                  }}
                  className="px-12 py-5 bg-[#FFB7B2] rounded-full text-2xl font-display paper-shadow text-[#4A4A40] cursor-pointer"
                >
                  {t('intro.begin')}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Earth on the Right */}
        <motion.div 
          className="relative flex items-end justify-end h-full z-10"
          animate={{ 
              x: stage === 'connection' || stage === 'button' ? 80 : 0,
              y: stage === 'connection' || stage === 'button' ? 80 : 0,
              scale: stage === 'connection' || stage === 'button' ? 1.4 : 1,
          }}
          transition={{ duration: 3, ease: "easeInOut" }}
        >
          {/* Main Rotation Group */}
          <motion.div
            className="relative flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {/* Earth Canvas */}
            <div className="relative w-[500px] h-[500px] rounded-full bg-[#A3D8FF] flex items-center justify-center overflow-hidden paper-shadow border-[12px] border-white/80 shrink-0">
              {/* Continents */}
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className={cn(
                    "absolute bg-[#97C197] opacity-80",
                    i === 0 && "w-48 h-32 top-10 left-10 rounded-full",
                    i === 1 && "w-32 h-64 top-20 right-5 rounded-[40%]",
                    i === 2 && "w-64 h-24 bottom-10 left-20 rounded-[60%]",
                    i === 3 && "w-24 h-24 top-40 left-5 rounded-full",
                    i === 4 && "w-20 h-20 bottom-20 right-20 rounded-full",
                    i === 5 && "w-32 h-40 top-5 left-40 rounded-[30%]",
                  )}
                  style={{
                    transform: `rotate(${i * 60}deg)`,
                    clipPath: 'polygon(10% 2%, 90% 5%, 100% 45%, 85% 95%, 15% 100%, 0 50%)'
                  }}
                />
              ))}
            </div>

            {/* People Around Earth */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[...Array(12)].map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                const dist = isHovered ? 280 : (handsJoined ? 310 : 340); 
                const x = Math.cos(angle) * dist;
                const y = Math.sin(angle) * dist;
                
                const isSpecial1 = i === 0;
                const isSpecial2 = i === 1;
                const effectiveJoined = handsJoined || isHovered;

                return (
                  <motion.div
                    key={i}
                    className="absolute w-16 h-24 flex flex-col items-center origin-center"
                    initial={{ 
                        opacity: 0, 
                        x: Math.cos(angle) * 400, 
                        y: Math.sin(angle) * 400, 
                        rotate: (angle * 180) / Math.PI + 90 
                    }}
                    animate={{ 
                        opacity: 1,
                        x, y
                    }}
                    transition={{ 
                        opacity: { delay: i * 0.1, duration: 1 },
                        x: { duration: 0.8, ease: "circOut" },
                        y: { duration: 0.8, ease: "circOut" }
                    }}
                  >
                    {/* Body */}
                    <div className="relative flex flex-col items-center paper-shadow">
                        {/* Head */}
                        <div 
                            className={cn("w-10 h-10 rounded-full z-20", PAPER_COLORS[i % PAPER_COLORS.length])} 
                        />
                        {/* Dress */}
                        <div 
                            className={cn("w-14 h-16 mt-[-4px] z-10", PAPER_COLORS[i % PAPER_COLORS.length])}
                            style={{ clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0% 100%)' }}
                        />

                        {/* Arms (holding hands) */}
                        <div className="absolute top-10 flex w-[230%] justify-between px-0">
                            {/* Left Arm */}
                            {!(isSpecial1 && !effectiveJoined) && (
                                <motion.div 
                                    className={cn("w-16 h-5 origin-right transition-colors duration-500", PAPER_COLORS[i % PAPER_COLORS.length])}
                                    initial={{ rotate: 10 }}
                                    animate={{ rotate: isHovered ? -5 : 0 }}
                                    style={{ clipPath: 'polygon(0 0, 100% 20%, 100% 80%, 0 100%)' }}
                                />
                            )}
                            {/* Right Arm */}
                            {!(isSpecial2 && !effectiveJoined) && (
                                <motion.div 
                                    className={cn("w-16 h-5 origin-left transition-colors duration-500", PAPER_COLORS[i % PAPER_COLORS.length])}
                                    initial={{ rotate: -10 }}
                                    animate={{ rotate: isHovered ? 5 : 0 }}
                                    style={{ clipPath: 'polygon(0 20%, 100% 0, 100% 100%, 0 80%)' }}
                                />
                            )}
                        </div>

                        {/* Legs */}
                        <div className="flex gap-1 mt-[-4px]">
                            <div className={cn("w-5 h-8", PAPER_COLORS[i % PAPER_COLORS.length])} style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }} />
                            <div className={cn("w-5 h-8", PAPER_COLORS[i % PAPER_COLORS.length])} style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 20% 100%)' }} />
                        </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
};
