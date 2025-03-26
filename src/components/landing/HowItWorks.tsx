import { Search, Phone, Clock } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    { icon: Search, title: "1. Enter Your Postcode", description: "Simply input your postcode to find locksmiths in your area." },
    { icon: Phone, title: "2. Choose a Locksmith", description: "Browse through verified professionals and select the best fit for you." },
    { icon: Clock, title: "3. Get Quick Service", description: "Connect with your chosen locksmith and get the help you need fast." }
  ]

  return (
    <section id="how-it-works" className="py-24 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-neutral flex items-center justify-center mb-4">
                <step.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-base-content/80">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}