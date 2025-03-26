"use client"

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 shadow-sm backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
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
            <span className="hidden text-xl font-bold sm:inline-block">Lasoo</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item, index) => (
              <a 
                key={index} 
                href={item.href} 
                className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Side - Auth & Theme */}
          <div className="flex items-center gap-2">
            <SignedOut>
              <Link to="/sign-in" className="hidden sm:block">
                <Button variant="default" size="sm">
                  Locksmith Login
                </Button>
              </Link>
            </SignedOut>
            
            <SignedIn>
              <Link to="/locksmith/dashboard" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            {/* Mobile menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <nav className="flex flex-col space-y-4 pt-6">
                  {navItems.map((item, index) => (
                    <a 
                      key={index} 
                      href={item.href} 
                      className="rounded-md px-3 py-2 text-base font-medium hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="pt-4">
                    <SignedOut>
                      <Link 
                        to="/sign-in" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button className="w-full" size="sm">
                          Locksmith Login
                        </Button>
                      </Link>
                    </SignedOut>
                    <SignedIn>
                      <Link 
                        to="/locksmith/dashboard" 
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button variant="outline" className="w-full" size="sm">
                          Dashboard
                        </Button>
                      </Link>
                    </SignedIn>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}