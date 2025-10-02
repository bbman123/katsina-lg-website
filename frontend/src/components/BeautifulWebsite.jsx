import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Menu, X, Home, Users, FileText, Phone, Mail, MapPin,
    Facebook, Twitter, Instagram, Youtube, Building
} from 'lucide-react';

const BeautifulWebsite = ({ children }) => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Scroll effect for header
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper function to check if a nav item is active
    const isNavActive = (navPath) => {
        // For Media, check if we're on /media or any /media/* path
        if (navPath === '/media') {
            return location.pathname === navPath || location.pathname.startsWith('/media/');
        }
        // For other paths, exact match
        return location.pathname === navPath;
    };

    // Updated navigation items
    const navItems = [
        { id: '/', label: 'Home', icon: <Home className="w-4 h-4" /> },
        { id: '/media', label: 'Media', icon: <FileText className="w-4 h-4" /> },
        { id: '/about', label: 'About', icon: <Users className="w-4 h-4" /> },
        { id: '/contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> }
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <style jsx>{`
               @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
               
               * {
                   font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
               }
               
               html {
                   scroll-behavior: smooth;
               }
               
               ::-webkit-scrollbar {
                   width: 8px;
               }
               
               ::-webkit-scrollbar-track {
                   background: #f1f5f9;
               }
               
               ::-webkit-scrollbar-thumb {
                   background: linear-gradient(180deg, #087443, #22c55e);
                   border-radius: 4px;
               }
           `}</style>

           {/* Fixed Header */}
           <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
               isScrolled
                   ? 'bg-white/95 backdrop-blur-md shadow-lg'
                   : 'bg-white/95 backdrop-blur-md shadow-lg'
                //    : 'bg-gradient-to-b from-black/20 to-transparent'
           }`}>
               <div className="h-1 bg-gradient-to-r from-green-600 via-white to-green-600"></div>

               <div className="max-w-7xl mx-auto px-4 py-3">
                   <div className="flex items-center justify-between">
                       {/* Logo */}
                       <Link to="/" className="flex items-center gap-3 flex-shrink-0">
                           <div className="flex items-center gap-3">
                               {/* Logo Image - Replace with your actual logo */}
                               <img 
                                   src="/images/katsina-logo.png" 
                                   alt="Katsina Local Government Logo"
                                   className="w-12 h-12 object-contain rounded-lg shadow-lg"
                                   onError={(e) => {
                                       // Fallback to text logo if image doesn't load
                                       e.target.style.display = 'none';
                                       e.target.nextSibling.style.display = 'flex';
                                   }}
                               />
                               {/* Fallback text logo */}
                               <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl items-center justify-center shadow-lg hidden">
                                   <span className="font-bold text-sm text-white">KLG</span>
                               </div>
                           </div>
                           {/* <div className={`${isScrolled ? 'text-gray-800' : 'text-white'}`}> */}
                           <div className={`${isScrolled ? 'text-gray-800' : 'text-gray-800'}`}>
                               <h1 className="text-lg font-bold leading-tight">Katsina Local Government</h1>
                               <p className="text-xs opacity-80">Home of Innovation & Prosperity</p>
                           </div>
                       </Link>

                       {/* Desktop Navigation - Updated without opportunities and services */}
                       <nav className="hidden lg:flex items-center gap-2">
                           {navItems.map((item) => (
                               <Link
                                   key={item.id}
                                   to={item.id}
                                   className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                                       isNavActive(item.id)
                                           ? 'bg-green-600 text-white shadow-lg'
                                           : isScrolled
                                               ? 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                                               : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                                   }`}
                               >
                                   {item.icon}
                                   {item.label}
                               </Link>
                           ))}
                       </nav>

                       {/* Admin Login Button */}
                       <div className="flex items-center gap-2">
                           {/* <Link 
                               to="/admin/login"
                               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-sm font-medium"
                           >
                               Admin Login
                           </Link> */}

                           {/* Mobile Menu Button */}
                           { <button
                               onClick={() => setIsMenuOpen(!isMenuOpen)}
                               className={`lg:hidden p-2 rounded-lg ${
                                   isScrolled ? 'text-gray-700' : 'text-black'
                               }`}
                           >
                               {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                           </button> }
                       </div>
                   </div>

                   {/* Mobile Menu */}
                   {isMenuOpen && (
                       <div className="lg:hidden mt-4 p-4 bg-white rounded-xl shadow-xl">
                           {navItems.map((item) => (
                               <Link
                                   key={item.id}
                                   to={item.id}
                                   onClick={() => setIsMenuOpen(false)}
                                   className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                                       isNavActive(item.id)
                                           ? 'bg-green-600 text-white'
                                           : 'text-gray-700 hover:bg-green-50'
                                   }`}
                               >
                                   {item.icon}
                                   {item.label}
                               </Link>
                           ))}
                       </div>
                   )}
               </div>
           </header>

           {/* Main Content */}
           <main className="pt-16">
               {children}
           </main>

           {/* Updated Footer without opportunities and services */}
           <footer className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-16 relative overflow-hidden">
               {/* Background Pattern */}
               <div className="absolute inset-0 opacity-10">
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-500/20 to-transparent"></div>
                   <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-green-400/30 to-transparent rounded-full transform translate-x-32 translate-y-32"></div>
                   <div className="absolute top-16 right-16 w-32 h-32 bg-gradient-to-br from-green-300/20 to-transparent rounded-full"></div>
               </div>

               <div className="max-w-7xl mx-auto px-4 relative z-10">
                   {/* Top Green Accent Line */}
                   <div className="h-1 bg-gradient-to-r from-green-400 via-green-300 to-green-400 mb-12 rounded-full"></div>

                   <div className="grid md:grid-cols-3 gap-8 mb-12">
                       {/* Logo and Description */}
                       <div className="md:col-span-2">
                           <div className="flex items-center gap-4 mb-6">
                                {/* Footer Logo */}
                                <div className="flex items-center gap-3">
                                <div 
                                    className="w-16 h-16 bg-white rounded-2xl shadow-xl border-2 border-green-300/30 flex items-center justify-center"
                                >
                                    <img 
                                    src="/images/katsina-logo.png" 
                                    alt="Katsina Local Government Logo"
                                    className="w-full h-full object-contain rounded-2xl"
                                    onError={(e) => {
                                        // Replace image with fallback text if needed
                                        e.target.style.display = 'none';
                                        const parent = e.target.parentElement;
                                        const fallback = parent.querySelector('.fallback-text');
                                        if (fallback) fallback.style.display = 'flex';
                                    }}
                                    />
                                    {/* Fallback Text Inside Same Container */}
                                    <div 
                                    className="hidden absolute items-center justify-center w-16 h-16"
                                    style={{ display: 'none' }}
                                    >
                                    <span className="font-bold text-2xl text-gray-800">KLG</span>
                                    </div>
                                </div>
                                </div>                               <div>
                                   <div className="font-bold text-2xl text-green-100">Katsina Local Government</div>
                                   <div className="text-lg text-green-200">Innovation Hub for Digital Governance</div>
                               </div>
                           </div>
                           <p className="text-green-100 leading-relaxed text-lg mb-6">
                               Leading Africa's digital transformation in local governance through innovation, transparency, and citizen empowerment. Building tomorrow's Nigeria, today.
                           </p>
                           
                           {/* Social Media Links */}
                           <div className="flex items-center gap-4">
                                <span className="text-green-200 font-semibold">Follow Us:</span>
                                <div className="flex gap-3">
                                    {[
                                    { 
                                        icon: <Facebook className="w-5 h-5" />, 
                                        label: "Facebook", 
                                        url: "https://web.facebook.com/people/Katsina-Local-Govt-Council/61575420623618/" 
                                    },
                                    { icon: <Twitter className="w-5 h-5" />, label: "Twitter", url: "https://x.com/KatsinaStateNg" },
                                    { icon: <Instagram className="w-5 h-5" />, label: "Instagram", url: "https://www.instagram.com/katsinastategovernment/" },
                                    { icon: <Youtube className="w-5 h-5" />, label: "YouTube", url: "https://www.youtube.com/channel/UCL0kYT_vCG2fFuXZj_Jvv2Q" }
                                    ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={social.label}
                                        className="w-10 h-10 bg-green-500/20 hover:bg-green-400/30 border border-green-400/30 rounded-lg flex items-center justify-center text-green-200 hover:text-white transition-all duration-300 transform hover:scale-110"
                                    >
                                        {social.icon}
                                    </a>
                                    ))}
                                </div>
                                </div>
                        </div>

                       {/* Quick Links & Contact Combined */}
                       <div>
                           <h3 className="font-bold text-xl mb-6 text-green-100 border-b border-green-500/30 pb-2"> Contact</h3>
                           
                           {/* Navigation Links */}
                           {/* <ul className="space-y-3 mb-6">
                               {navItems.map((item) => (
                                   <li key={item.id}>
                                       <Link 
                                           to={item.id} 
                                           className="flex items-center gap-2 text-green-200 hover:text-white transition-colors duration-300 group"
                                       >
                                           <div className="w-1 h-1 bg-green-400 rounded-full group-hover:w-2 transition-all duration-300"></div>
                                           {item.label}
                                       </Link>
                                   </li>
                               ))}
                           </ul> */}
                           
                           {/* Contact Info */}
                           <div className="space-y-3 text-green-200 mb-6">
                               <div className="flex items-center gap-2">
                                   <Phone className="w-4 h-4" />
                                   <span>+234 706 460 7578</span>
                               </div>
                               <div className="flex items-center gap-2">
                                   <Mail className="w-4 h-4" />
                                   <span>info@katsinalg.kt.gov.ng</span>
                               </div>
                               <div className="flex items-center gap-2">
                                   <MapPin className="w-4 h-4" />
                                   <span>Katsina, Nigeria</span>
                               </div>
                           </div>

                           {/* Admin Access */}
                           {/* <Link z
                               to="/admin/login"
                               className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg border border-blue-500/30"
                           >
                               <Building className="w-4 h-4" />
                               Admin Dashboard
                           </Link> */}
                       </div>
                   </div>

                   {/* Newsletter Signup */}
                   {/* <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-8 mb-12">
                       <div className="text-center mb-6">
                           <h3 className="text-2xl font-bold text-green-100 mb-2">Stay Connected</h3>
                           <p className="text-green-200">Get the latest updates on news and community developments</p>
                       </div>
                       <div className="flex flex-col md:flex-row gap-4 justify-center max-w-md mx-auto">
                           <input
                               type="email"
                               placeholder="Enter your email address"
                               className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-green-400/30 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                           />
                           <button className="bg-green-500 hover:bg-green-400 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                               Subscribe
                           </button>
                       </div>
                   </div> */}

                   {/* Bottom Section */}
                   <div className="border-t border-green-500/30 pt-8">
                       <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                           <p className="text-green-200 text-center md:text-left">
                               © {new Date().getFullYear()}  Katsina Local Government. All rights reserved. | By SilverWeb Enterprises
                           </p>
                           <div className="flex items-center gap-6">
                               <button className="text-green-200 hover:text-white transition-colors text-sm">
                                   Privacy Policy
                               </button>
                               <button className="text-green-200 hover:text-white transition-colors text-sm">
                                   Terms of Service
                               </button>
                               <button className="text-green-200 hover:text-white transition-colors text-sm">
                                   Accessibility
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
           </footer>
       </div>
   );
};

export default BeautifulWebsite;
