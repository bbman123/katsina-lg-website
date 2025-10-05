import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Beautiful Website Components
import BeautifulWebsite from './components/BeautifulWebsite';
import BeautifulHomePage from './pages/BeautifulHomePage';
import BeautifulMediaPage from './pages/BeautifulMediaPage';
import MediaDetailPage from './pages/MediaDetailPage';

// Admin Components
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import DataDebugComponent from './components/DataDebugComponent';

// ScrollToTop
import ScrollToTop from './components/ScrollToTop';


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

            {/* Leadership Team with Full Biographies */}
            <div className="mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Leadership Team</h2>
                    <p className="text-xl text-gray-600">Experienced leaders driving transformation and innovation</p>
                </div>

                <div className="space-y-12">
                    {[
                        { 
                            name: "Hon. Isah Miqdad", 
                            position: "Executive Chairman", 
                            image: "https://res.cloudinary.com/dhxcqjmkp/image/upload/v1759407845/chair_ante6q.png",
                            biography: [
                                "Hon. Isah Miqdad was born in Katsina Local Government Area on November 3, 1992. He completed his primary education at Tarbiyya Nursery and Primary School (1995-2003), secondary education at Ulul-albab Science and Secondary School and Onward College, Katsina, and graduated from Umaru Musa Yar'adua University in 2016.",
                                "His political career includes serving as pioneering Chairman of the Katsina Community Development Association, APC Local Government and Ward Congress Chairman in Charanchi (2018), and contesting the APC Katsina South Senatorial primary elections (2022). He was appointed Katsina Local Government Coordinator for the 'Not Too Young to Run' Bill and served on the Media Directorate for the 2023 APC general elections in Katsina State.",
                                "Professionally, he joined the Nigerian Small and Medium Enterprises Development Agency (SMEDAN) as Commercial Officer in 2020. Following Governor Dikko Umaru Radda's inauguration in May 2023, he was appointed Senior Special Assistant on Digital Media, a position he held for one year before resigning to contest the Chairmanship of Katsina Local Government, which he won on February 15, 2025."
                            ]
                        },
                        { 
                            name: "Hon. Abdulkarim Al-Ameen Modibbo", 
                            position: "Secretary", 
                            image: "https://res.cloudinary.com/dhxcqjmkp/image/upload/v1757415130/sec_wg14nx.jpg",
                            biography: [
                                "Malam Abdulkarim Al-Ameen Modibbo was born on 29th December 1988 in Katsina. He began his educational journey at Police Children Primary School, Katsina (1996–2002), and later proceeded to Government Pilot Secondary School, Daura (2005–2008). He obtained a Bachelor's degree from Katsina University (now Al-Qalam University) between 2008 and 2012.",
                                "In 2013, he completed the National Youth Service Corps (NYSC). Throughout his career, Malam Abdulkarim has served in various educational and religious capacities, combining both academic and spiritual leadership.",
                                "In 2022, he went back to Alqalam University Katsina for his Master's Degree program (in view). He was appointed as Secretary to Katsina Local Government in May 2025."
                            ]
                        },
                        { 
                            name: "Hon. Ishaq Tasi'u Modoji", 
                            position: "House Leader", 
                            image: "https://res.cloudinary.com/dhxcqjmkp/image/upload/v1757415131/leader_hjhzfl.jpg",
                            biography: [
                                "Hon. Ishaq Tasi'u Modoji was born on November 5, 1987, in Katsina State, Nigeria, specifically in the Katsina Local Government Area. He began his primary education at Shinkafi Qur'anic Model Primary School from 1993 to 1999. He later attended Sir Usman Nagogo College of Arabic and Islamic Studies (SUNCAIS) in Katsina, where he completed both his junior and senior secondary education from 2005 to 2011.",
                                "In his political and leadership experience, he served as a Youth Leader for the Action Congress of Nigeria (ACN) in Shinkafi B Ward from 2011 to 2013. He then became Secretary of the All Progressives Congress (APC) in Shinkafi B Ward from 2013 to 2020, and subsequently served as Chairman of the APC in the same ward from 2020 to 2022.",
                                "He ran for and was elected as Councillor for Shinkafi B Ward in 2022. Hon. Modoji is currently the Council Leader of Katsina Local Government, a position he has held since 2025."
                            ]
                        }
                    ].map((leader, index) => (
                        <div key={index} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                            <div className="md:flex">
                                <div className="md:w-1/3">
                                    <img
                                        src={leader.image}
                                        alt={leader.name}
                                        className="w-full h-64 md:h-full object-cover"
                                    />
                                </div>
                                <div className="md:w-2/3 p-8">
                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{leader.name}</h3>
                                    <p className="text-green-600 font-semibold text-lg mb-4">{leader.position}</p>
                                    <div className="space-y-3">
                                        {leader.biography.map((paragraph, pIndex) => (
                                            <p key={pIndex} className="text-gray-600 leading-relaxed text-justify">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ward Councilors Section */}
            <div className="mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Ward Councilors</h2>
                    <p className="text-xl text-gray-600">Dedicated representatives serving our communities</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[
                        { name: "Hon. Abdullahi Musa", position: "Ward 1 Councilor", image: "/default-avatar.jpg" },
                        { name: "Hon. Fatima Ibrahim", position: "Ward 2 Councilor", image: "/default-avatar.jpg" },
                        { name: "Hon. Usman Garba", position: "Ward 3 Councilor", image: "/default-avatar.jpg" },
                        { name: "Hon. Aisha Yusuf", position: "Ward 4 Councilor", image: "/default-avatar.jpg" },
                        { name: "Hon. Muhammad Sani", position: "Ward 5 Councilor", image: "/default-avatar.jpg" },
                        { name: "Hon. Zainab Ahmed", position: "Ward 6 Councilor", image: "/default-avatar.jpg" },
                        { name: "Hon. Ibrahim Lawal", position: "Ward 7 Councilor", image: "/default-avatar.jpg" },
                        { name: "Hon. Hadiza Kabir", position: "Ward 8 Councilor", image: "/default-avatar.jpg" },
                        { name: "Hon. Yakubu Aliyu", position: "Ward 9 Councilor", image: "/default-avatar.jpg" },
                        { name: "Hon. Maryam Bashir", position: "Ward 10 Councilor", image: "/default-avatar.jpg" },
                        { name: "Hon. Salisu Abdullahi", position: "Ward 11 Councilor", image: "/default-avatar.jpg" },
                        { name: "Hon. Hafsat Umar", position: "Ward 12 Councilor", image: "/default-avatar.jpg" }
                    ].map((councilor, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-4 text-center">
                                <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200">
                                    <img
                                        src={councilor.image}
                                        alt={councilor.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(councilor.name) + '&background=10b981&color=fff';
                                        }}
                                    />
                                </div>
                                <h4 className="font-semibold text-gray-800 text-sm">{councilor.name}</h4>
                                <p className="text-xs text-green-600 mt-1">{councilor.position}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Supervisory Councilors Section */}
            <div className="mt-20">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Supervisory Councilors</h2>
                    <p className="text-xl text-gray-600">Overseeing key departments and ensuring excellence in service delivery</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[
                        { name: "Hon. Ahmad Bello", position: "Education Supervisor", image: "/default-avatar.jpg" },
                        { name: "Hon. Bilkisu Abubakar", position: "Health Supervisor", image: "/default-avatar.jpg" },
                        { name: "Hon. Nasir Mohammed", position: "Agriculture Supervisor", image: "/default-avatar.jpg" },
                        { name: "Hon. Hauwa Idris", position: "Women Affairs Supervisor", image: "/default-avatar.jpg" },
                        { name: "Hon. Kabir Hassan", position: "Works Supervisor", image: "/default-avatar.jpg" },
                        { name: "Hon. Safiya Usman", position: "Environment Supervisor", image: "/default-avatar.jpg" },
                        { name: "Hon. Aminu Yahaya", position: "Finance Supervisor", image: "/default-avatar.jpg" },
                        { name: "Hon. Rakiya Suleiman", position: "Social Services Supervisor", image: "/default-avatar.jpg" },
                        { name: "Hon. Bala Abdullahi", position: "Youth & Sports Supervisor", image: "/default-avatar.jpg" },
                        { name: "Hon. Jamila Yusuf", position: "Commerce Supervisor", image: "/default-avatar.jpg" },
                        { name: "Hon. Isa Mahmud", position: "Information Supervisor", image: "/default-avatar.jpg" }
                    ].map((supervisor, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="p-4 text-center">
                                <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-gray-200">
                                    <img
                                        src={supervisor.image}
                                        alt={supervisor.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(supervisor.name) + '&background=3b82f6&color=fff';
                                        }}
                                    />
                                </div>
                                <h4 className="font-semibold text-gray-800 text-sm">{supervisor.name}</h4>
                                <p className="text-xs text-blue-600 mt-1">{supervisor.position}</p>
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
                        contact: "+234 706 460 7578",
                        color: "from-green-500 to-emerald-500"
                    },
                    {
                        icon: "✉️",
                        title: "Email Us",
                        desc: "Quick Response within 2 hours",
                        contact: "info@katsinalg.kt.gov.ng",
                        color: "from-blue-500 to-cyan-500"
                    },
                    {
                        icon: "📍",
                        title: "Visit Us",
                        desc: "Modern Citizen Service Center",
                        contact: "Katsina LG Secretariat, Nagogo Road Katsina, Katsina State",
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

            {/* Map Section - Add this new section */}
            <div className="mb-16">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Find Us on the Map</h2>
                        <p className="text-gray-600 mb-6">
                            Visit our modern office at the Katsina Local Government Secretariat
                        </p>
                    </div>
                    
                    {/* Google Maps Embed */}
                    <div className="relative w-full h-[500px] bg-gray-100">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3877.9039897043!2d7.5985!3d12.9816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11050c7f1c4c8c6f%3A0x1234567890abcdef!2sKatsina%20Local%20Government%20Secretariat!5e0!3m2!1sen!2sng!4v1234567890"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                            title="Katsina LG Secretariat Location"
                        ></iframe>
                        
                        {/* Optional: Overlay with address info */}
                        <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg p-4 max-w-sm">
                            <h3 className="font-bold text-gray-800 mb-2">Katsina LG Secretariat</h3>
                            <p className="text-sm text-gray-600 mb-2">
                                Nagogo Road, Katsina<br />
                                Katsina State, Nigeria
                            </p>
                            <a 
                                href="https://www.google.com/maps/dir/?api=1&destination=Katsina+Local+Government+Secretariat+Katsina+Nigeria"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                                Get Directions
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Form */}
            <div className="grid lg:grid-cols-2 gap-12">
                <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-3xl p-8 text-white">
                    <h2 className="text-3xl font-bold mb-6">Office Hours</h2>
                    <div className="space-y-4 text-lg">
                        <div className="flex justify-between">
                            <span>Monday:</span>
                            <span className="font-semibold">8:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tuesday:</span>
                            <span className="font-semibold">8:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Wednesday :</span>
                            <span className="font-semibold">8:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Thursday :</span>
                            <span className="font-semibold">8:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Friday :</span>
                            <span className="font-semibold">8:00 AM - 4:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Saturday:</span>
                            <span className="font-semibold">Closed</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Sunday:</span>
                            <span className="font-semibold">Closed</span>
                        </div>
                        {/* <div className="flex justify-between">
                            <span>Online Services:</span>
                            <span className="font-semibold">24/7 Available</span>
                        </div> */}
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
        {/* {process.env.NODE_ENV === 'development' && <DataDebugComponent />} */}
    </div>
);

// Main Website Wrapper
const MainWebsite = () => {
    return (
        <BeautifulWebsite>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<BeautifulHomePage />} />
                <Route path="/media" element={<BeautifulMediaPage />} />
                <Route path="/media/:id" element={<MediaDetailPage />} />
                {/* <Route path="/media" element={<BeautifulMediaPage />} /> */}
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
                        <Route path="/ktlgmaster/login" element={<AdminLogin />} />
                        <Route 
                            path="/ktlgmaster/dashboard" 
                            element={
                                <ProtectedRoute>
                                    <AdminDashboardPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/ktlgmaster/*" 
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
