
import React, { useState, useEffect } from 'react';
import { GameScene, BuddhaConfig, AppSettings, BaZiResult } from './types';
import { BUDDHA_LIST } from './constants';
import PixelBuddha from './components/PixelBuddha';
import RhythmGame from './components/RhythmGame';
import IncenseScene from './components/IncenseScene';
import AdminPanel from './components/AdminPanel';
import BirthdayInput from './components/BirthdayInput';
import InkBackground from './components/InkBackground';
import PhysicsGame from './components/PhysicsGame';
import { BaZiEngine } from './services/BaZiEngine';

const App: React.FC = () => {
  const [scene, setScene] = useState<GameScene>(GameScene.SELECTION);
  const [selectedBuddhaIdx, setSelectedBuddhaIdx] = useState(0);
  const [settings, setSettings] = useState<AppSettings>({
    targetHits: 3,
    customImages: {}
  });
  const [baZiData, setBaZiData] = useState<BaZiResult | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [titleClicks, setTitleClicks] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPhysicsGame, setShowPhysicsGame] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ZEN_TEMPLE_SETTINGS');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
    }
  }, []);

  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('ZEN_TEMPLE_SETTINGS', JSON.stringify(newSettings));
  };

  const handleTitleClick = () => {
    const next = titleClicks + 1;
    setTitleClicks(next);
    if (next >= 5) {
      setShowAdmin(true);
      setTitleClicks(0);
    }
  };

  const currentBuddha = BUDDHA_LIST[selectedBuddhaIdx];

  const generateWallpaper = async (data: BaZiResult) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. 背景底色
    ctx.fillStyle = '#f3deaf';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 纸张质感噪点
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
        ctx.fillRect(x, y, 1, 1);
    }

    // 2. 双重金边
    const gold = '#b0986c';
    ctx.strokeStyle = gold;
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // 3. 核心大字
    ctx.fillStyle = '#131313';
    ctx.textAlign = 'center';
    ctx.font = 'bold 450px "ZCOOL XiaoWei"';
    ctx.fillText(currentBuddha.symbol, 540, 650);

    // 4. 装饰垂直线
    ctx.strokeStyle = gold;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(350, 780); ctx.lineTo(350, 1150); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(730, 780); ctx.lineTo(730, 1150); ctx.stroke();

    // 5. 日柱信息
    ctx.font = 'bold 54px "Noto Serif SC"';
    ctx.fillText(`${data.dayPillar}日 · ${data.type}`, 540, 840);

    // 6. 箴言渲染
    const lines = data.oracle.split('\n');
    const maxLineLength = Math.max(...lines.map(l => l.length));
    const fontSize = maxLineLength > 8 ? 75 : 90;
    const charSpacing = fontSize * 1.25; 
    const lineSpacing = fontSize * 1.5;
    
    ctx.font = `${fontSize}px "ZCOOL XiaoWei"`;
    ctx.textBaseline = 'middle';

    const totalBlockWidth = (lines.length - 1) * lineSpacing;
    const startX = 540 + (totalBlockWidth / 2);
    const startY = 980;

    lines.forEach((line, lineIdx) => {
        const x = startX - (lineIdx * lineSpacing);
        for(let charIdx = 0; charIdx < line.length; charIdx++) {
            const y = startY + (charIdx * charSpacing);
            if (y < 1750) {
              ctx.fillText(line[charIdx], x, y);
            }
        }
    });

    // 7. 闲章
    const sealSize = 140;
    ctx.save();
    ctx.translate(canvas.width - 250, canvas.height - 350);
    ctx.rotate(-0.08);
    ctx.fillStyle = '#9d462f';
    ctx.globalAlpha = 0.9;
    ctx.fillRect(0, 0, sealSize, sealSize);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = '40px "ZCOOL XiaoWei"';
    ctx.fillText('了凡', sealSize/2, 60);
    ctx.fillText('真经', sealSize/2, 110);
    ctx.restore();

    // 8. 页脚宜忌
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#131313';
    ctx.font = '36px "Noto Serif SC"';
    ctx.fillText(`【 ${data.advice} 】`, 540, 1820);

    setResultImage(canvas.toDataURL('image/png'));
    setScene(GameScene.RESULT);
  };

  const handleBirthdaySubmit = (date: string) => {
    const result = BaZiEngine.getDayPillar(date, currentBuddha.id);
    setBaZiData(result);
    generateWallpaper(result);
  };

  const renderScene = () => {
    switch (scene) {
      case GameScene.SELECTION:
        return (
          <div className="flex flex-col items-center justify-between py-12">
            <div className="zen-card">
              <div className="text-center mb-4">
                <p className="text-[10px] font-print uppercase tracking-[0.4em] mb-1" style={{ color: 'var(--accent-blue)' }}>Ink Temple Inquiry</p>
                <div className="h-[1px] w-8 bg-black opacity-10 mx-auto mb-6"></div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center">
                <PixelBuddha config={currentBuddha} />
                <h2 className="mt-8 text-3xl font-print tracking-widest">{currentBuddha.name}</h2>
                <div className="vertical-text mt-8 h-32 opacity-60 text-sm">{currentBuddha.desc}</div>
              </div>

              <div className="w-full flex justify-between items-center mt-8 px-4">
                 <button onClick={() => setSelectedBuddhaIdx(prev => (prev === 0 ? BUDDHA_LIST.length - 1 : prev - 1))} className="text-sm opacity-40 hover:opacity-100">前缘</button>
                 <div className="seal" onClick={() => setShowPhysicsGame(true)}>圆觉</div>
                 <button onClick={() => setSelectedBuddhaIdx(prev => (prev === BUDDHA_LIST.length - 1 ? 0 : prev + 1))} className="text-sm opacity-40 hover:opacity-100">后继</button>
              </div>
            </div>
            <button onClick={() => setScene(GameScene.RHYTHM)} className="mt-12 btn-sharp text-lg">开启法事</button>
          </div>
        );
      case GameScene.RHYTHM:
        return <RhythmGame target={settings.targetHits} onWin={() => setScene(GameScene.INCENSE)} buddhaColor={currentBuddha.color} />;
      case GameScene.INCENSE:
        return <IncenseScene buddha={currentBuddha} onFinish={() => setScene(GameScene.BIRTHDAY)} />;
      case GameScene.BIRTHDAY:
        return <BirthdayInput buddha={currentBuddha} onSubmit={handleBirthdaySubmit} />;
      case GameScene.RESULT:
        return (
          <div className="flex flex-col items-center justify-center p-4">
             <div className="zen-card p-1 overflow-hidden border-none shadow-2xl">
                {resultImage && <img src={resultImage} alt="Wallpaper" className="w-full h-full object-cover" />}
             </div>
             <div className="mt-8 flex gap-6">
                <a href={resultImage || '#'} download={`ZenCard_${baZiData?.dayPillar}.png`} className="btn-sharp">收执此笺</a>
                <button onClick={() => { setScene(GameScene.SELECTION); setResultImage(null); }} className="btn-sharp">缘起再聚</button>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full max-w-lg mx-auto flex flex-col items-center justify-center overflow-hidden">
      <InkBackground />
      <header className="fixed top-0 w-full py-8 text-center z-50">
        <h1 onClick={handleTitleClick} className="text-xl font-print tracking-[0.8em] cursor-pointer opacity-80">灵动小庙</h1>
      </header>
      <main className="w-full flex items-center justify-center">{renderScene()}</main>
      <footer className="fixed bottom-0 w-full py-8 text-center opacity-20 text-[10px] tracking-[0.6em] font-print">
        凡所有相 皆是虚妄
      </footer>
      {showAdmin && <AdminPanel settings={settings} onSave={saveSettings} onClose={() => setShowAdmin(false)} />}
      {showPhysicsGame && <PhysicsGame onClose={() => setShowPhysicsGame(false)} />}
    </div>
  );
};

export default App;
