
import React from 'react';
import { BuddhaConfig } from '../types';

interface PixelBuddhaProps {
  config: BuddhaConfig;
  className?: string;
}

const PixelBuddha: React.FC<PixelBuddhaProps> = ({ config, className = '' }) => {
  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      {/* 顶部线描装饰 */}
      <div className="mb-6 opacity-30">
        <svg width="40" height="20" viewBox="0 0 40 20">
          <path d="M0 10 Q10 0 20 10 T40 10" fill="none" stroke="var(--line-gold)" strokeWidth="1" />
        </svg>
      </div>

      {/* 核心字意象 */}
      <div className="flex items-center gap-6">
        <div className="divider-v"></div>
        <div 
          className="font-print text-8xl select-none tracking-tighter"
          style={{ color: 'var(--ink-text)', opacity: 0.9 }}
        >
          {config.symbol}
        </div>
        <div className="divider-v"></div>
      </div>

      {/* 底部线描装饰 */}
      <div className="mt-6 opacity-30 rotate-180">
        <svg width="40" height="20" viewBox="0 0 40 20">
          <path d="M0 10 Q10 0 20 10 T40 10" fill="none" stroke="var(--line-gold)" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};

export default PixelBuddha;
