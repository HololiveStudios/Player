
import { Play, Trash } from 'lucide-react';
import type { Song } from '../types/music';

interface PlaylistViewProps {
    playlistId: string;
    onSongSelect: (song: Song) => void;
    addToQueue: (songs: Song | Song[]) => void;
  }
  
  export function PlaylistView({ playlistId, onSongSelect, addToQueue }: PlaylistViewProps) {
    return <div>Playlist ID: {playlistId}</div>;
  }
  

export function UserLibrary({ library, onSongSelect, onRemove }: UserLibraryProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Sua Biblioteca</h2>
      {library.length === 0 ? (
        <p className="text-zinc-400">Você ainda não adicionou músicas à sua biblioteca.</p>
      ) : (
        <ul className="space-y-4">
          {library.map((song) => (
            <li key={song.id} className="flex items-center justify-between bg-zinc-800/40 p-3 rounded-lg hover:bg-zinc-700/40 transition-colors">
              <div className="flex items-center gap-3 flex-1">
                {song.coverUrl ? (
                  <img src={song.coverUrl} alt={song.title} className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 bg-zinc-700 flex items-center justify-center rounded">
                    <span className="text-lg">🎵</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate hover:underline cursor-pointer" onClick={() => onSongSelect(song)}>
                    {song.title}
                  </h3>
                  <p className="text-zinc-400 text-sm truncate">{song.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onSongSelect(song)} className="bg-green-500 hover:bg-green-600 text-black rounded-full h-10 w-10 flex items-center justify-center shadow-lg">
                  <Play size={20} />
                </button>
                <button onClick={() => onRemove(song.id)} className="bg-red-500 hover:bg-red-600 text-white rounded-full h-10 w-10 flex items-center justify-center shadow-lg">
                  <Trash size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}