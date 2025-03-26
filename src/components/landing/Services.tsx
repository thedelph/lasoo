"use client"

import { Home, Car, Building, Key, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function Services() {
  const services = [
    {
      icon: Home,
      title: "Residential Services",
      subtitle: "Complete home security solutions",
      items: [
        "Emergency lockout assistance",
        "Lock installation and repair",
        "Key cutting and duplication",
        "Smart lock installation",
        "Security upgrades",
        "Window and door security"
      ]
    },
    {
      icon: Car,
      title: "Automotive Services",
      subtitle: "Vehicle security expertise",
      items: [
        "Car lockout assistance",
        "Car key replacement",
        "Transponder key programming",
        "Broken key extraction",
        "Ignition repair",
        "High-security automotive keys"
      ]
    },
    {
      icon: Building,
      title: "Commercial Services",
      subtitle: "Business security solutions",
      items: [
        "Master key systems",
        "Access control installation",
        "Commercial lock repair",
        "Security consultation",
        "Emergency exit devices",
        "File cabinet and desk locks"
      ]
    },
    {
      icon: ShieldCheck,
      title: "Security Upgrades",
      subtitle: "Advanced protection systems",
      items: [
        "Security assessments",
        "High-security lock installation",
        "CCTV consultation",
        "Smart security integration",
        "Keyless entry systems",
        "Security hardware upgrades"
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <section id="services" className="bg-slate-50 py-24">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900">Our Services</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Our network of professional locksmiths offers a comprehensive range of 
            security services for homes, businesses, and vehicles.
          </p>
        </motion.div>
        
        <motion.div 
          className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border border-slate-200 bg-white transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                      <p className="text-sm text-slate-500">{service.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                    {service.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-2">
                        <Key className="h-3 w-3 text-primary" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="mb-4 text-slate-600">Need a service not listed here?</p>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Contact Us for Custom Solutions
          </Button>
        </motion.div>
      </div>
    </section>
  )
}