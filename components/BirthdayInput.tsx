
import React, { useState } from 'react';
import { BuddhaConfig } from '../types';

interface BirthdayInputProps {
  buddha: BuddhaConfig;
  onSubmit: (date: string) => void;
}

const BirthdayInput: React.FC<BirthdayInputProps> = ({ buddha, onSubmit }) => {
  const [date, setDate] = useState('1995-01-01');

  return (
    <div className="zen-card no-shadow">
      <div className="text-center mb-12">
        <p className="text-[10px] font-print uppercase tracking-[0.4em] mb-1" style={{ color: 'var(--accent-blue)' }}>Chronicle of Birth</p>
        <h2 className="text-xl font-print">命理墨缘</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full px-4">
        <div className="w-full space-y-12">
          <div className="text-center opacity-60">
             <p className="font-print text-sm tracking-widest">请录入降生辰光</p>
          </div>

          <div className="relative">
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent border-b border-black/10 py-4 text-center focus:outline-none focus:border-black/30 transition-colors font-print text-lg"
            />
          </div>

          <button 
            onClick={() => onSubmit(date)}
            className="w-full btn-sharp text-lg py-4"
          >
            落笔启程
          </button>
        </div>
      </div>

      <div className="seal">注籍</div>
    </div>
  );
};

export default BirthdayInput;
