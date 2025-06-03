'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Upload, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Leaf,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { analyzePlantImage } from '@/lib/firebase-utils';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
  transition: { duration: 0.4, ease: "easeOut" }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  transition: { duration: 0.4, ease: "easeOut" }
};

const slideInFromRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function DiagnosePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setError(null);
      setAnalysisResult(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      console.log('🔍 Starting AI analysis...');
      const result = await analyzePlantImage(selectedImage);
      console.log('🔍 Analysis result:', result);
      
      setAnalysisResult(result);
      
      // Navigate to results page after a short delay
      setTimeout(() => {
        router.push(`/diagnosis/${result}`);
      }, 2000);
      
    } catch (err) {
      console.error('🚨 Analysis error:', err);
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-garden-cream px-4 py-8 md:py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8 md:mb-12"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeInUp}>
            <Badge variant="outline" className="mb-4 border-garden-medium text-garden-dark px-3 py-1">
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 mr-1" />
              AI Plant Diagnosis
            </Badge>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-2xl md:text-4xl font-bold text-garden-dark mb-4"
          >
            Diagnose Your Plant's Health
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-garden-medium text-sm md:text-lg max-w-2xl mx-auto"
          >
            Upload a clear photo of your plant showing any signs of disease, pests, or health issues. 
            Our AI will analyze it and provide expert treatment recommendations.
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedImage && (
            <motion.div
              key="upload"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Upload Area */}
              <Card className="border-garden-light/50 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <div 
                    className="border-2 border-dashed border-garden-light rounded-lg p-8 md:p-12 text-center cursor-pointer hover:border-garden-medium transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="mx-auto mb-6 p-4 bg-garden-light/20 rounded-full w-fit"
                    >
                      <Camera className="h-8 w-8 md:h-12 md:w-12 text-garden-medium" />
                    </motion.div>
                    
                    <h3 className="text-lg md:text-xl font-semibold text-garden-dark mb-2">
                      Upload Plant Photo
                    </h3>
                    <p className="text-garden-medium mb-6 text-sm md:text-base">
                      Click here or drag and drop your image
                    </p>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="bg-garden-dark hover:bg-garden-medium text-white">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                      </Button>
                    </motion.div>
                    
                    <p className="text-xs md:text-sm text-garden-medium mt-4">
                      Supports JPG, PNG files up to 10MB
                    </p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedImage && !analysisResult && (
            <motion.div
              key="preview"
              variants={scaleIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Image Preview & Analysis */}
              <Card className="border-garden-light/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl text-garden-dark">
                    Ready for Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Image Preview */}
                    <div className="lg:w-1/2">
                      <motion.div 
                        className="aspect-video bg-black/5 rounded-lg overflow-hidden"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {imagePreview && (
                          <img 
                            src={imagePreview} 
                            alt="Plant to analyze" 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </motion.div>
                    </div>
                    
                    {/* Controls */}
                    <div className="lg:w-1/2 flex flex-col justify-center">
                      <motion.div
                        variants={slideInFromRight}
                        initial="initial"
                        animate="animate"
                      >
                        <h3 className="text-lg md:text-xl font-semibold text-garden-dark mb-4">
                          AI Analysis Ready
                        </h3>
                        <p className="text-garden-medium mb-6 text-sm md:text-base">
                          Your image looks great! Click analyze to get instant diagnosis 
                          and treatment recommendations.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              onClick={handleAnalyze}
                              disabled={isAnalyzing}
                              className="bg-garden-dark hover:bg-garden-medium text-white flex-1 w-full sm:w-auto"
                            >
                              {isAnalyzing ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-4 w-4 mr-2" />
                                  Analyze Plant
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                              )}
                            </Button>
                          </motion.div>
                          
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              variant="outline"
                              onClick={resetAnalysis}
                              className="border-garden-medium text-garden-dark w-full sm:w-auto"
                            >
                              Choose Different Image
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {analysisResult && (
            <motion.div
              key="result"
              variants={scaleIn}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* Analysis Complete */}
              <Card className="border-garden-light/50 shadow-lg">
                <CardContent className="p-6 md:p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <CheckCircle className="h-12 w-12 md:h-16 md:w-16 text-garden-light mx-auto mb-4" />
                  </motion.div>
                  
                  <motion.h3 
                    className="text-xl md:text-2xl font-bold text-garden-dark mb-2"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.3 }}
                  >
                    Analysis Complete!
                  </motion.h3>
                  
                  <motion.p 
                    className="text-garden-medium mb-6 text-sm md:text-base"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.4 }}
                  >
                    Your plant has been analyzed successfully. Redirecting to detailed results...
                  </motion.p>
                  
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2 }}
                    className="w-full bg-garden-cream h-2 rounded-full mb-4"
                  >
                    <div className="h-full bg-garden-light rounded-full w-full"></div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-6"
            >
              <Alert className="bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Analysis Error</AlertTitle>
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips Section */}
        <motion.div 
          className="mt-8 md:mt-12"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <Card className="border-garden-light/30 bg-white/70">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl text-garden-dark flex items-center">
                <Leaf className="h-5 w-5 mr-2 text-garden-medium" />
                Photography Tips for Best Results
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
                <div className="space-y-2">
                  <h4 className="font-semibold text-garden-dark">✅ Good Photos:</h4>
                  <ul className="text-garden-medium space-y-1">
                    <li>• Clear, well-lit images</li>
                    <li>• Close-up of affected areas</li>
                    <li>• Multiple angles if possible</li>
                    <li>• Natural lighting preferred</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-garden-dark">❌ Avoid:</h4>
                  <ul className="text-garden-medium space-y-1">
                    <li>• Blurry or dark images</li>
                    <li>• Too far from the plant</li>
                    <li>• Heavy shadows</li>
                    <li>• Multiple plants in frame</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}