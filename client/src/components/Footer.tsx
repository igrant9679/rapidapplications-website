/* Federal Modernism Design: Systematic information architecture in footer */

import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img
              src="/images/rapidapplications-logo.webp"
              alt="RapidApplications"
              className="h-8 w-auto"
            />
            <p className="text-sm text-primary-foreground/80">
              AI-powered grants and scholarship management software for federal agencies, foundations, and universities.
            </p>
            <div className="text-sm text-primary-foreground/80">
              <p>44335 Premier Plaza, Suite 110</p>
              <p>Ashburn, VA 20147</p>
              <p className="mt-2">1-888-829-5003</p>
            </div>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-display text-sm font-semibold mb-4 uppercase tracking-wider">Solutions</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/solutions/grants" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Grants Management
                </Link>
              </li>
              <li>
                <Link href="/solutions/scholarships" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Scholarships Management
                </Link>
              </li>
              <li>
                <Link href="/solutions/fellowships" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Fellowship Management
                </Link>
              </li>
              <li>
                <Link href="/solutions/research" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Research Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-display text-sm font-semibold mb-4 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/features" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/use-cases" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Use Cases
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact/expert" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-display text-sm font-semibold mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact/expert" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} RapidApplications. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/terms-of-service" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy-policy" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/accessibility" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
