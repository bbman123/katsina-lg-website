import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Beautiful Website Components
import BeautifulWebsite from './components/BeautifulWebsite';
import BeautifulHomePage from './pages/BeautifulHomePage';
import BeautifulMediaPage from './pages/BeautifulMediaPage';

// Admin Components
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Beautiful About Page
const BeautifulAboutPage = () => (
    <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold text-gray-800 mb-6">About Katsina Local Government</h1>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                    Leading Nigeria's digital transformation in local governance through innovation, transparency, and citizen-centric services.
                </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-20">
                <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-3xl p-8 text-white">
                    <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                    <p className="text-xl leading-relaxed opacity-90">
                        To be Africa's most innovative and digitally advanced local government, creating a model of excellence in governance, citizen engagement, and sustainable development that inspires transformation across Nigeria.
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 text-white">
                    <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                    <p className="text-xl leading-relaxed opacity-90">
                        To serve our diverse community with integrity, innovation, and excellence by providing world-class digital services, creating economic opportunities, and building sustainable infrastructure.
                    </p>
                </div>
            </div>

            {/* Values */}
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { icon: "🏆", title: "Excellence", desc: "Pursuing the highest standards" },
                    { icon: "🤝", title: "Inclusivity", desc: "Every voice matters" },
                    { icon: "💡", title: "Innovation", desc: "Embracing creative solutions" },
                    { icon: "🔒", title: "Integrity", desc: "Transparency and accountability" }
                ].map((value, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 shadow-xl text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="text-4xl mb-4">{value.icon}</div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                        <p className="text-gray-600">{value.desc}</p>
                    </div>
                ))}
            </div>

            {/* Leadership Team */}
            <div className="mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Leadership Team</h2>
                    <p className="text-xl text-gray-600">Experienced leaders driving transformation and innovation</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { 
                            name: "Hon. Amina Abdullahi", 
                            position: "Executive Chairman", 
                            image: "https://images.unsplash.com/photo-1494790108755-2616b9b9b1b8?w=300&h=400&fit=crop",
                            experience: "15+ years in public service" 
                        },
                        { 
                            name: "Dr. Ibrahim Hassan", 
                            position: "Secretary", 
                            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop",
                            experience: "PhD in Public Administration" 
                        },
                        { 
                            name: "Engr. Fatima Usman", 
                            position: "Head of Digital Innovation", 
                            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=400&fit=crop",
                            experience: "Tech entrepreneur & innovator" 
                        }
                    ].map((leader, index) => (
                        <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <img
                                src={leader.image}
                                alt={leader.name}
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-1">{leader.name}</h3>
                                <p className="text-green-600 font-semibold mb-2">{leader.position}</p>
                                <p className="text-gray-600">{leader.experience}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// Beautiful Contact Page
const BeautifulContactPage = () => (
    <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold text-gray-800 mb-6">Get In Touch</h1>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                    We're here to serve you 24/7. Reach out through any of our modern communication channels.
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-16">
                {[
                    {
                        icon: "📞",
                        title: "Call Us",
                        desc: "24/7 Citizen Support Hotline",
                        contact: "+234 809 123 4567",
                        color: "from-green-500 to-emerald-500"
                    },
                    {
                        icon: "✉️",
                        title: "Email Us",
                        desc: "Quick Response within 2 hours",
                        contact: "info@katsinalg.gov.ng",
                        color: "from-blue-500 to-cyan-500"
                    },
                    {
                        icon: "📍",
                        title: "Visit Us",
                        desc: "Modern Citizen Service Center",
                        contact: "Katsina LG Secretariat, Katsina State",
                        color: "from-purple-500 to-violet-500"
                    }
                ].map((contact, index) => (
                    <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all text-center transform hover:-translate-y-2">
                        <div className={`w-16 h-16 bg-gradient-to-r ${contact.color} rounded-2xl flex items-center justify-center text-white mb-6 mx-auto text-2xl`}>
                            {contact.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{contact.title}</h3>
                        <p className="text-gray-600 mb-4">{contact.desc}</p>
                        <p className="text-lg font-semibold text-green-600">{contact.contact}</p>
                    </div>
                ))}
            </div>

            {/* Contact Form */}
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-3xl p-8 text-white">
                    <h2 className="text-3xl font-bold mb-6">Office Hours</h2>
                    <div className="space-y-4 text-lg">
                        <div className="flex justify-between">
                            <span>Monday - Friday:</span>
                            <span className="font-semibold">8:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Saturday:</span>
                            <span className="font-semibold">9:00 AM - 2:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Sunday:</span>
                            <span className="font-semibold">Emergency Only</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Online Services:</span>
                            <span className="font-semibold">24/7 Available</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-xl">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                    <form className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-colors">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
);

// Main Website Wrapper
const MainWebsite = () => {
    return (
        <BeautifulWebsite>
            <Routes>
                <Route path="/" element={<BeautifulHomePage />} />
                <Route path="/media" element={<BeautifulMediaPage />} />
                <Route path="/about" element={<BeautifulAboutPage />} />
                <Route path="/contact" element={<BeautifulContactPage />} />
            </Routes>
        </BeautifulWebsite>
    );
};

// Main App Component
function App() {
    return (
        <DataProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Main Website Routes */}
                        <Route path="/*" element={<MainWebsite />} />
                        
                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route 
                            path="/admin/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <AdminDashboardPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/admin/*" 
                            element={
                                <ProtectedRoute>
                                    <AdminDashboardPage />
                                </ProtectedRoute>
                            } 
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </DataProvider>
    );
}

export default App;
