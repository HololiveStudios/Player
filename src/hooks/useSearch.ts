import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import type { Song } from '../types/music';

const API_URL = 'http://localhost:3001';

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  
  // Debounce do termo de busca
  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  const { data: results = [], isLoading, error } = useQuery<Song[]>({
    queryKey: ['search', debouncedTerm],
    queryFn: async () => {
      if (!debouncedTerm.trim()) return [];
      
      const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(debouncedTerm)}`);
      if (!response.ok) {
        throw new Error('Falha ao buscar resultados');
      }
      return response.json();
    },
    enabled: debouncedTerm.trim().length > 0
  });
  
  return {
    searchTerm,
    setSearchTerm,
    results,
    isLoading,
    error,
    hasResults: results.length > 0
  };
}