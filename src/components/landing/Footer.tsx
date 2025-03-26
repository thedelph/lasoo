import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
      <nav className="grid grid-flow-col gap-4">
        <Link className="link link-hover" to="#">Terms of Service</Link>
        <Link className="link link-hover" to="#">Privacy Policy</Link>
      </nav> 
      <aside>
        <p>© 2024 LocksmithFinder. All rights reserved.</p>
      </aside>
    </footer>
  )
}