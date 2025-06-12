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
  AlertTriangle,
  MapPin,
  Clock,
  Users
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

      {/* Hero Section - Enhanced with Emotional Hook */}
      <section className="w-full px-4 py-16 md:py-24 lg:py-20 xl:py-24 relative overflow-hidden" role="banner">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-garden-medium"></div>
          <div className="absolute top-32 right-20 w-24 h-24 rounded-full bg-garden-light"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 rounded-full bg-garden-dark"></div>
        </div>
        
        <div className="w-full max-w-none lg:max-w-7xl xl:max-w-none mx-auto relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Badge variant="outline" className="mb-6 border-garden-medium text-garden-dark px-6 py-3 text-lg font-medium" aria-label="AI Plant Doctor service">
                <Leaf className="h-5 w-5 mr-2" aria-hidden="true" />
                Your Personal Plant Doctor
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-bold text-garden-dark mb-8 leading-tight px-4"
            >
              Sick Plant? Snap a Photo
              <br />
              <span className="text-garden-medium">Get Instant Help</span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-2xl md:text-3xl lg:text-2xl xl:text-2xl text-garden-dark font-medium mb-6 max-w-4xl mx-auto leading-relaxed px-4"
            >
              Fast, expert advice tailored to your backyard — no green thumb needed
            </motion.p>
            
            <motion.p 
              variants={fadeInUp}
              className="text-lg md:text-xl lg:text-lg xl:text-xl text-garden-medium max-w-3xl mx-auto mb-12 leading-relaxed px-4"
            >
              Powered by AI, built for Aussie gardens. Trained on Australian plants, pests & climate zones
            </motion.p>
            
            <motion.div 
              variants={fadeInUp}
              className="mb-12"
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-garden-dark hover:bg-garden-medium text-white px-10 py-5 text-lg md:text-xl lg:text-lg xl:text-xl font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[64px] lg:min-h-[56px] xl:min-h-[64px] max-w-md w-full sm:w-auto"
                aria-label="Start diagnosing your plant by taking a photo - takes under 10 seconds"
              >
                <Link href="/diagnose" className="flex items-center justify-center gap-3 md:gap-4 lg:gap-3 xl:gap-4">
                  <Camera className="h-7 w-7 md:h-8 md:w-8 lg:h-7 lg:w-7 xl:h-8 xl:w-8" aria-hidden="true" />
                  <span className="text-lg md:text-xl lg:text-lg xl:text-xl">Snap & Diagnose Now</span>
                  <ArrowRight className="h-6 w-6 md:h-7 md:w-7 lg:h-6 lg:w-6 xl:h-7 xl:w-7" aria-hidden="true" />
                </Link>
              </Button>
              <p className="text-sm text-garden-medium mt-3 font-medium" aria-label="Time indicator">
                ⚡ Takes under 10 seconds!
              </p>
            </motion.div>
          </motion.div>
          
          {/* Hero Visual - Enhanced with Plant Theme & Mobile Optimized */}
          <motion.div 
            className="relative max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="aspect-[3/2] sm:aspect-[4/3] bg-gradient-to-br from-garden-light/30 to-garden-medium/30 rounded-3xl overflow-hidden shadow-2xl border-2 border-garden-light/40 relative max-h-[280px] sm:max-h-none">
              {/* Plant-themed background pattern */}
              <div className="absolute inset-0 opacity-10" aria-hidden="true">
                <div className="absolute top-4 left-4 transform rotate-12">
                  <Leaf className="h-8 w-8 sm:h-12 sm:w-12 text-garden-dark" />
                </div>
                <div className="absolute top-8 right-6 transform -rotate-45">
                  <Leaf className="h-6 w-6 sm:h-8 sm:w-8 text-garden-medium" />
                </div>
                <div className="absolute bottom-6 left-8 transform rotate-45">
                  <Leaf className="h-7 w-7 sm:h-10 sm:w-10 text-garden-dark" />
                </div>
              </div>
              
              <div className="w-full h-full flex items-center justify-center p-6 sm:p-8 relative z-10">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Leaf className="h-20 w-20 sm:h-28 sm:w-28 md:h-36 md:w-36 lg:h-28 lg:w-28 xl:h-32 xl:w-32 text-garden-medium mx-auto mb-3 sm:mb-5" aria-hidden="true" />
                  </motion.div>
                  <h2 className="text-garden-dark font-bold text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl mb-1 sm:mb-2">
                    AI Plant Doctor
                  </h2>
                  <p className="text-garden-medium text-sm sm:text-base md:text-lg lg:text-base xl:text-lg">
                    Professional plant care, simplified
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Enhanced with Clearer Steps */}
      <section className="w-full px-4 py-16 lg:py-12 xl:py-16 bg-gradient-to-br from-white to-garden-light/10 relative" role="main">
        <div className="w-full max-w-none lg:max-w-7xl xl:max-w-none mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-4xl xl:text-4xl font-bold text-garden-dark mb-6 px-4"
            >
              How It Works
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl lg:text-xl xl:text-xl text-garden-medium max-w-3xl mx-auto px-4"
            >
              Three simple steps to healthier plants — perfect for busy Aussie gardeners
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto px-4"
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
                  <div className="w-32 h-32 mx-auto bg-gradient-to-br from-garden-light/30 to-garden-medium/30 rounded-full flex items-center justify-center border-4 border-garden-light/50 shadow-lg">
                    <step.icon className="h-16 w-16 lg:h-12 lg:w-12 xl:h-14 xl:w-14 text-garden-medium" aria-hidden="true" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-garden-dark text-white rounded-full flex items-center justify-center font-bold text-xl lg:text-lg xl:text-xl shadow-lg" aria-label={`Step ${index + 1}`}>
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-2xl xl:text-2xl font-bold text-garden-dark mb-6">
                  {step.title}
                </h3>
                <p className="text-lg md:text-xl lg:text-lg xl:text-lg text-garden-medium leading-relaxed font-medium">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Australian Focus Section - New */}
      <section className="w-full px-4 py-12 bg-gradient-to-br from-garden-dark/5 to-garden-medium/5 relative">
        <div className="w-full max-w-5xl mx-auto">
          <motion.div 
            className="text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3 mb-6">
              <MapPin className="h-8 w-8 text-garden-medium" aria-hidden="true" />
              <Badge variant="outline" className="border-garden-medium text-garden-dark px-6 py-3 text-lg font-semibold">
                Built for Australia
              </Badge>
            </motion.div>
            <motion.p 
              variants={fadeInUp}
              className="text-2xl md:text-3xl lg:text-2xl xl:text-2xl text-garden-dark font-bold mb-4"
            >
              Advice for Aussie plants & pests • Built for Australian climate zones
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Key Benefits - Redesigned with Better Visual Hierarchy */}
      <section className="w-full px-4 py-16 lg:py-12 xl:py-16 bg-gradient-to-br from-garden-light/15 to-garden-medium/10 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
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
              className="text-4xl md:text-5xl lg:text-4xl xl:text-4xl font-bold text-garden-dark mb-6 px-4"
            >
              Why Choose GardenGuardian?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl lg:text-xl xl:text-xl text-garden-medium max-w-4xl mx-auto px-4"
            >
              Australian-made intelligence for Australian gardens
            </motion.p>
          </motion.div>
          
          {/* Primary Benefit - Larger and More Prominent */}
          <motion.div 
            className="max-w-3xl mx-auto px-4 mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Card className="border-2 border-garden-medium/40 hover:border-garden-medium/60 transition-all duration-300 hover:shadow-2xl bg-white/95 rounded-3xl overflow-hidden">
              <CardHeader className="pb-6 pt-12">
                <div className="text-center">
                  <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-garden-light/30 to-garden-medium/30 rounded-3xl flex items-center justify-center shadow-lg">
                    <Zap className="h-16 w-16 lg:h-12 lg:w-12 xl:h-14 xl:w-14 text-garden-medium" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-3xl md:text-4xl lg:text-3xl xl:text-4xl text-garden-dark mb-8 font-bold leading-tight">
                    Instant Plant Diagnosis
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-12">
                <p className="text-xl md:text-2xl lg:text-xl xl:text-xl text-garden-medium leading-relaxed text-center font-medium">
                  Advanced AI analysis identifies plant health issues in seconds, not days
                </p>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Secondary Benefits - Improved Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4"
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
                  <CardHeader className="pb-4 pt-10">
                    <div className="flex items-start gap-6">
                      <div className="w-20 h-20 lg:w-16 lg:h-16 xl:w-20 xl:h-20 bg-gradient-to-br from-garden-light/20 to-garden-medium/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="h-10 w-10 lg:h-8 lg:w-8 xl:h-10 xl:w-10 text-garden-medium" aria-hidden="true" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl md:text-2xl lg:text-xl xl:text-2xl text-garden-dark mb-4 font-bold text-left">
                          {benefit.title}
                        </CardTitle>
                        <p className="text-base md:text-lg lg:text-base xl:text-lg text-garden-medium leading-relaxed text-left">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Professional Disclaimer - Accessible and Subtle */}
          <motion.div 
            className="max-w-5xl mx-auto px-4 mt-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <Alert className="border-blue-200 bg-blue-50" role="note" aria-label="Important disclaimer about AI analysis">
              <Shield className="h-5 w-5 text-blue-600" aria-hidden="true" />
              <AlertTitle className="text-blue-800 text-lg font-semibold">AI-Powered Plant Care Assistant</AlertTitle>
              <AlertDescription className="text-blue-700 text-base leading-relaxed">
                This advanced AI system provides plant health insights and care recommendations for educational purposes. 
                For commercial agricultural applications or complex plant health issues, professional consultation is recommended. 
                Always verify treatment products and follow label instructions.
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
          <div className="absolute inset-0 opacity-5" aria-hidden="true">
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
                className="text-4xl md:text-6xl lg:text-4xl xl:text-5xl font-bold mb-8"
              >
                Ready to Help Your Plants?
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-xl md:text-2xl lg:text-xl xl:text-xl text-garden-cream mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
              >
                Join thousands of Aussie gardeners getting instant, expert plant care advice
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-garden-light hover:bg-garden-medium text-garden-dark font-bold px-10 py-5 text-lg md:text-xl rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[64px] max-w-md w-full sm:w-auto"
                  aria-label="Check your plant's health now with instant AI diagnosis"
                >
                  <Link href="/diagnose" className="flex items-center justify-center gap-3 md:gap-4">
                    <Camera className="h-8 w-8 md:h-9 md:w-9 lg:h-8 lg:w-8 xl:h-9 xl:w-9 flex-shrink-0" aria-hidden="true" />
                    <span className="text-lg md:text-xl lg:text-lg xl:text-xl">Check My Plant's Health</span>
                    <ArrowRight className="h-7 w-7 md:h-8 md:w-8 lg:h-7 lg:w-7 xl:h-8 xl:w-8 flex-shrink-0" aria-hidden="true" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA - Enhanced with Better Copy */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-40 bg-garden-dark/97 backdrop-blur-sm border-t border-garden-light/30 p-4 md:hidden safe-area-inset-bottom w-full shadow-2xl"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.5 }}
        role="complementary"
        aria-label="Mobile sticky call to action"
      >
        <Button 
          asChild 
          size="lg" 
          className="w-full bg-garden-light hover:bg-garden-medium text-garden-dark font-bold py-4 text-lg rounded-xl min-h-[56px] shadow-lg"
          aria-label="Diagnose your plant health from mobile - quick and easy"
        >
          <Link href="/diagnose" className="flex items-center justify-center">
            
            <span className="text-lg -ml-4"> <span className="text-xl mr-2">📷</span> Diagnose My Plant</span>
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}

// How It Works Steps - Enhanced with Clearer Descriptions
const howItWorksSteps = [
  {
    icon: Camera,
    title: "Take Photo",
    description: "Snap a clear picture of affected leaves, stems, or problem areas using your phone's camera"
  },
  {
    icon: Zap,
    title: "Get Analysis",
    description: "AI instantly identifies issues and provides expert diagnosis with confidence scoring"
  },
  {
    icon: CheckCircle,
    title: "Apply Treatment",
    description: "Get step-by-step treatment guidance based on Australian conditions and track improvement over time"
  }
];

// Restructured benefits with better visual hierarchy and Australian focus
const secondaryBenefits = [
  {
    icon: Shield,
    title: "Australia Safe",
    description: "All treatments meet APVMA regulations with state-specific compliance checking and environmental safety guidelines"
  },
  {
    icon: BarChart3,
    title: "Track Progress", 
    description: "Monitor your garden's recovery with intelligent insights, personalized care schedules, and success tracking"
  }
];