import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './landing/SupabaseHeader'
import Footer from './landing/Footer'
import HeroSection from './landing/HeroSection'
import Features from './landing/Features'
import HowItWorks from './landing/HowItWorks'
import Services from './landing/Services'

export default function LandingPage() {
  const navigate = useNavigate()
  const [postcode, setPostcode] = useState('')

  const handleSearch = (e: FormEvent, serviceType: string) => {
    e.preventDefault()
    if (postcode.trim()) {
      // Set a flag in sessionStorage to ensure the search runs on the next page
      sessionStorage.setItem('lasoo_search_trigger', 'true');
      sessionStorage.setItem('lasoo_search_postcode', postcode.trim());
      sessionStorage.setItem('lasoo_search_service', serviceType);
      
      // Navigate to the search page with postcode and serviceType parameters
      navigate(`/find?postcode=${encodeURIComponent(postcode.trim())}&serviceType=${serviceType}&autoSearch=true`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection 
          postcode={postcode}
          onPostcodeChange={setPostcode}
          onSubmit={handleSearch}
        />
        <Features />
        <HowItWorks />
        <Services />
      </main>
      <Footer />
    </div>
  )
}