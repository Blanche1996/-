
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

  const speed = 0.25; 

  const animate = useCallback((time: number) => {
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

    if (cursorPos >= 40 && cursorPos <= 60) {
      const nextHits = hits + 1;
      setHits(nextHits);
      audioService.playWoodenFish();
      
      const newRipple = { id: rippleIdRef.current++, x, y };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 800);

      if (nextHits >= target) {
        onWin();
      }
    } else {
      audioService.playError();
    }
  };

  return (
    <div className="zen-card no-shadow cursor-pointer overflow-hidden" onClick={handleHit}>
      {/* 墨晕层 */}
      <div className="absolute inset-0 pointer-events-none">
        {ripples.map(r => (
          <div 
            key={r.id}
            className="ink-ripple"
            style={{ left: r.x, top: r.y, width: '40px', height: '40px' }}
          />
        ))}
      </div>

      {/* 天 - 标题 */}
      <div className="text-center mb-8">
        <p className="text-[10px] font-print uppercase tracking-[0.4em] mb-1" style={{ color: 'var(--accent-blue)' }}>Mokugyo Ritual</p>
        <h2 className="text-xl font-print">敲击墨染木鱼</h2>
      </div>

      {/* 人 - 核心内容 */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* 白描风格木鱼 */}
        <div className="relative w-48 h-48 mb-12">
          <svg viewBox="0 0 100 100" className="w-full h-full" style={{ fill: 'none', stroke: 'var(--ink-text)', strokeWidth: '1' }}>
            <path d="M50 15 C80 15 95 40 95 65 C95 85 80 95 50 95 C20 95 5 85 5 65 C5 40 20 15 50 15" />
            <path d="M30 60 Q50 45 70 60" opacity="0.3" />
            <path d="M35 75 Q50 65 65 75" opacity="0.2" />
            {/* 木鱼开口线 */}
            <path d="M15 65 H85" opacity="0.1" />
          </svg>
        </div>

        {/* 节奏条 - 极简线框 */}
        <div className="w-full h-8 relative flex items-center mb-4">
          <div className="absolute inset-x-0 h-[1px] bg-black opacity-10"></div>
          {/* 判定区 */}
          <div className="absolute left-[40%] right-[40%] h-full border-x border-black opacity-20"></div>
          {/* 指针 */}
          <div 
            className="absolute w-[2px] h-full bg-black z-10"
            style={{ left: `${cursorPos}%`, transition: 'none' }}
          ></div>
        </div>
        <p className="font-print text-sm opacity-40">于中心处叩首: {hits} / {target}</p>
      </div>

      {/* 地 - 印章 */}
      <div className="seal">了凡</div>
    </div>
  );
};

export default RhythmGame;
