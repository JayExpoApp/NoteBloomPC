import React, { useState, useEffect } from 'react';
import { Minus, Square, X, Maximize2 } from 'lucide-react';
import './TitleBar.css';

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (window.electron) {
      window.electron.isMaximized().then(setIsMaximized);
    }
  }, []);

  const handleMaximize = async () => {
    window.electron?.maximize();
    setTimeout(async () => {
      if (window.electron) {
        const max = await window.electron.isMaximized();
        setIsMaximized(max);
      }
    }, 100);
  };

  return (
    <div className="titlebar" style={{ WebkitAppRegion: 'drag' } as any}>
      <div className="titlebar-logo">
        <span className="titlebar-emoji">🌸</span>
        <span className="titlebar-name">NoteBloom</span>
      </div>
      <div className="titlebar-controls" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button className="tb-btn tb-min" onClick={() => window.electron?.minimize()} title="Réduire">
          <Minus size={12} />
        </button>
        <button className="tb-btn tb-max" onClick={handleMaximize} title={isMaximized ? 'Restaurer' : 'Agrandir'}>
          {isMaximized ? <Square size={11} /> : <Maximize2 size={11} />}
        </button>
        <button className="tb-btn tb-close" onClick={() => window.electron?.close()} title="Fermer">
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
