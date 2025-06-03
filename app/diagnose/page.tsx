'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Camera, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { uploadPlantImage, analyzePlantImage } from '@/lib/firebase-utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DiagnosePage() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  // Reset media stream when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should not exceed 10MB');
      return;
    }

    setError(null);
    setImage(file);
    
    // Create a preview URL for the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const openCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera when available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setIsCameraOpen(true);
    } catch (err) {
      setError('Camera access failed. Please check permissions or try uploading a photo instead.');
      console.error('Camera error:', err);
    }
  };

  const capturePhoto = () => {
    setIsCapturing(true);
    
    const video = videoRef.current;
    if (!video) {
      setIsCapturing(false);
      return;
    }
    
    // Create a canvas to capture the frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'plant-photo.jpg', { type: 'image/jpeg' });
        setImage(file);
        
        // Create a preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        
        // Stop the camera
        closeCamera();
      }
      setIsCapturing(false);
    }, 'image/jpeg', 0.9);
  };

  const closeCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };

  const handleSubmit = async () => {
    if (!image) {
      setError('Please upload or capture a photo of your plant');
      return;
    }

    setIsUploading(true);
    setError(null);
    
    try {
      // In a real app, this would upload to Firebase and call the AI service
      const imageUrl = await uploadPlantImage(image);
      const diagnosisId = await analyzePlantImage(imageUrl);
      
      // Navigate to the results page with the diagnosis ID
      router.push(`/diagnosis/${diagnosisId}`);
    } catch (err) {
      setError('Failed to analyze your plant. Please try again.');
      console.error('Upload error:', err);
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-garden-cream px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-garden-dark text-center mb-6">
          Diagnose Your Plant
        </h1>
        <p className="text-center text-garden-medium mb-10 max-w-md mx-auto">
          Take a clear photo of the affected area of your plant for the most accurate diagnosis.
        </p>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {!isCameraOpen && !imagePreview && (
            <div className="p-6 md:p-10 text-center">
              <div className="flex flex-col space-y-4">
                <Button 
                  onClick={openCamera} 
                  size="lg"
                  className="bg-garden-dark hover:bg-garden-medium text-white py-6 rounded-lg flex items-center justify-center gap-2"
                >
                  <Camera className="h-5 w-5" />
                  Use Camera
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-garden-light/30" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-garden-medium">or</span>
                  </div>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-garden-medium text-garden-dark hover:bg-garden-light/20 py-6"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </div>
          )}

          {isCameraOpen && (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full aspect-video object-cover"
                playsInline
                autoPlay
              />
              
              <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center space-x-4 bg-black/30">
                <Button 
                  variant="outline"
                  onClick={closeCamera} 
                  className="bg-white/90 hover:bg-white text-garden-dark"
                >
                  Cancel
                </Button>
                
                <Button 
                  onClick={capturePhoto}
                  className="bg-garden-dark hover:bg-garden-medium text-white"
                  disabled={isCapturing}
                >
                  {isCapturing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    'Capture Photo'
                  )}
                </Button>
              </div>
            </div>
          )}

          {imagePreview && (
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Plant preview" 
                    className="w-full aspect-video object-contain bg-black/5"
                  />
                  
                  <Button 
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-garden-dark"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                  >
                    Change Photo
                  </Button>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-center py-6">
                <Button 
                  onClick={handleSubmit}
                  className="bg-garden-dark hover:bg-garden-medium text-white px-8 py-6 text-lg"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Diagnose Plant'
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4 bg-garden-alert/10 text-garden-alert border-garden-alert/20">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-garden-dark mb-4">Tips for a Great Diagnosis</h3>
          <ul className="space-y-2 text-garden-medium list-disc pl-5">
            <li>Take a clear, well-lit photo of the affected area</li>
            <li>Include both healthy and damaged parts for comparison</li>
            <li>Capture multiple symptoms if present (leaves, stems, fruit)</li>
            <li>Hold the camera steady to avoid blur</li>
          </ul>
        </div>
      </div>
    </div>
  );
}