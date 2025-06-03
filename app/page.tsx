'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Smartphone, 
  Camera, 
  Leaf, 
  Shield, 
  Users, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Zap,
  Globe,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleOnHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { type: "spring", stiffness: 300, damping: 20 }
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-garden-cream via-white to-garden-cream/50">
      {/* Bolt.new Badge - Required for hackathon */}
      <div className="fixed bottom-4 right-4 z-50">
        <Link 
          href="https://bolt.new/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block hover:scale-105 transition-transform duration-200"
        >
          <Image
            src="/images/bolt-badge.png"
            alt="Powered by Bolt.new"
            width={80}
            height={80}
            className="w-16 h-16 md:w-20 md:h-20 drop-shadow-lg"
            priority
          />
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative px-4 py-12 md:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-4 md:mb-6 border-garden-medium text-garden-dark px-3 py-1">
                <Leaf className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                AI-Powered Plant Health
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-garden-dark mb-4 md:mb-6 leading-tight"
            >
              Your Garden's
              <br className="hidden sm:block" />
              <span className="text-garden-medium"> AI Health Detective</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-garden-medium max-w-3xl mx-auto mb-8 md:mb-12 px-4"
            >
              Instantly diagnose plant diseases and get expert treatment recommendations 
              tailored for Australian gardens. Professional-grade analysis, simplified for home gardeners.
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
            >
              <motion.div {...scaleOnHover}>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-garden-dark hover:bg-garden-medium text-white px-8 py-3 text-lg w-full sm:w-auto"
                >
                  <Link href="/diagnose" className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Start Diagnosis
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div {...scaleOnHover}>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border-garden-medium text-garden-dark hover:bg-garden-light/20 px-8 py-3 text-lg w-full sm:w-auto"
                >
                  <Link href="/dashboard">
                    View Dashboard
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Hero Image/Visual */}
          <motion.div 
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="aspect-video bg-gradient-to-br from-garden-light/20 to-garden-medium/20 rounded-2xl overflow-hidden shadow-2xl border border-garden-light/30">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Leaf className="h-16 w-16 md:h-24 md:w-24 text-garden-medium mx-auto mb-4" />
                  </motion.div>
                  <p className="text-garden-dark font-medium text-lg md:text-xl">
                    AI-Powered Plant Analysis
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 md:py-24 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl md:text-4xl font-bold text-garden-dark mb-4"
            >
              Everything You Need for Healthy Plants
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-garden-medium text-lg md:text-xl max-w-2xl mx-auto"
            >
              Professional plant care tools designed for Australian home gardeners
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="h-full border-garden-light/30 hover:border-garden-medium/50 transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="text-center pb-4">
                    <motion.div 
                      className="mx-auto mb-4 p-3 bg-garden-light/20 rounded-full w-fit"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="h-6 w-6 md:h-8 md:w-8 text-garden-medium" />
                    </motion.div>
                    <CardTitle className="text-lg md:text-xl text-garden-dark">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-garden-medium text-sm md:text-base leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 md:py-24 bg-garden-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl md:text-4xl font-bold mb-4 md:mb-6"
            >
              Ready to Transform Your Garden?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-garden-cream mb-8 md:mb-12 max-w-2xl mx-auto"
            >
              Join thousands of Australian gardeners who trust GardenGuardian AI 
              to keep their plants healthy and thriving.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <motion.div {...scaleOnHover}>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-garden-light hover:bg-garden-medium text-garden-dark font-semibold px-8 py-3 text-lg"
                >
                  <Link href="/diagnose" className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Get Started Now
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const features = [
  {
    icon: Camera,
    title: "AI Plant Doctor",
    description: "Instant disease identification via photo upload with professional-grade accuracy for Australian plant varieties."
  },
  {
    icon: Shield,
    title: "APVMA Compliance",
    description: "Treatment recommendations using only registered chemicals that comply with Australian biosecurity regulations."
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Optimized for use in your garden with touch-friendly interface and offline diagnosis capabilities."
  },
  {
    icon: Users,
    title: "Community Network", 
    description: "Connect with local gardeners, share success stories, and get alerts about pest outbreaks in your area."
  },
  {
    icon: BarChart3,
    title: "Health Dashboard",
    description: "Track your plants' recovery progress over time with detailed analytics and treatment reminders."
  },
  {
    icon: Globe,
    title: "Australian Focus",
    description: "Specifically trained on Australian climate zones, local suppliers, and state-specific regulations."
  }
];