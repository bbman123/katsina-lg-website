import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Users, Building, Target, Heart, Globe, Clock
} from 'lucide-react';
import { useData } from '../contexts/DataContext';

// Add this helper function for relative time
const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) {
        return 'just now';
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return minutes === 1 ? '1 min ago' : `${minutes} mins ago`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    }
    
    const days = Math.floor(hours / 24);
    if (days < 7) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    }
    
    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
        return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
    
    const months = Math.floor(days / 30);
    if (months < 12) {
        return months === 1 ? '1 month ago' : `${months} months ago`;
    }
    
    const years = Math.floor(days / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
};

// Animation hooks (same as before)
const useIntersectionObserver = (delay = 0) => {
    const [isVisible, setIsVisible] = useState(false);
    const [elementRef, setElementRef] = useState(null);

    useEffect(() => {
        if (!elementRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        observer.observe(elementRef);
        return () => observer.disconnect();
    }, [elementRef, delay]);

    return [setElementRef, isVisible];
};

const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [elementRef, isVisible] = useIntersectionObserver();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (isVisible && !hasStarted && end > 0) {
      setHasStarted(true);

      let start = 0;
      const startTime = performance.now();

      const step = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Use cubic ease-out for smoother feel
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = easeProgress * end;

        // Don't use Math.floor — preserve decimals
        setCount(current);

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    }
  }, [isVisible, hasStarted, end, duration]);

  return [elementRef, count];
};

const FadeInUp = ({ children, delay = 0, className = "" }) => {
   const [elementRef, isVisible] = useIntersectionObserver(delay);

   return (
       <div
           ref={elementRef}
           className={`transform transition-all duration-700 ease-out ${
               isVisible
                   ? 'translate-y-0 opacity-100'
                   : 'translate-y-8 opacity-0'
           } ${className}`}
       >
           {children}
       </div>
   );
};

// Main CountUp Component
const CountUp = ({ end, duration = 2000, suffix = "", decimals = 0 }) => {
  const [elementRef, count] = useCountUp(end, duration);

  // Format with fixed decimals, remove unnecessary trailing zeros
  const formatted = decimals !== undefined 
    ? parseFloat(count.toFixed(decimals))
    : Math.round(count);

  return (
    <span ref={elementRef}>
      {formatted.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals
      })}
      {suffix}
    </span>
  );
};

