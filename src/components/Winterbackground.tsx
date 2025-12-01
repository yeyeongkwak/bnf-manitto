'use client';
import { useEffect, useState } from 'react';

interface Snowflake {
   id: number;
   x: number;
   delay: number;
   duration: number;
   size: number;
}

export function WinterBackground() {
   const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

   useEffect(() => {
      const flakes: Snowflake[] = Array.from({ length: 40 }, (_, i) => ({
         id: i,
         x: Math.random() * 100,
         delay: Math.random() * 5,
         duration: 5 + Math.random() * 10,
         size: 2 + Math.random() * 4
      }));

      const id = requestAnimationFrame(() => setSnowflakes(flakes));
      return () => cancelAnimationFrame(id);
   }, []);

   return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
         {/* 하늘 */}
         <div className="absolute inset-0 bg-gradient-to-b from-[#a8d5f2] via-[#c9e4f7] to-[#e8f4fc]" />

         {/* 구름 */}
         <div className="absolute top-8 left-20 w-64 h-32 bg-white/90 rounded-full blur-2xl" />
         <div className="absolute top-16 right-32 w-80 h-40 bg-white/80 rounded-full blur-3xl" />
         <div className="absolute bottom-0 left-0 right-0 h-2/3">
            {/* Back hill */}
            <div className="absolute bottom-0 left-0 right-0 h-96">
               <svg viewBox="0 0 1440 400" className="w-full h-full">
                  <path d="M0,200 Q360,120 720,180 T1440,200 L1440,400 L0,400 Z" fill="#f5f9fc" opacity="0.8" />
               </svg>
            </div>

            {/* Front hill */}
            <div className="absolute bottom-0 left-0 right-0 h-80">
               <svg viewBox="0 0 1440 320" className="w-full h-full">
                  <path d="M0,160 Q360,80 720,140 T1440,160 L1440,320 L0,320 Z" fill="#ffffff" />
               </svg>
            </div>
         </div>
         {/* 눈송이 */}
         {snowflakes.map(flake => (
            <div
               key={flake.id}
               className="absolute rounded-full bg-white animate-fall"
               style={{
                  left: `${flake.x}%`,
                  width: `${flake.size}px`,
                  height: `${flake.size}px`,
                  animationDelay: `${flake.delay}s`,
                  animationDuration: `${flake.duration}s`,
                  top: '-10px'
               }}
            />
         ))}

         <div className="absolute bottom-32 left-20">
            <svg width="60" height="80" viewBox="0 0 60 80">
               <ellipse cx="30" cy="70" rx="8" ry="6" fill="#88b892" opacity="0.3" />
               <path
                  d="M30,10 L40,35 L35,35 L45,55 L40,55 L48,70 L12,70 L20,55 L15,55 L25,35 L20,35 Z"
                  fill="#6b9e78"
               />
               <circle cx="28" cy="25" r="3" fill="#ffffff" opacity="0.6" />
               <circle cx="35" cy="45" r="3" fill="#ffffff" opacity="0.6" />
            </svg>
         </div>

         <div className="absolute bottom-40 right-32">
            <svg width="50" height="70" viewBox="0 0 50 70">
               <ellipse cx="25" cy="63" rx="7" ry="5" fill="#88b892" opacity="0.3" />
               <path d="M25,8 L33,30 L29,30 L37,48 L33,48 L40,63 L10,63 L17,48 L13,48 L21,30 L17,30 Z" fill="#6b9e78" />
               <circle cx="23" cy="22" r="2.5" fill="#ffffff" opacity="0.6" />
               <circle cx="29" cy="40" r="2.5" fill="#ffffff" opacity="0.6" />
            </svg>
         </div>

         <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) translateX(20px);
            opacity: 0.3;
          }
        }
        .animate-fall {
          animation: fall linear infinite;
        }
      `}</style>
      </div>
   );
}
