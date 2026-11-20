import { useQuery } from '@tanstack/react-query';
import type { Song } from '../types/music';

const API_URL = 'http://localhost:3001';

export function useMusicLibrary() {
  return useQuery<Song[]>({
    queryKey: ['songs'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/songs`);
      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      return response.json();
    }
  });
}