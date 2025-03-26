'use client';

import Link from 'next/link';
import { Lock } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

export default function Header() {
  return (
    <header className="navbar bg-base-100 border-b">
      <div className="container mx-auto px-4">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost gap-2 normal-case text-xl">
            <Lock className="h-6 w-6" />
            <span className="font-bold">LocksmithFinder</span>
          </Link>
        </div>

        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 items-center">
            <li>
              <Link href="#features">Features</Link>
            </li>
            <li>
              <Link href="#how-it-works">How It Works</Link>
            </li>
            <li>
              <Link href="#contact">Contact</Link>
            </li>
            <li>
              <Link href="/locksmith/login" className="btn btn-primary btn-sm">
                Locksmith Login
              </Link>
            </li>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
