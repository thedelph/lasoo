"use client"

import type React from "react"

import { Link } from "react-router-dom"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail("")
      // Here you would typically send the email to your API
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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
    <footer className="relative bg-slate-950 pt-16 pb-8 text-slate-300">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-3xl opacity-20"></div>
        <div className="absolute right-0 bottom-0 h-[200px] w-[200px] rounded-full bg-secondary/5 blur-3xl opacity-20"></div>
      </div>

      <div className="container relative mx-auto px-4">
        <motion.div
          className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Company Info */}
          <motion.div variants={itemVariants}>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary-foreground"
                >
                  <path 
                    d="M18 8C18 4.69 15.31 2 12 2C8.69 2 6 4.69 6 8C6 11.31 8.69 14 12 14V22L18 16H22V8H18Z" 
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">Lasoo</span>
            </Link>
            <p className="mb-6 text-slate-400">
              Connecting you with trusted locksmith professionals in your area for all your security needs.
            </p>

            {/* Newsletter Subscription */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium uppercase tracking-wider text-white">
                Subscribe to our newsletter
              </h3>
              {subscribed ? (
                <p className="text-primary">Thank you for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Your email"
                    className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-slate-800 bg-slate-900 hover:bg-slate-800 hover:text-primary"
                asChild
              >
                <a href="#" aria-label="Facebook">
                  <Facebook size={18} />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-slate-800 bg-slate-900 hover:bg-slate-800 hover:text-primary"
                asChild
              >
                <a href="#" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-slate-800 bg-slate-900 hover:bg-slate-800 hover:text-primary"
                asChild
              >
                <a href="#" aria-label="Instagram">
                  <Instagram size={18} />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-slate-800 bg-slate-900 hover:bg-slate-800 hover:text-primary"
                asChild
              >
                <a href="#" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
              </Button>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  className="inline-block text-slate-400 transition-colors hover:text-primary hover:underline"
                  to="#features"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  className="inline-block text-slate-400 transition-colors hover:text-primary hover:underline"
                  to="#how-it-works"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  className="inline-block text-slate-400 transition-colors hover:text-primary hover:underline"
                  to="#services"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  className="inline-block text-slate-400 transition-colors hover:text-primary hover:underline"
                  to="/sign-in"
                >
                  Locksmith Login
                </Link>
              </li>
              <li>
                <Link
                  className="inline-block text-slate-400 transition-colors hover:text-primary hover:underline"
                  to="#contact"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  className="inline-block text-slate-400 transition-colors hover:text-primary hover:underline"
                  to="#services"
                >
                  Residential Services
                </Link>
              </li>
              <li>
                <Link
                  className="inline-block text-slate-400 transition-colors hover:text-primary hover:underline"
                  to="#services"
                >
                  Automotive Services
                </Link>
              </li>
              <li>
                <Link
                  className="inline-block text-slate-400 transition-colors hover:text-primary hover:underline"
                  to="#services"
                >
                  Commercial Services
                </Link>
              </li>
              <li>
                <Link
                  className="inline-block text-slate-400 transition-colors hover:text-primary hover:underline"
                  to="#services"
                >
                  Security Upgrades
                </Link>
              </li>
              <li>
                <Link
                  className="inline-block text-slate-400 transition-colors hover:text-primary hover:underline"
                  to="#services"
                >
                  Emergency Lockouts
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div id="contact" variants={itemVariants}>
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800">
                  <Phone size={14} className="text-primary" />
                </div>
                <span className="text-slate-400">0800 123 4567</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800">
                  <Mail size={14} className="text-primary" />
                </div>
                <span className="text-slate-400">contact@locksmithfinder.com</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800">
                  <MapPin size={14} className="text-primary" />
                </div>
                <span className="text-slate-400">123 Security Street, London, UK</span>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <Separator className="my-6 bg-slate-800" />

        {/* Bottom Footer */}
        <motion.div
          className="flex flex-col items-center justify-between md:flex-row"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <p className="mb-4 text-slate-500 md:mb-0">&copy; 2025 Lasoo. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link className="text-sm text-slate-500 hover:text-primary hover:underline" to="#">
              Terms of Service
            </Link>
            <Link className="text-sm text-slate-500 hover:text-primary hover:underline" to="#">
              Privacy Policy
            </Link>
            <Link className="text-sm text-slate-500 hover:text-primary hover:underline" to="#">
              Cookie Policy
            </Link>
            <Link className="text-sm text-slate-500 hover:text-primary hover:underline" to="#">
              Accessibility
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
