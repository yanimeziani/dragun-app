'use client';

import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function DragunAvatar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [zIndex, setZIndex] = useState(50); // Start on top
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll physics to make it react to page movement
  const { scrollYProgress } = useScroll();
  const ySpring = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Create a "breathing" effect based on scroll
  const scale = useTransform(ySpring, [0, 0.5, 1], [1, 1.2, 0.9]);
  
  // Random patrolling logic
  useEffect(() => {
    // Only run on client to avoid hydration mismatch
    if (typeof window === 'undefined') return;

    const moveRandomly = () => {
      // Calculate safe bounds (padding from edges)
      const padding = 50;
      const maxX = window.innerWidth - padding * 2;
      const maxY = window.innerHeight - padding * 2;

      const newX = Math.random() * maxX - maxX / 2; // Center based
      const newY = Math.random() * maxY - maxY / 2;

      setPosition({ x: newX, y: newY });
      
      // Randomly dive behind content to simulate depth
      // 30% chance to go behind (z-index -10), 70% to be in front (z-index 50)
      if (Math.random() > 0.7) {
        setZIndex(-10);
      } else {
        setZIndex(50);
      }
    };

    // Move every 4-7 seconds
    const interval = setInterval(moveRandomly, 5000);
    moveRandomly(); // Initial move

    return () => clearInterval(interval);
  }, [pathname]); // Reset behavior on navigation

  // If we are in the chat, the dragon should be less intrusive (maybe stick to top corner)
  const isChat = pathname.includes('/chat');

  return (
    <motion.div
      ref={containerRef}
      className="fixed top-1/2 left-1/2 pointer-events-none" // Centered by default, moves from here
      style={{ 
        zIndex,
        x: position.x,
        y: position.y,
        scale,
      }}
      animate={{
        x: isChat ? 120 : position.x, // Move to corner in chat
        y: isChat ? -250 : position.y,
        opacity: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 20,
        damping: 10,
        mass: 1.2, // Heavy, realistic feel
      }}
    >
      {/* 
        THE GOLDEN DRAGON SPIRIT 
        Since we don't have a 3D model, we build a multi-layered CSS composition 
        that looks like a glowing, breathing golden entity.
      */}
      <div className="relative w-24 h-24 md:w-32 md:h-32 group pointer-events-auto cursor-pointer"
           onMouseEnter={() => setIsHovered(true)}
           onMouseLeave={() => setIsHovered(false)}
      >
        {/* Core Glow (Soul) */}
        <div className="absolute inset-0 bg-amber-400 rounded-full blur-[40px] opacity-20 animate-pulse"></div>

        {/* The Body (Liquid Gold Gradient) */}
        <div className="absolute inset-2 bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-800 rounded-full shadow-[inset_-10px_-10px_20px_rgba(120,53,15,0.5),inset_10px_10px_20px_rgba(255,255,255,0.5)] border border-yellow-200/30 backdrop-blur-sm">
           {/* Texture/Scales overlay would go here */}
        </div>

        {/* The Eye (Sentience) */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-16 h-8 flex justify-center items-center gap-4">
             {/* Left Eye */}
             <motion.div 
               className="w-3 h-1 bg-black rounded-full shadow-[0_0_5px_rgba(255,0,0,0.5)]"
               animate={{ height: isHovered ? 8 : 2 }} // Open eyes on hover
             />
             {/* Right Eye */}
             <motion.div 
               className="w-3 h-1 bg-black rounded-full shadow-[0_0_5px_rgba(255,0,0,0.5)]"
               animate={{ height: isHovered ? 8 : 2 }}
             />
        </div>
        
        {/* Breathing Animation Ring */}
        <motion.div 
           className="absolute inset-[-10px] border-2 border-amber-500/30 rounded-full"
           animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0, 0.3] }}
           transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* Interactive Speech Bubble (Optional) */}
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-base-100/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl border border-amber-500/20 whitespace-nowrap z-[100]"
          >
            <p className="text-xs font-bold text-amber-600">I am watching over your debts.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
