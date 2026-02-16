
import React, { useState } from 'react';
import { AppSettings, BuddhaType } from '../types';
import { BUDDHA_LIST } from '../constants';

interface AdminPanelProps {
  settings: AppSettings;
  onSave: (settings: AppSettings) => void;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ settings, onSave, onClose }) => {
  const [hits, setHits] = useState(settings.targetHits);
  const [urls, setUrls] = useState<Record<string, string>>({ ...settings.customImages });

  const handleSave = () => {
    onSave({ targetHits: hits, customImages: urls });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-md z-[2000] flex items-center justify-center p-4">
      <div className="bg-[#FAF9DE] organic-blob border-4 border-white shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-xl opacity-30 hover:opacity-100">✕</button>
        
        <h2 className="text-lg mb-8 text-center font-bold tracking-[0.5em] opacity-80 font-serif">设置 · SETTINGS</h2>
        
        <div className="space-y-8 font-serif">
          <section>
            <label className="block text-xs mb-3 font-bold opacity-60 tracking-widest">目标次数 / TARGET:</label>
            <input 
              type="number" 
              value={hits} 
              onChange={(e) => setHits(Number(e.target.value))}
              className="w-full bg-white/50 border-2 border-stone-200 organic-blob p-3 text-sm focus:outline-none focus:border-stone-400 transition-colors"
            />
          </section>

          <section>
            <label className="block text-xs mb-3 font-bold opacity-60 tracking-widest">神像链接 / IMAGE URLS:</label>
            <div className="space-y-4">
              {BUDDHA_LIST.map(b => (
                <div key={b.id} className="group">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }}></div>
                    <span className="text-[10px] font-bold opacity-60 uppercase">{b.name}</span>
                  </div>
                  <input 
                    type="text" 
                    value={urls[b.id] || ''} 
                    onChange={(e) => setUrls(prev => ({ ...prev, [b.id]: e.target.value }))}
                    placeholder="请输入图片链接..."
                    className="w-full bg-white/30 border border-stone-100 rounded-lg p-2 text-[10px] focus:outline-none focus:bg-white transition-all"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex gap-4 mt-10">
          <button 
            onClick={onClose}
            className="flex-1 organic-blob border-2 border-stone-200 py-3 text-xs font-bold opacity-60 hover:opacity-100 transition-opacity"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 organic-blob bg-[#1A3947] text-white py-3 text-xs font-bold shadow-lg hover:shadow-xl transition-all"
          >
            保存设置
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
