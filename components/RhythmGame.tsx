
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { audioService } from '../services/audioService';

interface RhythmGameProps {
  target: number;
  onWin: () => void;
  buddhaColor: string;
}

const RhythmGame: React.FC<RhythmGameProps> = ({ target, onWin, buddhaColor }) => {
  const [hits, setHits] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [cursorPos, setCursorPos] = useState(0);
  
  const requestRef = useRef<number>(null);
  const directionRef = useRef<number>(1);
  const rippleIdRef = useRef(0);

  // 速度 0.07：极度舒缓，给予用户充分的反应时间
  const speed = 0.07; 

  const animate = useCallback(() => {
    setCursorPos(prev => {
      let next = prev + (directionRef.current * speed * 10);
      if (next >= 100) {
        next = 100;
        directionRef.current = -1;
      } else if (next <= 0) {
        next = 0;
        directionRef.current = 1;
      }
      return next;
    });
    requestRef.current = requestAnimationFrame(animate);
  }, [speed]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  const handleHit = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 区间包含判定 (35% - 65%)：游标中心点落在区间内即算成功
    if (cursorPos >= 35 && cursorPos <= 65) {
      const nextHits = hits + 1;
      setHits(nextHits);
      audioService.playWoodenFish();
      
      const newRipple = { id: rippleIdRef.current++, x, y };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 800);

      if (nextHits >= target) {
        setTimeout(onWin, 600);
      }
    } else {
      audioService.playError();
    }
  };

  return (
    <div className="zen-card no-shadow cursor-pointer overflow-hidden" onClick={handleHit}>
      <div className="text-center mb-12">
        <p className="text-[10px] font-print uppercase tracking-[0.4em] mb-1" style={{ color: 'var(--accent-blue)' }}>Rhythm of Mindfulness</p>
        <h2 className="text-xl font-print">敲击木鱼</h2>
        <div className="text-[10px] opacity-30 mt-2 tracking-widest font-print">功德进益: {hits} / {target}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        {/* 背景节奏条 */}
        <div className="relative w-full h-8 bg-black/5 rounded-full overflow-hidden border border-black/5">
          {/* 成功判定区 */}
          <div 
            className="absolute h-full transition-opacity duration-300"
            style={{ 
              left: '35%', 
              width: '30%', 
              backgroundColor: buddhaColor, 
              opacity: 0.15 
            }}
          ></div>
          
          <div className="absolute left-[35%] h-full w-[1px] bg-black/10"></div>
          <div className="absolute left-[65%] h-full w-[1px] bg-black/10"></div>

          {/* 移动游标 */}
          <div 
            className="absolute h-full w-1 bg-black shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10"
            style={{ left: `${cursorPos}%`, transform: 'translateX(-50%)' }}
          ></div>
        </div>
        
        <div className="mt-12 opacity-20 transform scale-150 grayscale select-none pointer-events-none">
          <svg width="80" height="64" viewBox="0 0 80 64">
            <path d="M40 10 Q70 10 70 32 Q70 54 40 54 Q10 54 10 32 Q10 10 40 10" fill="none" stroke="black" strokeWidth="2" />
            <path d="M20 32 Q40 40 60 32" fill="none" stroke="black" strokeWidth="1" />
          </svg>
        </div>
        
        <p className="mt-8 text-xs font-print opacity-30 tracking-[0.4em]">于中正之时 叩响清音</p>
      </div>

      {/* 视觉墨染反馈 */}
      <div className="absolute inset-0 pointer-events-none">
        {ripples.map(r => (
          <div 
            key={r.id}
            className="ink-ripple"
            style={{ left: r.x, top: r.y, width: '40px', height: '40px' }}
          />
        ))}
      </div>

      <div className="seal">积德</div>
    </div>
  );
};

export default RhythmGame;
