import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from './landing/Header'
import Footer from './landing/Footer'
import HeroSection from './landing/HeroSection'
import Features from './landing/Features'
import HowItWorks from './landing/HowItWorks'
import Services from './landing/Services'

export default function LandingPage() {
  const navigate = useNavigate()
  const [postcode, setPostcode] = useState('')

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (postcode.trim()) {
      navigate(`/find?postcode=${encodeURIComponent(postcode.trim())}`)
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