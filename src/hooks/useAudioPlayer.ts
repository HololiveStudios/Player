import { useCallback, useEffect, useRef, useState } from 'react';
import type { Song } from '../types/music';

const API_URL = 'http://localhost:3001';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    // Recuperar volume do localStorage
    const savedVolume = localStorage.getItem('player_volume');
    return savedVolume ? parseFloat(savedVolume) : 0.7;
  });
  const [progress, setProgress] = useState(0);
  const [queue, setQueue] = useState<Song[]>([]);
  const [history, setHistory] = useState<Song[]>([]);
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');
  const [shuffle, setShuffle] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Inicializar o player de áudio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (queue.length > 0 || repeat === 'all') {
        playNext();
      } else {
        setIsPlaying(false);
        setProgress(0);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    // Definir volume inicial
    audio.volume = volume;

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [queue, repeat, volume]);

  // Salvar volume no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('player_volume', volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const play = useCallback((song: Song) => {
    if (!audioRef.current) return;

    // Se estiver tocando uma música diferente, adicione a atual ao histórico
    if (currentSong && currentSong.id !== song.id) {
      setHistory(prev => [currentSong, ...prev.slice(0, 49)]);
    }

    if (currentSong?.id !== song.id) {
      setProgress(0);
      setCurrentTime(0);
      audioRef.current.src = `${API_URL}/api/songs/${encodeURIComponent(song.id)}`;
      setCurrentSong(song);
    }

    audioRef.current.play().catch((error) => {
      console.error('Erro ao reproduzir:', error);
      setIsPlaying(false);
    });
    setIsPlaying(true);
  }, [currentSong]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (!currentSong) return;
    if (isPlaying) {
      pause();
    } else {
      play(currentSong);
    }
  }, [currentSong, isPlaying, play, pause]);

  const setAudioVolume = useCallback((value: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = value;
    setVolume(value);
  }, []);

  const seek = useCallback((value: number) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const time = value * audioRef.current.duration;
    audioRef.current.currentTime = time;
    setProgress(value);
    setCurrentTime(time);
  }, []);

  // Adicionar músicas à fila
  const addToQueue = useCallback((songs: Song | Song[]) => {
    if (Array.isArray(songs)) {
      setQueue(prev => [...prev, ...songs]);
    } else {
      setQueue(prev => [...prev, songs]);
    }
  }, []);

  // Limpar a fila
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Reproduzir a próxima música
  const playNext = useCallback(() => {
    if (queue.length > 0) {
      // Pegar a próxima música da fila
      const nextSong = queue[0];
      setQueue(prev => prev.slice(1));
      play(nextSong);
    } else if (repeat === 'all' && currentSong) {
      // Se repetir todas, volte para a primeira música do histórico
      const allSongs = [...history, currentSong];
      if (allSongs.length > 0) {
        play(allSongs[0]);
      }
    }
  }, [queue, play, repeat, history, currentSong]);

  // Reproduzir a música anterior
  const playPrevious = useCallback(() => {
    if (history.length > 0) {
      const previousSong = history[0];
      setHistory(prev => prev.slice(1));
      
      // Se estiver tocando uma música atualmente, adicione-a de volta à fila
      if (currentSong) {
        setQueue(prev => [currentSong, ...prev]);
      }
      
      play(previousSong);
    } else if (audioRef.current && audioRef.current.currentTime > 3) {
      // Se já passou mais de 3 segundos, volte para o início da música atual
      audioRef.current.currentTime = 0;
      setProgress(0);
      setCurrentTime(0);
    }
  }, [history, play, currentSong]);

  // Alternar modo de repetição
  const toggleRepeat = useCallback(() => {
    setRepeat(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  // Alternar modo aleatório
  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
    
    if (!shuffle && queue.length > 0) {
      // Embaralhar a fila quando ativar o modo aleatório
      setQueue(prev => {
        const newQueue = [...prev];
        for (let i = newQueue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newQueue[i], newQueue[j]] = [newQueue[j], newQueue[i]];
        }
        return newQueue;
      });
    }
  }, [shuffle, queue]);

  // Formatar tempo em MM:SS
  const formatTime = useCallback((timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  return {
    currentSong,
    isPlaying,
    volume,
    progress,
    duration,
    currentTime,
    formatTime,
    queue,
    history,
    repeat,
    shuffle,
    play,
    pause,
    togglePlay,
    setVolume: setAudioVolume,
    seek,
    addToQueue,
    clearQueue,
    playNext,
    playPrevious,
    toggleRepeat,
    toggleShuffle
  };
}