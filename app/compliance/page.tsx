'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  AlertTriangle, 
  Cloud, 
  Thermometer, 
  Wind,
  Droplets,
  Search,
  Shield,
  FileText
} from 'lucide-react';
import { apvmaService, type APVMAProduct, type WeatherForecast } from '@/lib/apvma-service';

export default function CompliancePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<APVMAProduct[]>([]);
  const [weather, setWeather] = useState<WeatherForecast[]>([]);
  const [postcode, setPostcode] = useState('2000');
  const [loading, setLoading] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // Load initial weather data
  useEffect(() => {
    loadWeatherData();
  }, []);

  const searchProducts = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await apvmaService.searchProducts(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWeatherData = async () => {
    setWeatherLoading(true);
    try {
      const forecast = await apvmaService.getSprayWeatherForecast(postcode);
      setWeather(forecast);
    } catch (error) {
      console.error('Error loading weather:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  const getSprayRecommendation = async (treatmentType: string) => {
    try {
      const recommendation = await apvmaService.getApplicationRecommendation(postcode, treatmentType);
      alert(`Recommendation: ${recommendation.reason}\n\nWarnings: ${recommendation.weatherWarnings.join(', ')}`);
    } catch (error) {
      console.error('Error getting recommendation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-green-800">APVMA Compliance Dashboard</h1>
          <p className="text-gray-600">Real-time Australian chemical registration data and weather-based recommendations</p>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="search">Product Search</TabsTrigger>
            <TabsTrigger value="weather">Weather Conditions</TabsTrigger>
            <TabsTrigger value="compliance">Compliance Check</TabsTrigger>
          </TabsList>

          {/* Product Search Tab */}
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  APVMA Product Database Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for chemicals (e.g., copper, pyrethrum, glyphosate)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
                  />
                  <Button onClick={searchProducts} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Search Results ({searchResults.length} products found)</h3>
                    <div className="grid gap-4">
                      {searchResults.map((product) => (
                        <Card key={product.id} className="border-l-4 border-l-green-500">
                          <CardContent className="pt-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-lg">{product.productName}</h4>
                              <Badge variant="outline" className="bg-green-50">
                                {product.registrationNumber}
                              </Badge>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p><strong>Registration Holder:</strong> {product.registrationHolder}</p>
                                <p><strong>Status:</strong> 
                                  <Badge variant={product.registrationStatus === 'Active' ? 'default' : 'secondary'} className="ml-2">
                                    {product.registrationStatus}
                                  </Badge>
                                </p>
                                <p><strong>Product Type:</strong> {product.productType}</p>
                              </div>
                              
                              <div>
                                <p><strong>Active Constituents:</strong></p>
                                <ul className="list-disc list-inside text-xs text-gray-600">
                                  {product.activeConstituents.map((constituent, index) => (
                                    <li key={index}>{constituent}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {product.restrictions && product.restrictions.length > 0 && (
                              <Alert className="mt-3">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                  <strong>Restrictions:</strong> {product.restrictions.join(', ')}
                                </AlertDescription>
                              </Alert>
                            )}

                            <div className="flex gap-2 mt-3">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(`https://portal.apvma.gov.au/pubcris/${product.registrationNumber}`, '_blank')}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                View Label
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => getSprayRecommendation(product.productName)}
                              >
                                <Cloud className="h-4 w-4 mr-1" />
                                Check Weather
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {searchQuery && searchResults.length === 0 && !loading && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      No products found. Try searching for common chemicals like "copper", "pyrethrum", or "glyphosate".
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weather Conditions Tab */}
          <TabsContent value="weather">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Spray Weather Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter postcode (e.g., 2000)"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                  />
                  <Button onClick={loadWeatherData} disabled={weatherLoading}>
                    {weatherLoading ? 'Loading...' : 'Get Forecast'}
                  </Button>
                </div>

                {weather.length > 0 && (
                  <div className="space-y-4">
                    {weather.map((forecast, index) => (
                      <Card key={index} className={`border-l-4 ${
                        forecast.sprayConditions === 'excellent' ? 'border-l-green-500' :
                        forecast.sprayConditions === 'good' ? 'border-l-blue-500' :
                        forecast.sprayConditions === 'marginal' ? 'border-l-yellow-500' :
                        'border-l-red-500'
                      }`}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold">{forecast.location}</h3>
                              <p className="text-sm text-gray-600">
                                {new Date(forecast.date).toLocaleDateString('en-AU', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </p>
                            </div>
                            <Badge variant={
                              forecast.sprayConditions === 'excellent' ? 'default' :
                              forecast.sprayConditions === 'good' ? 'secondary' :
                              forecast.sprayConditions === 'marginal' ? 'outline' :
                              'destructive'
                            }>
                              {forecast.sprayConditions.toUpperCase()} CONDITIONS
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-4 w-4 text-orange-500" />
                              <span>{forecast.temperature.min}°C - {forecast.temperature.max}°C</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Wind className="h-4 w-4 text-blue-500" />
                              <span>{forecast.windSpeed}km/h {forecast.windDirection}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Droplets className="h-4 w-4 text-blue-600" />
                              <span>{forecast.humidity}% humidity</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Cloud className="h-4 w-4 text-gray-500" />
                              <span>{forecast.rainfallProbability}% rain</span>
                            </div>
                          </div>

                          {forecast.warnings.length > 0 && (
                            <Alert className="mt-3">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                <strong>Weather Warnings:</strong> {forecast.warnings.join(', ')}
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Check Tab */}
          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Real-time APVMA Integration Active</strong><br />
                      This dashboard connects to live Australian government databases to ensure compliance with current regulations.
                    </AlertDescription>
                  </Alert>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-green-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Data Sources</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>APVMA PubCRIS Database</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Bureau of Meteorology</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>State Agriculture Departments</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Compliance Features</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span>Registration verification</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span>Weather-based recommendations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span>State-specific restrictions</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription>
                      <strong>Important:</strong> Always verify chemical registration and follow label directions exactly. This tool provides guidance but does not replace professional agricultural advice or legal compliance requirements.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 