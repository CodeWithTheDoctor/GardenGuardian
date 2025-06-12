import Link from 'next/link';
import { Leaf, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-garden-dark text-white py-16" role="contentinfo">
      <div className="w-full mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6" aria-label="GardenGuardian homepage">
              <div className="p-2 bg-garden-light rounded-xl">
                <Leaf className="h-6 w-6 text-garden-dark" aria-hidden="true" />
              </div>
              <span className="font-bold text-2xl">GardenGuardian</span>
            </Link>
            <p className="text-garden-cream mb-6 text-lg leading-relaxed">
              AI-powered plant health diagnosis designed for Australian gardeners. 
              Get instant, reliable advice to keep your garden thriving.
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href="#" 
                className="text-garden-cream hover:text-garden-light transition-colors p-3 hover:bg-garden-medium/20 rounded-lg min-h-[48px] min-w-[48px] flex items-center justify-center"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-6 w-6" />
              </Link>
              <Link 
                href="#" 
                className="text-garden-cream hover:text-garden-light transition-colors p-3 hover:bg-garden-medium/20 rounded-lg min-h-[48px] min-w-[48px] flex items-center justify-center"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-6 w-6" />
              </Link>
              <Link 
                href="#" 
                className="text-garden-cream hover:text-garden-light transition-colors p-3 hover:bg-garden-medium/20 rounded-lg min-h-[48px] min-w-[48px] flex items-center justify-center"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-6 w-6" />
              </Link>
            </div>
          </div>
          
          {/* Features Section */}
          <div>
            <h3 className="font-bold mb-8 text-garden-light text-xl">Features</h3>
            <ul className="space-y-5">
              <li>
                <Link 
                  href="/diagnose" 
                  className="text-garden-cream hover:text-garden-light transition-colors flex items-center group text-lg py-2 px-3 rounded-lg hover:bg-garden-medium/10 min-h-[48px]"
                  aria-label="Plant diagnosis feature"
                >
                  <span className="w-3 h-3 bg-garden-light rounded-full mr-4 group-hover:bg-white transition-colors flex-shrink-0"></span>
                  Plant Diagnosis
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard" 
                  className="text-garden-cream hover:text-garden-light transition-colors flex items-center group text-lg py-2 px-3 rounded-lg hover:bg-garden-medium/10 min-h-[48px]"
                  aria-label="Personal dashboard"
                >
                  <span className="w-3 h-3 bg-garden-light rounded-full mr-4 group-hover:bg-white transition-colors flex-shrink-0"></span>
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/community" 
                  className="text-garden-cream hover:text-garden-light transition-colors flex items-center group text-lg py-2 px-3 rounded-lg hover:bg-garden-medium/10 min-h-[48px]"
                  aria-label="Community platform"
                >
                  <span className="w-3 h-3 bg-garden-light rounded-full mr-4 group-hover:bg-white transition-colors flex-shrink-0"></span>
                  Community
                </Link>
              </li>
            </ul>
          </div>
          
        </div>
        
        {/* Bottom Section with Enhanced Spacing */}
        <div className="border-t border-garden-medium/20 mt-16 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 max-w-6xl mx-auto">
          <div className="text-center md:text-left">
            <p className="text-garden-cream text-base mb-2">
              &copy; {new Date().getFullYear()} GardenGuardian AI. All rights reserved.
            </p>
            <p className="text-garden-cream text-sm">
              Educational tool - Not professional agricultural advice
            </p>
          </div>
          <p className="text-garden-cream text-base font-medium">
            Made with 🌱 in Australia
          </p>
        </div>
      </div>
    </footer>
  );
}