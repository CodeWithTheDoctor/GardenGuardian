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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-3 md:p-4">
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 px-2">
          <h1 className="text-2xl md:text-3xl font-bold text-green-800">APVMA Compliance Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600">Real-time Australian chemical registration data and weather-based recommendations</p>
        </div>

        <Tabs defaultValue="search" className="space-y-4 md:space-y-6">
          {/* Mobile-friendly tabs */}
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="search" className="flex flex-col gap-1 py-3 px-2 text-xs md:text-sm">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Product Search</span>
              <span className="sm:hidden">Search</span>
            </TabsTrigger>
            <TabsTrigger value="weather" className="flex flex-col gap-1 py-3 px-2 text-xs md:text-sm">
              <Cloud className="h-4 w-4" />
              <span className="hidden sm:inline">Weather Conditions</span>
              <span className="sm:hidden">Weather</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex flex-col gap-1 py-3 px-2 text-xs md:text-sm">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Compliance Check</span>
              <span className="sm:hidden">Compliance</span>
            </TabsTrigger>
          </TabsList>

          {/* Product Search Tab */}
          <TabsContent value="search">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Search className="h-5 w-5" />
                  APVMA Product Database Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mobile-friendly search layout */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Search for chemicals (e.g., copper, pyrethrum)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={searchProducts} 
                    disabled={loading}
                    className="w-full sm:w-auto px-6"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm md:text-base">
                      Search Results ({searchResults.length} products found)
                    </h3>
                    <div className="grid gap-3 md:gap-4">
                      {searchResults.map((product) => (
                        <Card key={product.id} className="border-l-4 border-l-green-500 shadow-sm">
                          <CardContent className="pt-4 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                              <h4 className="font-semibold text-base md:text-lg pr-2">{product.productName}</h4>
                              <Badge variant="outline" className="bg-green-50 text-xs whitespace-nowrap self-start">
                                {product.registrationNumber}
                              </Badge>
                            </div>
                            
                            <div className="grid gap-3 md:grid-cols-2 text-sm">
                              <div className="space-y-2">
                                <p><strong>Registration Holder:</strong> {product.registrationHolder}</p>
                                <p className="flex items-center gap-2">
                                  <strong>Status:</strong> 
                                  <Badge variant={product.registrationStatus === 'Active' ? 'default' : 'secondary'} className="text-xs">
                                    {product.registrationStatus}
                                  </Badge>
                                </p>
                                <p><strong>Product Type:</strong> {product.productType}</p>
                              </div>
                              
                              <div className="space-y-2">
                                <p><strong>Active Constituents:</strong></p>
                                <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                                  {product.activeConstituents.map((constituent, index) => (
                                    <li key={index}>{constituent}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {product.restrictions && product.restrictions.length > 0 && (
                              <Alert className="bg-yellow-50 border-yellow-200">
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                <AlertDescription className="text-sm">
                                  <strong>Restrictions:</strong> {product.restrictions.join(', ')}
                                </AlertDescription>
                              </Alert>
                            )}

                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.open(`https://portal.apvma.gov.au/pubcris/${product.registrationNumber}`, '_blank')}
                                className="w-full sm:w-auto"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                View Label
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => getSprayRecommendation(product.productName)}
                                className="w-full sm:w-auto"
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
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm">
                      No products found. Try searching for common chemicals like "copper", "pyrethrum", or "glyphosate".
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weather Conditions Tab */}
          <TabsContent value="weather">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Cloud className="h-5 w-5" />
                  Spray Weather Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mobile-friendly weather search */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    placeholder="Enter postcode (e.g., 2000)"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={loadWeatherData} 
                    disabled={weatherLoading}
                    className="w-full sm:w-auto px-6"
                  >
                    {weatherLoading ? 'Loading...' : 'Get Forecast'}
                  </Button>
                </div>

                {weather.length > 0 && (
                  <div className="space-y-3 md:space-y-4">
                    {weather.map((forecast, index) => (
                      <Card key={index} className={`border-l-4 shadow-sm ${
                        forecast.sprayConditions === 'excellent' ? 'border-l-green-500' :
                        forecast.sprayConditions === 'good' ? 'border-l-blue-500' :
                        forecast.sprayConditions === 'marginal' ? 'border-l-yellow-500' :
                        'border-l-red-500'
                      }`}>
                        <CardContent className="pt-4 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div>
                              <h3 className="font-semibold text-base">{forecast.location}</h3>
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
                            } className="text-xs whitespace-nowrap self-start">
                              {forecast.sprayConditions.toUpperCase()} CONDITIONS
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-4 w-4 text-orange-500 flex-shrink-0" />
                              <span className="truncate">{forecast.temperature.min}°C - {forecast.temperature.max}°C</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Wind className="h-4 w-4 text-blue-500 flex-shrink-0" />
                              <span className="truncate">{forecast.windSpeed}km/h {forecast.windDirection}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Droplets className="h-4 w-4 text-blue-600 flex-shrink-0" />
                              <span className="truncate">{forecast.humidity}% humidity</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Cloud className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              <span className="truncate">{forecast.rainfallProbability}% rain</span>
                            </div>
                          </div>

                          {forecast.warnings.length > 0 && (
                            <Alert className="bg-yellow-50 border-yellow-200">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <AlertDescription className="text-sm">
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
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Shield className="h-5 w-5" />
                  Compliance Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="grid gap-4">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-sm">
                      <strong>Real-time APVMA Integration Active</strong><br />
                      This dashboard connects to live Australian government databases to ensure compliance with current regulations.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-green-200 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base md:text-lg">Data Sources</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>APVMA PubCRIS Database</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>Bureau of Meteorology</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>State Agriculture Departments</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base md:text-lg">Compliance Features</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span>Registration verification</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span>Weather-based recommendations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                          <span>State-specific restrictions</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-sm">
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