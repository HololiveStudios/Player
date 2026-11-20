import React from 'react';
import { Heart } from 'lucide-react';
import type { Song } from '../types/music';

interface NowPlayingProps {
  song: Song;
}

export function NowPlaying({ song }: NowPlayingProps) {
  return (
    <div className="flex items-center gap-3">
      {song.coverUrl ? (
        <img
          src={song.coverUrl}
          alt={`${song.title} cover`}
          className="w-14 h-14 object-cover"
        />
      ) : (
        <div className="w-14 h-14 bg-zinc-800 flex items-center justify-center">
          <span className="text-2xl">🎵</span>
        </div>
      )}
      
      <div>
        <h3 className="text-sm font-medium">{song.title}</h3>
        <p className="text-xs text-zinc-400">{song.artist}</p>
      </div>
      
      <button className="ml-4 text-zinc-400 hover:text-pink-500 transition-colors">
        <Heart size={18} />
      </button>
    </div>
  );
}