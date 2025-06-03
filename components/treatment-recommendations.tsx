import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Leaf, AlertTriangle, CheckCircle, ExternalLink, ShoppingCart, 
  Shield, MapPin, Clock, FileText
} from 'lucide-react';
import { Treatment } from '@/lib/types';

interface ComplianceInfo {
  compliant: boolean;
  warnings: string[];
  requirements: string[];
  restrictions: string[];
  permitRequired?: boolean;
  permitType?: string;
  contactInformation?: string;
}

interface TreatmentRecommendationsProps {
  treatments: Treatment[];
  userPreferences: {
    organicOnly: boolean;
    budgetLimit: number;
  };
  location?: {
    postcode: string;
    state: string;
    nearWaterways?: boolean;
    residentialArea?: boolean;
  };
}

export function TreatmentRecommendations({ 
  treatments, 
  userPreferences,
  location 
}: TreatmentRecommendationsProps) {
  const [complianceData, setComplianceData] = useState<Record<string, ComplianceInfo>>({});
  const [loading, setLoading] = useState(false);

  // Load compliance data when location is available
  useEffect(() => {
    if (location && treatments.length > 0) {
      loadComplianceData();
    }
  }, [location, treatments]);

  const loadComplianceData = async () => {
    if (!location) return;
    
    setLoading(true);
    try {
      const { apvmaService } = await import('@/lib/apvma-service');
      const compliance: Record<string, ComplianceInfo> = {};

      for (const treatment of treatments) {
        if (treatment.apvmaNumber) {
          // Check compliance
          const complianceResult = await apvmaService.checkCompliance(
            treatment.apvmaNumber, 
            {
              state: location.state,
              nearWaterways: location.nearWaterways,
              residentialArea: location.residentialArea
            }
          );

          // Check permit requirements
          const permitInfo = await apvmaService.checkPermitRequirements(
            treatment.apvmaNumber, 
            location.state
          );

          compliance[treatment.id] = {
            ...complianceResult,
            permitRequired: permitInfo.permitRequired,
            permitType: permitInfo.permitType,
            contactInformation: permitInfo.contactInformation
          };
        }
      }

      setComplianceData(compliance);
    } catch (error) {
      console.error('Error loading compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTreatments = treatments.filter(treatment => 
    userPreferences.organicOnly ? treatment.type === 'organic' : true
  );
  
  // Filter treatments by budget if budget limit is set
  const budgetFilteredTreatments = filteredTreatments.filter(treatment => 
    treatment.cost <= userPreferences.budgetLimit
  );

  // Sort treatments: compliant first, then organic, then by cost
  const sortedTreatments = [...budgetFilteredTreatments].sort((a, b) => {
    // Compliant treatments first
    const aCompliant = complianceData[a.id]?.compliant !== false;
    const bCompliant = complianceData[b.id]?.compliant !== false;
    if (aCompliant && !bCompliant) return -1;
    if (!aCompliant && bCompliant) return 1;
    
    // Then organic treatments
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
          {location && (
            <Badge variant="outline" className="ml-2 text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              {location.state}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {location && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4" />
            <AlertTitle>Real-time Compliance Checking Active</AlertTitle>
            <AlertDescription>
              Treatment recommendations are being checked against current APVMA regulations 
              and {location.state} state requirements.
              {loading && ' Compliance data loading...'}
            </AlertDescription>
          </Alert>
        )}

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
            {sortedTreatments.map((treatment) => {
              const compliance = complianceData[treatment.id];
              const isCompliant = compliance?.compliant !== false;
              
              return (
                <div key={treatment.id} className={`bg-white border rounded-lg overflow-hidden ${
                  isCompliant ? 'border-garden-light/20' : 'border-yellow-400'
                }`}>
                  <div className="flex flex-col lg:flex-row">
                    {/* Treatment Header */}
                    <div className="lg:w-1/3 p-4 bg-garden-light/10">
                      <div className="flex flex-row lg:flex-col justify-between">
                        <div>
                          <div className="flex gap-2 mb-2">
                            <Badge className={
                              treatment.type === 'organic' ? 'bg-garden-light text-garden-dark' : 
                              treatment.type === 'chemical' ? 'bg-yellow-500 text-white' : 
                              'bg-blue-500 text-white'
                            }>
                              {treatment.type.charAt(0).toUpperCase() + treatment.type.slice(1)}
                            </Badge>
                            
                            {compliance && (
                              <Badge variant={isCompliant ? 'default' : 'destructive'}>
                                <Shield className="h-3 w-3 mr-1" />
                                {isCompliant ? 'Compliant' : 'Check Required'}
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-semibold text-garden-dark">
                            {treatment.name}
                          </h3>
                        </div>
                        
                        <div className="mt-2 lg:mt-4">
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

                      {compliance?.permitRequired && (
                        <div className="mt-2 text-xs bg-yellow-100 border border-yellow-300 p-2 rounded">
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="h-3 w-3 text-yellow-600" />
                            <strong className="text-yellow-800">Permit Required</strong>
                          </div>
                          <p className="text-yellow-700">{compliance.permitType}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Treatment Instructions */}
                    <div className="lg:w-2/3 p-4">
                      {/* Compliance Warnings */}
                      {compliance && (compliance.warnings.length > 0 || compliance.requirements.length > 0) && (
                        <Alert className="mb-4 border-yellow-200 bg-yellow-50">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <AlertTitle className="text-yellow-800">Compliance Notice</AlertTitle>
                          <AlertDescription className="text-yellow-700">
                            {compliance.warnings.length > 0 && (
                              <div className="mb-2">
                                <strong>Warnings:</strong>
                                <ul className="list-disc list-inside mt-1">
                                  {compliance.warnings.map((warning, i) => (
                                    <li key={i} className="text-sm">{warning}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {compliance.requirements.length > 0 && (
                              <div>
                                <strong>Requirements:</strong>
                                <ul className="list-disc list-inside mt-1">
                                  {compliance.requirements.map((req, i) => (
                                    <li key={i} className="text-sm">{req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </AlertDescription>
                        </Alert>
                      )}

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
                        {treatment.apvmaNumber && (
                          <Button 
                            size="sm"
                            variant="outline"
                            asChild
                          >
                            <a
                              href={`https://portal.apvma.gov.au/pubcris/${treatment.apvmaNumber}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              APVMA Label
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </Button>
                        )}
                        
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

                      {compliance?.contactInformation && compliance.permitRequired && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                          <div className="font-medium text-blue-800 mb-1">Permit Contact Information:</div>
                          <div className="text-blue-700">{compliance.contactInformation}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}