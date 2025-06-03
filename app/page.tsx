import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Leaf, Bug, Droplets, Sun, Upload, Clock, InfoIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-garden-cream">
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
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <Alert className="mb-8 bg-blue-50 border-blue-200 max-w-4xl mx-auto">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Prototype Demonstration</AlertTitle>
            <AlertDescription className="text-blue-700">
              This is a high-fidelity prototype showcasing the user experience for an AI-powered plant health platform. 
              UI/UX is production-ready, with simulated AI responses for demonstration purposes.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-garden-dark mb-6 leading-tight">
                Your AI-Powered <br />Garden Health Detective
                <span className="text-lg md:text-xl text-blue-600 block mt-2 font-normal">(Prototype)</span>
              </h1>
              <p className="text-lg md:text-xl text-garden-medium mb-8 max-w-2xl">
                Experience how gardeners will instantly diagnose plant diseases & pests and get Australian-compliant treatments tailored to their garden.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-garden-dark hover:bg-garden-medium text-white px-8 py-6 rounded-lg text-lg">
                  <Link href="/diagnose">
                    Try the Demo
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-garden-medium text-garden-dark hover:bg-garden-light/20">
                  <Link href="/dashboard">
                    View Features
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden rounded-2xl shadow-xl">
                <Image
                  src="https://images.pexels.com/photos/7728078/pexels-photo-7728078.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Healthy garden with vegetables"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-garden-dark text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Upload className="h-12 w-12 text-garden-dark" />, 
                title: "Upload a Photo", 
                description: "Take a photo of your plant showing signs of disease or pest damage." 
              },
              { 
                icon: <Clock className="h-12 w-12 text-garden-medium" />, 
                title: "Instant Diagnosis", 
                description: "Our AI identifies the issue with accuracy and confidence rating." 
              },
              { 
                icon: <Droplets className="h-12 w-12 text-garden-light" />, 
                title: "Get Treatment", 
                description: "Receive Australian-compliant treatment recommendations." 
              }
            ].map((step, index) => (
              <Card key={index} className="border-garden-light">
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-4 bg-garden-cream rounded-full">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-garden-dark mb-2">{step.title}</h3>
                  <p className="text-garden-medium">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-garden-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-garden-dark text-center mb-12">Key Features</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="h-10 w-10" />,
                title: "Disease Identification",
                description: "AI-powered recognition of 1000+ plant diseases and pests specific to Australian gardens."
              },
              {
                icon: <Bug className="h-10 w-10" />,
                title: "Pest Control Solutions",
                description: "Targeted treatments for common Australian garden pests that comply with local regulations."
              },
              {
                icon: <Droplets className="h-10 w-10" />,
                title: "Treatment Plans",
                description: "Step-by-step instructions for organic and chemical treatments with safety information."
              },
              {
                icon: <Sun className="h-10 w-10" />,
                title: "Climate Adaptation",
                description: "Recommendations tailored to your Australian climate zone and current weather conditions."
              },
              {
                icon: <Leaf className="h-10 w-10" />,
                title: "Garden Health Tracking",
                description: "Monitor your plants' recovery over time with progress tracking and reminders."
              },
              {
                icon: <Bug className="h-10 w-10" />,
                title: "Community Knowledge",
                description: "Connect with local gardening experts and share successful treatment methods."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="p-3 bg-garden-light/20 rounded-full inline-block mb-4">
                  <div className="text-garden-dark">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-garden-dark mb-2">{feature.title}</h3>
                <p className="text-garden-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-garden-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Save Your Plants?</h2>
          <p className="text-xl text-garden-light mb-8 max-w-2xl mx-auto">
            Don't wait until it's too late. Diagnose your plant now and get it back to health with expert recommendations.
          </p>
          <Button asChild size="lg" className="bg-garden-light hover:bg-garden-medium text-garden-dark font-semibold px-8 py-6 rounded-lg text-lg">
            <Link href="/diagnose">
              Diagnose Your First Plant
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}