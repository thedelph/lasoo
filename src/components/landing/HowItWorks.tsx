"use client"

import { Search, Phone, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "1. Enter Your Postcode",
      description: "Simply input your postcode in the search box to find qualified locksmiths available in your area.",
      color: "bg-primary",
    },
    {
      icon: CheckCircle,
      title: "2. Compare & Choose",
      description:
        "Browse through verified professionals, compare ratings, services, and prices to select the best fit for your needs.",
      color: "bg-emerald-500",
    },
    {
      icon: Phone,
      title: "3. Connect Directly",
      description:
        "Contact your chosen locksmith directly through our platform to discuss your requirements and schedule service.",
      color: "bg-amber-500",
    },
    {
      icon: Clock,
      title: "4. Get Quick Service",
      description:
        "Receive prompt, professional service from your selected locksmith, often within 30 minutes for emergencies.",
      color: "bg-violet-500",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  }

  return (
    <section id="how-it-works" className="relative bg-slate-50 py-24 dark:bg-slate-900">
      {/* Decorative elements */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/5"></div>
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-primary/5"></div>
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">How It Works</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            Finding a reliable locksmith has never been easier. Follow these simple steps to get the help you need.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          <motion.div
            className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {steps.map((step, index) => (
              <motion.div key={index} className="relative" variants={itemVariants}>
                {/* Connection lines with arrows */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+20px)] top-[28px] hidden h-[2px] w-[calc(100%-40px)] bg-slate-200 lg:block dark:bg-slate-700">
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 text-primary">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div
                    className={`z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-full ${step.color} shadow-lg`}
                  >
                    <step.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
                </div>

                {/* Vertical connection for mobile and tablet */}
                {index < steps.length - 1 && (
                  <div className="absolute -bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center lg:hidden">
                    <div className="h-6 w-[2px] bg-slate-200 dark:bg-slate-700"></div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="rotate-90 text-primary"
                    >
                      <path d="M8 0L6.59 1.41L12.17 7H0V9H12.17L6.59 14.59L8 16L16 8L8 0Z" fill="currentColor" />
                    </svg>
                  </div>
                )}
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
            <Button
              size="lg"
              className="bg-primary px-8 py-6 text-base font-medium text-primary-foreground hover:bg-primary/90"
            >
              Find a Locksmith Now
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

