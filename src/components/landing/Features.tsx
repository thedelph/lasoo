"use client"

import { Clock, Shield, MapPin, ThumbsUp, Star, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

export default function Features() {
  const features = [
    {
      icon: Clock,
      title: "24/7 Emergency Service",
      description:
        "Round-the-clock availability for all your locksmith needs, including emergency lockouts and urgent security issues.",
    },
    {
      icon: Shield,
      title: "Vetted Professionals",
      description:
        "All our locksmiths undergo thorough background checks, certification verification, and quality assurance testing.",
    },
    {
      icon: MapPin,
      title: "Local Experts",
      description:
        "Find skilled locksmiths in your area with knowledge of local security needs and fast response times.",
    },
    {
      icon: ThumbsUp,
      title: "Transparent Pricing",
      description:
        "Clear, upfront pricing with no hidden fees or surprises. Know what you'll pay before booking service.",
    },
    {
      icon: Star,
      title: "Verified Reviews",
      description: "Read genuine customer reviews and ratings to choose the best locksmith for your specific needs.",
    },
    {
      icon: Lock,
      title: "Security Expertise",
      description:
        "Get expert advice on the latest security solutions for your home or business from qualified professionals.",
    },
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
    <section id="features" className="relative bg-white py-24">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -right-40 bottom-20 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900">Why Choose Us</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            We connect you with the most reliable locksmith professionals in your area, ensuring quality service when
            you need it most.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full border border-slate-200 bg-white transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="mb-2.5 text-xl font-semibold text-slate-900">{feature.title}</h3>
                      <p className="text-slate-600">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
