#!/bin/bash

# GardenGuardian AI - Environment Setup Template
# This script creates a template .env.local file
# NO ACTUAL API KEYS SHOULD BE IN THIS FILE

echo "🔐 Setting up GardenGuardian AI Environment Variables"
echo "=================================================="

# Create .env.local file with placeholders
cat > .env.local << 'EOF'
# GardenGuardian AI - Environment Variables
# Fill in your actual API keys below

# Gemini AI (Required for intelligent plant health analysis)
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here

# SendGrid (Required for email notifications)
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Firebase Configuration (Required for persistence, auth, community)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here

# Weather (Required for spray recommendations)
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key_here
EOF

echo "✅ Created .env.local template file"
echo "📝 Please edit .env.local and add your actual API keys"
echo "🔒 The .env.local file is already in .gitignore and will not be committed"
echo ""
echo "⚠️  IMPORTANT SECURITY STEPS:"
echo "1. Regenerate your compromised API keys immediately"
echo "2. Update the keys in .env.local"
echo "3. Never commit .env.local to git"
echo ""
echo "🚀 Next steps:"
echo "1. Edit .env.local with your actual keys"
echo "2. Test your application with the new keys"
