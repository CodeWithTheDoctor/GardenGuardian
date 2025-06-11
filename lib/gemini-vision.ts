// Gemini 2.0 Flash Integration for Intelligent Plant Health Analysis
// Replaces Google Vision API with advanced AI plant diagnostics

import { GEMINI_VISION_ERRORS, throwConfigurationError } from './error-handling';

export interface GeminiAnalysisResult {
  plantHealth: 'healthy' | 'diseased' | 'stressed' | 'unknown';
  diagnosis: string;
  confidence: number;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  treatmentRecommendations: AustralianTreatment[];
  additionalNotes?: string;
  analysisTimestamp: string;
}

export interface AustralianTreatment {
  name: string;
  type: 'organic' | 'chemical' | 'cultural' | 'biological';
  description: string;
  application: string;
  timing: string;
  cost: string;
  availability: string;
  safetyNotes: string;
  bunningsAvailable: boolean;
  requiresVerification: boolean;
}

/**
 * Enhanced Gemini 2.0 Flash analysis with Australian expertise
 */
export async function analyzeImageWithGemini(
  imageFile: File,
  imageUrl: string
): Promise<GeminiAnalysisResult> {
  try {
    // Validate API key
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throwConfigurationError(GEMINI_VISION_ERRORS.NOT_CONFIGURED);
    }

    // Convert image to base64
    const base64ImageData = await fileToBase64(imageFile);

    // Enhanced prompt focusing on Australian conditions with clear disclaimers
    const expertPrompt = `You are an AI plant health assistant providing EDUCATIONAL SUGGESTIONS ONLY for Australian gardens. 

CRITICAL INSTRUCTIONS:
- Your analysis is for educational purposes only and is NOT a professional diagnosis
- DO NOT provide specific APVMA registration numbers (they must be verified independently)
- Always indicate that professional verification is required
- Focus on general treatment categories rather than specific products

Analyze this plant image and provide a structured JSON response:

{
  "plantHealth": "healthy|diseased|stressed|unknown",
  "diagnosis": "Clear identification of the issue or 'healthy plant'",
  "confidence": 85,
  "severity": "mild|moderate|severe",
  "description": "Detailed description of what you observe including symptoms, likely causes, and environmental factors relevant to Australian conditions",
  "treatmentRecommendations": [
    {
      "name": "General treatment category (e.g., 'Copper-based fungicide' not specific brands)",
      "type": "organic|chemical|cultural|biological",
      "description": "General description of treatment approach",
      "application": "General application method requiring professional guidance",
      "timing": "General timing recommendations",
      "cost": "Estimated cost range (e.g., '$15-25')",
      "availability": "General availability (e.g., 'Garden centers, agricultural suppliers')",
      "safetyNotes": "Important safety considerations and requirement for professional consultation",
      "bunningsAvailable": false,
      "requiresVerification": true
    }
  ],
  "additionalNotes": "Include disclaimer that this is AI-generated educational content requiring professional verification. Mention specific Australian considerations like climate zones, native pest patterns, or seasonal factors.",
  "analysisTimestamp": "${new Date().toISOString()}"
}

Focus on:
- Australian climate conditions and seasonal patterns
- Common Australian plant diseases and pests
- Environmentally responsible approaches suitable for Australian conditions
- Clear disclaimers about professional verification requirements
- General treatment categories rather than specific product recommendations

Provide 1-3 treatment options focusing on the most appropriate and environmentally responsible approaches for Australian conditions.

ALWAYS include disclaimers about professional verification and regulatory compliance requirements.`;

    // Make the API call to Gemini 2.0 Flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: expertPrompt },
            {
              inline_data: {
                mime_type: imageFile.type,
                data: base64ImageData
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.3,        // More conservative for safety-critical content
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Gemini API Error Response:', errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('🔍 Gemini Raw Response:', data);

    // Extract and parse the JSON response
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) {
      throw new Error('No content returned from Gemini API');
    }

    console.log('📝 Gemini Text Content:', textContent);

    // Parse JSON from the response
    let analysisResult: GeminiAnalysisResult;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                       textContent.match(/```\s*([\s\S]*?)\s*```/) ||
                       [null, textContent];
      
      const jsonString = jsonMatch[1] || textContent;
      analysisResult = JSON.parse(jsonString.trim());
      
      // Ensure all treatments require verification
      if (analysisResult.treatmentRecommendations) {
        analysisResult.treatmentRecommendations = analysisResult.treatmentRecommendations.map(treatment => ({
          ...treatment,
          requiresVerification: true,
          safetyNotes: treatment.safetyNotes + ' IMPORTANT: Verify product registration and consult agricultural professionals before use.'
        }));
      }

    } catch (parseError) {
      console.error('❌ JSON Parsing Error:', parseError);
      console.error('🔍 Raw text to parse:', textContent);
      throw new Error('Failed to parse Gemini response as JSON');
    }

    console.log('✅ Gemini Analysis Result:', analysisResult);
    return analysisResult;

  } catch (error) {
    console.error('❌ Gemini Vision Analysis Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throwConfigurationError(GEMINI_VISION_ERRORS.NOT_CONFIGURED);
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        throwConfigurationError(GEMINI_VISION_ERRORS.API_QUOTA_EXCEEDED);
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throwConfigurationError(GEMINI_VISION_ERRORS.NOT_CONFIGURED);
      }
    }
    
    // Re-throw for upstream handling
    throw error;
  }
}

/**
 * Convert File to base64 string
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data:image/jpeg;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

// Check if Gemini API is configured
export const isGeminiAPIConfigured = (): boolean => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  console.log('🔧 Gemini API Config Check:', {
    hasApiKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyPrefix: apiKey?.substring(0, 8) + '...' || 'none'
  });
  return !!apiKey;
};

// Get configuration status for UI display
export const getGeminiConfigurationStatus = () => {
  return {
    geminiAPI: isGeminiAPIConfigured(),
    configured: isGeminiAPIConfigured(),
    message: isGeminiAPIConfigured() 
      ? 'Using Gemini 2.0 Flash for intelligent plant health analysis with Australian treatment recommendations'
      : 'Gemini API not configured - intelligent plant analysis unavailable'
  };
}; 