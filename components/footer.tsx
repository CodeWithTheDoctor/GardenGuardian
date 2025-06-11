import Link from 'next/link';
import { Leaf, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-garden-dark text-white py-16">
      <div className="w-full mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-garden-light rounded-xl">
                <Leaf className="h-6 w-6 text-garden-dark" />
              </div>
              <span className="font-bold text-2xl">GardenGuardian</span>
            </Link>
            <p className="text-garden-cream mb-6 text-base leading-relaxed">
              AI-powered plant health diagnosis designed for Australian gardeners. 
              Get instant, reliable advice to keep your garden thriving.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-garden-cream hover:text-garden-light transition-colors p-2 hover:bg-garden-medium/20 rounded-lg">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-garden-cream hover:text-garden-light transition-colors p-2 hover:bg-garden-medium/20 rounded-lg">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-garden-cream hover:text-garden-light transition-colors p-2 hover:bg-garden-medium/20 rounded-lg">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          
          {/* App Features */}
          <div>
            <h3 className="font-bold mb-6 text-garden-light text-lg">App Features</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/diagnose" className="text-garden-cream hover:text-garden-light transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-garden-light rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Plant Diagnosis
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-garden-cream hover:text-garden-light transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-garden-light rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  My Dashboard
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-garden-cream hover:text-garden-light transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-garden-light rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Community
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Account & Support */}
          <div>
            <h3 className="font-bold mb-6 text-garden-light text-lg">Account & Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/login" className="text-garden-cream hover:text-garden-light transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-garden-light rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-garden-cream hover:text-garden-light transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-garden-light rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-garden-cream hover:text-garden-light transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-garden-light rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-garden-cream hover:text-garden-light transition-colors flex items-center group">
                  <span className="w-2 h-2 bg-garden-light rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-garden-medium/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 max-w-6xl mx-auto">
          <div className="text-center md:text-left">
            <p className="text-garden-cream text-sm">
              &copy; {new Date().getFullYear()} GardenGuardian AI. All rights reserved.
            </p>
            <p className="text-garden-cream text-xs mt-1">
              Educational tool - Not professional agricultural advice
            </p>
          </div>
          <p className="text-garden-cream text-sm font-medium">
            Made with 🌱 in Australia
          </p>
        </div>
      </div>
    </footer>
  );
}