import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { 
    Play, Download, Eye, Calendar, Clock, Filter,
    Video, Image, FileText, Search, Star, Share2
} from 'lucide-react';

const BeautifulMediaPage = () => {
    const {mediaItems, getMediaByCategory, getFeaturedMedia} = useData();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        {id: 'all', label: 'All Media', count: mediaItems.length},
        {id: 'Infrastructure', label: 'Infrastructure', count: getMediaByCategory('Infrastructure').length},
        {id: 'Healthcare', label: 'Healthcare', count: getMediaByCategory('Healthcare').length},
        {id: 'Agriculture', label: 'Agriculture', count: getMediaByCategory('Agriculture').length},
        {id: 'Education', label: 'Education', count: getMediaByCategory('Education').length},
        {id: 'Community', label: 'Community', count: getMediaByCategory('Community').length},
        {id: 'Environment', label: 'Environment', count: getMediaByCategory('Environment').length},
        {id: 'Innovation', label: 'Innovation', count: getMediaByCategory('Innovation').length}
    ];

    // Filter media items
    const filteredItems = mediaItems.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch && item.status === 'published';
    });

    const featuredItems = getFeaturedMedia().filter(item => item.status === 'published');

    const getTypeIcon = (type) => {
        switch (type) {
            case 'video':
                return <Video className="w-5 h-5"/>;
            case 'image':
                return <Image className="w-5 h-5"/>;
            case 'document':
                return <FileText className="w-5 h-5"/>;
            default:
                return <FileText className="w-5 h-5"/>;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'video':
                return 'bg-red-500';
            case 'image':
                return 'bg-green-500';
            case 'document':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
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

                {/* Search and Filter */}
                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                            <input
                                type="text"
                                placeholder="Search media..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
                            {categories.slice(0, 5).map(category => (
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
                </div>

                {/* Featured Media */}
                {featuredItems.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Media</h2>
                        <div className="grid lg:grid-cols-2 gap-8">
                            {featuredItems.slice(0, 2).map((item) => (
                                <div key={item.id}
                                     className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500">
                                    <div className="relative">
                                        <img
                                            src={item.thumbnail}
                                            alt={item.title}
                                            className="w-full h-64 object-cover"
                                        />
                                        <div
                                            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                                        <div className="absolute top-4 left-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getTypeColor(item.type)}`}>
                                                {item.type.toUpperCase()}
                                            </span>
                                        </div>

                                        {item.type === 'video' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <button
                                                    className="bg-white/20 backdrop-blur-sm border-2 border-white rounded-full p-4 hover:bg-white/30 transition-all duration-300 transform hover:scale-110">
                                                    <Play className="w-8 h-8 text-white"/>
                                                </button>
                                            </div>
                                        )}

                                        <div
                                            className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
                                            <div className="flex items-center gap-2">
                                                <Eye className="w-4 h-4"/>
                                                {item.views?.toLocaleString() || item.downloads?.toLocaleString() || '0'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="mb-4">
                                            <span
                                                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {item.category}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-800 mb-3 leading-tight">
                                            {item.title}
                                        </h3>

                                        <p className="text-gray-600 leading-relaxed mb-4">
                                            {item.description}
                                        </p>

                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <span className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4"/>
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </span>
                                            {item.duration && (
                                                <span className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4"/>
                                                    {item.duration}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                                                {getTypeIcon(item.type)}
                                                {item.type === 'video' ? 'Watch Now' :
                                                    item.type === 'document' ? 'Download' : 'View Gallery'}
                                            </button>
                                            <button
                                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl transition-all duration-300">
                                                <Share2 className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* All Media Grid */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">All Media</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredItems.map((item) => (
                            <div key={item.id}
                                 className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="relative">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span
                                            className={`px-2 py-1 rounded-md text-xs font-semibold text-white ${getTypeColor(item.type)}`}>
                                            {item.type.toUpperCase()}
                                        </span>
                                    </div>

                                    {item.type === 'video' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <button className="bg-white/20 backdrop-blur-sm border border-white rounded-full
						p-3hover:bg-white/30 transition-all"><Play className="w-6 h-6 text-white"/></button>
                                        </div>)}
                                    <div
                                        className="absolute bottom-2 right-2 bg-black/70 rounded-md px-2 py-1 text-white text-xs">
                                        {item.type === 'video' && item.duration}
                                        {item.type === 'document' && `${item.pages} pages`}
                                        {item.type === 'image' && 'Gallery'}
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="mb-2">
                                    <span
                                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                                        {item.category}
                                    </span>
                                    </div>

                                    <h3 className="font-bold text-gray-800 mb-2 leading-tight line-clamp-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1">
                                        <Eye className="w-3 h-3"/>
                                            {item.views?.toLocaleString() || item.downloads?.toLocaleString() || '0'}
                                    </span>
                                    </div>

                                    <button
                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors text-sm">
                                        {item.type === 'video' ? 'Watch' : item.type === 'document' ? 'Download' : 'View'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* No results */}
                {filteredItems.length === 0 && (
                    <div className="text-center py-16">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
                        <h3 className="text-2xl font-bold text-gray-600 mb-2">No media found</h3>
                        <p className="text-gray-500 mb-6">Try adjusting your search or filter</p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                            }}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                        >
                            Show All Media
                        </button>
                    </div>
                )}

                {/* Newsletter Signup */}
                <div
                    className="mt-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-white text-center">
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
                        <button
                            className="bg-white text-green-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default BeautifulMediaPage;
