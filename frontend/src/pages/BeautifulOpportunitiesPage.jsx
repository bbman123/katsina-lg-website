import React, { useState } from 'react';
import { 
    Star, Calendar, MapPin, Users, DollarSign, Clock,
    ChevronRight, Award, Target, Filter, Search
} from 'lucide-react';

const BeautifulOpportunitiesPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Rich opportunities data
    const opportunities = [
        {
            id: 1,
            title: "Digital Skills Empowerment Program",
            category: "education",
            type: "Training Program",
            deadline: "2024-12-31",
            duration: "6 months",
            amount: "Free + ₦50,000 completion bonus",
            participants: 234,
            maxParticipants: 500,
            description: "Comprehensive digital literacy program covering web development, digital marketing, data analysis, and e-commerce. Includes mentorship, certification, and job placement assistance.",
            requirements: [
                "Age 18-35 years",
                "Basic computer literacy",
                "Commitment to full program duration",
                "Resident of Katsina LGA"
            ],
            benefits: [
                "Industry-recognized certification",
                "Laptop provided during training",
                "3-month mentorship program",
                "Job placement assistance",
                "Startup funding opportunities"
            ],
            location: "Katsina Technology Hub",
            contact: "digitalskills@katsinalg.gov.ng",
            featured: true,
            difficulty: "Beginner",
            rating: 4.9
        },
        {
            id: 2,
            title: "Women's Cooperative Development Grant",
            category: "business",
            type: "Business Grant",
            deadline: "2024-12-25",
            amount: "₦2,000,000 per cooperative",
            participants: 89,
            maxParticipants: 150,
            description: "Supporting women's cooperatives with funding, training, and market access to build sustainable businesses in agriculture, crafts, and trading.",
            requirements: [
                "Registered women's cooperative",
                "Minimum 10 active members",
                "Business plan required",
                "2+ years operational experience"
            ],
            benefits: [
                "Seed funding up to ₦2M",
                "Business development training",
                "Market linkage support",
                "Financial literacy program",
                "Mentorship from successful entrepreneurs"
            ],
            location: "Women's Development Center",
            contact: "womencoop@katsinalg.gov.ng",
            duration: "Ongoing support",
            featured: false,
            difficulty: "Intermediate",
            rating: 4.7
        },
        {
            id: 3,
            title: "Youth Agricultural Innovation Hub",
            category: "agriculture",
            type: "Innovation Program",
            deadline: "2024-12-15",
            duration: "12 months",
            amount: "₦5,000,000 total funding",
            participants: 156,
            maxParticipants: 200,
            description: "Revolutionary program combining modern farming techniques with technology to create next-generation agricultural entrepreneurs and food security solutions.",
            requirements: [
                "Age 18-40 years",
                "Interest in agriculture/agtech",
                "Basic education certificate",
                "Innovation mindset"
            ],
            benefits: [
                "Modern farming equipment access",
                "Greenhouse farming training",
                "Digital agriculture tools",
                "Market guarantee for produce",
                "International exchange program"
            ],
            location: "Agricultural Innovation Center",
            contact: "agritech@katsinalg.gov.ng",
            featured: true,
            difficulty: "Advanced",
            rating: 4.8
        },
        {
            id: 4,
            title: "Small Business Digital Marketing Bootcamp",
            category: "business",
            type: "Training Program",
            deadline: "2024-12-20",
            duration: "3 months",
            amount: "₦25,000 registration fee",
            participants: 78,
            maxParticipants: 100,
            description: "Intensive training program for small business owners to master digital marketing, social media management, and online sales strategies.",
            requirements: [
                "Existing business owner",
                "Age 25-55 years",
                "Basic smartphone/computer skills",
                "Commitment to attend all sessions"
            ],
            benefits: [
                "Digital marketing certification",
                "Free website development",
                "Social media strategy templates",
                "Google Ads credit worth ₦50,000",
                "Business networking opportunities"
            ],
            location: "Business Development Center",
            contact: "marketing@katsinalg.gov.ng",
            featured: false,
            difficulty: "Beginner",
            rating: 4.6
        },
        {
            id: 5,
            title: "Healthcare Innovation Challenge",
            category: "health",
            type: "Competition",
            deadline: "2024-12-10",
            duration: "6 months",
            amount: "₦10,000,000 prize pool",
            participants: 45,
            maxParticipants: 50,
            description: "Innovation challenge for healthcare solutions addressing local health challenges through technology, telemedicine, and community health initiatives.",
            requirements: [
                "Healthcare professional or student",
                "Innovative health solution idea",
                "Team of 2-5 members",
                "Detailed project proposal"
            ],
            benefits: [
                "Cash prizes up to ₦5M",
                "Mentorship from health experts",
                "Implementation support",
                "International conference presentation",
                "Patent application assistance"
            ],
            location: "Health Innovation Lab",
            contact: "healthinnovation@katsinalg.gov.ng",
            featured: true,
            difficulty: "Advanced",
            rating: 4.9
        }
    ];

    const categories = [
        { id: 'all', label: 'All Categories', count: opportunities.length },
        { id: 'education', label: 'Education & Training', count: opportunities.filter(o => o.category === 'education').length },
        { id: 'business', label: 'Business Development', count: opportunities.filter(o => o.category === 'business').length },
        { id: 'agriculture', label: 'Agriculture & Food', count: opportunities.filter(o => o.category === 'agriculture').length },
        { id: 'health', label: 'Healthcare Innovation', count: opportunities.filter(o => o.category === 'health').length }
    ];

    // Filter opportunities
    const filteredOpportunities = opportunities.filter(opp => {
        const matchesCategory = selectedCategory === 'all' || opp.category === selectedCategory;
        const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             opp.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getDifficultyColor = (difficulty) => {
        switch(difficulty) {
            case 'Beginner': return 'bg-green-100 text-green-800';
            case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'Advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="py-20 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
                        Life-Changing Opportunities
                    </h1>
                    <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        Discover comprehensive programs designed to transform lives, build skills, and create sustainable prosperity for every citizen of Katsina Local Government Area.
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="mb-12">
                    <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search opportunities..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2">
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
                </div>

                {/* Results Summary */}
                <div className="mb-8">
                    <p className="text-gray-600">
                        Showing <span className="font-semibold text-green-600">{filteredOpportunities.length}</span> opportunities
                        {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.label}`}
                        {searchTerm && ` matching "${searchTerm}"`}
                    </p>
                </div>

                {/* Opportunities Grid */}
                <div className="space-y-8">
                    {filteredOpportunities.map((opportunity) => (
                        <div key={opportunity.id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500">
                            <div className={`bg-gradient-to-r ${
                                opportunity.featured
                                    ? 'from-green-600 to-blue-600'
                                    : 'from-gray-600 to-gray-800'
                            } p-8 text-white`}>
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                                            <span className="bg-white/20 px-4 py-2 rounded-full font-medium">
                                                {opportunity.category.charAt(0).toUpperCase() + opportunity.category.slice(1)}
                                            </span>
                                            <span className="bg-white/20 px-4 py-2 rounded-full font-medium">
                                                {opportunity.type}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getDifficultyColor(opportunity.difficulty)} text-gray-800`}>
                                                {opportunity.difficulty}
                                            </span>
                                            {opportunity.featured && (
                                                <span className="bg-yellow-500 text-yellow-900 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                                                    <Star className="w-4 h-4" />
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-bold mb-4">{opportunity.title}</h2>
                                        <p className="text-xl opacity-90">{opportunity.description}</p>
                                        
                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mt-4">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-5 h-5 ${
                                                            i < Math.floor(opportunity.rating)
                                                                ? 'text-yellow-400 fill-current' : 'text-white/30' }`} /> ))} </div> <span className="text-yellow-400 font-semibold">{opportunity.rating}</span> <span  								className="text-white/70">({opportunity.participants} reviews)</span> </div> </div>
					<div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 min-w-[300px]">
                                    <div className="text-center mb-4">
                                        <div className="text-3xl font-bold mb-2">{opportunity.participants}</div>
                                        <div className="text-sm opacity-80">Active Participants</div>
                                        <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                                            <div 
                                                className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${(opportunity.participants / opportunity.maxParticipants) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs opacity-70 mt-1">
                                            {opportunity.maxParticipants - opportunity.participants} spots remaining
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid lg:grid-cols-2 gap-12">
                                {/* Left Column - Details */}
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Calendar className="w-6 h-6 text-green-600" />
                                            Program Details
                                        </h3>
                                        <div className="space-y-4">
                                            {opportunity.duration && (
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                    <span className="font-medium text-gray-700">Duration:</span>
                                                    <span className="font-bold text-gray-900">{opportunity.duration}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <span className="font-medium text-gray-700">Value/Funding:</span>
                                                <span className="font-bold text-green-600">{opportunity.amount}</span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <span className="font-medium text-gray-700">Application Deadline:</span>
                                                <span className="font-bold text-red-600">
                                                    {new Date(opportunity.deadline).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                                <span className="font-medium text-gray-700">Location:</span>
                                                <span className="font-bold text-gray-900">{opportunity.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Target className="w-6 h-6 text-blue-600" />
                                            Requirements
                                        </h3>
                                        <ul className="space-y-3">
                                            {opportunity.requirements.map((req, reqIndex) => (
                                                <li key={reqIndex} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                                                    <ChevronRight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700">{req}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Right Column - Benefits & Action */}
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <Award className="w-6 h-6 text-yellow-600" />
                                            Program Benefits
                                        </h3>
                                        <ul className="space-y-3">
                                            {opportunity.benefits.map((benefit, benefitIndex) => (
                                                <li key={benefitIndex} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                                                    <Star className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-700">{benefit}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl">
                                        <h4 className="text-xl font-bold text-gray-800 mb-4">Ready to Apply?</h4>
                                        <p className="text-gray-600 mb-6">
                                            Join thousands of citizens who have transformed their lives through our programs.
                                        </p>
                                        
                                        {/* Urgency indicator */}
                                        <div className="mb-6 p-4 bg-orange-100 border border-orange-200 rounded-xl">
                                            <div className="flex items-center gap-2 text-orange-800">
                                                <Clock className="w-5 h-5" />
                                                <span className="font-semibold">
                                                    {Math.ceil((new Date(opportunity.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                                                Apply Now
                                            </button>
                                            <button className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl font-semibold border border-gray-300 transition-all duration-300">
                                                Download Brochure
                                            </button>
                                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300">
                                                Schedule Info Session
                                            </button>
                                        </div>
                                        
                                        <div className="mt-6 text-center">
                                            <p className="text-sm text-gray-600">
                                                Contact: <a href={`mailto:${opportunity.contact}`} className="text-green-600 hover:text-green-700 font-semibold">{opportunity.contact}</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No results message */}
            {filteredOpportunities.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                        <Search className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-600 mb-2">No opportunities found</h3>
                    <p className="text-gray-500 mb-6">
                        Try adjusting your search terms or category filter
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('all');
                        }}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Show All Opportunities
                    </button>
                </div>
            )}

            {/* Call to Action */}
            <div className="mt-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-12 text-white text-center">
                <h2 className="text-3xl font-bold mb-4">Don't See What You're Looking For?</h2>
                <p className="text-xl mb-8 opacity-90">
                    New opportunities are added regularly. Subscribe to our newsletter or contact us for personalized guidance.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors">
                        Subscribe to Updates
                    </button>
                    <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white hover:text-green-600 transition-colors">
                        Contact Our Team
                    </button>
                </div>
            </div>
        </div>
    </div>
);
};
export default BeautifulOpportunitiesPage; 
