import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  LayoutDashboard, Users, FileText, Settings, LogOut, Plus, 
  Edit, Trash2, Eye, Upload, Play, Home, Activity, Clock, Bell,
  TrendingUp, Video, Image, Share2, Calendar
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { 
    mediaItems, 
    addMediaItem, 
    updateMediaItem, 
    deleteMediaItem, 
    getPublishedMedia 
  } = useData();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
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

  // Calculate stats from actual data
  const publishedMedia = getPublishedMedia();
  const stats = {
    totalMedia: mediaItems.length,
    totalViews: mediaItems.reduce((acc, item) => acc + (item.views || item.downloads || 0), 0),
    publishedMedia: publishedMedia.length,
    draftMedia: mediaItems.filter(item => item.status === 'draft').length
  };

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      if (type === 'media') {
        deleteMediaItem(id);
        alert('Media deleted successfully!');
      }
    } catch (error) {
      alert('Error deleting item: ' + error.message);
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

  const handleSubmit = () => {
    if (!uploadForm.title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (!selectedItem && !selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    try {
      // Simulate file upload URL (in real app, this would be uploaded to server)
      let fileUrl = selectedItem?.fileUrl;
      let thumbnail = selectedItem?.thumbnail;

      if (selectedFile) {
        if (selectedFile.type.startsWith('image/')) {
          fileUrl = filePreview;
          thumbnail = filePreview;
        } else if (selectedFile.type.startsWith('video/')) {
          // For video, you'd typically upload to a service and get a URL
          fileUrl = 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&h=400&fit=crop'; // Placeholder
          thumbnail = 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&h=400&fit=crop';
        } else {
          // For documents, create a document thumbnail
          fileUrl = `/documents/${selectedFile.name}`;
          thumbnail = 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&h=400&fit=crop';
        }
      }

      const mediaData = {
        ...uploadForm,
        fileUrl,
        thumbnail,
        tags: uploadForm.category ? [uploadForm.category.toLowerCase()] : []
      };

      if (selectedItem) {
        // Update existing item
        updateMediaItem(selectedItem.id, mediaData);
        alert('Media updated successfully!');
      } else {
        // Add new item
        addMediaItem(mediaData);
        alert('Media uploaded successfully!');
      }

      setShowModal(false);
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
    } catch (error) {
      alert('Error saving media: ' + error.message);
    }
  };

  // Dashboard Stats Cards
  const StatCard = ({ title, value, icon, trend, color }) => (
    <div className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value.toLocaleString()}</p>
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className="w-4 h-4" />
              <span>Live data</span>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  // Navigation
  const NavItem = ({ id, icon, label, count }) => (
    <button
      onClick={() => setActiveTab(id)}
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! Here's your media management overview.</p>
      </div>

      {/* Live Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Media Items" 
          value={stats.totalMedia} 
          icon={<FileText className="w-8 h-8 text-blue-600" />}
          trend={true}
          color="border-l-blue-500"
        />
        <StatCard 
          title="Total Views/Downloads" 
          value={stats.totalViews} 
          icon={<Eye className="w-8 h-8 text-green-600" />}
          trend={true}
          color="border-l-green-500"
        />
        <StatCard 
          title="Published Content" 
          value={stats.publishedMedia} 
          icon={<Activity className="w-8 h-8 text-purple-600" />}
          trend={true}
          color="border-l-purple-500"
        />
        <StatCard 
          title="Draft Content" 
          value={stats.draftMedia} 
          icon={<Clock className="w-8 h-8 text-orange-600" />}
          trend={true}
          color="border-l-orange-500"
        />
      </div>

      {/* Recent Media */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-green-600" />
          Recent Media
        </h2>
        <div className="space-y-4">
          {mediaItems.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <img 
                src={item.thumbnail} 
                alt={item.title}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.category} • {item.type}</p>
                <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {item.views ? `${item.views.toLocaleString()} views` : `${item.downloads?.toLocaleString() || 0} downloads`}
                </span>
                <button 
                  onClick={() => openModal('media', item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Media Management</h1>
          <p className="text-gray-600">Upload and manage photos, videos, and documents - changes appear instantly on the website!</p>
        </div>
        <button 
          onClick={() => openModal('media')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Upload Media
        </button>
      </div>

      {/* Media Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mediaItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative">
              <img 
                src={item.thumbnail} 
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-md text-xs font-semibold text-white ${
                  item.type === 'video' ? 'bg-red-500' :
                  item.type === 'document' ? 'bg-blue-500' : 'bg-green-500'
                }`}>
                  {item.type?.toUpperCase()}
                </span>
              </div>

              <div className="absolute top-3 right-3 flex gap-2">
                <button 
                  onClick={() => openModal('media', item)}
                  className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete('media', item.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm border-2 border-white rounded-full p-3">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{item.category}</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {item.views?.toLocaleString() || item.downloads?.toLocaleString() || 0}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.featured && <span>⭐</span>}
                  {item.status}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mediaItems.length === 0 && (
        <div className="text-center py-16">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No media items yet</h3>
          <p className="text-gray-600 mb-6">Upload your first media item to get started!</p>
          <button 
            onClick={() => openModal('media')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="h-1 bg-gradient-to-r from-green-600 via-white to-green-600"></div>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">KLG</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Katsina LG Admin</h1>
              <p className="text-sm text-gray-600">Content Management System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.open('/', '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Home className="w-4 h-4" />
              View Website
            </button>
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{user?.name?.[0] || 'A'}</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-800">{user?.name || 'Admin User'}</p>
                <p className="text-sm text-gray-600">{user?.role || 'Administrator'}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen">
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

        {/* Main Content */}
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>

      {/* Working Media Upload/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedItem ? 'Edit Media' : 'Upload New Media'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* File Upload */}
                {!selectedItem && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload File *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                      {filePreview ? (
                        <div className="space-y-4">
                          <img src={filePreview} alt="Preview" className="max-w-xs max-h-48 mx-auto rounded-lg" />
                          <p className="text-sm text-gray-600">{selectedFile?.name}</p>
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
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-2">
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
                          <p className="text-sm text-gray-500">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Describe the media content"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={uploadForm.type}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={uploadForm.status}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    <div className="flex items-center h-12">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={uploadForm.featured}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, featured: e.target.checked }))}
                          className="sr-only"
                        />
                        <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                          uploadForm.featured ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
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
                <div className="flex gap-4 pt-6 border-t">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    {selectedItem ? 'Update Media' : 'Upload Media'}
                  </button>
                </div>

                {/* Help Text */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-bold">i</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-800 mb-1">Upload Tips</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
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
