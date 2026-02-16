
import React, { useState } from 'react';
import { BuddhaConfig } from '../types';

interface IncenseSceneProps {
  buddha: BuddhaConfig;
  onFinish: () => void;
}

const IncenseScene: React.FC<IncenseSceneProps> = ({ buddha, onFinish }) => {
  const [litSticks, setLitSticks] = useState<boolean[]>([false, false, false]);
  const [isFinishing, setIsFinishing] = useState(false);

  const handleStickClick = (index: number) => {
    if (litSticks[index] || isFinishing) return;
    const next = [...litSticks];
    next[index] = true;
    setLitSticks(next);
    
    if (next.every(s => s)) {
      setIsFinishing(true);
      setTimeout(onFinish, 2800);
    }
  };

  return (
    <div className="zen-card no-shadow">
      <div className="text-center mb-12">
        <p className="text-[10px] font-print uppercase tracking-[0.4em] mb-1" style={{ color: 'var(--accent-blue)' }}>Incense Offering</p>
        <h2 className="text-xl font-print">虔诚焚香</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full pb-12">
        <div className="relative w-full h-80 flex flex-col items-center justify-end">
          
          {/* 香支区域：视觉上在炉子上方 */}
          <div className="flex gap-16 z-20 relative -mb-4">
            {litSticks.map((isLit, i) => (
              <div 
                key={i}
                onClick={() => handleStickClick(i)}
                className="incense-wrapper"
              >
                {/* 香支实体 */}
                <div className={`incense-stick ${isLit ? 'lit' : ''}`}>
                   {/* 燃烧点：金色核心 + 呼吸感余烬 */}
                   <div className="incense-tip"></div>
                   
                   {/* 袅袅青烟：从燃烧点升起 */}
                   <div className="smoke-container">
                     <div className="smoke-wave"></div>
                     <div className="smoke-wave delay-1"></div>
                     <div className="smoke-wave delay-2"></div>
                   </div>
                </div>
              </div>
            ))}
          </div>

          {/* 香炉：位于底部，视觉层级最前 */}
          <div className="relative w-56 h-28 z-30 pointer-events-none drop-shadow-md">
             <svg viewBox="0 0 100 50" className="w-full h-full" style={{ fill: 'var(--card-bg)', stroke: 'var(--line-gold)', strokeWidth: '0.8' }}>
                <path d="M5 35 Q50 48 95 35 L88 12 H12 L5 35 Z" fill="var(--bg-paper)" fillOpacity="0.7" />
                <path d="M5 35 Q50 48 95 35 L88 12 H12 L5 35" fill="none" />
                <path d="M20 40 L18 48 M80 40 L82 48 M50 42 L50 48" stroke="var(--line-gold)" strokeWidth="1.2" />
                <circle cx="50" cy="25" r="2.5" fill="var(--line-gold)" opacity="0.15"/>
             </svg>
          </div>
        </div>

        <p className="mt-16 text-sm font-print opacity-40 tracking-widest min-h-[1.5em] transition-all duration-1000">
           {isFinishing ? '清香既上 缘法自来' : '点燃三支心香 · 祈愿圆满'}
        </p>
      </div>

      <div className="seal">奉请</div>

      <style>{`
        .incense-wrapper {
          position: relative;
          width: 60px; /* 宽阔的触控区 */
          height: 180px;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          cursor: pointer;
          transition: transform 0.3s ease;
          z-index: 50;
        }
        
        .incense-stick {
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, #3d2b1f, #1a140f);
          border-radius: 1px;
          position: relative;
          opacity: 0.15;
          transition: all 1.2s ease;
        }
        
        .incense-stick.lit {
          opacity: 1;
          background: linear-gradient(to bottom, #7a3e1a, #4a2510);
        }

        /* 燃烧余烬光晕 */
        .incense-tip {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #ffda44;
          opacity: 0;
          transition: opacity 1s ease;
          z-index: 10;
        }
        
        .incense-stick.lit .incense-tip {
          opacity: 1;
          animation: ember-glow 2.5s infinite alternate ease-in-out;
        }

        @keyframes ember-glow {
          from { 
            box-shadow: 0 0 2px #ff4500, 0 0 6px #ff0000, 0 0 10px rgba(255, 69, 0, 0.3); 
            transform: translate(-50%, -50%) scale(0.85);
            background-color: #ffcc00;
          }
          to { 
            box-shadow: 0 0 4px #ffcc00, 0 0 15px #ff4500, 0 0 20px rgba(255, 204, 0, 0.4);
            transform: translate(-50%, -50%) scale(1.15);
            background-color: #fff;
          }
        }

        /* 柔和烟雾 */
        .smoke-container {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 200px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 2s ease;
        }
        
        .incense-stick.lit .smoke-container {
          opacity: 1;
        }
        
        .smoke-wave {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 1.5px;
          height: 120px;
          background: linear-gradient(to top, rgba(120, 120, 120, 0.3) 0%, rgba(255, 255, 255, 0) 100%);
          filter: blur(5px);
          transform-origin: bottom center;
          animation: smoke-float 5s infinite linear;
        }
        
        .delay-1 { animation-delay: 1.6s; width: 2px; filter: blur(7px); }
        .delay-2 { animation-delay: 3.2s; width: 1px; filter: blur(4px); }

        @keyframes smoke-float {
          0% { 
            transform: translateX(-50%) translateY(0) scaleX(1) scaleY(0.1); 
            opacity: 0; 
          }
          20% { 
            opacity: 0.5; 
          }
          60% { 
            transform: translateX(calc(-50% + 20px)) translateY(-80px) scaleX(4) scaleY(0.8);
            opacity: 0.2;
          }
          100% { 
            transform: translateX(calc(-50% - 15px)) translateY(-180px) scaleX(10) scaleY(1.4); 
            opacity: 0;
            filter: blur(15px);
          }
        }
      `}</style>
    </div>
  );
};

export default IncenseScene;
