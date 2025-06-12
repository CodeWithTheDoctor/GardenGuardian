import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Cloud Function to set admin status for specific users
export const setAdminStatus = functions.https.onCall(async (data, context) => {
  // Only allow authenticated users
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  const { email, isAdmin } = data;
  
  try {
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // Set custom claims
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: isAdmin,
    });

    console.log(`Admin status ${isAdmin ? 'granted' : 'removed'} for user: ${email}`);
    return { success: true, message: `Admin status updated for ${email}` };
    
  } catch (error) {
    console.error('Error setting admin status:', error);
    throw new functions.https.HttpsError('internal', 'Unable to set admin status');
  }
});

// Cloud Function to automatically set admin status for the main admin email
export const setupAdmin = functions.https.onRequest(async (req, res) => {
  try {
    const adminEmail = 'ashishithape.ai@gmail.com';
    
    // Check if user exists, if not create them
    let user;
    try {
      user = await admin.auth().getUserByEmail(adminEmail);
    } catch (error) {
      // User doesn't exist, create them
      user = await admin.auth().createUser({
        email: adminEmail,
        emailVerified: true,
      });
    }
    
    // Set admin custom claims
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true,
    });

    res.json({ 
      success: true, 
      message: `Admin status granted for ${adminEmail}`,
      uid: user.uid
    });
    
  } catch (error) {
    console.error('Error setting up admin:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Unable to setup admin user' 
    });
  }
});

// Cloud Function to check if user is admin
export const checkAdminStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    return { isAdmin: false };
  }

  const isAdmin = context.auth.token.admin === true;
  return { isAdmin, uid: context.auth.uid };
}); 