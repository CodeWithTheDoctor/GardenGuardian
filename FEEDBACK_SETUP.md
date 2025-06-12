# 🌱 GardenGuardian AI - Feedback System Setup Guide

This guide will walk you through setting up the complete feedback system with Firebase Cloud Functions and SendGrid email notifications.

## 📋 Prerequisites

1. **Firebase Project** - Already configured with Firestore
2. **Firebase Blaze Plan** - Required for Cloud Functions (pay-as-you-go, free tier available)
3. **SendGrid Account** - For email notifications
4. **Node.js 18+** - For Firebase Functions
5. **Firebase CLI** - For deployment

### ⚠️ Important: Firebase Blaze Plan Required

Firebase Cloud Functions require the **Blaze (pay-as-you-go) plan**. The good news:

- **Free tier included**: 2 million function invocations per month
- **Feedback system usage**: Very minimal cost (likely free)
- **Upgrade at**: <https://console.firebase.google.com/project/gardenguardian-de65c/usage/details>

### Alternative: No Cloud Functions Setup

If you prefer not to upgrade, the feedback system will still work with:

- ✅ **Frontend components** - Feedback collection works perfectly
- ✅ **Firestore storage** - All feedback saved to database
- ✅ **Admin dashboard** - Full feedback viewing capability
- ❌ **Email notifications** - Manual checking via admin dashboard

## 🚀 Quick Setup

### Option A: Full Setup (with Email Notifications) - Requires Blaze Plan

### 1. Upgrade Firebase Plan

Visit: <https://console.firebase.google.com/project/gardenguardian-de65c/usage/details>

- Click "Modify Plan"
- Select "Blaze (Pay as you go)"
- Note: Functions have generous free tier (2M invocations/month)

### 2. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
firebase login
```

### 2. Initialize Firebase Functions

```bash
# From your project root
firebase init functions

# Select:
# - Use existing project (your GardenGuardian project)
# - TypeScript
# - ESLint: Yes
# - Install dependencies: Yes
```

### 3. Set SendGrid Configuration

```bash
# Set your SendGrid API key in Firebase Functions config
firebase functions:config:set sendgrid.api_key="***REMOVED***"

# Verify the configuration
firebase functions:config:get
```

### 4. Deploy Functions

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

### 5. Set Up Admin User

After deployment, make a GET request to set up the admin user:

```bash
# Replace YOUR_PROJECT_ID with your actual Firebase project ID
curl https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com/setupAdmin
```

Or visit the URL in your browser:

```
https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com/setupAdmin
```

### Option B: Frontend-Only Setup (No Email Notifications)

If you prefer not to upgrade Firebase now, you can still use the complete feedback system:

### 1. Deploy Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 2. Set Admin Status Manually

In Firebase Console → Authentication → Users:

1. Find your user (`ashishithape.ai@gmail.com`)
2. Click on the user
3. In "Custom claims" section, add:

   ```json
   {"admin": true}
   ```

### 3. Access Admin Dashboard

- Frontend feedback system: ✅ Fully functional
- Firestore storage: ✅ All feedback saved
- Admin dashboard: ✅ Available at `/admin/feedback`
- Email notifications: ❌ Manual dashboard checking instead

## 📧 Email Configuration (Blaze Plan Only)

### SendGrid Setup

1. **Verify Sender Email**:
   - Go to SendGrid Dashboard → Settings → Sender Authentication
   - Verify `noreply@gardenguardian.com.au` (or your domain)
   - Update the `from` field in `functions/src/index.ts` if needed

2. **Email Template** (Optional):
   - The function uses inline HTML, but you can create SendGrid templates
   - Update the function to use template IDs if preferred

## 🔐 Admin Access

### Setting Admin Status

The admin email `ashishithape.ai@gmail.com` is automatically granted admin access when you run the `setupAdmin` function.

### Access Admin Dashboard

1. Log in with the admin email
2. Navigate to `/admin/feedback`
3. View all feedback and statistics

### Manual Admin Setup (if needed)

If you need to grant admin access to additional users:

```javascript
// Call this from your app or Firebase Console
import { httpsCallable } from 'firebase/functions';

const setAdminStatus = httpsCallable(functions, 'setAdminStatus');
setAdminStatus({
  email: 'another-admin@example.com',
  isAdmin: true
});
```

## 📱 Feedback Triggers

### Current Implementation

The feedback system is automatically integrated into:

1. **Diagnosis Complete Page** - Shows after 5 seconds on `/diagnosis/[id]`
2. **Share/Save Actions** - Can be triggered manually
3. **Exit Intent** - Available for other pages

### Adding More Triggers

Add the `ContextualFeedback` component to any page:

```tsx
import { ContextualFeedback } from '@/components/contextual-feedback';

// In your component JSX
<ContextualFeedback
  context="page-name"
  trigger="delayed"
  delay={3000}
/>
```

### Manual Triggers

Trigger feedback programmatically:

```javascript
// Trigger feedback after a specific action
const triggerFeedback = () => {
  window.dispatchEvent(new CustomEvent('trigger-feedback', { 
    detail: { context: 'custom-action' } 
  }));
};
```

## 📊 Feedback Data Structure

### Firestore Collection: `feedback`

```typescript
{
  id: string;           // Auto-generated document ID
  rating: 1-5;          // Emoji rating
  context: string;      // Where feedback was given
  page: string;         // Page URL
  diagnosisId?: string; // Related diagnosis (if applicable)
  message?: string;     // Optional user message
  email?: string;       // Optional contact email
  userId: string;       // Firebase user ID or 'anonymous'
  userEmail?: string;   // User's login email (if authenticated)
  userAgent: string;    // Browser info
  timestamp: Date;      // When feedback was given
  createdAt: Timestamp; // Firestore timestamp
}
```

## 🚨 Troubleshooting

### Functions Not Triggering

1. **Check Function Logs**:

   ```bash
   firebase functions:log
   ```

2. **Verify Firestore Rules**:
   Ensure your Firestore rules allow writing to the `feedback` collection:

   ```javascript
   // In firestore.rules
   match /feedback/{document} {
     allow read, write: if true; // Or your specific rules
   }
   ```

### SendGrid Issues

1. **Verify API Key**:

   ```bash
   firebase functions:config:get sendgrid
   ```

2. **Check Sender Authentication**:
   - Ensure your sender email is verified in SendGrid
   - Update the `from` field in the function if needed

3. **Check SendGrid Activity**:
   - Go to SendGrid Dashboard → Activity
   - Look for failed deliveries or bounces

### Admin Access Issues

1. **Check Custom Claims**:

   ```javascript
   // In Firebase Console → Authentication → Users
   // Click on user → Custom claims should show {"admin": true}
   ```

2. **Force Token Refresh**:

   ```javascript
   // In your app
   await auth.currentUser?.getIdToken(true);
   ```

### Feedback Not Showing

1. **Check Local Storage**:
   - Clear `feedback-*` keys in localStorage to reset cooldown
   - Or test in incognito mode

2. **Verify Component Import**:

   ```tsx
   import { ContextualFeedback } from '@/components/contextual-feedback';
   ```

## 📈 Analytics & Monitoring

### View Feedback Stats

1. **Admin Dashboard**: `/admin/feedback`
2. **Firebase Console**: Firestore → `feedback` collection
3. **SendGrid Analytics**: Dashboard → Activity

### Export Feedback Data

```javascript
// From Firebase Console or custom script
const feedback = await getDocs(collection(db, 'feedback'));
const data = feedback.docs.map(doc => ({ id: doc.id, ...doc.data() }));
console.log(JSON.stringify(data, null, 2));
```

## 🔄 Updates & Maintenance

### Update Functions

```bash
cd functions
npm run build
firebase deploy --only functions
```

### Update Frontend Components

The feedback components are in:

- `hooks/use-feedback.ts`
- `components/ui/feedback-drawer.tsx`
- `components/contextual-feedback.tsx`

Changes to these files are deployed with your Next.js app (no separate deployment needed).

## 🎯 Success Metrics

After setup, you should see:

1. ✅ Feedback drawer appears on diagnosis pages
2. ✅ Email notifications sent to `ashishithape.ai@gmail.com`
3. ✅ Admin dashboard accessible at `/admin/feedback`
4. ✅ Feedback data stored in Firestore
5. ✅ Admin user has proper custom claims

## 📞 Support

If you encounter issues:

1. Check Firebase Console logs
2. Verify SendGrid activity
3. Test in incognito mode to bypass localStorage cooldowns
4. Ensure all environment variables are set correctly

The feedback system is now fully operational and will help you gather valuable user insights to improve GardenGuardian AI! 🌱
