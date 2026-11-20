
import { Search as SearchIcon, Play, Plus } from 'lucide-react';
import { useSearch } from '../hooks/useSearch';
import type { Song } from '../types/music';

interface SearchViewProps {
  onSongSelect: (song: Song) => void;
  addToQueue: (song: Song) => void;
}

export function SearchView({ onSongSelect, addToQueue }: SearchViewProps) {
  const { searchTerm, setSearchTerm, results, isLoading, hasResults } = useSearch();

  return (
    <div className="space-y-6">
      <div className="sticky top-0 bg-zinc-800/80 backdrop-blur-md z-10 py-4">
        <div className="relative max-w-md mx-auto">
          <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="O que você quer ouvir?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-700 text-white rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-32">
          <p className="text-zinc-400">Buscando...</p>
        </div>
      )}

      {!isLoading && searchTerm && !hasResults && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Nenhum resultado encontrado para "{searchTerm}"</h3>
          <p className="text-zinc-400">Verifique a ortografia ou tente termos diferentes</p>
        </div>
      )}

      {hasResults && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Resultados</h2>
          
          {/* Top result */}
          {results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-zinc-800/40 rounded-lg p-5 hover:bg-zinc-700/40 transition-colors">
                <h3 className="text-sm uppercase text-zinc-400 mb-4">Melhor resultado</h3>
                <div className="flex flex-col items-start">
                  {results[0].coverUrl ? (
                    <img 
                      src={results[0].coverUrl} 
                      alt={`${results[0].title} cover`}
                      className="w-24 h-24 mb-4 object-cover shadow-lg rounded"
                    />
                  ) : (
                    <div className="w-24 h-24 mb-4 bg-zinc-700 flex items-center justify-center rounded shadow-lg">
                      <span className="text-3xl">🎵</span>
                    </div>
                  )}
                  <h2 className="text-2xl font-bold mb-1">{results[0].title}</h2>
                  <p className="text-zinc-400 flex items-center gap-2 mb-4">
                    {results[0].artist}
                    <span className="w-1 h-1 bg-zinc-400 rounded-full"></span>
                    <span>Música</span>
                  </p>
                  <button 
                    onClick={() => onSongSelect(results[0])}
                    className="bg-green-500 hover:bg-green-600 text-black rounded-full h-10 w-10 flex items-center justify-center shadow-lg"
                  >
                    <Play size={20} />
                  </button>
                </div>
              </div>

              <div className="bg-zinc-800/40 rounded-lg p-5">
                <h3 className="text-sm uppercase text-zinc-400 mb-4">Músicas</h3>
                <ul className="space-y-2">
                  {results.slice(0, 4).map(song => (
                    <li key={song.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3 flex-1">
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
                        <div className="flex-1 min-w-0">
                          <div 
                            className="font-medium truncate hover:underline cursor-pointer"
                            onClick={() => onSongSelect(song)}
                          >
                            {song.title}
                          </div>
                          <div className="text-zinc-400 text-xs truncate">{song.artist}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => onSongSelect(song)}
                          className="p-2 rounded-full hover:bg-zinc-700"
                        >
                          <Play size={18} />
                        </button>
                        <button 
                          onClick={() => addToQueue(song)}
                          className="p-2 rounded-full hover:bg-zinc-700"
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}