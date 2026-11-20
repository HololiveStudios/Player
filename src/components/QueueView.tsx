import React from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { FiMusic, FiRepeat, FiShuffle} from 'react-icons/fi';
import type { Song } from '../types/music';


export const QueueView: React.FC = () => {
  const { 
    currentSong, 
    queue, 
    history, 
    repeat,
    shuffle,
    toggleRepeat,
    toggleShuffle,
    play,
    clearQueue 
  } = useAudioPlayer();
  
  const handlePlaySong = (song: Song) => {
    play(song);
  };
  
  // Helper function to make repeat mode more readable
  const getRepeatModeText = () => {
    switch(repeat) {
      case 'off': return 'Desativado';
      case 'all': return 'Repetir todas';
      case 'one': return 'Repetir uma';
      default: return '';
    }
  };
  
  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto bg-gray-900 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Fila de reprodução</h1>
        
        <div className="flex items-center space-x-4">
          <button 
            className={`flex items-center px-3 py-1 rounded-full text-sm ${repeat !== 'off' ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={toggleRepeat}
            title="Alternar modo de repetição"
          >
            <FiRepeat className="mr-2" size={16} />
            <span>{getRepeatModeText()}</span>
          </button>
          
          <button 
            className={`flex items-center px-3 py-1 rounded-full text-sm ${shuffle ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={toggleShuffle}
            title="Alternar modo aleatório"
          >
            <FiShuffle className="mr-2" size={16} />
            <span>{shuffle ? 'Ativado' : 'Desativado'}</span>
          </button>
        </div>
      </div>
      
      {/* Now Playing */}
      {currentSong && (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4 text-gray-400">Tocando agora</h2>
          <div className="flex items-center p-3 bg-gray-800 rounded-md">
            <div className="w-12 h-12 bg-gray-700 rounded-md overflow-hidden mr-4 flex-shrink-0">
              {currentSong.coverUrl ? (
                <img 
                  src={currentSong.coverUrl} 
                  alt={currentSong.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiMusic className="text-gray-500" size={20} />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{currentSong.title}</p>
              <p className="text-sm text-gray-400 truncate">{currentSong.artist}</p>
            </div>
            
            <div className="text-sm text-gray-400">
              {currentSong.durationFormatted}
            </div>
          </div>
        </div>
      )}
      
      {/* Queue */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-400">Próximas na fila</h2>
          {queue.length > 0 && (
            <button 
              className="text-sm text-gray-400 hover:text-white"
              onClick={clearQueue}
            >
              Limpar fila
            </button>
          )}
        </div>
        
        {queue.length === 0 ? (
          <div className="bg-gray-800 rounded-md p-6 text-center">
            <FiMusic className="mx-auto mb-4 text-gray-600" size={32} />
            <p className="text-gray-400">Sua fila está vazia</p>
            <p className="text-sm text-gray-500 mt-2">Adicione músicas através da busca ou playlists</p>
          </div>
        ) : (
          <div className="space-y-2">
            {queue.map((song, index) => (
              <div 
                key={`${song.id}-${index}`}
                className="flex items-center p-3 hover:bg-gray-800 rounded-md group transition-colors cursor-pointer"
                onClick={() => handlePlaySong(song)}
              >
                <div className="w-10 h-10 bg-gray-800 rounded-md overflow-hidden mr-4 flex-shrink-0">
                  {song.coverUrl ? (
                    <img 
                      src={song.coverUrl} 
                      alt={song.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <FiMusic className="text-gray-500" size={16} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{song.title}</p>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>
                
                <div className="text-sm text-gray-400 flex items-center mr-2">
                  {song.durationFormatted}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* History */}
      {history.length > 0 && (
        <div>
          <h2 className="text-lg font-medium mb-4 text-gray-400">Histórico recente</h2>
          <div className="space-y-2">
            {history.slice(0, 5).map((song, index) => (
              <div 
                key={`history-${song.id}-${index}`}
                className="flex items-center p-3 hover:bg-gray-800 rounded-md transition-colors cursor-pointer group opacity-70 hover:opacity-100"
                onClick={() => handlePlaySong(song)}
              >
                <div className="w-10 h-10 bg-gray-800 rounded-md overflow-hidden mr-4 flex-shrink-0">
                  {song.coverUrl ? (
                    <img 
                      src={song.coverUrl} 
                      alt={song.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-700">
                      <FiMusic className="text-gray-500" size={16} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{song.title}</p>
                  <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                </div>
                
                <div className="text-sm text-gray-400">
                  {song.durationFormatted}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};