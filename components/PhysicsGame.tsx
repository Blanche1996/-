
import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { audioService } from '../services/audioService';

interface PhysicsGameProps {
  onClose: () => void;
}

const BEAD_TIERS = [
  { level: 0, radius: 18, color: '#7f8c8d', label: '灰', glow: 'rgba(127,140,141,0.3)' },
  { level: 1, radius: 26, color: '#8b4513', label: '木', glow: 'rgba(139,69,19,0.3)' },
  { level: 2, radius: 38, color: '#d4af37', label: '金', glow: 'rgba(212,175,55,0.4)' },
  { level: 3, radius: 56, color: '#00ced1', label: '琉', glow: 'rgba(0,206,209,0.5)' },
  { level: 4, radius: 86, color: '#fecfef', label: '虹', glow: 'rgba(255,154,158,0.6)' }
];

const PhysicsGame: React.FC<PhysicsGameProps> = ({ onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const [score, setScore] = useState(0);
  const [win, setWin] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const { Engine, Render, Runner, Bodies, Composite, Events } = Matter;

    const engine = Engine.create({
      gravity: { x: 0, y: 1.2, scale: 0.001 }
    });
    engineRef.current = engine;

    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio
      }
    });

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const wallColor = '#b0986c';

    // 绘制“功德箱” (U型容器)
    const walls = [
      Bodies.rectangle(width / 2, height - 10, width, 20, { isStatic: true, render: { fillStyle: wallColor } }),
      Bodies.rectangle(10, height / 2, 20, height, { isStatic: true, render: { fillStyle: wallColor } }),
      Bodies.rectangle(width - 10, height / 2, 20, height, { isStatic: true, render: { fillStyle: wallColor } })
    ];

    Composite.add(engine.world, walls);

    // 碰撞监听与合成
    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        if (bodyA.label === bodyB.label && bodyA.label.startsWith('bead_')) {
          const level = parseInt(bodyA.label.split('_')[1]);
          if (level < BEAD_TIERS.length - 1) {
            const nextLevel = level + 1;
            const midX = (bodyA.position.x + bodyB.position.x) / 2;
            const midY = (bodyA.position.y + bodyB.position.y) / 2;

            Composite.remove(engine.world, [bodyA, bodyB]);

            const tier = BEAD_TIERS[nextLevel];
            const newBead = Bodies.circle(midX, midY, tier.radius, {
              label: `bead_${nextLevel}`,
              restitution: 0.5,
              friction: 0.02,
              render: {
                fillStyle: tier.color,
                strokeStyle: '#ffffff33',
                lineWidth: 2
              }
            });
            
            Composite.add(engine.world, newBead);
            audioService.playDing();
            setScore(prev => prev + (level + 1) * 20);

            if (nextLevel === BEAD_TIERS.length - 1) {
              setWin(true);
            }
          }
        }
      });
    });

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      render.canvas.remove();
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current || !engineRef.current || win) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = 40;

    const level = 0;
    const tier = BEAD_TIERS[level];
    const bead = Matter.Bodies.circle(x, y, tier.radius, {
      label: `bead_${level}`,
      restitution: 0.4,
      friction: 0.05,
      render: { 
        fillStyle: tier.color,
        strokeStyle: '#ffffff22',
        lineWidth: 1
      }
    });

    Matter.Composite.add(engineRef.current.world, bead);
    audioService.playWoodenFish();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4">
      <div className="zen-card max-h-[90vh] flex flex-col items-center justify-between p-0 overflow-hidden relative border-none">
        <button onClick={onClose} className="absolute top-6 right-6 z-50 text-xl opacity-30 hover:opacity-100 font-print">✕</button>

        <div className="pt-10 text-center">
          <p className="text-[10px] font-print uppercase tracking-[0.4em] mb-1" style={{ color: 'var(--accent-blue)' }}>Synthesis Ritual</p>
          <h2 className="text-2xl font-print tracking-widest">圆觉合成</h2>
          <div className="text-xs font-print opacity-40 mt-2">功德点: {score}</div>
        </div>

        <div ref={containerRef} onClick={handleClick} className="flex-1 w-full cursor-crosshair relative">
          {win && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-xl z-50 animate-fade-in">
              <div className="text-center p-8 bg-[#FAF9DE] rounded-sm border-2 border-[#b0986c]">
                <h3 className="text-5xl font-print mb-6 tracking-widest">大圆满</h3>
                <p className="text-sm font-print opacity-60 mb-8">虹光普照 · 诸事皆圆</p>
                <button onClick={onClose} className="btn-sharp">收执此缘</button>
              </div>
            </div>
          )}
          <div className="absolute top-4 left-0 right-0 text-center pointer-events-none opacity-20 font-print text-[10px] tracking-widest">
            指尖轻触 · 投掷念珠
          </div>
        </div>

        <div className="pb-10 w-full px-8 text-center bg-white/10 backdrop-blur-sm">
          <div className="flex justify-center gap-4 mb-6 pt-4">
            {BEAD_TIERS.map(t => (
              <div key={t.level} className="flex flex-col items-center">
                <div 
                  className="rounded-full border border-black/10 shadow-sm" 
                  style={{ width: 14, height: 14, background: t.color }}
                ></div>
                <span className="text-[9px] font-print opacity-40 mt-1">{t.label}</span>
              </div>
            ))}
          </div>
          <div className="seal mx-auto relative bottom-0 right-0">功德</div>
        </div>
      </div>
    </div>
  );
};

export default PhysicsGame;
