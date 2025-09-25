import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// 👇 Replace with your actual backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export const DataProvider = ({ children }) => {
  const [mediaItems, setMediaItems] = useState([]); // Already correct, just ensure it's an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from backend on mount
  useEffect(() => {
    fetchMedia();
  }, []);

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  };

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/media`, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch media');
      const data = await response.json();
      
      console.log('API Response:', data); // Debug log
      
      // Handle different response structures
      if (Array.isArray(data)) {
        setMediaItems(data);
      } else if (data.data && Array.isArray(data.data)) {
        setMediaItems(data.data);
      } else if (data.items && Array.isArray(data.items)) {
        setMediaItems(data.items);
      } else {
        console.warn('Unexpected media response structure:', data);
        setMediaItems([]); // Set empty array to prevent filter errors
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching media:', err);
      setMediaItems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Update DataContext to expose a method to add already-saved media
  // Add method to directly add an already-saved media item to state
  const addSavedMediaItem = (mediaItem) => {
    setMediaItems(prevItems => [mediaItem, ...prevItems]);
    return mediaItem;
  };

  // Update the existing addMediaItem to handle both cases
  const addMediaItem = async (mediaData) => {
    try {
      // If mediaData has _id or id, it's already saved - just add to state
      if (mediaData._id || mediaData.id) {
        setMediaItems(prevItems => [mediaData, ...prevItems]);
        return mediaData;
      }
      
      // Otherwise, save to backend first (this path won't be used for file uploads)
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(mediaData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add media');
      }

      const newItem = await response.json();
      setMediaItems(prevItems => [newItem, ...prevItems]);
      
      return newItem;
    } catch (error) {
      console.error('Error adding media:', error);
      throw error;
    }
  };

  // Update the updateMediaItem function to properly update state
  const updateMediaItem = async (id, updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/media/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update media');
      }

      const updatedItem = await response.json();
      
      // Update local state
      setMediaItems(prevItems => 
        prevItems.map(item => 
          (item.id === id || item._id === id) ? updatedItem : item
        )
      );
      
      return updatedItem;
    } catch (error) {
      console.error('Error updating media:', error);
      throw error;
    }
  };

  // Update the deleteMediaItem function in DataContext
  const deleteMediaItem = async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      // Use the API_BASE_URL constant instead of hardcoded URL
      const response = await fetch(`${API_BASE}/media/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete media');
      }

      // Remove from local state
      setMediaItems(prevItems => prevItems.filter(item => item.id !== id && item._id !== id));
      
      console.log('Media deleted successfully:', id);
      return true;
    } catch (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  };

  // Getter functions with safety checks
  const getMediaByCategory = (category) => {
    if (!Array.isArray(mediaItems)) return [];
    return mediaItems.filter(
      item => item.category === category && item.status === 'published'
    );
  };

  const getFeaturedMedia = () => {
    if (!Array.isArray(mediaItems)) return [];
    return mediaItems.filter(item => item.featured && item.status === 'published');
  };

  const getPublishedMedia = () => {
    if (!Array.isArray(mediaItems)) return [];
    return mediaItems.filter(item => item.status === 'published');
  };

  const searchMedia = async (searchTerm, category = 'all') => {
    // You can do this client-side or call backend
    const url = new URL(`${API_BASE}/media`);
    if (searchTerm) url.searchParams.append('search', searchTerm);
    if (category && category !== 'all') url.searchParams.append('category', category);

    try {
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        return data;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (err) {
      console.error('Error searching media:', err);
      return [];
    }
  };

  // Optional: Only keep if useful during dev
  const resetData = () => {
    console.warn("Reset data only works locally. Use seed script on backend.");
  };

  const clearAllData = async () => {
    try {
      await Promise.all(
        mediaItems.map(item => deleteMediaItem(item.id))
      );
      console.log('All media items cleared');
    } catch (err) {
      console.error('Error clearing all data:', err);
    }
  };

  const value = {
    // State
    mediaItems,
    loading,
    error,

    // CRUD
    addMediaItem,
    addSavedMediaItem, // New method for already-saved items
    updateMediaItem,
    deleteMediaItem,

    // Getters
    getMediaByCategory,
    getFeaturedMedia,
    getPublishedMedia,
    searchMedia,

    // Utilities
    resetData,
    clearAllData,
    refresh: fetchMedia, // allow manual reload
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};