// src/components/admin/UserModal.jsx
import React, { useState } from 'react';
import { X, Save, User, Mail, Phone, MapPin, Shield } from 'lucide-react';

const UserModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        role: user?.role || 'user',
        status: user?.status || 'active',
        department: user?.department || '',
        permissions: user?.permissions || []
    });

    const [loading, setLoading] = useState(false);

    const roles = [
        { value: 'super_admin', label: 'Super Administrator', color: 'red' },
        { value: 'admin', label: 'Administrator', color: 'blue' },
        { value: 'editor', label: 'Content Editor', color: 'green' },
        { value: 'moderator', label: 'Moderator', color: 'yellow' },
        { value: 'user', label: 'Regular User', color: 'gray' }
    ];

    const departments = [
        'Administration', 'Finance', 'Planning', 'Education', 'Health',
        'Agriculture', 'Works', 'Social Services', 'Security'
    ];

    const permissions = [
        'create_opportunities', 'edit_opportunities', 'delete_opportunities',
        'manage_media', 'manage_users', 'view_analytics', 'system_settings'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            onSave(formData);
            setLoading(false);
        }, 1000);
    };

    const handlePermissionChange = (permission) => {
        setFormData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {user ? 'Edit User' : 'Add New User'}
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <User className="w-4 h-4 inline mr-1" />
                            Full Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter full name"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-1" />
                            Email Address *
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter email address"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Phone className="w-4 h-4 inline mr-1" />
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter phone number"
                        />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Department
                        </label>
                        <select
                            value={formData.department}
                            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Select Department</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        Address
                    </label>
                    <textarea
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter address"
                    />
                </div>

                {/* Role Selection */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        <Shield className="w-4 h-4 inline mr-1" />
                        User Role
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {roles.map(role => (
                            <button
                                key={role.value}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${
                                    formData.role === role.value
                                        ? `border-${role.color}-500 bg-${role.color}-50`
                                        : 'border-gray-300 hover:border-gray-400'
                                }`}
                            >
                                <div className="font-semibold text-gray-800">{role.label}</div>
                                <div className="text-sm text-gray-600 mt-1">
                                    {role.value === 'super_admin' && 'Full system access'}
                                    {role.value === 'admin' && 'Administrative privileges'}
                                    {role.value === 'editor' && 'Content management'}
                                    {role.value === 'moderator' && 'Content moderation'}
                                    {role.value === 'user' && 'Basic access'}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Permissions */}
                {formData.role !== 'user' && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Permissions
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {permissions.map(permission => (
                                <label key={permission} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.permissions.includes(permission)}
                                        onChange={() => handlePermissionChange(permission)}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                    {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Status */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Account Status
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="status"
                                value="active"
                                checked={formData.status === 'active'}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                className="mr-2"
                            />
                            <span className="text-green-600 font-medium">Active</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="status"
                                value="inactive"
                                checked={formData.status === 'inactive'}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                className="mr-2"
                            />
                            <span className="text-red-600 font-medium">Inactive</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="status"
                                value="suspended"
                                checked={formData.status === 'suspended'}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                className="mr-2"
                            />
                            <span className="text-orange-600 font-medium">Suspended</span>
                        </label>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="w-5 h-5" />
                        {loading ? 'Saving...' : (user ? 'Update User' : 'Create User')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserModal;