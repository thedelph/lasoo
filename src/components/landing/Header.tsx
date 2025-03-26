import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import ThemeToggle from "../../components/ThemeToggle";

export default function Header() {
  return (
    <header className="navbar bg-base-100 border-b">
      <div className="container mx-auto px-4">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost gap-2 normal-case text-xl">
            <Lock className="h-6 w-6" />
            <span className="font-bold">LocksmithFinder</span>
          </Link>
        </div>

        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 items-center">
            <li>
              <Link to="#features">Features</Link>
            </li>
            <li>
              <Link to="#how-it-works">How It Works</Link>
            </li>
            <li>
              <Link to="#contact">Contact</Link>
            </li>
            <SignedOut>
              <li>
                <Link to="/sign-in" className="btn btn-primary btn-sm">
                  Locksmith Login
                </Link>
              </li>
            </SignedOut>
            <SignedIn>
              <li>
                <Link to="/locksmith/dashboard" className="btn btn-ghost btn-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <UserButton afterSignOutUrl="/" />
              </li>
            </SignedIn>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}