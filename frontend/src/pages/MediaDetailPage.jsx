import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Download, Share2, Calendar, Eye, Clock, User,
    Play, FileText, Image, ChevronRight, ExternalLink, Copy,
    Facebook, Twitter, Linkedin, Mail, CheckCircle, AlertCircle,
    ZoomIn, ZoomOut, RotateCw, X
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const MediaDetailPage = () => {
    const { id } = useParams(); // This could be slug or ID
    const navigate = useNavigate();
    const { mediaItems, loading, refresh } = useData();
    const [mediaItem, setMediaItem] = useState(null);
    const [relatedItems, setRelatedItems] = useState([]);
    const [imageZoom, setImageZoom] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(false);

    useEffect(() => {
        const fetchMediaItem = async () => {
            // First try to find in local state by slug, _id, or id
            let item = mediaItems.find(m => 
                (m.slug === id || m._id === id || m.id === id) && 
                m.status === 'published'
            );
            
            // If not found locally, fetch from backend
            if (!item) {
                try {
                    // Try fetching by slug first
                    let response = await fetch(`${API_BASE}/media/slug/${id}`);
                    
                    // If slug fetch fails, try by ID
                    if (!response.ok && id.match(/^[0-9a-fA-F]{24}$/)) {
                        response = await fetch(`${API_BASE}/media/${id}`);
                    }
                    
                    if (response.ok) {
                        const data = await response.json();
                        item = data.data || data; // Handle wrapped response
                    }
                } catch (error) {
                    console.error('Error fetching media:', error);
                }
            }
            
            setMediaItem(item);
            
            // Find related items after we have the main item
            if (item && mediaItems.length > 0) {
                console.log('Finding related items for:', item.title);
                console.log('Current item category:', item.category);
                console.log('Current item type:', item.title);
                console.log('Total media items available:', mediaItems.length);
                
                const related = mediaItems
                    .filter(m => {
                        // Skip if it's the same item (check all possible ID matches)
                        if (m.slug === item.slug || 
                            m._id === item._id) {
                            return false;
                        }
                        
                        // Only published items
                        if (m.status !== 'published') {
                            return false;
                        }
                        
                        // Match by category OR type
                        const sameCategory = m.category === item.category;
                        const sameType = m.type === item.type;
                        
                        return sameCategory || sameType;
                    })
                    .slice(0, 5); // Limit to 5 items
                
                console.log('Related items found:', related.length);
                console.log('Related items:', related.map(r => r.title));
                setRelatedItems(related);
                
                // Track view
                if (item._id || item.id) {
                    trackView(item._id || item.id);
                }
            }
        };
        
        fetchMediaItem();
        
        // Refresh media items if we don't have any
        if (mediaItems.length === 0 && !loading) {
            refresh();
        }
    }, [id, mediaItems, loading, refresh]);

    // Update the trackView function
    const trackView = async (mediaId) => {
        try {
            // Call the view tracking endpoint
            const response = await fetch(`${API_BASE}/media/${mediaId}/view`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('View tracked:', data.views);
            }
        } catch (error) {
            console.error('Error tracking view:', error);
            // Don't show error to user, just log it
        }
    };

    const handleDownload = async () => {
        if (!mediaItem?.fileUrl) return;
        
        setDownloadProgress(true);
        try {
            const response = await fetch(mediaItem.fileUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            
            // ✅ Use slug for filename, fallback to title if slug doesn't exist
            const baseFilename = mediaItem.slug || 
                mediaItem.title.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .substring(0, 100);
            
            // Determine file extension based on type or existing file extension
            let extension = '';
            if (mediaItem.type === 'document') {
                // Try to get extension from fileUrl if it's a document
                const urlExtMatch = mediaItem.fileUrl.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/);
                extension = urlExtMatch ? urlExtMatch[1] : 'pdf';
            } else if (mediaItem.type === 'video') {
                const urlExtMatch = mediaItem.fileUrl.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/);
                extension = urlExtMatch ? urlExtMatch[1] : 'mp4';
            } else if (mediaItem.type === 'image') {
                const urlExtMatch = mediaItem.fileUrl.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/);
                extension = urlExtMatch ? urlExtMatch[1] : 'jpg';
            } else {
                // Try to extract extension from fileUrl as last resort
                const urlExtMatch = mediaItem.fileUrl.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/);
                extension = urlExtMatch ? urlExtMatch[1] : 'file';
            }
            
            a.download = `${baseFilename}.${extension}`;
            
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download error:', error);
        } finally {
            setDownloadProgress(false);
        }
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const title = mediaItem?.title || '';
        const text = `Check out: ${title}`;

        switch (platform) {
            case 'copy':
                navigator.clipboard.writeText(url);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'email':
                window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
                break;
            default:
                if (navigator.share) {
                    navigator.share({ title, text, url });
                }
        }
    };

    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return days === 1 ? '1 day ago' : `${days} days ago`;
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
        const months = Math.floor(days / 30);
        if (months < 12) return months === 1 ? '1 month ago' : `${months} months ago`;
        const years = Math.floor(days / 365);
        return years === 1 ? '1 year ago' : `${years} years ago`;
    };

    if (loading && !mediaItem) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
                        <div className="h-96 bg-gray-300 rounded-2xl mb-8"></div>
                        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!mediaItem) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Media Not Found</h1>
                        <p className="text-gray-600 mb-6">The media item you're looking for doesn't exist or has been removed.</p>
                        <Link to="/media" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block">
                            Back to Media Gallery
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Breadcrumb */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Link to="/" className="text-gray-600 hover:text-green-600 transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <Link to="/media" className="text-gray-600 hover:text-green-600 transition-colors">Media</Link>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-800 font-medium truncate max-w-xs">{mediaItem.title}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-6"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back</span>
                        </button>

                        {/* Media Display */}
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                            {mediaItem.type === 'image' && (
                                <>
                                    <div 
                                        className="relative cursor-zoom-in"
                                        onClick={() => setImageZoom(true)}
                                    >
                                        <img
                                            src={mediaItem.fileUrl || mediaItem.thumbnail || '/default-media-image.jpg'}
                                            alt={mediaItem.title}
                                            className="w-full h-auto"
                                        />
                                        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg flex items-center gap-2">
                                            <ZoomIn className="w-4 h-4" />
                                            Click to zoom
                                        </div>
                                    </div>
                                </>
                            )}

                            {mediaItem.type === 'video' && (
                                <div className="relative aspect-video bg-black">
                                    <video
                                        controls
                                        className="w-full h-full"
                                        poster={mediaItem.thumbnail}
                                    >
                                        <source src={mediaItem.fileUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}

                            {mediaItem.type === 'document' && (
                                <div className="p-12 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
                                    <FileText className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Document Preview</h3>
                                    <p className="text-gray-600 mb-6">
                                        {mediaItem.description || 'Download to view the full document'}
                                    </p>
                                    <button
                                        onClick={handleDownload}
                                        disabled={downloadProgress}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {downloadProgress ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Downloading...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-5 h-5" />
                                                Download Document
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* If file URL is a direct link to PDF, show iframe */}
                            {mediaItem.type === 'document' && mediaItem.fileUrl?.toLowerCase().endsWith('.pdf') && (
                                <iframe
                                    src={mediaItem.fileUrl}
                                    className="w-full h-[600px] border-0"
                                    title={mediaItem.title}
                                />
                            )}
                        </div>

                        {/* Media Info */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">{mediaItem.title}</h1>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(mediaItem.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {getRelativeTime(mediaItem.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {(mediaItem.views || 0).toLocaleString()} views
                                </span>
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                                    {mediaItem.category || 'General'}
                                </span>
                            </div>

                            {mediaItem.description && (
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed">{mediaItem.description}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                                <button
                                    onClick={handleDownload}
                                    disabled={downloadProgress}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                                >
                                    {downloadProgress ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            Download
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowShareModal(true)}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Related Media */}
                        {relatedItems.length > 0 ? (
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Related Media</h3>
                                <div className="space-y-4">
                                    {relatedItems.map((item) => (
                                        <Link
                                            key={item._id || item.id}
                                            to={`/media/${item.slug || item._id || item.id}`}
                                            className="flex gap-3 group"
                                        >
                                            <img
                                                src={item.thumbnail || item.fileUrl || '/default-media-image.jpg'}
                                                alt={item.title}
                                                className="w-20 h-20 object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                                                onError={(e) => {
                                                    e.target.src = '/default-media-image.jpg';
                                                }}
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">
                                                    {item.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {getRelativeTime(item.createdAt)}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">Related Media</h3>
                                <p className="text-gray-600 text-sm">No related media found.</p>
                                <Link 
                                    to="/media" 
                                    className="mt-4 inline-block text-green-600 hover:text-green-700 font-medium text-sm"
                                >
                                    Browse all media →
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Zoom Modal */}
            {imageZoom && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setImageZoom(false)}>
                    <button
                        onClick={() => setImageZoom(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>
                    <img
                        src={mediaItem.fileUrl || mediaItem.thumbnail}
                        alt={mediaItem.title}
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Share Media</h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => handleShare('facebook')}
                                className="flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                                Facebook
                            </button>
                            <button
                                onClick={() => handleShare('twitter')}
                                className="flex items-center justify-center gap-2 p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                                Twitter
                            </button>
                            <button
                                onClick={() => handleShare('linkedin')}
                                className="flex items-center justify-center gap-2 p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                                LinkedIn
                            </button>
                            <button
                                onClick={() => handleShare('email')}
                                className="flex items-center justify-center gap-2 p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                                Email
                            </button>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                            <button
                                onClick={() => handleShare('copy')}
                                className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-colors ${
                                    copySuccess 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {copySuccess ? (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Link Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-5 h-5" />
                                        Copy Link
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaDetailPage;