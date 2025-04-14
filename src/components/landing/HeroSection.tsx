"use client"

import { Car, Home } from "lucide-react"
import { type FormEvent, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface HeroSectionProps {
  postcode: string
  onPostcodeChange: (value: string) => void
  onSubmit: (e: FormEvent, serviceType: string) => void
}

export default function HeroSection({ postcode, onPostcodeChange, onSubmit }: HeroSectionProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Background elements */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Animated decorative elements */}
      {mounted && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.15, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/60 blur-xl"></div>
            <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-secondary/60 blur-xl"></div>
            <div className="absolute top-1/3 right-1/4 h-40 w-40 rounded-full bg-accent/40 blur-xl"></div>
          </motion.div>
        </>
      )}

      {/* Content */}
      <div className="relative z-10 flex min-h-[85vh] items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
            Find{" "}
            <span className="text-primary">Trusted Locksmiths</span>{" "}
            <br className="hidden sm:block" />
            in Your Area
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg text-slate-200 drop-shadow md:text-xl">
            Enter your postcode to discover reliable locksmith services near you. Professional, vetted experts available
            24/7.
          </p>

          <form className="mx-auto mb-8 max-w-xl px-4 sm:px-0">
            <div className="flex w-full overflow-hidden rounded-lg shadow-lg border-2 border-gray-300">
              <div className="flex-1 flex items-center bg-white rounded-lg px-4 py-2">
              <Input
                className="w-full border-0 bg-transparent py-3 text-base focus-visible:ring-0 focus-visible:outline-none"
                placeholder="Enter your postcode"
                type="text"
                value={postcode}
                onChange={(e) => onPostcodeChange(e.target.value)}
                required
              />
              </div>
            </div>
            <div className="mt-5 flex w-full flex-col sm:flex-row gap-4">
              <Button
                type="button"
                className="flex-1 bg-blue-600 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors rounded-lg shadow-lg border-2 border-blue-500"
                size="lg"
                onClick={(e) => onSubmit(e as unknown as FormEvent, "vehicle")}
              >
                <div className="flex items-center justify-center w-full">
                  <Car className="mr-2 h-6 w-6 flex-shrink-0" />
                  <span>View Vehicle Locksmiths</span>
                </div>
              </Button>
              <Button
                type="button"
                className="flex-1 bg-green-600 py-3 text-base font-medium text-white hover:bg-green-700 transition-colors rounded-lg shadow-lg border-2 border-green-500"
                size="lg"
                onClick={(e) => onSubmit(e as unknown as FormEvent, "home")}
              >
                <div className="flex items-center justify-center w-full">
                  <Home className="mr-2 h-6 w-6 flex-shrink-0" />
                  <span>View Home Locksmiths</span>
                </div>
              </Button>
            </div>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {["24/7 Service", "Vetted Professionals", "Fast Response", "Emergency Callout"].map((text, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
              >
                <Badge
                  variant="secondary"
                  className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
                >
                  {text}
                </Badge>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-12 text-center text-sm text-slate-300"
          >
            Trusted by thousands of customers across the UK
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
