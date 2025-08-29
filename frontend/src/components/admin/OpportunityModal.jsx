// src/components/admin/OpportunityModal.jsx
import React, { useState } from 'react';
import { X, Save, Calendar, MapPin, Users, DollarSign, AlertCircle } from 'lucide-react';
import { opportunitiesAPI } from '../../services/api';

const OpportunityModal = ({ opportunity, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: opportunity?.title || '',
        description: opportunity?.description || '',
        category: opportunity?.category || 'education',
        type: opportunity?.type || 'program',
        eligibility: opportunity?.eligibility || '',
        benefits: opportunity?.benefits || '',
        requirements: opportunity?.requirements || '',
        applicationProcess: opportunity?.applicationProcess || '',
        deadline: opportunity?.deadline ? new Date(opportunity.deadline).toISOString().split('T')[0] : '',
        location: opportunity?.location || '',
        contactInfo: opportunity?.contactInfo || '',
        status: opportunity?.status || 'active',
        maxApplicants: opportunity?.maxApplicants || '',
        budget: opportunity?.budget || '',
        tags: opportunity?.tags?.join(', ') || '',
        images: opportunity?.images || []
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const categories = [
        'education', 'health', 'agriculture', 'business', 'youth', 'women', 'infrastructure', 'social'
    ];

    const types = [
        'program', 'scholarship', 'loan', 'grant', 'training', 'employment', 'volunteer'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.deadline) newErrors.deadline = 'Deadline is required';
        if (!formData.eligibility.trim()) newErrors.eligibility = 'Eligibility criteria is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                maxApplicants: formData.maxApplicants ? parseInt(formData.maxApplicants) : null,
                budget: formData.budget ? parseFloat(formData.budget) : null
            };

            let response;
            if (opportunity) {
                response = await opportunitiesAPI.update(opportunity._id, submitData);
            } else {
                response = await opportunitiesAPI.create(submitData);
            }

            if (response.data.success) {
                onSave(response.data.data);
                onClose();
            }
        } catch (error) {
            console.error('Error saving opportunity:', error);
            alert('Error saving opportunity: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {opportunity ? 'Edit Opportunity' : 'Create New Opportunity'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Opportunity Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                                        errors.title ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Enter opportunity title"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                >
                                    {types.map(type => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                                        errors.description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Describe the opportunity in detail"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Eligibility */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Eligibility Criteria *
                                </label>
                                <textarea
                                    name="eligibility"
                                    value={formData.eligibility}
                                    onChange={handleChange}
                                    rows={3}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                                        errors.eligibility ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Who is eligible for this opportunity?"
                                />
                                {errors.eligibility && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.eligibility}
                                    </p>
                                )}
                            </div>

                            {/* Benefits */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Benefits
                                </label>
                                <textarea
                                    name="benefits"
                                    value={formData.benefits}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="What benefits will participants receive?"
                                />
                            </div>

                            {/* Requirements */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Requirements
                                </label>
                                <textarea
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="What are the requirements to apply?"
                                />
                            </div>

                            {/* Application Process */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Application Process
                                </label>
                                <textarea
                                    name="applicationProcess"
                                    value={formData.applicationProcess}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="How should applicants apply?"
                                />
                            </div>

                            {/* Deadline */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Application Deadline *
                                </label>
                                <input
                                    type="date"
                                    name="deadline"
                                    value={formData.deadline}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                                        errors.deadline ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                />
                                {errors.deadline && (
                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.deadline}
                                    </p>
                                )}
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="Where will this take place?"
                                />
                            </div>

                            {/* Max Applicants */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <Users className="w-4 h-4 inline mr-1" />
                                    Max Applicants
                                </label>
                                <input
                                    type="number"
                                    name="maxApplicants"
                                    value={formData.maxApplicants}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="Maximum number of applicants"
                                    min="1"
                                />
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <DollarSign className="w-4 h-4 inline mr-1" />
                                    Budget (₦)
                                </label>
                                <input
                                    type="number"
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="Total budget for this opportunity"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            {/* Contact Info */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Contact Information
                                </label>
                                <input
                                    type="text"
                                    name="contactInfo"
                                    value={formData.contactInfo}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="Email or phone for inquiries"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="draft">Draft</option>
                                    <option value="closed">Closed</option>
                                </select>
                            </div>

                            {/* Tags */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                    placeholder="e.g., education, youth, development, training"
                                />
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
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
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? 'Saving...' : (opportunity ? 'Update Opportunity' : 'Create Opportunity')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OpportunityModal;