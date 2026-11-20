import React from 'react';
import { Virtuoso } from 'react-virtuoso';
import type { Song } from '../types/music';
import { Music } from 'lucide-react';

interface MusicListProps {
  songs: Song[];
  currentSong: Song | null;
  onSongSelect: (song: Song) => void;
}

export function MusicList({ songs, currentSong, onSongSelect }: MusicListProps) {
  return (
    <div className="w-full h-full overflow-hidden bg-gray-900/50 rounded-lg">
      <Virtuoso
        data={songs}
        itemContent={(index, song) => (
          <button
            key={song.id}
            onClick={() => onSongSelect(song)}
            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors ${
              currentSong?.id === song.id ? 'bg-white/10' : ''
            }`}
          >
            {song.coverUrl ? (
              <img
                src={song.coverUrl}
                alt={`${song.title} cover`}
                className="w-10 h-10 rounded object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center">
                <Music size={20} className="text-gray-400" />
              </div>
            )}
            <div className="flex-1 text-left">
              <h3 className="text-white font-medium">{song.title}</h3>
              <p className="text-gray-400 text-sm">{song.artist}</p>
            </div>
          </button>
        )}
      />
    </div>
  );
}