import { Home, Car } from "lucide-react"

export default function Services() {
  const services = [
    {
      icon: Home,
      title: "Residential Services",
      subtitle: "Home lockouts, lock changes, and repairs",
      items: [
        "Emergency lockout assistance",
        "Lock installation and repair",
        "Key cutting and duplication",
        "Security upgrades"
      ]
    },
    {
      icon: Car,
      title: "Automotive Services",
      subtitle: "Vehicle lockouts and key services",
      items: [
        "Car lockout assistance",
        "Car key replacement",
        "Transponder key programming",
        "Broken key extraction"
      ]
    }
  ]

  return (
    <section id="services" className="py-24 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-neutral flex items-center justify-center">
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="card-title">{service.title}</h3>
                    <p className="text-base-content/80">{service.subtitle}</p>
                  </div>
                </div>
                <ul className="space-y-2 text-base-content/80">
                  {service.items.map((item, itemIndex) => (
                    <li key={itemIndex}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}