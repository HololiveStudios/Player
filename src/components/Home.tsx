import React, { useState, useEffect } from 'react';
import { Clock, Play, Plus } from 'lucide-react';
import type { Song } from '../types/music';
import { useQuery } from '@tanstack/react-query';

const API_URL = 'http://localhost:3001';

interface HomeProps {
  songs: Song[];
  playSong: (song: Song) => void;
  addToQueue: (song: Song) => void;
}

export function Home({ songs, playSong, addToQueue }: HomeProps) {
  const [recentlyAdded, setRecentlyAdded] = useState<Song[]>([]);
  
  // Buscar estatísticas do usuário
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/stats`);
      if (!response.ok) {
        throw new Error('Falha ao buscar estatísticas');
      }
      return response.json();
    }
  });

  // Ordenar músicas por data de adição (mais recentes primeiro)
  useEffect(() => {
    if (songs.length > 0) {
      const sorted = [...songs].sort((a, b) => {
        if (!a.addedAt || !b.addedAt) return 0;
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      });
      setRecentlyAdded(sorted.slice(0, 6));
    }
  }, [songs]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Bom dia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats?.topArtists?.slice(0, 6).map((artist, index) => (
            <div 
              key={index}
              className="bg-zinc-800/40 hover:bg-zinc-700/40 transition-colors rounded flex items-center overflow-hidden"
            >
              <div className="w-14 h-14 bg-zinc-700 flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <div className="flex-1 p-3">
                <h3 className="font-medium truncate">{artist.name}</h3>
                <p className="text-xs text-zinc-400">{artist.count} músicas</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Adicionadas recentemente</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {recentlyAdded.map(song => (
            <div key={song.id} className="bg-zinc-800/40 p-3 rounded hover:bg-zinc-700/40 transition-colors group">
              <div className="relative mb-3">
                {song.coverUrl ? (
                  <img 
                    src={song.coverUrl} 
                    alt={`${song.title} cover`}
                    className="w-full aspect-square object-cover rounded shadow-lg"
                  />
                ) : (
                  <div className="w-full aspect-square bg-zinc-700 flex items-center justify-center rounded shadow-lg">
                    <span className="text-3xl">🎵</span>
                  </div>
                )}
                <button 
                  onClick={() => playSong(song)} 
                  className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0"
                >
                  <Play size={20} className="text-black" />
                </button>
              </div>
              <h3 className="font-medium truncate">{song.title}</h3>
              <p className="text-sm text-zinc-400 truncate">{song.artist}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Todas as músicas</h2>
          <button
            onClick={() => songs.length > 0 && playSong(songs[0])}
            className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
          >
            <Play size={16} />
            <span>Reproduzir</span>
          </button>
        </div>
        
        <div className="bg-zinc-800/40 rounded-lg overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-400 border-b border-zinc-700">
              <tr>
                <th className="p-4 w-12">#</th>
                <th className="p-4">Título</th>
                <th className="p-4">Álbum</th>
                <th className="p-4 text-right"><Clock size={16} /></th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr 
                  key={song.id} 
                  className="hover:bg-zinc-700/40 border-b border-zinc-700/50 last:border-none"
                >
                  <td className="p-4 w-12">{index + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {song.coverUrl ? (
                        <img 
                          src={song.coverUrl} 
                          alt={`${song.title} cover`}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-zinc-700 flex items-center justify-center rounded">
                          <span className="text-lg">🎵</span>
                        </div>
                      )}
                      <div>
                        <div 
                          className="font-medium hover:underline cursor-pointer"
                          onClick={() => playSong(song)}
                        >
                          {song.title}
                        </div>
                        <div className="text-zinc-400 text-xs">{song.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-zinc-400">{song.album || 'Desconhecido'}</td>
                  <td className="p-4 text-zinc-400 text-right">{song.durationFormatted}</td>
                  <td className="p-4 w-12">
                    <button 
                      onClick={() => addToQueue(song)}
                      className="text-zinc-400 hover:text-white transition-colors"
                      title="Adicionar à fila"
                    >
                      <Plus size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}