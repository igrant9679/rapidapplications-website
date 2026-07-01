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
              src="/images/communityforce-logo.webp" 
              alt="CommunityForce" 
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
                <a href="https://www.communityforce.com/solutions/grants-management/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Grants Management
                </a>
              </li>
              <li>
                <a href="https://www.communityforce.com/solutions/scholarship-management/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Scholarships Management
                </a>
              </li>
              <li>
                <a href="https://www.communityforce.com/solutions/fellowship-management/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Fellowship Management
                </a>
              </li>
              <li>
                <a href="https://www.communityforce.com/solutions/research-management/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Research Management
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-display text-sm font-semibold mb-4 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://www.communityforce.com/documentation/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://www.communityforce.com/case-studies/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="https://www.communityforce.com/blog/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="https://www.communityforce.com/support/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Support
                </a>
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
                <a href="https://www.communityforce.com/careers/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="https://www.communityforce.com/contact/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="https://www.communityforce.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} CommunityForce. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="https://www.communityforce.com/terms-of-service/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Terms of Service
              </a>
              <a href="https://www.communityforce.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="https://www.communityforce.com/accessibility/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
