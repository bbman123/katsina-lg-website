import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Users, Building, Target, Heart, Globe
} from 'lucide-react';

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
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
		setCount(end);
                   clearInterval(timer);
               } else {
                   setCount(Math.floor(start));
               }
           }, 16);

           return () => clearInterval(timer);
       }
   }, [isVisible, end, duration, hasStarted]);

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

const CountUp = ({ end, duration = 2000, suffix = "" }) => {
   const [elementRef, count] = useCountUp(end, duration);
   return (
       <span ref={elementRef}>
           {count.toLocaleString()}{suffix}
       </span>
   );
};

const BeautifulHomePage = () => {
   const [currentSlide, setCurrentSlide] = useState(0);

   // Beautiful hero slides
   const heroSlides = [
       {
           id: 1,
           title: "Building Tomorrow's Katsina",
           subtitle: "Innovative Governance, Sustainable Development",
           description: "Leading Nigeria's most progressive local government through digital transformation, community empowerment, and sustainable development initiatives.",
           image: "https://res.cloudinary.com/dhxcqjmkp/image/upload/v1757416784/building_bh5djq.jpg",
           stats: { projects: 45, beneficiaries: 12500, investment: 2.4 }
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
       { label: "Active Projects", value: 156, icon: <Building className="w-8 h-8" />, color: "bg-blue-500" },
       { label: "Citizens Served", value: 45200, icon: <Users className="w-8 h-8" />, color: "bg-green-500" },
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
                           {Object.entries(heroSlides[currentSlide].stats).map(([key, value], index) => (
                               <div key={key} className="text-center">
                                   <div className="text-3xl md:text-4xl font-bold text-green-300">
                                       <CountUp end={typeof value === 'number' ? value : parseInt(value)} />
                                       {typeof value === 'number' && value > 1000 ? 
                                           value > 1000000 ? 'M' : value > 1000 ? 'K' : '' : 
                                           typeof value === 'string' && value.includes('.') ? 'B' : ''}
                                   </div>
                                   <div className="text-sm uppercase tracking-wider opacity-80">
                                       {key.replace(/([A-Z])/g, ' $1').trim()}
                                   </div>
                               </div>
                           ))}
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
                       {[
                            {
                                title: "Katsina LG Chairman Engages Social Media Influencers to Strengthen Youth Support for APC Government",
                                image: "https://res.cloudinary.com/dhxcqjmkp/image/upload/v1757417267/apc_tkpfai.jpg",
                                date: "September 8, 2025",
                                excerpt: "The Executive Chairman of Katsina Local Government, Hon. Isah Miqdad AD Saude, has hosted an interactive forum with social media influencers and APC youth supporters across the local government. The meeting, held on Sunday, 7th September 2025, at the Local Government Secretariat conference hall, aimed at fostering unity, strengthening political engagement, and deepening youth participation in governance. The forum was well attended by prominent political figures, including former aides to the immediate past Governor of Katsina State, Rt. Hon. Aminu Bello Masari, Hon. Tanimu Sada Sa’ad, Hon. Khalil Aminu, and Hon. Abdulkarim AK Ibrahim. Others in attendance were the Special Assistant on Protocol to the Senior Special Assistant to the President of Nigeria, Bola Ahmad Tinubu, Hon. Umar Ahmad Zayyad; the Liaison Officer of Katsina Local Government, Hon. A. Hafiz; along with  other stakeholders. In his keynote address, Hon. Isah Miqdad AD Saude commended the efforts of youths who actively promote the achievements of the APC-led administration on social media platforms. He assured them of his commitment to creating stronger links between them and relevant stakeholders, to provide greater opportunities for youth empowerment and community development. The Chairman further encouraged the youths to remain steadfast in supporting the Executive Governor of Katsina State, Malam Dikko Umar Radda, PhD, CON, particularly as opposition parties intensify preparations ahead of the forthcoming elections. Zaharaddeen Muazu Rafindadi Press Secretary to Katsina LGC"
                            },
                            {
                                title: "Unity in Prayer: Katsina LG Chairman Hosts Darika and Izala Scholars for Peace Prayer in the State",
                                image: "https://res.cloudinary.com/dhxcqjmkp/image/upload/v1757417329/prayer_juykpj.jpg",
                                date: "September 7, 2025",
                                excerpt: "Katsina Local Government Chairman, Hon. Isah Miqdad AD Saude, on Sunday, 7th September 2025, convened and led a special prayer session with prominent Islamic scholars from the Darika and Izala groups at the Local Government Secretariat Mosque. The gathering was organized to seek divine intervention for peace, security, and stability in Katsina State. In his opening address, Hon. Saude expressed deep appreciation to the scholars for honoring the invitation despite the short notice. He stressed that the central purpose of the event was to unite the religious community in collective prayers for an end to the security challenges confronting the state. He further explained that the initiative followed the directive of the Executive Governor of Katsina State, Malam Dikko Umaru Radda, who called for collaboration between clerics from both Darika and Izala traditions to offer special prayers for peace and harmony across the state. Special Advisers to the Governor on Darika and Izala Affairs, Malam Muhammad Mahi Bello and Hon. Gambo Agaji, respectively, also delivered goodwill messages, underscoring the critical role of prayers in the pursuit of peace, stability, and community resilience. The prayer session commenced with Khalifa Sheikh Malam Tijjani of Shehu Jafaru Zawiyya leading the supplications, joined by Khalifa Malam Abbati Rafindadi, Sheikh Malam Abba Bala Gambawara, and other clerics representing diverse religious groups. Each offered prayers beseeching Allah to bless Katsina with lasting peace and prosperity. The event drew wide attendance, including the Chairman of the Katsina Local Government Legislative Council, Hon. Ishaq Tas’iu Modoji, councillors of the local government, the representative of the Emir of Katsina at Shinkafi, the representative of Magajin Gari Katsina and Wakilin Kudu, Alhaji Abdu Illiyasu, as well as leaders of zawiyyas, Izala scholars, and other dignitaries. The session concluded with a closing prayer led by the Chief Imam of Katsina Central Mosque, Malam Mustapha Gambo, who prayed for peace, unity, and sustainable development in Katsina State. Zaharaddeen Muazu Rafindadi Press Secretary to Katsina LGC "
                            },
                            {
                                title: "Katsina Local Government Council Chairman Hon. Isah Miqdad Ad Saude Participates in Exclusive NTA Katsina Television Program",
                                image: "https://res.cloudinary.com/dhxcqjmkp/image/upload/v1757417329/nta_hbaip9.jpg",
                                date: "September 3, 2025",
                                excerpt: "Katsina Local Government Council Chairman, Hon. Isah Miqdad AD Saude, in a group photograph with the management and members of staff of the Nigerian Television Authority (NTA) Katsina, shortly after an exclusive and insightful live program where he spent an hour highlighting the achievements of His Excellency, Governor Mal. Dikko Umar Radda, PhD, CON. During the live session, Hon. Miqdad spoke extensively on education, including the foreign scholarship scheme initiated to support children of the poor, health and its ongoing infrastructure development with special reference to the General Amadi Rimi Orthopedic Hospital where the Governor is establishing a modern imaging center, as well as security and the sustained efforts being made to safeguard communities. The interview was engaging and informative, and he later granted a short follow-up interview after the live session, further emphasizing the importance of collective support in sustaining the progress being recorded across the state. Zaharaddeen Muazu Rafindadi Press Secretary to Katsina LGC "
                            }
                            ].map((news, index) => (
                            <FadeInUp key={index} delay={index * 200}>
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
                                <img
                                    src={news.image}
                                    alt={news.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-sm text-green-600 font-medium mb-2">{news.date}</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                                    {news.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
                                    {news.excerpt}
                                    </p>
                                    <Link
                                    to="/media"
                                    className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-1"
                                    >
                                    Read More
                                    <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                </div>
                            </FadeInUp>
                            ))}
                   </div>

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
