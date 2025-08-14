cat > frontend/src/pages/PublicHome.jsx << 'EOF'
import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react'

const Header = () => (
    <header className="relative">
        <div className="flag-strip" aria-hidden="true"></div>
        <div className="header-centered">
            <img src="/logo.png" alt="Katsina LG" className="w-32 h-auto" />
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold">Katsina Local Government</h1>
                <p className="text-xl opacity-95">Home of Hospitality</p>
            </div>
        </div>
    </header>
)

export default function PublicHome() {
    const [opportunities, setOpportunities] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/public-data')
                const data = await response.json()

                if (data.success) {
                    setOpportunities(data.data.opportunities || [])
                }
            } catch (error) {
                console.error('Error fetching data:', error)
                // Fallback data for demo
                setOpportunities([
                    {
                        _id: '1',
                        title: 'Youth Entrepreneurship Grant',
                        description: 'Supporting young entrepreneurs with startup capital',
                        deadline: '2024-09-15',
                        applicants: 45,
                        category: 'Grant'
                    },
                    {
                        _id: '2',
                        title: 'Agricultural Training Program',
                        description: 'Modern farming techniques training',
                        deadline: '2024-08-25',
                        applicants: 78,
                        category: 'Training'
                    }
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="app-hero">
                <div className="container-public">
                    <Header />
                    <div className="mt-16 text-center text-white">
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="app-hero">
            <div className="container-public">
                <Header />

                <main className="mt-16 text-white">
                    <section className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Building a Stronger Katsina Community
                        </h2>
                        <p className="text-xl md:text-2xl mb-8 opacity-90">
                            Together We Progress, Together We Prosper
                        </p>
                        <button className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all">
                            Explore Opportunities
                        </button>
                    </section>

                    <section className="mb-16">
                        <h2 className="text-2xl font-semibold mb-6">Latest Opportunities</h2>
                        {opportunities.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {opportunities.slice(0, 6).map(opp => (
                                    <article key={opp._id} className="bg-white/10 backdrop-blur rounded-lg p-6 hover:bg-white/15 transition-all">
                                        <div className="mb-2">
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded">
                        {opp.category}
                      </span>
                                        </div>
                                        <h3 className="font-semibold text-white mb-2">{opp.title}</h3>
                                        <p className="text-sm text-white/80 mb-2">
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            Deadline: {new Date(opp.deadline).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-white/90 mb-4">{opp.description}</p>
                                        <div className="flex justify-between items-center">
                      <span className="text-xs text-white/70">
                        <Users className="w-4 h-4 inline mr-1" />
                          {opp.applicants || 0} applicants
                      </span>
                                            <button className="px-3 py-1 bg-white text-green-700 rounded hover:bg-gray-100 transition-colors">
                                                Apply
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-white/80">No opportunities available at the moment.</p>
                            </div>
                        )}
                    </section>

                    <section className="text-center">
                        <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white/10 p-6 rounded-lg hover:bg-white/15 transition-all">
                                <h3 className="font-semibold mb-2">Phone</h3>
                                <p>+234 123 456 7890</p>
                            </div>
                            <div className="bg-white/10 p-6 rounded-lg hover:bg-white/15 transition-all">
                                <h3 className="font-semibold mb-2">Email</h3>
                                <p>info@katsinalg.gov.ng</p>
                            </div>
                            <div className="bg-white/10 p-6 rounded-lg hover:bg-white/15 transition-all">
                                <h3 className="font-semibold mb-2">Address</h3>
                                <p>Local Government Secretariat<br />Katsina, Katsina State</p>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
EOF