import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlaylists } from '../hooks/usePlaylists';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { FiMusic, FiPlay, FiPause, FiTrash2, FiClock, FiArrowLeft } from 'react-icons/fi';
import type { Song } from '../types/music';

export const PlaylistView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getPlaylist, removeFromPlaylist } = usePlaylists();
  const { currentSong, isPlaying, play, togglePlay, addToQueue } = useAudioPlayer();
  const [isOptionsOpen, setIsOptionsOpen] = useState<string | null>(null);
  
  // Get playlist details
  const { data: playlist, isLoading, error } = getPlaylist(id || '');
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (error || !playlist) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <FiMusic size={48} className="mb-4" />
        <p className="text-xl mb-2">Playlist não encontrada</p>
        <button 
          className="text-white bg-green-600 hover:bg-green-700 px-6 py-2 rounded-full mt-4"
          onClick={() => navigate('/')}
        >
          Voltar para Home
        </button>
      </div>
    );
  }
  
  const handlePlayAll = () => {
    if (playlist.songs.length) {
      // Play first song and add the rest to queue
      const firstSong = playlist.songs[0] as Song;
      const restSongs = (playlist.songs as Song[]).slice(1);
      
      play(firstSong);
      if (restSongs.length) {
        addToQueue(restSongs);
      }
    }
  };
  
  const handlePlaySong = (song: Song) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      play(song);
    }
  };
  
  const handleRemoveSong = (songId: string) => {
    if (!id) return;
    removeFromPlaylist({ playlistId: id, songId });
    setIsOptionsOpen(null);
  };
  
  const toggleOptions = (songId: string) => {
    setIsOptionsOpen(isOptionsOpen === songId ? null : songId);
  };
  
  // Calculate total duration
  const totalDuration = (playlist.songs as Song[]).reduce(
    (acc, song) => acc + song.duration, 
    0
  );
  
  // Format duration as HH:MM
  const formatTotalDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} h ${minutes} min`;
    }
    return `${minutes} min`;
  };
  
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="flex items-start p-6 pb-4">
        <button 
          className="text-white p-2 rounded-full hover:bg-gray-700 mr-4"
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft size={20} />
        </button>
        
        <div className="flex items-center">
          <div className="w-48 h-48 bg-gray-700 shadow-lg rounded flex items-center justify-center mr-6">
            {playlist.imageUrl ? (
              <img 
                src={playlist.imageUrl} 
                alt={playlist.name} 
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <FiMusic className="text-gray-500" size={64} />
            )}
          </div>
          
          <div>
            <p className="uppercase text-xs font-semibold mb-2">Playlist</p>
            <h1 className="text-5xl font-bold mb-4">{playlist.name}</h1>
            <p className="text-gray-400 mb-2">{playlist.description}</p>
            <div className="flex items-center text-sm text-gray-400">
              <span>{(playlist.songs as Song[]).length} músicas</span>
              <span className="mx-1">•</span>
              <span>{formatTotalDuration(totalDuration)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <div className="px-8 py-4 flex items-center">
        <button 
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 mr-4 shadow-lg"
          onClick={handlePlayAll}
          disabled={(playlist.songs as Song[]).length === 0}
        >
          <FiPlay size={24} fill="white" />
        </button>
      </div>
      
      {/* Songs List */}
      <div className="flex-1 px-8 pb-8 overflow-y-auto">
        {(playlist.songs as Song[]).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FiMusic size={48} className="mb-4" />
            <p className="text-xl mb-2">Esta playlist está vazia</p>
            <p className="text-sm">Adicione músicas utilizando a busca</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 py-2 px-4 text-gray-400 text-sm border-b border-gray-700">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5">Título</div>
              <div className="col-span-4">Álbum</div>
              <div className="col-span-1"></div>
              <div className="col-span-1 flex justify-end">
                <FiClock size={16} />
              </div>
            </div>
            
            {/* Song Rows */}
            {(playlist.songs as Song[]).map((song, index) => (
              <div 
                key={song.id}
                className="grid grid-cols-12 gap-4 py-3 px-4 hover:bg-gray-800/50 rounded-md group relative"
              >
                <div className="col-span-1 flex items-center justify-center text-gray-400 group-hover:hidden">
                  {index + 1}
                </div>
                <div className="col-span-1 items-center justify-center text-white hidden group-hover:flex cursor-pointer"
                  onClick={() => handlePlaySong(song)}
                >
                  {currentSong?.id === song.id && isPlaying ? (
                    <FiPause size={16} />
                  ) : (
                    <FiPlay size={16} />
                  )}
                </div>
                
                <div className="col-span-5 flex items-center min-w-0" onClick={() => handlePlaySong(song)} style={{cursor: 'pointer'}}>
                  <div className="w-10 h-10 bg-gray-700 rounded mr-3 flex-shrink-0 overflow-hidden">
                    {song.coverUrl ? (
                      <img 
                        src={song.coverUrl} 
                        alt={song.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-700">
                        <FiMusic className="text-gray-500" size={14} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className={`font-medium truncate ${currentSong?.id === song.id ? 'text-green-500' : 'text-white'}`}>
                      {song.title}
                    </p>
                    <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                  </div>
                </div>
                
                <div className="col-span-4 flex items-center text-gray-400 truncate">
                  {song.album !== "Desconhecido" ? song.album : ""}
                </div>
                
                <div className="col-span-1 flex items-center justify-center">
                  <button 
                    className="text-gray-400 hover:text-white p-2 opacity-0 group-hover:opacity-100"
                    onClick={() => toggleOptions(song.id)}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="2" r="2"/>
                      <circle cx="8" cy="8" r="2"/>
                      <circle cx="8" cy="14" r="2"/>
                    </svg>
                  </button>
                  
                  {isOptionsOpen === song.id && (
                    <div className="absolute right-16 top-2 bg-gray-800 rounded-md shadow-lg z-10 py-1 w-48">
                      <button 
                        className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center text-sm"
                        onClick={() => handleRemoveSong(song.id)}
                      >
                        <FiTrash2 className="mr-2" size={14} />
                        Remover da playlist
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="col-span-1 flex items-center justify-end text-gray-400">
                  {song.durationFormatted}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};