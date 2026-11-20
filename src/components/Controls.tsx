import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle } from 'lucide-react';
import type { Song } from '../types/music';

interface ControlsProps {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  formatTime: (seconds: number) => string;
  onTogglePlay: () => void;
  onSeek: (progress: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  repeat: 'off' | 'all' | 'one';
  shuffle: boolean;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
}

export function Controls({
  currentSong,
  isPlaying,
  progress,
  currentTime,
  duration,
  formatTime,
  onTogglePlay,
  onSeek,
  onPrevious,
  onNext,
  repeat,
  shuffle,
  onToggleRepeat,
  onToggleShuffle,
}: ControlsProps) {
  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-md">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleShuffle}
          className={`text-white hover:text-green-500 transition-colors ${
            shuffle ? 'text-green-500' : 'text-zinc-400'
          }`}
        >
          <Shuffle size={20} />
        </button>
        
        <button
          onClick={onPrevious}
          className="text-white hover:text-green-500 transition-colors"
        >
          <SkipBack size={20} />
        </button>
        
        <button
          onClick={onTogglePlay}
          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!currentSong}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button
          onClick={onNext}
          className="text-white hover:text-green-500 transition-colors"
        >
          <SkipForward size={20} />
        </button>
        
        <button
          onClick={onToggleRepeat}
          className={`text-white hover:text-green-500 transition-colors ${
            repeat !== 'off' ? 'text-green-500' : 'text-zinc-400'
          }`}
        >
          {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
        </button>
      </div>
      
      <div className="w-full flex items-center gap-2">
        <span className="text-xs text-zinc-400 w-10 text-right">
          {formatTime(currentTime)}
        </span>
        
        <div className="flex-1 relative group">
          <div className="h-1 bg-zinc-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-zinc-400 group-hover:bg-green-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.001"
            value={progress || 0}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={!currentSong}
          />
        </div>
        
        <span className="text-xs text-zinc-400 w-10">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}