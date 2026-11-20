import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VolumeSliderProps {
  volume: number;
  onChange: (value: number) => void;
}

export function VolumeSlider({ volume, onChange }: VolumeSliderProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(volume === 0 ? 1 : 0)}
        className="text-white hover:text-primary transition-colors"
      >
        {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  );
}