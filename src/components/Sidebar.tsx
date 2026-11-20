import React, { useState } from 'react';
import { Home, Search, Library, ListMusic, Plus, Heart } from 'lucide-react';
import { usePlaylists } from '../hooks/usePlaylists';

interface SidebarProps {
  onHomeClick: () => void;
  onSearchClick: () => void;
  onLibraryClick: () => void;
  onQueueClick: () => void;
  onPlaylistSelect: (id: string) => void;
  currentView: string;
}

export function Sidebar({ 
  onHomeClick, 
  onSearchClick, 
  onLibraryClick,
  onQueueClick,
  onPlaylistSelect,
  currentView
}: SidebarProps) {
  const { playlists, createPlaylist, isCreating } = usePlaylists();
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist({
        name: newPlaylistName.trim(),
        description: `Playlist criada em ${new Date().toLocaleDateString()}`
      });
      setNewPlaylistName('');
      setShowCreatePlaylist(false);
    }
  };

  return (
    <div className="w-64 bg-zinc-900 flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white mb-6">Spotify Clone</h1>
        
        <nav className="space-y-6">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={onHomeClick}
                className={`flex items-center gap-3 w-full p-2 rounded hover:bg-zinc-800 transition-colors ${
                  currentView === 'home' ? 'text-green-500' : 'text-zinc-300'
                }`}
              >
                <Home size={20} />
                <span>Início</span>
              </button>
            </li>
            <li>
              <button 
                onClick={onSearchClick}
                className={`flex items-center gap-3 w-full p-2 rounded hover:bg-zinc-800 transition-colors ${
                  currentView === 'search' ? 'text-green-500' : 'text-zinc-300'
                }`}
              >
                <Search size={20} />
                <span>Buscar</span>
              </button>
            </li>
            <li>
              <button 
                onClick={onLibraryClick}
                className={`flex items-center gap-3 w-full p-2 rounded hover:bg-zinc-800 transition-colors ${
                  currentView === 'library' ? 'text-green-500' : 'text-zinc-300'
                }`}
              >
                <Library size={20} />
                <span>Sua Biblioteca</span>
              </button>
            </li>
            <li>
              <button 
                onClick={onQueueClick}
                className={`flex items-center gap-3 w-full p-2 rounded hover:bg-zinc-800 transition-colors ${
                  currentView === 'queue' ? 'text-green-500' : 'text-zinc-300'
                }`}
              >
                <ListMusic size={20} />
                <span>Fila de Reprodução</span>
              </button>
            </li>
          </ul>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold uppercase text-zinc-400">Playlists</h2>
              <button 
                onClick={() => setShowCreatePlaylist(!showCreatePlaylist)}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            
            {showCreatePlaylist && (
              <div className="mb-3 p-2 bg-zinc-800 rounded">
                <input
                  type="text"
                  placeholder="Nome da playlist"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="bg-zinc-700 text-white p-2 rounded w-full mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreatePlaylist}
                    disabled={isCreating || !newPlaylistName.trim()}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                  >
                    Criar
                  </button>
                  <button
                    onClick={() => setShowCreatePlaylist(false)}
                    className="bg-transparent border border-zinc-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
            
            <ul className="space-y-1 max-h-64 overflow-y-auto">
              <li>
                <button className="flex items-center gap-3 w-full p-2 rounded hover:bg-zinc-800 transition-colors text-zinc-300">
                  <Heart size={18} className="text-pink-600" />
                  <span>Músicas Curtidas</span>
                </button>
              </li>
              
              {playlists.map((playlist) => (
                <li key={playlist.id}>
                  <button 
                    onClick={() => onPlaylistSelect(playlist.id)}
                    className={`flex items-center gap-3 w-full p-2 rounded hover:bg-zinc-800 transition-colors ${
                      currentView === 'playlist' && selectedPlaylistId === playlist.id 
                        ? 'text-green-500' 
                        : 'text-zinc-300'
                    }`}
                  >
                    <span className="truncate">{playlist.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}