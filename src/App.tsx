import { useState } from 'react';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { useMusicLibrary } from './hooks/useMusicLibrary';
import { Controls } from './components/Controls';
import { MusicList } from './components/MusicList';
import { VolumeSlider } from './components/VolumeSlider';
import { Sidebar } from './components/Sidebar';
import { Search } from './components/Search';
import { PlaylistView } from './components/PlaylistView';
import { Home } from './components/Home';
import { QueueView } from './components/QueueView';
import { UserLibrary } from './components/UserLibrary';
import { SearchView } from './components/SearchView';
import { NowPlaying } from './components/NowPlaying';

type View = 'home' | 'search' | 'library' | 'playlist' | 'queue';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  
  const {
    currentSong,
    isPlaying,
    volume,
    progress,
    currentTime,
    duration,
    formatTime,
    repeat,
    shuffle,
    queue,
    play,
    togglePlay,
    setVolume,
    seek,
    playNext,
    playPrevious,
    toggleRepeat,
    toggleShuffle,
    addToQueue
  } = useAudioPlayer();

  const { data: songs = [], isLoading, error } = useMusicLibrary();

  // Handlers para navegação
  const navigateToHome = () => {
    setCurrentView('home');
    setSelectedPlaylistId(null);
  };

  const navigateToSearch = () => {
    setCurrentView('search');
    setSelectedPlaylistId(null);
  };

  const navigateToLibrary = () => {
    setCurrentView('library');
    setSelectedPlaylistId(null);
  };

  const navigateToPlaylist = (playlistId: string) => {
    setCurrentView('playlist');
    setSelectedPlaylistId(playlistId);
  };

  const navigateToQueue = () => {
    setCurrentView('queue');
    setSelectedPlaylistId(null);
  };

  // Renderizar conteúdo principal com base na view atual
  const renderMainContent = () => {
    switch (currentView) {
      case 'home':
        return <Home songs={songs} playSong={play} addToQueue={addToQueue} />;
      case 'search':
        return <SearchView onSongSelect={play} addToQueue={addToQueue} />;
      case 'library':
        return <UserLibrary onPlaylistSelect={navigateToPlaylist} />;
      case 'playlist':
        return selectedPlaylistId ? (
          <PlaylistView 
            playlistId={selectedPlaylistId} 
            onSongSelect={play}
            addToQueue={addToQueue} 
          />
        ) : null;
      case 'queue':
        return <QueueView queue={queue} currentSong={currentSong} onSongSelect={play} />;
      default:
        return <Home songs={songs} playSong={play} addToQueue={addToQueue} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <p className="text-lg">Carregando biblioteca de músicas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <p className="text-lg text-red-500">Erro ao carregar músicas. Verifique se o servidor está rodando.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          onHomeClick={navigateToHome}
          onSearchClick={navigateToSearch}
          onLibraryClick={navigateToLibrary}
          onQueueClick={navigateToQueue}
          onPlaylistSelect={navigateToPlaylist}
          currentView={currentView}
        />
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-6 bg-gradient-to-b from-zinc-800 to-zinc-900">
          {renderMainContent()}
        </main>
      </div>
      
      {/* Now playing bar */}
      <div className="h-20 bg-zinc-900 border-t border-zinc-800 flex items-center px-4">
        <div className="grid grid-cols-3 w-full gap-4">
          {/* Now playing info */}
          <div className="flex items-center">
            {currentSong && <NowPlaying song={currentSong} />}
          </div>
          
          {/* Player controls */}
          <div className="flex flex-col items-center justify-center">
            <Controls
              currentSong={currentSong}
              isPlaying={isPlaying}
              progress={progress}
              currentTime={currentTime}
              duration={duration}
              formatTime={formatTime}
              onTogglePlay={togglePlay}
              onSeek={seek}
              onPrevious={playPrevious}
              onNext={playNext}
              repeat={repeat}
              shuffle={shuffle}
              onToggleRepeat={toggleRepeat}
              onToggleShuffle={toggleShuffle}
            />
          </div>
          
          {/* Volume control */}
          <div className="flex items-center justify-end">
            <VolumeSlider volume={volume} onChange={setVolume} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;