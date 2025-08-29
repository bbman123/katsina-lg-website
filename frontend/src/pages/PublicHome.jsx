import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Star, Users, Building, Target, Heart,
  Menu, X, Home, Phone, Mail, MapPin
} from 'lucide-react';

const KatsinaWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Sample data for immediate display
  const opportunities = [
    {
      id: 1,
      title: "Digital Skills Empowerment Program",
      category: "Training",
      deadline: "2024-12-31",
      participants: 234,
      amount: "Free + ₦50,000 bonus",
      description: "Comprehensive digital literacy program covering web development, digital marketing, and data analysis."
    },
    {
      id: 2,
      title: "Women's Cooperative Development Grant",
      category: "Grant",
      deadline: "2024-12-25",
      participants: 89,
      amount: "₦2,000,000 per cooperative",
      description: "Supporting women's cooperatives with funding, training, and market access."
    },
    {
      id: 3,
      title: "Youth Agricultural Innovation Hub",
      category: "Entrepreneurship",
      deadline: "2024-12-15",
      participants: 156,
      amount: "₦5,000,000 total funding",
      description: "Revolutionary program combining modern farming with technology."
    }
  ];

  const stats = [
    { label: "Active Projects", value: 156, icon: <Building className="w-8 h-8" />, color: "bg-blue-500" },
    { label: "Beneficiaries", value: 45200, icon: <Users className="w-8 h-8" />, color: "bg-green-500" },
    { label: "Programs", value: 89, icon: <Target className="w-8 h-8" />, color: "bg-purple-500" },
    { label: "Communities", value: 67, icon: <Heart className="w-8 h-8" />, color: "bg-red-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="h-1 bg-gradient-to-r from-green-600 via-white to-green-600"></div>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="font-bold text-lg text-white">KLG</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Katsina Local Government</h1>
                <p className="text-sm text-gray-600">Home of Innovation & Prosperity</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a href="/admin/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Admin Login
              </a>
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Building Tomorrow's Katsina
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Innovative Governance, Sustainable Development
          </p>
          <p className="text-lg mb-12 max-w-3xl mx-auto opacity-80">
            Leading Nigeria's most progressive local government through digital transformation, 
            community empowerment, and sustainable development initiatives.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors">
              Explore Opportunities
              <ArrowRight className="w-6 h-6 inline ml-2" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors">
              Our Services
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Impact at a Glance</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transforming lives through innovative programs and sustainable development initiatives.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all">
                <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Opportunities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Life-changing programs designed to empower every citizen with skills, resources, and opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map((opportunity) => (
              <div key={opportunity.id} className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white rounded-t-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      {opportunity.category}
                    </span>
                    <span className="text-sm opacity-90">
                      {opportunity.participants} participants
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{opportunity.title}</h3>
                  <p className="opacity-90">{opportunity.description}</p>
                </div>

                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Value:</span>
                      <span className="font-semibold text-green-600">{opportunity.amount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-semibold text-red-600">
                        {new Date(opportunity.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold transition-colors">
                    Learn More & Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="font-bold text-lg">KLG</span>
                </div>
                <div>
                  <div className="font-bold text-lg">Katsina LG</div>
                  <div className="text-sm text-gray-400">Innovation Hub</div>
                </div>
              </div>
              <p className="text-gray-400">
                Leading Africa's digital transformation in local governance through innovation and transparency.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-green-400">Home</a></li>
                <li><a href="#" className="hover:text-green-400">Opportunities</a></li>
                <li><a href="#" className="hover:text-green-400">Services</a></li>
                <li><a href="#" className="hover:text-green-400">About</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+234 809 123 4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>info@katsinalg.gov.ng</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Katsina, Nigeria</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Admin Access</h3>
              <a 
                href="/admin/login" 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
              >
                Admin Dashboard
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Katsina Local Government. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default KatsinaWebsite;
