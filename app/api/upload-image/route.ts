import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID!,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID!,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')!,
    client_email: process.env.GOOGLE_CLIENT_EMAIL!,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    auth_uri: process.env.GOOGLE_AUTH_URI!,
    token_uri: process.env.GOOGLE_TOKEN_URI!,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL!,
    client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL!,
    universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN!
  } as const;

  initializeApp({
    credential: cert(serviceAccount as any),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'gardenguardian-ai-storage'
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const diagnosisId = formData.get('diagnosisId') as string;
    const userId = formData.get('userId') as string || 'demo-user-001';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!diagnosisId) {
      return NextResponse.json({ error: 'No diagnosis ID provided' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get Firebase Admin Storage
    const storage = getStorage();
    const bucket = storage.bucket();

    // Create file path
    const fileName = `diagnosis-images/${userId}/${diagnosisId}`;
    const fileRef = bucket.file(fileName);

    // Upload the file
    await fileRef.save(buffer, {
      metadata: {
        contentType: file.type,
      },
      public: true, // Make the file publicly readable
    });

    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    console.log('✅ Image uploaded successfully:', publicUrl);

    return NextResponse.json({ 
      success: true, 
      imageUrl: publicUrl,
      fileName: fileName
    });

  } catch (error) {
    console.error('🚨 Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 