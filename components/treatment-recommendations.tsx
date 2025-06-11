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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-garden-dark">
          <Shield className="h-5 w-5" />
          Treatment Recommendations
        </CardTitle>
      </CardHeader>
      
      <CardContent>


        {location && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Location-Optimized Recommendations</AlertTitle>
            <AlertDescription className="text-green-700">
              Treatments are tailored for {location.state} growing conditions and seasonal factors.
              {loading && ' Updating recommendations...'}
            </AlertDescription>
          </Alert>
        )}

        {sortedTreatments.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-garden-dark mb-2">
              No treatments available
            </h3>
            <p className="text-garden-medium">
              We couldn't find suitable treatments for this plant condition at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedTreatments.map((treatment) => {
              const compliance = complianceData[treatment.id];
              const isCompliant = compliance?.compliant !== false;
              
              return (
                <Card key={treatment.id} className="border-l-4 border-l-garden-medium hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row">
                    {/* Treatment Summary */}
                    <div className="lg:w-1/3 p-4 bg-garden-light/10 border-r border-garden-light/30">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-garden-dark text-lg leading-tight pr-2">
                              {treatment.name}
                            </h3>
                            <Badge 
                              variant={treatment.type === 'organic' ? 'secondary' : 'outline'}
                              className="flex-shrink-0 ml-2"
                            >
                              {treatment.type}
                            </Badge>
                          </div>
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
                            Estimated cost
                          </div>
                        </div>
                      </div>
                      
                      {treatment.apvmaNumber && (
                        <div className="mt-4 text-xs text-garden-medium bg-yellow-100 border border-yellow-300 p-2 rounded">
                          <div className="flex items-center gap-1 mb-1">
                            <AlertTriangle className="h-3 w-3 text-yellow-600" />
                            <strong className="text-yellow-800">Verify Registration</strong>
                          </div>
                          <p className="text-yellow-700">AI suggests: {treatment.apvmaNumber}</p>
                          <p className="text-yellow-700 text-xs mt-1">⚠️ Check actual registration status</p>
                        </div>
                      )}

                      {compliance?.permitRequired && (
                        <div className="mt-2 text-xs bg-yellow-100 border border-yellow-300 p-2 rounded">
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="h-3 w-3 text-yellow-600" />
                            <strong className="text-yellow-800">Permit May Be Required</strong>
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
                        AI-Generated Instructions
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
                            AI-Generated Safety Warnings
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
                              href={`https://portal.apvma.gov.au/pubcris`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              Verify APVMA Registration
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
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        
        {/* Professional Advice Notice */}
        <Alert className="mt-6 border-garden-medium/30 bg-garden-light/10">
          <Shield className="h-4 w-4 text-garden-medium" />
          <AlertTitle className="text-garden-dark">Seek Professional Advice</AlertTitle>
          <AlertDescription className="text-garden-medium text-sm">
            For accurate diagnosis and treatment recommendations, consult with:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Local agricultural extension officers</li>
              <li>Licensed pest control professionals</li>
              <li>Qualified horticulturists or agronomists</li>
              <li>Experienced garden center specialists</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}