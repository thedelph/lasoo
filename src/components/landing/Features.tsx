import { Clock, Shield, MapPin } from "lucide-react"

export default function Features() {
  return (
    <section id="features" className="py-24 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Clock, title: "24/7 Service", description: "Round-the-clock availability for all your locksmith needs." },
            { icon: Shield, title: "Vetted Professionals", description: "All our locksmiths are thoroughly checked and certified." },
            { icon: MapPin, title: "Local Experts", description: "Find skilled locksmiths in your area quickly and easily." }
          ].map((feature, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-full bg-neutral flex items-center justify-center mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="card-title">{feature.title}</h3>
                <p className="text-base-content/80">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}