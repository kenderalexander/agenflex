import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export const MobileStatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState('6:24');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex items-center justify-between px-5 pt-2 pb-1 text-white select-none text-xs font-semibold">
      <span className="font-bold tracking-tight text-[13px]">{timeStr}</span>
      <div className="flex items-center gap-1.5 text-white/90">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <Battery className="w-4 h-4 fill-white text-white" />
      </div>
    </div>
  );
};
