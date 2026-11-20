export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  year?: string;
  genre?: string;
  duration: number;
  durationFormatted: string;
  coverUrl?: string;
  path?: string;
  addedAt?: string;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  repeat: 'off' | 'all' | 'one';
  shuffle: boolean;
  queue: Song[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  songs: string[] | Song[];
  createdAt: string;
}

export interface UserStats {
  totalSongs: number;
  totalDuration: number;
  totalPlaylists: number;
  topArtists: {name: string, count: number}[];
  topAlbums: {name: string, count: number}[];
  recentlyAdded: Song[];
  genres: {name: string, count: number}[];
}