const BeautifulHomePage = () => {
   const [currentSlide, setCurrentSlide] = useState(0);
   const { mediaItems, loading: mediaLoading } = useData();
   const [currentTime, setCurrentTime] = useState(new Date());

   // Update current time every minute to keep relative times fresh
   useEffect(() => {
       const timer = setInterval(() => {
           setCurrentTime(new Date());
       }, 60000); // Update every minute

       return () => clearInterval(timer);
   }, []);

   // Get the latest 3 published media items sorted by most recent first
   const latestNews = React.useMemo(() => {
       return mediaItems
           .filter(item => item.status === 'published')
           .sort((a, b) => {
               // Ensure we're sorting by most recent first
               const dateA = new Date(a.createdAt || a.updatedAt);
               const dateB = new Date(b.createdAt || b.updatedAt);
               return dateB - dateA; // Most recent first
           })
           .slice(0, 3);
   }, [mediaItems, currentTime]); // Re-calculate when mediaItems or currentTime changes

   // Beautiful hero slides
   const heroSlides = [
       {
           id: 1,
           title: "Building Tomorrow's Katsina",
           subtitle: "Innovative Governance, Sustainable Development",
           description: "Leading Nigeria's most progressive local government through digital transformation, community empowerment, and sustainable development initiatives.",
           image: "https://res.cloudinary.com/dhxcqjmkp/image/upload/v1757416784/building_bh5djq.jpg",
           stats: { projects: 4500, beneficiaries: 12500, investment: 245 }
       },
       {
           id: 2,
           title: "Empowering Our Communities",
           subtitle: "Digital Innovation, Citizen-Centric Services",
           description: "Transforming local governance through modern technology and innovative solutions that put citizens at the heart of everything we do.",
           image: "https://res.cloudinary.com/dhxcqjmkp/image/upload/v1757416784/empowering_sot9mv.jpg",
           stats: { programs: 12, citizens: 3200, services: 850 }
       },
       {
           id: 3,
           title: "Smart Infrastructure",
           subtitle: "Modern Solutions for Growing Communities",
           description: "Revolutionary infrastructure projects including smart roads, digital connectivity, renewable energy, and modern healthcare facilities.",
           image: "https://res.cloudinary.com/dhxcqjmkp/image/upload/v1757416785/Infrastructure_yrlw5s.jpg",
           stats: { roads: 120, connections: 8500, facilities: 28 }
       }
   ];

   // Auto-slide effect
   useEffect(() => {
       const timer = setInterval(() => {
           setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
       }, 6000);
       return () => clearInterval(timer);
   }, [heroSlides.length]);

   // Beautiful stats data
   const quickStats = [
       { label: "Active Projects", value: 1560, icon: <Building className="w-8 h-8" />, color: "bg-blue-500" },
       { label: "Citizens Served", value: 4520, icon: <Users className="w-8 h-8" />, color: "bg-green-500" },
       { label: "Government Programs", value: 89, icon: <Target className="w-8 h-8" />, color: "bg-purple-500" },
       { label: "Communities Served", value: 67, icon: <Heart className="w-8 h-8" />, color: "bg-red-500" }
   ];

   return (
       <div>
           {/* Spectacular Hero Section */}
           <section className="relative h-screen flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0">
                   <img
                       src={heroSlides[currentSlide].image}
                       alt={heroSlides[currentSlide].title}
                       className="w-full h-full object-cover transition-all duration-1000"
                       loading="eager"
                   />
                   <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 via-green-800/60 to-blue-900/80"></div>
               </div>

               <div className="relative z-10 container mx-auto px-4 text-center text-white">
                   <FadeInUp>
                       <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                           {heroSlides[currentSlide].title}
                       </h1>
                   </FadeInUp>

                   <FadeInUp delay={200}>
                       <p className="text-2xl md:text-3xl mb-4 font-light opacity-90">
                           {heroSlides[currentSlide].subtitle}
                       </p>
                   </FadeInUp>

                   <FadeInUp delay={400}>
                       <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-80 leading-relaxed">
                           {heroSlides[currentSlide].description}
                       </p>
                   </FadeInUp>

                   <FadeInUp delay={600}>
                       <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
                           <Link
                               to="/about"
                               className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl"
                           >
                               Learn More About Us
                               <ArrowRight className="w-6 h-6 inline ml-2" />
                           </Link>
                           <Link
                               to="/contact"
                               className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/30"
                           >
                               Get In Touch
                           </Link>
                       </div>
                   </FadeInUp>

                   <FadeInUp delay={800}>
                       <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                           {Object.entries(heroSlides[currentSlide].stats).map(([key, rawValue]) => {
                                // Parse value safely
                                const numValue = typeof rawValue === 'number' ? rawValue : parseInt(rawValue, 10) || 0;

                                let displayValue = numValue;
                                let suffix = '';

                                if (numValue >= 1_000_000) {
                                    displayValue = parseFloat((numValue / 1_000_000).toFixed(1)); // e.g., 2.5
                                    suffix = 'M';
                                } else if (numValue >= 1_000) {
                                    displayValue = parseFloat((numValue / 1_000).toFixed(1)); // e.g., 4.5
                                    suffix = 'K';
                                }
                                // Below 1000 → show full number (e.g., 850)

                                const label = key
                                    .replace(/([A-Z])/g, ' $1')
                                    .trim()
                                    .toUpperCase();

                                return (
                                    <div key={key} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-green-300 flex items-baseline justify-center gap-1">
                                        <CountUp 
                                        end={displayValue} 
                                        duration={2500} 
                                        decimals={1} 
                                        />
                                        <span>{suffix}</span>
                                    </div>
                                    <div className="text-sm uppercase tracking-wider opacity-80 mt-1">
                                        {label}
                                    </div>
                                    </div>
                                );
                                })}
                       </div>
                   </FadeInUp>
               </div>

               {/* Slide indicators */}
               <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
                   {heroSlides.map((_, index) => (
                       <button
                           key={index}
                           onClick={() => setCurrentSlide(index)}
                           className={`w-4 h-4 rounded-full transition-all duration-300 ${
                               index === currentSlide
                                   ? 'bg-white scale-125'
                                   : 'bg-white/50 hover:bg-white/75'
                           }`}
                       />
                   ))}
               </div>
           </section>

           {/* Quick Stats Section */}
           <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
               <div className="container mx-auto px-4">
                   <FadeInUp>
                       <div className="text-center mb-16">
                           <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                               Impact at a Glance
                           </h2>
                           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                               Transforming lives through innovative programs and sustainable development initiatives across Katsina Local Government Area.
                           </p>
                       </div>
                   </FadeInUp>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                       {quickStats.map((stat, index) => (
                           <FadeInUp key={index} delay={index * 100}>
                               <div className="bg-white rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                   <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg`}>
                                       {stat.icon}
                                   </div>
                                   <div className="text-4xl font-bold text-gray-800 mb-2">
                                       <CountUp end={stat.value} />
                                   </div>
                                   <div className="text-gray-600 font-medium">
                                       {stat.label}
                                   </div>
                               </div>
                           </FadeInUp>
                       ))}
                   </div>
               </div>
           </section>

           {/* About Preview Section */}
           <section className="py-20">
               <div className="container mx-auto px-4">
                   <div className="grid lg:grid-cols-2 gap-12 items-center">
                       <FadeInUp>
                           <div>
                               <h2 className="text-4xl font-bold text-gray-800 mb-6">
                                   Leading Digital Transformation
                               </h2>
                               <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                   Katsina Local Government is at the forefront of Nigeria's digital governance revolution. 
                                   We're building a model of excellence that combines traditional values with modern innovation 
                                   to serve our diverse community better.
                               </p>
                               <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                   Through transparency, citizen engagement, and sustainable development initiatives, 
                                   we're creating opportunities that empower every resident of our local government area.
                               </p>
                               <Link
                                   to="/about"
                                   className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
                               >
                                   Learn More About Us
                                   <ArrowRight className="w-5 h-5" />
                               </Link>
                           </div>
                       </FadeInUp>

                       <FadeInUp delay={200}>
                           <div className="relative">
                               <img
                                   src="https://res.cloudinary.com/dhxcqjmkp/image/upload/v1757415986/leadership_cjw74v.jpg"
                                   alt="Modern Government Building"
                                   className="rounded-2xl shadow-2xl w-full"
                               />
                               <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent rounded-2xl"></div>
                           </div>
                       </FadeInUp>
                   </div>
               </div>
           </section>

           {/* Media Preview Section */}
           <section className="py-20 bg-gray-100">
               <div className="container mx-auto px-4">
                   <FadeInUp>
                       <div className="text-center mb-16">
                           <h2 className="text-4xl font-bold text-gray-800 mb-4">
                               Latest News & Updates
                           </h2>
                           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                               Stay informed with the latest developments and success stories from across our communities.
                           </p>
                       </div>
                   </FadeInUp>

                   <div className="grid md:grid-cols-3 gap-8">
                       {mediaLoading ? (
                           // Loading skeleton
                           [...Array(3)].map((_, index) => (
                               <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                                   <div className="w-full h-48 bg-gray-300"></div>
                                   <div className="p-6">
                                       <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                                       <div className="h-6 bg-gray-300 rounded mb-3"></div>
                                       <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                       <div className="h-4 bg-gray-300 rounded mb-2"></div>
                                       <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                   </div>
                               </div>
                           ))
                       ) : latestNews.length > 0 ? (
                           latestNews.map((news, index) => (
                               <FadeInUp key={news.id || news._id || index} delay={index * 200}>
                                   <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full group">
                                       <div className="relative overflow-hidden">
                                           <img
                                               src={news.thumbnail || news.fileUrl || '/default-news-image.jpg'}
                                               alt={news.title}
                                               className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                               onError={(e) => {
                                                   e.target.src = '/default-news-image.jpg';
                                               }}
                                           />
                                           {/* New/Latest badge for very recent items */}
                                           {new Date() - new Date(news.createdAt) < 86400000 && ( // Less than 24 hours
                                               <div className="absolute top-4 right-4">
                                                   <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                                       NEW
                                                   </span>
                                               </div>
                                           )}
                                       </div>
                                       <div className="p-6 flex-1 flex flex-col">
                                           <div className="flex items-center gap-2 text-sm text-green-600 font-medium mb-2">
                                               <Clock className="w-4 h-4" />
                                               <span className="font-semibold">
                                                   {getRelativeTime(news.createdAt || news.updatedAt)}
                                               </span>
                                               <span className="text-gray-400">•</span>
                                               <span className="text-gray-500">
                                                   {new Date(news.createdAt).toLocaleDateString('en-US', {
                                                       month: 'short',
                                                       day: 'numeric'
                                                   })}
                                               </span>
                                           </div>
                                           <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
                                               {news.title}
                                           </h3>
                                           <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
                                               {news.description || news.excerpt || 'Click to read more about this news item.'}
                                           </p>
                                           <div className="flex items-center justify-between">
                                               <Link
                                                   to={`/media/${news.id || news._id}`}
                                                   className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                                               >
                                                   Read More
                                                   <ArrowRight className="w-4 h-4" />
                                               </Link>
                                               {news.category && (
                                                   <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                                       {news.category}
                                                   </span>
                                               )}
                                           </div>
                                       </div>
                                   </div>
                               </FadeInUp>
                           ))
                       ) : (
                           // Fallback when no news items exist
                           <div className="col-span-3 text-center py-12">
                               <div className="inline-block p-6 bg-gray-50 rounded-full mb-4">
                                   <Globe className="w-12 h-12 text-gray-400" />
                               </div>
                               <p className="text-gray-500 mb-4 text-lg">No news items available at the moment.</p>
                               <p className="text-gray-400 mb-6">Check back soon for updates!</p>
                               {/* Only show admin link if user is logged in as admin */}
                               <Link
                                   to="/media"
                                   className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-2"
                               >
                                   Browse All Media
                                   <ArrowRight className="w-4 h-4" />
                               </Link>
                           </div>
                       )}
                   </div>

                   {latestNews.length > 0 && (
                       <FadeInUp delay={600}>
                           <div className="text-center mt-12">
                               <Link
                                   to="/media"
                                   className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl inline-flex items-center gap-2"
                               >
                                   View All Media
                                   <ArrowRight className="w-6 h-6" />
                               </Link>
                           </div>
                       </FadeInUp>
                   )}
               </div>
           </section>

           {/* Call to Action Section */}
           <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
               <div className="container mx-auto px-4 text-center">
                   <FadeInUp>
                       <h2 className="text-4xl font-bold mb-6">Ready to Connect With Us?</h2>
                       <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                           Have questions, suggestions, or want to get involved in your community? 
                           We're here to listen and support you every step of the way.
                       </p>
                       <div className="flex flex-col md:flex-row gap-4 justify-center">
                           <Link
                               to="/contact"
                               className="bg-white text-green-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                           >
                               Contact Us Today
                           </Link>
                           <Link
                               to="/about"
                               className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
                           >
                               Learn More
                           </Link>
                       </div>
                   </FadeInUp>
               </div>
           </section>
       </div>
   );
};

export default BeautifulHomePage;
