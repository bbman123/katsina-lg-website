import React from 'react';
import { useData } from '../contexts/DataContext';
import { RefreshCw, Database, Eye } from 'lucide-react';

const DataDebugComponent = () => {
    const { mediaItems, resetData, clearAllData } = useData();

    const handleRefresh = () => {
        window.location.reload();
    };

    const stats = {
        total: mediaItems.length,
        published: mediaItems.filter(item => item.status === 'published').length,
        featured: mediaItems.filter(item => item.featured).length,
        draft: mediaItems.filter(item => item.status === 'draft').length
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white shadow-2xl rounded-xl p-4 border-2 border-gray-200 max-w-sm z-50">
            <div className="flex items-center gap-2 mb-3">
                <Database className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-gray-800">Data Debug</h3>
                <button
                    onClick={handleRefresh}
                    className="ml-auto p-1 text-gray-500 hover:text-gray-700"
                    title="Refresh Page"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Total Items:</span>
                    <span className="font-semibold">{stats.total}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Published:</span>
                    <span className="font-semibold text-green-600">{stats.published}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Featured:</span>
                    <span className="font-semibold text-blue-600">{stats.featured}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Draft:</span>
                    <span className="font-semibold text-orange-600">{stats.draft}</span>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2">localStorage Status:</div>
                <div className="text-xs text-green-600 mb-3">
                    ✓ Data persisted ({localStorage.getItem('katsina_lg_data') ? 'Active' : 'Empty'})
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={resetData}
                        className="flex-1 bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs hover:bg-orange-200"
                        title="Reset to initial data"
                    >
                        Reset
                    </button>
                    <button
                        onClick={clearAllData}
                        className="flex-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200"
                        title="Clear all data"
                    >
                        Clear
                    </button>
                </div>
            </div>

            <div className="mt-2 text-xs text-gray-400">
                Last update: {new Date().toLocaleTimeString()}
            </div>
        </div>
    );
};

export default DataDebugComponent;