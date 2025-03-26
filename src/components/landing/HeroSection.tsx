import { Search } from "lucide-react"
import { FormEvent } from "react"

interface HeroSectionProps {
  postcode: string
  onPostcodeChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
}

export default function HeroSection({ postcode, onPostcodeChange, onSubmit }: HeroSectionProps) {
  return (
    <section className="hero min-h-[70vh] bg-neutral text-neutral-content">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-8">Find Trusted Locksmiths in Your Area</h1>
          <p className="text-xl mb-8 opacity-90">
            Enter your postcode to discover reliable locksmith services near you. Quick, easy, and secure.
          </p>
          <form onSubmit={onSubmit} className="join w-full max-w-md mx-auto">
            <input
              className="input input-bordered join-item flex-1 text-neutral"
              placeholder="Enter your postcode"
              type="text"
              value={postcode}
              onChange={(e) => onPostcodeChange(e.target.value)}
              required
            />
            <button type="submit" className="btn join-item bg-white text-neutral hover:bg-neutral hover:text-white">
              <Search className="h-4 w-4 mr-2" />
              Find
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}