// Load environment variables from .env file
require('dotenv').config();

const admin = require('firebase-admin');

// Check if we have the required environment variables first
if (!process.env.GOOGLE_PROJECT_ID || !process.env.GOOGLE_PRIVATE_KEY) {
  console.log('⚠️  Missing Firebase service account credentials');
  console.log('\n📋 Quick setup options:');
  console.log('');
  console.log('Option 1: Manual setup in Firebase Console (Recommended)');
  console.log('1. Go to Firebase Console → Authentication → Users');
  console.log('2. Find user: ashishithape.ai@gmail.com');
  console.log('3. Click on the user');
  console.log('4. In "Custom claims" section, add: {"admin": true}');
  console.log('');
  console.log('Option 2: Environment variables');
  console.log('1. Download service account key from Firebase Console');
  console.log('2. Add credentials to .env file');
  console.log('3. Run: node scripts/setup-admin.js');
  console.log('');
  console.log('✅ The feedback system will work perfectly with Option 1!');
  process.exit(0);
}

// Initialize Firebase Admin (you'll need to add your service account key)
const serviceAccount = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  universe_domain: "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setupAdmin() {
  try {
    const adminEmail = 'ashishithape.ai@gmail.com';
    
    console.log('🔍 Looking up user:', adminEmail);
    
    // Get user by email
    let user;
    try {
      user = await admin.auth().getUserByEmail(adminEmail);
      console.log('✅ User found:', user.uid);
    } catch (error) {
      console.log('👤 User not found, creating...');
      user = await admin.auth().createUser({
        email: adminEmail,
        emailVerified: true,
      });
      console.log('✅ User created:', user.uid);
    }
    
    // Set admin custom claims
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
    });
    
    console.log('🎉 Admin status granted for:', adminEmail);
    console.log('📧 User can now access /admin/feedback');
    
    // Verify the claims were set
    const userRecord = await admin.auth().getUser(user.uid);
    console.log('✅ Custom claims:', userRecord.customClaims);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    
    if (error.code === 'auth/invalid-credential') {
      console.log('\n📋 To fix this:');
      console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
      console.log('2. Click "Generate new private key"');
      console.log('3. Add the credentials to your .env file');
      console.log('4. Or run this script with environment variables');
    }
    
    process.exit(1);
  }
}

setupAdmin(); 