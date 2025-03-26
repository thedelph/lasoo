import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content">
      <div>
        <p className="text-sm">© 2024 LocksmithFinder. All rights reserved.</p>
        <nav className="grid grid-flow-col gap-4">
          <Link href="#" className="link link-hover">
            Terms of Service
          </Link>
          <Link href="#" className="link link-hover">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
