
import React, { useState, useEffect, useRef } from 'react';
import { BuddhaConfig } from '../types';

interface Particle {
  id: number;
  x: number;
  opacity: number;
}

interface IncenseSceneProps {
  buddha: BuddhaConfig;
  onFinish: () => void;
}

const IncenseScene: React.FC<IncenseSceneProps> = ({ buddha, onFinish }) => {
  const [litSticks, setLitSticks] = useState<boolean[]>([false, false, false]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);
  const particleIdRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      litSticks.forEach((lit, idx) => {
        if (lit) {
          const newParticle = {
            id: particleIdRef.current++,
            x: (idx - 1) * 40 + (Math.random() * 6 - 3),
            opacity: 0.4
          };
          setParticles(prev => [...prev.slice(-30), newParticle]);
        }
      });
    }, 150);
    return () => clearInterval(interval);
  }, [litSticks]);

  const handleStickClick = (index: number) => {
    if (litSticks[index] || isFinishing) return;
    const next = [...litSticks];
    next[index] = true;
    setLitSticks(next);
    if (next.every(s => s)) {
      setIsFinishing(true);
      setTimeout(onFinish, 2000);
    }
  };

  return (
    <div className="zen-card no-shadow">
      <div className="text-center mb-12">
        <p className="text-[10px] font-print uppercase tracking-[0.4em] mb-1" style={{ color: 'var(--accent-blue)' }}>Incense Offering</p>
        <h2 className="text-xl font-print">虔诚焚香</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-end w-full pb-12">
        <div className="relative w-full h-64 flex flex-col items-center justify-end">
          {/* 烟雾线 */}
          <div className="absolute top-0 w-full h-full pointer-events-none">
            {particles.map(p => (
              <div 
                key={p.id}
                className="absolute w-[1px] h-12 bg-black opacity-10"
                style={{ 
                  left: `calc(50% + ${p.x}px)`,
                  bottom: '100px',
                  animation: 'smoke-rise 3s ease-out forwards',
                  opacity: p.opacity
                }}
              />
            ))}
          </div>

          {/* 香炉 - 线描 */}
          <div className="relative w-40 h-20 mb-[-10px] z-20">
             <svg viewBox="0 0 100 50" className="w-full h-full" style={{ fill: 'var(--card-bg)', stroke: 'var(--line-gold)', strokeWidth: '1' }}>
                <path d="M10 40 Q50 50 90 40 L85 10 H15 L10 40" />
                <circle cx="20" cy="25" r="2" fill="var(--line-gold)" opacity="0.2"/>
                <circle cx="80" cy="25" r="2" fill="var(--line-gold)" opacity="0.2"/>
             </svg>
          </div>

          {/* 香支 */}
          <div className="flex gap-10 z-10 mb-8">
            {litSticks.map((isLit, i) => (
              <div 
                key={i}
                onClick={() => handleStickClick(i)}
                className={`relative w-[1px] h-32 cursor-pointer transition-all duration-1000 ${isLit ? 'bg-[#8B4513]' : 'bg-black opacity-10'}`}
              >
                {isLit && (
                  <div className="absolute top-0 left-[-1px] w-1 h-1 bg-red-600 rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-12 text-sm font-print opacity-30 tracking-widest">
           {isFinishing ? '清香既上 缘法自来' : '点燃三支心香'}
        </p>
      </div>

      <div className="seal">奉请</div>

      <style>{`
        @keyframes smoke-rise {
          0% { transform: translateY(0) scaleX(1); opacity: 0.3; }
          100% { transform: translateY(-150px) scaleX(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default IncenseScene;
