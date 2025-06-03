import Link from 'next/link';
import { Leaf, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-garden-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="p-1 bg-white rounded-full">
                <Leaf className="h-5 w-5 text-garden-dark" />
              </div>
              <span className="font-bold text-xl">GardenGuardian</span>
            </Link>
            <p className="text-garden-light mb-4 text-sm">
              AI-powered plant disease diagnosis for Australian gardeners. Get instant identification and treatment recommendations.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-white hover:text-garden-light transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-white hover:text-garden-light transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-white hover:text-garden-light transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-garden-light">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/diagnose" className="hover:text-garden-light transition-colors">Disease Diagnosis</Link></li>
              <li><Link href="/dashboard" className="hover:text-garden-light transition-colors">Plant Dashboard</Link></li>
              <li><Link href="#" className="hover:text-garden-light transition-colors">Treatment Library</Link></li>
              <li><Link href="#" className="hover:text-garden-light transition-colors">Plant Identification</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-garden-light">Learn</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-garden-light transition-colors">Common Plant Diseases</Link></li>
              <li><Link href="#" className="hover:text-garden-light transition-colors">Organic Treatments</Link></li>
              <li><Link href="#" className="hover:text-garden-light transition-colors">Pest Control Guide</Link></li>
              <li><Link href="#" className="hover:text-garden-light transition-colors">Australian Climate Zones</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-garden-light">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-garden-light transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-garden-light transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-garden-light transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-garden-light transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-garden-medium/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-garden-light text-sm">
            &copy; {new Date().getFullYear()} GardenGuardian AI. All rights reserved.
          </p>
          <p className="text-garden-light text-sm">
            Made with 🌱 in Australia
          </p>
        </div>
      </div>
    </footer>
  );
}