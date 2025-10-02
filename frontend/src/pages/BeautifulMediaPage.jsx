import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Play, FileText, Image, Download, Search, Filter, Calendar,
    Eye, Share2, Clock, ChevronRight, Grid, List, TrendingUp, Star, Newspaper
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

// Add the relative time helper function
const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) {
        return 'just now';
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }
    
    const days = Math.floor(hours / 24);
    if (days < 7) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    }
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
    
    const months = Math.floor(days / 30);
    if (months < 12) {
        return months === 1 ? '1 month ago' : `${months} months ago`;
    }
    
    const years = Math.floor(days / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
};

const BeautifulMediaPage = () => {
    const { mediaItems, loading } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, popular
    const [viewMode, setViewMode] = useState('grid'); // grid or list
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    // Share function
    const handleShare = (item) => {
        const url = `${window.location.origin}/media/${item.slug || item.id || item._id}`;
        const text = `Check out: ${item.title}`;
        
        if (navigator.share) {
            navigator.share({
                title: item.title,
                text: text,
                url: url
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        }
    };

    // Get categories with counts from actual data
    const categories = useMemo(() => {
        const categoryCount = {};
        
        mediaItems.forEach(item => {
            if (item.status === 'published') {
                const cat = item.category || 'General';
                categoryCount[cat] = (categoryCount[cat] || 0) + 1;
            }
        });

        const categoriesArray = [
            { id: 'all', label: 'All', count: mediaItems.filter(item => item.status === 'published').length }
        ];

        Object.entries(categoryCount).forEach(([category, count]) => {
            categoriesArray.push({ id: category, label: category, count });
        });

        return categoriesArray;
    }, [mediaItems]);

    // Filter and sort items
    const processedItems = useMemo(() => {
        let filtered = mediaItems.filter(item => item.status === 'published');

        // Apply category filter
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt);
                case 'oldest':
                    return new Date(a.createdAt || a.updatedAt) - new Date(b.createdAt || b.updatedAt);
                case 'popular':
                    return (b.views || 0) + (b.downloads || 0) - (a.views || 0) - (a.downloads || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [mediaItems, selectedCategory, searchTerm, sortBy, currentTime]);

    // Get featured items (marked as featured or most viewed)
    const featuredItems = useMemo(() => {
        return mediaItems
            .filter(item => item.status === 'published' && (item.featured || (item.views && item.views > 50)))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2);
    }, [mediaItems]);

    // Get trending items (most viewed in the last 7 days)
    const trendingItems = useMemo(() => {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return processedItems
            .filter(item => new Date(item.createdAt) > sevenDaysAgo)
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 5);
    }, [processedItems]);

    const getTypeColor = (type) => {
        switch (type) {
            case 'video': return 'bg-red-500';
            case 'document': return 'bg-blue-500';
            case 'image': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'video': return <Play className="w-5 h-5" />;
            case 'document': return <FileText className="w-5 h-5" />;
            case 'image': return <Image className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    return (
        <div className="py-20 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                        Media & News Center
                    </h1>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Stay informed with the latest developments, success stories, and transformative projects shaping
                        the future of Katsina Local Government Area.
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search media..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-4">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="popular">Most Popular</option>
                            </select>

                            {/* View Mode Toggle */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-3 rounded-lg ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-3 rounded-lg ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2 mt-6">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                    selectedCategory === category.id
                                        ? 'bg-green-600 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-green-50 border border-gray-200'
                                }`}
                            >
                                {category.label} ({category.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Featured Media Section */}
                {/* {featuredItems.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <Star className="w-6 h-6 text-yellow-500 fill-current" />
                            <h2 className="text-2xl font-bold text-gray-800">Featured News</h2>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-8">
                            {featuredItems.map((item) => (
                                <div key={item.id || item._id}
                                     className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
                                    <div className="relative h-64">
                                        <img
                                            src={item.thumbnail || item.fileUrl || '/default-media-image.jpg'}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getTypeColor(item.type)}`}>
                                                {item.type?.toUpperCase() || 'MEDIA'}
                                            </span>
                                        </div>

                                        {item.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <button className="bg-white/20 backdrop-blur-sm border-2 border-white rounded-full p-4 hover:bg-white/30 transition-all transform hover:scale-110">
                                                    <Play className="w-8 h-8 text-white"/>
                                                </button>
                                            </div>
                                        )}

                                        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                                            <div className="flex items-center gap-2">
                                                <Eye className="w-4 h-4"/>
                                                {item.views?.toLocaleString() || '0'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {item.category || 'General'}
                                            </span>
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <Clock className="w-4 h-4"/>
                                                {getRelativeTime(item.createdAt)}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-800 mb-3 leading-tight line-clamp-2 min-h-[3.5rem]">
                                            {item.title}
                                        </h3>

                                        <p className="text-gray-600 leading-relaxed mb-4 line-clamp-3 flex-1">
                                            {item.description || 'No description available'}
                                        </p>

                                        <div className="flex gap-3">
                                            <Link
                                                to={`/media/${item.id || item._id}`}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                                            >
                                                {getTypeIcon(item.type)}
                                                {item.type === 'video' ? 'Watch Now' : item.type === 'document' ? 'Download' : 'View'}
                                            </Link>
                                            <button
                                                onClick={() => handleShare(item)}
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl transition-all"
                                                title="Share"
                                            >
                                                <Share2 className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )} */}

                {/* Trending Section with Thumbnails */}
                {trendingItems.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-6">
                            <TrendingUp className="w-6 h-6 text-red-500" />
                            <h2 className="text-2xl font-bold text-gray-800">Trending This Week</h2>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            {trendingItems.map((item) => (
                                <div key={item.id || item._id} className="min-w-[280px] max-w-[320px] bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-3 flex gap-3">
                                    <img
                                        src={item.thumbnail || item.fileUrl || '/default-media-image.jpg'}
                                        alt={item.title}
                                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0 flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`w-2 h-2 rounded-full ${getTypeColor(item.type)}`}></span>
                                            <span className="text-xs text-gray-500">{getRelativeTime(item.createdAt)}</span>
                                        </div>
                                        <h4 className="font-semibold text-gray-800 mb-auto" 
                                            title={item.title}>
                                            <span className="text-sm leading-tight line-clamp-2 md:text-xs md:leading-tight">
                                                {item.title}
                                            </span>
                                        </h4>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {(item.views || 0).toLocaleString()}
                                            </span>
                                            <Link
                                                to={`/media/${item.slug || item._id || item.id}`}  // ✅ Updated to use slug
                                                className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md transition-colors"
                                            >
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <div>
                    {/* Main Content Header */}
                    <div className="border-b border-gray-200 pb-4 mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Newspaper className="w-6 h-6 text-green-600" />
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {searchTerm ? 
                                            `Search Results for "${searchTerm}"` : 
                                            selectedCategory === 'all' ? 'All News & Media' : `${selectedCategory} News`
                                        }
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        Showing {processedItems.length} of {mediaItems.filter(item => item.status === 'published').length} total items
                                    </p>
                                </div>
                            </div>
                            {processedItems.length > 0 && (
                                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                                    <span>Sorted by:</span>
                                    <span className="font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                        {sortBy === 'newest' ? '🕐 Newest First' : sortBy === 'oldest' ? '📅 Oldest First' : '🔥 Most Popular'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {loading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                                    <div className="w-full h-48 bg-gray-300"></div>
                                    <div className="p-6">
                                        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                                        <div className="h-6 bg-gray-300 rounded mb-3"></div>
                                        <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : processedItems.length > 0 ? (
                        <div className={viewMode === 'grid' 
                            ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8" 
                            : "space-y-4"
                        }>
                            {processedItems.map((item) => (
                                <div key={item.id || item._id} 
                                    className={viewMode === 'grid'
                                        ? "bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full group"
                                        : "bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 flex gap-4 items-center"
                                    }>
                                    {viewMode === 'grid' ? (
                                        // Grid View
                                        <>
                                            <div className="relative overflow-hidden">
                                                <img
                                                    src={item.thumbnail || item.fileUrl || '/default-media-image.jpg'}
                                                    alt={item.title}
                                                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 left-3">
                                                    <span className={`px-2 py-1 rounded-md text-xs font-semibold text-white ${getTypeColor(item.type)}`}>
                                                        {item.type?.toUpperCase() || 'MEDIA'}
                                                    </span>
                                                </div>

                                                {/* NEW badge for items less than 24 hours old */}
                                                {new Date() - new Date(item.createdAt) < 86400000 && (
                                                    <div className="absolute top-3 right-3">
                                                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                                                            NEW
                                                        </span>
                                                    </div>
                                                )}

                                                {item.type === 'video' && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <button className="bg-white/20 backdrop-blur-sm border border-white rounded-full p-3 hover:bg-white/30 transition-all">
                                                            <Play className="w-6 h-6 text-white"/>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4 flex flex-col flex-1">
                                                <div className="mb-2">
                                                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                                                        {item.category || 'General'}
                                                    </span>
                                                </div>

                                                <h3 className="font-bold text-gray-800 mb-2 leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-green-600 transition-colors">
                                                    {item.title}
                                                </h3>

                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                                                    {item.description || 'No description available'}
                                                </p>

                                                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3"/>
                                                        <span className="font-medium">{getRelativeTime(item.createdAt || item.updatedAt)}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3 h-3"/>
                                                        {item.views?.toLocaleString() || '0'}
                                                    </span>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Link
                                                        to={`/media/${item.slug || item.id || item._id}`}
                                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors text-sm text-center"
                                                    >
                                                        {item.type === 'video' ? 'Watch' : item.type === 'document' ? 'Download' : 'View'}
                                                    </Link>
                                                    <button
                                                        onClick={() => handleShare(item)}
                                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 rounded-lg transition-all"
                                                        title="Share"
                                                    >
                                                        <Share2 className="w-4 h-4"/>
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        // List View
                                        <>
                                            <img
                                                src={item.thumbnail || item.fileUrl || '/default-media-image.jpg'}
                                                alt={item.title}
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-1 rounded-md text-xs font-semibold text-white ${getTypeColor(item.type)}`}>
                                                        {item.type?.toUpperCase() || 'MEDIA'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        <Clock className="w-3 h-3 inline mr-1"/>
                                                        {getRelativeTime(item.createdAt || item.updatedAt)}
                                                    </span>
                                                    {new Date() - new Date(item.createdAt) < 86400000 && (
                                                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                                                            NEW
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                                                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Eye className="w-4 h-4"/>
                                                    {item.views?.toLocaleString() || '0'}
                                                </span>
                                                <Link
                                                    to={`/media/${item.slug || item.id || item._id}`}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => handleShare(item)}
                                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-all"
                                                    title="Share"
                                                >
                                                    <Share2 className="w-4 h-4"/>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        // No items found
                        <div className="text-center py-16">
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
                            <h3 className="text-2xl font-bold text-gray-600 mb-2">No media found</h3>
                            <p className="text-gray-500 mb-6">
                                {searchTerm || selectedCategory !== 'all' 
                                    ? 'Try adjusting your search or filter' 
                                    : 'No media items have been published yet'}
                            </p>
                            {(searchTerm || selectedCategory !== 'all') && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory('all');
                                    }}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Newsletter Subscription */}
                <div className="mt-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Subscribe to our newsletter for the latest news, updates, and opportunities.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg text-gray-800"
                        />
                        <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeautifulMediaPage;
