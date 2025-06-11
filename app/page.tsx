'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Leaf, 
  Shield, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Zap,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-garden-cream via-white to-garden-cream/50 overflow-x-hidden">
      {/* Bolt.new Badge */}
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

      {/* Hero Section - Enhanced with Visual Interest */}
      <section className="w-full px-4 py-16 md:py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-garden-medium"></div>
          <div className="absolute top-32 right-20 w-24 h-24 rounded-full bg-garden-light"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 rounded-full bg-garden-dark"></div>
        </div>
        
        <div className="w-full max-w-none mx-auto relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-6 border-garden-medium text-garden-dark px-6 py-3 text-base font-medium">
                <Leaf className="h-5 w-5 mr-2" aria-hidden="true" />
                AI Plant Doctor
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-garden-dark mb-8 leading-tight px-4"
            >
              AI Plant Health
              <br />
              <span className="text-garden-medium">Assistant</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-2xl md:text-3xl text-garden-dark font-medium mb-6 max-w-3xl mx-auto leading-relaxed px-4"
            >
              Instant plant diagnosis and care recommendations
            </motion.p>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl text-garden-medium max-w-2xl mx-auto mb-12 leading-relaxed px-4"
            >
              Advanced AI analysis tailored for Australian gardeners and growing conditions
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="mb-12"
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-garden-dark hover:bg-garden-medium text-white px-8 py-4 text-base md:text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[56px] max-w-xs w-full sm:w-auto"
                aria-label="Start diagnosing your plant by taking a photo"
              >
                <Link href="/diagnose" className="flex items-center justify-center gap-3 md:gap-4">
                  <Camera className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true" />
                  <span className="text-base md:text-lg">Start Plant Diagnosis</span>
                  <ArrowRight className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Hero Visual - Enhanced with Plant Theme */}
          <motion.div 
            className="relative max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-garden-light/30 to-garden-medium/30 rounded-3xl overflow-hidden shadow-2xl border-2 border-garden-light/40 relative">
              {/* Plant-themed background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 transform rotate-12">
                  <Leaf className="h-12 w-12 text-garden-dark" />
                </div>
                <div className="absolute top-8 right-6 transform -rotate-45">
                  <Leaf className="h-8 w-8 text-garden-medium" />
                </div>
                <div className="absolute bottom-6 left-8 transform rotate-45">
                  <Leaf className="h-10 w-10 text-garden-dark" />
                </div>
              </div>
              
              <div className="w-full h-full flex items-center justify-center p-8 relative z-10">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Leaf className="h-32 w-32 md:h-40 md:w-40 text-garden-medium mx-auto mb-6" aria-hidden="true" />
                  </motion.div>
                  <h2 className="text-garden-dark font-bold text-2xl md:text-3xl mb-3">
                    AI Plant Doctor
                  </h2>
                  <p className="text-garden-medium text-lg md:text-xl">
                    Professional plant care, simplified
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Enhanced Visual Interest */}
      <section className="w-full px-4 py-16 bg-gradient-to-br from-white to-garden-light/10 relative">
        <div className="w-full max-w-none mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-garden-dark mb-6 px-4"
            >
              How It Works
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-garden-medium max-w-2xl mx-auto px-4"
            >
              Three simple steps to healthier plants
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-4xl mx-auto px-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={fadeInUp}
                className="text-center relative"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative mb-8">
                  <div className="w-28 h-28 mx-auto bg-gradient-to-br from-garden-light/30 to-garden-medium/30 rounded-full flex items-center justify-center border-4 border-garden-light/50 shadow-lg">
                    <step.icon className="h-14 w-14 text-garden-medium" aria-hidden="true" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-garden-dark text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-garden-dark mb-4">
                  {step.title}
                </h3>
                <p className="text-base md:text-lg text-garden-medium leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Key Benefits - Redesigned with Priority Hierarchy */}
      <section className="w-full px-4 py-16 bg-gradient-to-br from-garden-light/15 to-garden-medium/10 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-garden-medium transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-garden-dark transform -translate-x-24 translate-y-24"></div>
        </div>
        
        <div className="w-full max-w-none mx-auto relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-garden-dark mb-6 px-4"
            >
              Why Choose GardenGuardian?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-garden-medium max-w-3xl mx-auto px-4"
            >
              Designed specifically for Australian gardeners
            </motion.p>
          </motion.div>
          
          {/* Primary Benefit - Larger and Prominent */}
          <motion.div 
            className="max-w-2xl mx-auto px-4 mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="border-2 border-garden-medium/40 hover:border-garden-medium/60 transition-all duration-300 hover:shadow-2xl bg-white/95 rounded-3xl overflow-hidden">
              <CardHeader className="pb-4 pt-10">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-garden-light/30 to-garden-medium/30 rounded-3xl flex items-center justify-center shadow-lg">
                    <Camera className="h-12 w-12 text-garden-medium" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-3xl md:text-4xl text-garden-dark mb-6 font-bold">
                    Professional-Grade AI Analysis
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-10">
                <p className="text-xl md:text-2xl text-garden-medium leading-relaxed text-center">
                  Advanced plant health assessment powered by cutting-edge AI technology
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Secondary Benefits - Smaller Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {secondaryBenefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Card className="h-full border-2 border-garden-light/30 hover:border-garden-medium/40 transition-all duration-300 hover:shadow-lg bg-white/90 rounded-2xl">
                  <CardHeader className="pb-4 pt-8">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-6 bg-garden-light/20 rounded-2xl flex items-center justify-center">
                        <benefit.icon className="h-8 w-8 text-garden-medium" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-xl md:text-2xl text-garden-dark mb-4 font-bold">
                        {benefit.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base md:text-lg text-garden-medium leading-relaxed text-center">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Professional Disclaimer - Subtle but Present */}
          <motion.div 
            className="max-w-4xl mx-auto px-4 mt-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">AI-Powered Plant Care Assistant</AlertTitle>
              <AlertDescription className="text-blue-700 text-sm">
                This advanced AI system provides plant health insights and care recommendations. 
                For commercial agricultural applications or complex plant health issues, 
                professional consultation is recommended. Always verify treatment products and follow label instructions.
              </AlertDescription>
            </Alert>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section with Enhanced Design */}
      <section className="relative w-full">
        {/* Main CTA content */}
        <div className="bg-gradient-to-br from-garden-dark via-garden-dark to-garden-medium/90 text-white px-4 py-20 w-full relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-8 left-8 transform rotate-12">
              <Leaf className="h-16 w-16 text-white" />
            </div>
            <div className="absolute top-16 right-12 transform -rotate-45">
              <Leaf className="h-12 w-12 text-white" />
            </div>
            <div className="absolute bottom-12 left-1/4 transform rotate-45">
              <Leaf className="h-14 w-14 text-white" />
            </div>
            <div className="absolute bottom-8 right-8 transform -rotate-12">
              <Leaf className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-4xl md:text-6xl font-bold mb-8"
              >
                Ready to Start?
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-xl md:text-2xl text-garden-cream mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Start diagnosing your plants today with AI-powered plant health analysis
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-garden-light hover:bg-garden-medium text-garden-dark font-bold px-8 py-4 text-base md:text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[56px] max-w-sm w-full sm:w-auto"
                  aria-label="Get started with plant diagnosis now"
                >
                  <Link href="/diagnose" className="flex items-center justify-center gap-3 md:gap-4">
                    <Zap className="h-6 w-6 md:h-7 md:w-7" aria-hidden="true" />
                    <span className="text-base md:text-lg">Diagnose My Plant Now</span>
                    <ArrowRight className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
      </section>

      {/* Mobile Sticky CTA - Enhanced */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-40 bg-garden-dark/97 backdrop-blur-sm border-t border-garden-light/30 p-4 md:hidden safe-area-inset-bottom w-full shadow-2xl"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <Button 
          asChild 
          size="lg" 
          className="w-full bg-garden-light hover:bg-garden-medium text-garden-dark font-bold py-4 text-base rounded-xl min-h-[56px] shadow-lg"
          aria-label="Start plant diagnosis from mobile sticky button"
        >
          <Link href="/diagnose" className="flex items-center justify-center gap-3">
            <Camera className="h-6 w-6" aria-hidden="true" />
            <span className="text-base">Diagnose Plant</span>
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}

// How It Works Steps - Condensed descriptions
const howItWorksSteps = [
  {
    icon: Camera,
    title: "Take Photo",
    description: "Snap a clear picture of affected leaves, stems, or problem areas"
  },
  {
    icon: Zap,
    title: "Get Analysis",
    description: "AI instantly identifies issues and provides expert diagnosis"
  },
  {
    icon: CheckCircle,
    title: "Follow Advice",
    description: "Receive actionable treatment steps for Australian conditions"
  }
];

// Restructured benefits with hierarchy - Primary + Secondary
const secondaryBenefits = [
  {
    icon: Shield,
    title: "Australian Expertise",
    description: "Specialized knowledge of Australian plants, pests, and growing conditions built into every recommendation"
  },
  {
    icon: BarChart3,
    title: "Smart Monitoring", 
    description: "Track your garden's health over time with intelligent insights and personalized care schedules"
  }
];