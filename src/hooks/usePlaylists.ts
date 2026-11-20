import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Playlist, Song } from '../types/music';

const API_URL = 'http://localhost:3001';

export function usePlaylists() {
  const queryClient = useQueryClient();

  // Buscar todas as playlists
  const { data: playlists = [], isLoading, error } = useQuery<Playlist[]>({
    queryKey: ['playlists'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/playlists`);
      if (!response.ok) {
        throw new Error('Falha ao buscar playlists');
      }
      return response.json();
    }
  });

  // Buscar uma playlist específica com detalhes das músicas
  const getPlaylist = (id: string) => {
    return useQuery<Playlist>({
      queryKey: ['playlist', id],
      queryFn: async () => {
        const response = await fetch(`${API_URL}/api/playlists/${id}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar detalhes da playlist');
        }
        return response.json();
      },
      enabled: !!id
    });
  };

  // Criar nova playlist
  const createPlaylistMutation = useMutation({
    mutationFn: async (newPlaylist: { name: string; description?: string; imageUrl?: string }) => {
      const response = await fetch(`${API_URL}/api/playlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlaylist),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao criar playlist');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  // Adicionar música à playlist
  const addToPlaylistMutation = useMutation({
    mutationFn: async ({ playlistId, songId }: { playlistId: string; songId: string }) => {
      const response = await fetch(`${API_URL}/api/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ songId }),
      });
      
      if (!response.ok) {
        throw new Error('Falha ao adicionar música à playlist');
      }
      
      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  // Remover música da playlist
  const removeFromPlaylistMutation = useMutation({
    mutationFn: async ({ playlistId, songId }: { playlistId: string; songId: string }) => {
      const response = await fetch(`${API_URL}/api/playlists/${playlistId}/songs/${songId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Falha ao remover música da playlist');
      }
      
      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['playlist', variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });

  return {
    playlists,
    isLoading,
    error,
    getPlaylist,
    createPlaylist: createPlaylistMutation.mutate,
    isCreating: createPlaylistMutation.isPending,
    addToPlaylist: addToPlaylistMutation.mutate,
    isAddingToPlaylist: addToPlaylistMutation.isPending,
    removeFromPlaylist: removeFromPlaylistMutation.mutate,
    isRemovingFromPlaylist: removeFromPlaylistMutation.isPending,
  };
}