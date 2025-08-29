import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Initial sample data
const initialMediaItems = [
  {
    id: 1,
    title: "New Healthcare Center Opens in Katsina",
    description: "State-of-the-art medical facility providing comprehensive healthcare services to the community with modern equipment and qualified medical professionals.",
    type: "image",
    category: "Healthcare",
    thumbnail: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600&h=400&fit=crop",
    fileUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=1200&h=800&fit=crop",
    status: "published",
    featured: true,
    views: 2840,
    tags: ["healthcare", "infrastructure", "community"],
    createdAt: "2024-03-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Agricultural Innovation Program Launch",
    description: "Revolutionary farming techniques and modern equipment distribution program aimed at increasing crop yields and supporting local farmers with sustainable practices.",
    type: "video",
    category: "Agriculture",
    thumbnail: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=400&fit=crop",
    fileUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=800&fit=crop",
    status: "published",
    featured: true,
    views: 1920,
    duration: "5:30",
    tags: ["agriculture", "innovation", "sustainability"],
    createdAt: "2024-03-14T14:30:00Z"
  },
  {
    id: 3,
    title: "Infrastructure Development Report 2024",
    description: "Comprehensive overview of road construction, bridge repairs, and urban planning initiatives completed this quarter.",
    type: "document",
    category: "Infrastructure",
    thumbnail: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop",
    fileUrl: "/documents/infrastructure-report-2024.pdf",
    status: "published",
    featured: false,
    downloads: 856,
    pages: 24,
    tags: ["infrastructure", "development", "planning"],
    createdAt: "2024-03-13T09:15:00Z"
  },
  {
    id: 4,
    title: "Community Education Initiative",
    description: "Expanding access to quality education through new school buildings, teacher training programs, and digital learning resources.",
    type: "image",
    category: "Education",
    thumbnail: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop",
    fileUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=1200&h=800&fit=crop",
    status: "published",
    featured: false,
    views: 1456,
    tags: ["education", "community", "development"],
    createdAt: "2024-03-12T16:45:00Z"
  },
  {
    id: 5,
    title: "Environmental Conservation Project",
    description: "Tree planting campaign and waste management system implementation to promote environmental sustainability and community health.",
    type: "video",
    category: "Environment",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    fileUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=800&fit=crop",
    status: "published",
    featured: false,
    views: 1124,
    duration: "3:45",
    tags: ["environment", "sustainability", "conservation"],
    createdAt: "2024-03-11T11:20:00Z"
  },
  {
    id: 6,
    title: "Digital Innovation Hub Launch",
    description: "New technology center providing coding bootcamps, digital literacy programs, and startup incubation services for young entrepreneurs.",
    type: "image",
    category: "Innovation",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop",
    fileUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=800&fit=crop",
    status: "published",
    featured: true,
    views: 2156,
    tags: ["innovation", "technology", "entrepreneurship"],
    createdAt: "2024-03-10T13:00:00Z"
  }
];

const STORAGE_KEY = 'katsina_lg_data';

export const DataProvider = ({ children }) => {
  // Initialize state with data from localStorage or default data
  const [mediaItems, setMediaItems] = useState(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        return parsedData.mediaItems || initialMediaItems;
      }
      return initialMediaItems;
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      return initialMediaItems;
    }
  });

  // Save data to localStorage whenever mediaItems changes
  useEffect(() => {
    try {
      const dataToSave = {
        mediaItems,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      console.log('Data saved to localStorage:', mediaItems.length, 'items');
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [mediaItems]);

  // Generate unique ID
  const generateId = () => {
    return Math.max(...mediaItems.map(item => item.id), 0) + 1;
  };

  // Add new media item
  const addMediaItem = (mediaData) => {
    const newItem = {
      ...mediaData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      views: mediaData.type === 'document' ? undefined : 0,
      downloads: mediaData.type === 'document' ? 0 : undefined
    };

    setMediaItems(prev => {
      const updated = [...prev, newItem];
      console.log('Added media item:', newItem.title);
      return updated;
    });

    return newItem;
  };

  // Update existing media item
  const updateMediaItem = (id, updates) => {
    setMediaItems(prev => {
      const updated = prev.map(item =>
          item.id === id
              ? { ...item, ...updates, updatedAt: new Date().toISOString() }
              : item
      );
      console.log('Updated media item:', id);
      return updated;
    });
  };

  // Delete media item
  const deleteMediaItem = (id) => {
    setMediaItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      console.log('Deleted media item:', id);
      return updated;
    });
  };

  // Get media by category
  const getMediaByCategory = (category) => {
    return mediaItems.filter(item =>
        item.category === category && item.status === 'published'
    );
  };

  // Get featured media
  const getFeaturedMedia = () => {
    return mediaItems.filter(item =>
        item.featured && item.status === 'published'
    );
  };

  // Get published media
  const getPublishedMedia = () => {
    return mediaItems.filter(item => item.status === 'published');
  };

  // Search media
  const searchMedia = (searchTerm, category = 'all') => {
    return mediaItems.filter(item => {
      const matchesCategory = category === 'all' || item.category === category;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch && item.status === 'published';
    });
  };

  // Reset to initial data (for testing purposes)
  const resetData = () => {
    setMediaItems(initialMediaItems);
    localStorage.removeItem(STORAGE_KEY);
    console.log('Data reset to initial state');
  };

  // Clear all data
  const clearAllData = () => {
    setMediaItems([]);
    localStorage.removeItem(STORAGE_KEY);
    console.log('All data cleared');
  };

  const value = {
    // Data
    mediaItems,

    // CRUD Operations
    addMediaItem,
    updateMediaItem,
    deleteMediaItem,

    // Getters
    getMediaByCategory,
    getFeaturedMedia,
    getPublishedMedia,
    searchMedia,

    // Utilities
    resetData,
    clearAllData
  };

  return (
      <DataContext.Provider value={value}>
        {children}
      </DataContext.Provider>
  );
};