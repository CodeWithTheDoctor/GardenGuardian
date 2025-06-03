import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Leaf, AlertTriangle, CheckCircle, ExternalLink, ShoppingCart 
} from 'lucide-react';
import { Treatment } from '@/lib/types';

interface TreatmentRecommendationsProps {
  treatments: Treatment[];
  userPreferences: {
    organicOnly: boolean;
    budgetLimit: number;
  };
}

export function TreatmentRecommendations({ 
  treatments, 
  userPreferences 
}: TreatmentRecommendationsProps) {
  const filteredTreatments = treatments.filter(treatment => 
    userPreferences.organicOnly ? treatment.type === 'organic' : true
  );
  
  // Filter treatments by budget if budget limit is set
  const budgetFilteredTreatments = filteredTreatments.filter(treatment => 
    treatment.cost <= userPreferences.budgetLimit
  );

  // Sort treatments: organic first, then by cost
  const sortedTreatments = [...budgetFilteredTreatments].sort((a, b) => {
    // Organic treatments first
    if (a.type === 'organic' && b.type !== 'organic') return -1;
    if (a.type !== 'organic' && b.type === 'organic') return 1;
    // Then sort by cost (ascending)
    return a.cost - b.cost;
  });
  
  return (
    <Card className="border-garden-light/30">
      <CardHeader>
        <CardTitle className="text-xl text-garden-dark flex items-center">
          <Leaf className="h-5 w-5 mr-2 text-garden-light" />
          Australian-Compliant Treatment Recommendations
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {sortedTreatments.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-garden-dark mb-2">
              No treatments match your preferences
            </h3>
            <p className="text-garden-medium mb-6">
              We couldn't find treatments that match your budget or preference settings.
            </p>
            <Button 
              variant="outline"
              className="border-garden-medium text-garden-dark"
              onClick={() => {
                // In a real app, this would reset filters
                console.log('Reset filters');
              }}
            >
              Reset Preferences
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedTreatments.map((treatment) => (
              <div key={treatment.id} className="bg-white border border-garden-light/20 rounded-lg overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* Treatment Header */}
                  <div className="sm:w-1/3 p-4 bg-garden-light/10">
                    <div className="flex flex-row sm:flex-col justify-between">
                      <div>
                        <Badge className={
                          treatment.type === 'organic' ? 'bg-garden-light text-garden-dark' : 
                          treatment.type === 'chemical' ? 'bg-yellow-500 text-white' : 
                          'bg-blue-500 text-white'
                        }>
                          {treatment.type.charAt(0).toUpperCase() + treatment.type.slice(1)}
                        </Badge>
                        <h3 className="text-lg font-semibold text-garden-dark mt-2">
                          {treatment.name}
                        </h3>
                      </div>
                      
                      <div className="mt-2 sm:mt-4">
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold text-garden-dark">
                            ${treatment.cost}
                          </span>
                          <span className="text-garden-medium text-sm ml-1">
                            AUD
                          </span>
                        </div>
                        <div className="text-xs text-garden-medium">
                          Typical cost
                        </div>
                      </div>
                    </div>
                    
                    {treatment.apvmaNumber && (
                      <div className="mt-4 text-xs text-garden-medium bg-garden-light/20 p-2 rounded">
                        <strong>APVMA Registered:</strong> {treatment.apvmaNumber}
                      </div>
                    )}
                  </div>
                  
                  {/* Treatment Instructions */}
                  <div className="sm:w-2/3 p-4">
                    <h4 className="font-medium text-garden-dark mb-3 flex items-center">
                      <CheckCircle className="h-4 w-4 text-garden-medium mr-1" />
                      Application Instructions
                    </h4>
                    
                    <div className="space-y-3 mb-4">
                      {treatment.instructions.map((step, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-garden-light/20 flex items-center justify-center text-garden-dark text-sm font-medium">
                            {index + 1}
                          </div>
                          <p className="text-garden-medium text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                    
                    {treatment.safetyWarnings && treatment.safetyWarnings.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-garden-dark mb-2 flex items-center text-sm">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                          Safety Warnings
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-garden-medium space-y-1">
                          {treatment.safetyWarnings.map((warning, i) => (
                            <li key={i}>{warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {treatment.suppliers.map((supplier) => (
                        <Button 
                          key={supplier} 
                          size="sm"
                          asChild
                          className="bg-garden-dark hover:bg-garden-medium text-white"
                        >
                          <a
                            href={`https://www.google.com/search?q=${encodeURIComponent(`${treatment.name} ${supplier} australia`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                            {supplier}
                            <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}