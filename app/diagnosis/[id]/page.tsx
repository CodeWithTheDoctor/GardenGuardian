'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Leaf, AlertTriangle, ChevronRight, Check, 
  ShoppingCart, Download, Share2 
} from 'lucide-react';
import { TreatmentRecommendations } from '@/components/treatment-recommendations';
import { getDiagnosisById } from '@/lib/firebase-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { PlantDiagnosis } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function DiagnosisPage() {
  const { id } = useParams<{ id: string }>();
  const [diagnosis, setDiagnosis] = useState<PlantDiagnosis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        if (typeof id !== 'string') return;
        
        console.log('🔍 Fetching diagnosis for ID:', id);
        const diagnosisData = await getDiagnosisById(id);
        console.log('🔍 Diagnosis data received:', diagnosisData);
        setDiagnosis(diagnosisData);
        setLoading(false);
      } catch (err) {
        console.error('🚨 Error fetching diagnosis:', err);
        setError('Failed to load diagnosis. Please try again.');
        setLoading(false);
      }
    };
    
    if (id) {
      fetchDiagnosis();
    }
  }, [id]);
  
  if (loading) {
    return <DiagnosisPageSkeleton />;
  }
  
  if (error || !diagnosis) {
    return (
      <motion.div 
        className="min-h-screen bg-garden-cream px-4 py-8 md:py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AlertTriangle className="h-12 w-12 md:h-16 md:w-16 text-garden-alert mx-auto mb-4" />
          </motion.div>
          <motion.h1 
            className="text-2xl md:text-3xl font-bold text-garden-dark mb-4"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            Diagnosis Not Found
          </motion.h1>
          <motion.p 
            className="text-garden-medium mb-8 text-sm md:text-base"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            {error || "We couldn't find the diagnosis you're looking for."}
          </motion.p>
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <Button 
              asChild 
              className="bg-garden-dark hover:bg-garden-medium text-white"
            >
              <Link href="/diagnose">
                Try Another Diagnosis
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }
  
  const { disease, confidence, severity, description } = diagnosis.diagnosis;
  
  // Convert confidence to progress value
  const confidenceValue = Math.round(confidence);
  
  // Check if this is a healthy plant
  const isHealthyPlant = disease.includes('Healthy') || disease.includes('No Issues Detected') || diagnosis.treated === true;
  
  // Determine severity color and status
  const severityColor = isHealthyPlant ? 'text-green-600' :
    severity === 'severe' ? 'text-garden-alert' :
    severity === 'moderate' ? 'text-yellow-600' : 
    'text-garden-light';
    
  const statusBadgeText = isHealthyPlant ? 'Healthy' : severity.charAt(0).toUpperCase() + severity.slice(1);
  const categoryBadgeText = isHealthyPlant ? 'Plant Health' : 'Plant Disease';

  return (
    <motion.div 
      className="min-h-screen bg-garden-cream px-4 py-8 md:py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="mb-6 md:mb-8"
          variants={slideInLeft}
          initial="initial"
          animate="animate"
        >
          <Link 
            href="/dashboard" 
            className="text-garden-medium hover:text-garden-dark flex items-center text-sm md:text-base"
          >
            <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
            Back to Dashboard
          </Link>
        </motion.div>
        
        {/* Diagnosis Result Card */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6 md:mb-8 border-garden-light/30 overflow-hidden shadow-lg">
            <CardHeader className="bg-garden-dark text-white">
              <CardTitle className="text-xl md:text-2xl">Diagnosis Results</CardTitle>
            </CardHeader>
            
            <CardContent className="p-4 md:pt-6">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-4 md:mb-6">
                {/* Plant Image */}
                <motion.div 
                  className="w-full md:w-1/2"
                  variants={slideInLeft}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.3 }}
                >
                  <div className="aspect-video bg-black/5 rounded-lg overflow-hidden">
                    {diagnosis.imageUrl ? (
                      <img 
                        src={diagnosis.imageUrl}
                        alt={`Plant with ${disease}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-garden-medium">
                        No image available
                      </div>
                    )}
                  </div>
                </motion.div>
                
                {/* Diagnosis Details */}
                <motion.div 
                  className="w-full md:w-1/2"
                  variants={slideInRight}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-xl md:text-2xl font-bold text-garden-dark mb-2">
                    {disease}
                  </h2>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge variant="outline" className={`${severityColor} border-current text-xs md:text-sm`}>
                      {statusBadgeText}
                    </Badge>
                    
                    <Badge variant="outline" className={`${isHealthyPlant ? "border-green-600 text-green-600" : "border-garden-medium text-garden-medium"} text-xs md:text-sm`}>
                      <Leaf className="h-3 w-3 mr-1" />
                      {categoryBadgeText}
                    </Badge>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-garden-medium">AI Confidence</span>
                      <span className="text-sm font-medium">{confidenceValue}%</span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                    >
                      <Progress
                        value={confidenceValue}
                        className="h-2 bg-garden-cream"
                        indicatorClassName={
                          confidenceValue > 80 ? "bg-garden-light" :
                          confidenceValue > 60 ? "bg-yellow-500" :
                          "bg-garden-alert"
                        }
                      />
                    </motion.div>
                  </div>
                  
                  <p className="text-garden-medium mb-4 text-sm md:text-base leading-relaxed">
                    {description}
                  </p>
                  
                  <motion.div 
                    className="flex flex-wrap gap-2"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.6 }}
                  >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-garden-light text-garden-dark gap-1 text-xs md:text-sm"
                      >
                        <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                        Share
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-garden-light text-garden-dark gap-1 text-xs md:text-sm"
                      >
                        <Download className="h-3 w-3 md:h-4 md:w-4" />
                        Save Report
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Treatment Recommendations */}
        {diagnosis.treatments && diagnosis.treatments.length > 0 && (
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.5 }}
          >
            <TreatmentRecommendations 
              treatments={diagnosis.treatments}
              userPreferences={{
                organicOnly: false,
                budgetLimit: 100
              }}
            />
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.6 }}
        >
          <motion.div 
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              asChild 
              className="bg-garden-dark hover:bg-garden-medium text-white w-full text-sm md:text-base"
            >
              <Link href="/diagnose">
                Diagnose Another Plant
              </Link>
            </Button>
          </motion.div>
          
          {!isHealthyPlant && (
            <motion.div 
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="outline" 
                className="border-garden-medium text-garden-dark w-full text-sm md:text-base"
                onClick={() => {
                  console.log('Mark as treated');
                }}
              >
                <Check className="h-4 w-4 mr-2" />
                Mark as Treated
              </Button>
            </motion.div>
          )}
          
          {isHealthyPlant && (
            <motion.div 
              className="flex-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                variant="outline" 
                className="border-green-600 text-green-600 w-full text-sm md:text-base cursor-default"
                disabled
              >
                <Check className="h-4 w-4 mr-2" />
                Plant is Healthy
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

function DiagnosisPageSkeleton() {
  return (
    <div className="min-h-screen bg-garden-cream px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-6 w-32" />
        </div>
        
        <Card className="mb-8 border-garden-light/30 overflow-hidden">
          <CardHeader className="bg-garden-dark text-white">
            <CardTitle className="text-2xl">Diagnosis Results</CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-1/2">
                <Skeleton className="aspect-video w-full rounded-lg" />
              </div>
              
              <div className="md:w-1/2">
                <Skeleton className="h-8 w-3/4 mb-2" />
                <div className="flex items-center gap-2 mb-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-28" />
                </div>
                
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-2 w-full mb-4" />
                
                <Skeleton className="h-20 w-full mb-4" />
                
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4 mb-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}