"use client"

import { Search } from "lucide-react"
import { type FormEvent, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

interface HeroSectionProps {
  postcode: string
  onPostcodeChange: (value: string) => void
  onSubmit: (e: FormEvent) => void
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

          <form onSubmit={onSubmit} className="mx-auto mb-8 max-w-md">
            <div className="flex w-full overflow-hidden rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
              <Input
                className="flex-1 rounded-none rounded-l-lg border-0 bg-white px-4 py-6 text-base focus-visible:ring-2 focus-visible:ring-primary"
                placeholder="Enter your postcode"
                type="text"
                value={postcode}
                onChange={(e) => onPostcodeChange(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="rounded-none rounded-r-lg bg-primary px-6 py-6 text-base font-medium text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                <Search className="mr-2 h-5 w-5" />
                Find Now
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
