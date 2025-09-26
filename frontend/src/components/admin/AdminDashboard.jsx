import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  LayoutDashboard, Users, FileText, Settings, LogOut, Plus, 
  Edit, Trash2, Eye, Upload, Play, Home, Activity, Clock, Bell,
  TrendingUp, Video, Image, Share2, Calendar, Menu, X, CheckCircle, AlertCircle, Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// 👇 Replace with your actual backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { 
    mediaItems, 
    addMediaItem, 
    updateMediaItem, 
    deleteMediaItem, 
    getPublishedMedia,
    refresh // ✅ Add this
  } = useData();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    type: 'image',
    category: 'General',
    status: 'published',
    featured: false
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // Calculate stats from actual data
  const publishedMedia = getPublishedMedia();
  const stats = {
    totalMedia: mediaItems.length,
    totalViews: mediaItems.reduce((acc, item) => acc + (item.views || item.downloads || 0), 0),
    publishedMedia: publishedMedia.length,
    draftMedia: mediaItems.filter(item => item.status === 'draft').length
  };

  // Notification Component
  const Notification = ({ type, message, onClose }) => {
    const config = {
      success: {
        icon: <CheckCircle className="w-5 h-5" />,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        iconColor: 'text-green-600'
      },
      error: {
        icon: <AlertCircle className="w-5 h-5" />,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-600'
      },
      info: {
        icon: <Info className="w-5 h-5" />,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-600'
      }
    };

    const style = config[type] || config.info;

    return (
      <div className={`fixed top-4 right-4 z-[60] max-w-md animate-slideIn`}>
        <div className={`${style.bgColor} ${style.borderColor} border rounded-lg shadow-lg p-4 flex items-start gap-3`}>
          <div className={`${style.iconColor} flex-shrink-0 mt-0.5`}>
            {style.icon}
          </div>
          <div className="flex-1">
            <p className={`${style.textColor} text-sm font-medium`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`${style.textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Show notification helper
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000); // Auto-hide after 5 seconds
  };

  // Update the handleDelete function
  const handleDelete = async (type, id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item? This action cannot be undone.');
    if (!confirmDelete) return;
    
    setDeletingId(id);
    
    try {
      if (type === 'media') {
        await deleteMediaItem(id);
        showNotification('success', 'Media deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showNotification('error', `Failed to delete: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    if (item) {
      setUploadForm({
        title: item.title || '',
        description: item.description || '',
        type: item.type || 'image',
        category: item.category || 'General',
        status: item.status || 'published',
        featured: item.featured || false
      });
    } else {
      setUploadForm({
        title: '',
        description: '',
        type: 'image',
        category: 'General',
        status: 'published',
        featured: false
      });
    }
    setSelectedFile(null);
    setFilePreview(null);
    setShowModal(true);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    // Auto-detect type based on file
    if (file.type.startsWith('image/')) {
      setUploadForm(prev => ({ ...prev, type: 'image' }));
    } else if (file.type.startsWith('video/')) {
      setUploadForm(prev => ({ ...prev, type: 'video' }));
    } else {
      setUploadForm(prev => ({ ...prev, type: 'document' }));
    }
  };

  // Update the handleSubmit function
  const handleSubmit = async () => {
    if (!uploadForm.title.trim()) {
      showNotification('error', 'Please enter a title');
      return;
    }

    if (!selectedItem && !selectedFile) {
      showNotification('error', 'Please select a file to upload');
      return;
    }

    setIsSubmitting(true);

    try {
      // For actual file upload
      if (selectedFile && !selectedItem) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('title', uploadForm.title);
        formData.append('description', uploadForm.description);
        formData.append('type', uploadForm.type);
        formData.append('category', uploadForm.category);
        formData.append('status', uploadForm.status);
        formData.append('featured', uploadForm.featured);

        // Upload using FormData to your backend
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE}/media/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Upload failed');
        }

        const newMedia = await response.json();
        
        // ✅ FIX: Don't call addMediaItem, just refresh the media list
        // The media is already saved in the database
        await refresh(); // This will fetch the updated list from the backend
        
        showNotification('success', 'Media uploaded successfully!');
        setShowModal(false);
        
        // Reset form
        setUploadForm({
          title: '',
          description: '',
          type: 'image',
          category: 'General',
          status: 'published',
          featured: false
        });
        setSelectedFile(null);
        setFilePreview(null);
        
      } else if (selectedItem) {
        // For updates
        const mediaData = {
          ...uploadForm,
          fileUrl: selectedItem.fileUrl,
          thumbnail: selectedItem.thumbnail,
          tags: uploadForm.category ? [uploadForm.category.toLowerCase()] : []
        };

        await updateMediaItem(selectedItem.id || selectedItem._id, mediaData);
        showNotification('success', 'Media updated successfully!');
        setShowModal(false);
        
        // Reset form
        setUploadForm({
          title: '',
          description: '',
          type: 'image',
          category: 'General',
          status: 'published',
          featured: false
        });
        setSelectedFile(null);
        setFilePreview(null);
      }
    } catch (error) {
      showNotification('error', `Failed to save: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dashboard Stats Cards
  const StatCard = ({ title, value, icon, trend, color }) => (
    <div className={`bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">{title}</p>
          <p className="text-xl md:text-3xl font-bold text-gray-800">{value.toLocaleString()}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs md:text-sm ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4" />
              <span>Live data</span>
            </div>
          )}
        </div>
        <div className={`p-2 md:p-4 rounded-2xl ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
          {React.cloneElement(icon, { className: "w-5 h-5 md:w-8 md:h-8" })}
        </div>
      </div>
    </div>
  );

  // Navigation
  const NavItem = ({ id, icon, label, count }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setSidebarOpen(false); // Close sidebar on mobile after selection
      }}
      className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-xl transition-all duration-200 ${
        activeTab === id 
          ? 'bg-green-600 text-white shadow-lg transform scale-105' 
          : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      {count !== undefined && (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          activeTab === id ? 'bg-green-700 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  );

  // Dashboard Overview
  const DashboardView = () => (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-sm md:text-base text-gray-600">Welcome back, {user?.name}! Here's your media management overview.</p>
      </div>

      {/* Live Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          title="Total Media Items" 
          value={stats.totalMedia} 
          icon={<FileText className="text-blue-600" />}
          trend={true}
          color="border-l-blue-500"
        />
        <StatCard 
          title="Total Views/Downloads" 
          value={stats.totalViews} 
          icon={<Eye className="text-green-600" />}
          trend={true}
          color="border-l-green-500"
        />
        <StatCard 
          title="Published Content" 
          value={stats.publishedMedia} 
          icon={<Activity className="text-purple-600" />}
          trend={true}
          color="border-l-purple-500"
        />
        <StatCard 
          title="Draft Content" 
          value={stats.draftMedia} 
          icon={<Clock className="text-orange-600" />}
          trend={true}
          color="border-l-orange-500"
        />
      </div>

      {/* Recent Media */}
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
          Recent Media
        </h2>
        <div className="space-y-3 md:space-y-4">
          {mediaItems.slice(0, 5).map((item) => (
            <div key={item._id || item.id} className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <img 
                src={item.thumbnail || item.fileUrl || '/default-media-image.jpg'} 
                alt={item.title}
                className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/default-media-image.jpg';
                }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">{item.title}</h3>
                <p className="text-xs md:text-sm text-gray-600">{item.category} • {item.type}</p>
                <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
                <span className="text-xs md:text-sm text-gray-500">
                  {item.views ? `${item.views.toLocaleString()} views` : `${item.downloads?.toLocaleString() || 0} downloads`}
                </span>
                <button 
                  onClick={() => openModal('media', item)}
                  className="p-1.5 md:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Media Management View
  const MediaView = () => (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Media Management</h1>
          <p className="text-sm md:text-base text-gray-600">Upload and manage photos, videos, and documents - changes appear instantly on the website!</p>
        </div>
        <button 
          onClick={() => openModal('media')}
          className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg text-sm md:text-base"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          Upload Media
        </button>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {mediaItems.map((item) => (
          <div key={item._id || item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <div className="relative h-40 md:h-48 flex-shrink-0">
              <img 
                src={item.thumbnail || item.fileUrl || '/default-media-image.jpg'} 
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/default-media-image.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              <div className="absolute top-2 md:top-3 left-2 md:left-3">
                <span className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-md text-xs font-semibold text-white ${
                  item.type === 'video' ? 'bg-red-500' :
                  item.type === 'document' ? 'bg-blue-500' : 'bg-green-500'
                }`}>
                  {item.type?.toUpperCase() || 'MEDIA'}
                </span>
              </div>

              <div className="absolute top-2 md:top-3 right-2 md:right-3 flex gap-1.5 md:gap-2">
                <button 
                  onClick={() => openModal('media', item)}
                  className="p-1.5 md:p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-lg"
                  title="Edit"
                >
                  <Edit className="w-3 h-3 md:w-4 md:h-4" />
                </button>
                <button 
                  onClick={() => handleDelete('media', item._id)}
                  disabled={deletingId === item._id}
                  className={`p-1.5 md:p-2 ${deletingId === item._id ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white rounded-lg transition-colors shadow-lg`}
                  title="Delete"
                >
                  {deletingId === item._id ? (
                    <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-3 h-3 md:w-4 md:h-4" />
                  )}
                </button>
              </div>

              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/20 backdrop-blur-sm border-2 border-white rounded-full p-2 md:p-3">
                    <Play className="w-4 h-4 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 md:p-4 flex flex-col flex-1">
              {/* Title - Fixed height with line clamp */}
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 h-10 md:h-12 leading-5 md:leading-6 text-sm md:text-base" title={item.title}>
                {item.title}
              </h3>
              
              {/* Description - Fixed height with line clamp */}
              <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2 h-8 md:h-10 leading-4 md:leading-5" title={item.description}>
                {item.description || 'No description available'}
              </p>
              
              {/* Category and Views - Fixed position */}
              <div className="flex items-center justify-between text-xs md:text-sm text-gray-500 mb-3 mt-auto">
                <span className="truncate max-w-[100px]">{item.category || 'General'}</span>
                <span className="flex items-center gap-1 flex-shrink-0">
                  <Eye className="w-3 h-3 md:w-4 md:h-4" />
                  {item.views?.toLocaleString() || item.downloads?.toLocaleString() || 0}
                </span>
              </div>

              {/* Status and Date - Fixed position */}
              <div className="flex items-center justify-between">
                <span className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  item.status === 'published' ? 'bg-green-100 text-green-800' : 
                  item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-600'
                }`}>
                  {item.featured && <span className="text-yellow-500">⭐</span>}
                  {item.status}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mediaItems.length === 0 && (
        <div className="text-center py-12 md:py-16">
          <Upload className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">No media items yet</h3>
          <p className="text-sm md:text-base text-gray-600 mb-6">Upload your first media item to get started!</p>
          <button 
            onClick={() => openModal('media')}
            className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
          >
            Upload First Media
          </button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'media':
        return <MediaView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add CSS for animation */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-green-600 via-white to-green-600"></div>
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo Container */}
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src="/images/katsina-logo.png" 
                alt="KLG"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.fallback-text');
                  if (fallback) fallback.style.display = 'inline-flex';
                }}
              />
              <span
                className="text-white font-bold text-sm md:text-lg fallback-text hidden"
              >
                KLG
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-gray-800">Katsina LG Admin</h1>
              <p className="text-xs md:text-sm text-gray-600">Content Management System</p>
            </div>
          </div>          
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => window.open('/', '_blank')}
              className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm md:text-base"
            >
              <Home className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden md:inline">View Website</span>
            </button>
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{user?.name?.[0] || 'A'}</span>
              </div>
              <div className="text-right hidden lg:block">
                <p className="font-semibold text-gray-800">{user?.name || 'Admin User'}</p>
                <p className="text-sm text-gray-600">{user?.role || 'Administrator'}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm md:text-base"
            >
              <LogOut className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-6 space-y-2">
            <NavItem 
              id="dashboard" 
              icon={<LayoutDashboard className="w-5 h-5" />} 
              label="Dashboard" 
            />
            <NavItem 
              id="media" 
              icon={<FileText className="w-5 h-5" />} 
              label="Media" 
              count={mediaItems.length}
            />
            <NavItem 
              id="users" 
              icon={<Users className="w-5 h-5" />} 
              label="Users" 
              count={0}
            />
            <NavItem 
              id="settings" 
              icon={<Settings className="w-5 h-5" />} 
              label="Settings" 
            />
          </nav>
        </aside>

        {/* Sidebar - Mobile (Overlay) */}
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <aside className="lg:hidden fixed left-0 top-0 w-64 h-full bg-white shadow-2xl z-50">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-bold text-gray-800">Menu</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-6 space-y-2">
                <NavItem 
                  id="dashboard" 
                  icon={<LayoutDashboard className="w-5 h-5" />} 
                  label="Dashboard" 
                />
                <NavItem 
                  id="media" 
                  icon={<FileText className="w-5 h-5" />} 
                  label="Media" 
                  count={mediaItems.length}
                />
                <NavItem 
                  id="users" 
                  icon={<Users className="w-5 h-5" />} 
                  label="Users" 
                  count={0}
                />
                <NavItem 
                  id="settings" 
                  icon={<Settings className="w-5 h-5" />} 
                  label="Settings" 
                />
              </nav>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>

      {/* Working Media Upload/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                  {selectedItem ? 'Edit Media' : 'Upload New Media'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 md:space-y-6">
                {/* File Upload */}
                {!selectedItem && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload File *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 text-center hover:border-blue-400 transition-colors">
                      {filePreview ? (
                        <div className="space-y-4">
                          <img src={filePreview} alt="Preview" className="max-w-full max-h-32 md:max-h-48 mx-auto rounded-lg" />
                          <p className="text-xs md:text-sm text-gray-600">{selectedFile?.name}</p>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setFilePreview(null);
                            }}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm md:text-base text-gray-600 mb-2">
                            Drag and drop your file here, or 
                            <label className="text-blue-600 hover:text-blue-700 cursor-pointer ml-1">
                              browse
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                onChange={handleFileSelect}
                              />
                            </label>
                          </p>
                          <p className="text-xs md:text-sm text-gray-500">
                            Supports: Images, Videos, Documents (PDF, Word, Excel, PowerPoint)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    disabled={isSubmitting}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter media title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    disabled={isSubmitting}
                    rows={4}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Describe the media content"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={uploadForm.type}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="General">General</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Education">Education</option>
                      <option value="Community">Community</option>
                      <option value="Environment">Environment</option>
                      <option value="Innovation">Innovation</option>
                    </select>
                  </div>
                </div>

                {/* Status and Featured */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={uploadForm.status}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, status: e.target.value }))}
                      disabled={isSubmitting}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Featured */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Featured
                    </label>
                    <div className="flex items-center h-10 md:h-12">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={uploadForm.featured}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, featured: e.target.checked }))}
                          disabled={isSubmitting}
                          className="sr-only"
                        />
                        <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                          uploadForm.featured ? 'bg-green-500' : 'bg-gray-300'
                        } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                            uploadForm.featured ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                        </div>
                        <span className="ml-3 text-sm text-gray-700">
                          {uploadForm.featured ? 'Featured' : 'Not Featured'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 md:pt-6 border-t">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 md:px-6 py-2 md:py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 md:w-5 md:h-5" />
                        {selectedItem ? 'Update Media' : 'Upload Media'}
                      </>
                    )}
                  </button>
                </div>

                {/* Help Text */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 md:p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 md:w-6 md:h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-xs md:text-sm font-bold">i</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-semibold text-blue-800 mb-1">Upload Tips</h4>
                      <ul className="text-xs md:text-sm text-blue-700 space-y-1">
                        <li>• Images: JPG, PNG, GIF up to 10MB</li>
                        <li>• Videos: MP4, WebM up to 100MB</li>
                        <li>• Documents: PDF, Word, Excel, PowerPoint up to 25MB</li>
                        <li>• Published content appears immediately on the website</li>
                        <li>• Featured content appears in highlighted sections</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
