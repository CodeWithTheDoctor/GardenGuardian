"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdminStatus = exports.setupAdmin = exports.setAdminStatus = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
// Cloud Function to set admin status for specific users
exports.setAdminStatus = functions.https.onCall(async (data, context) => {
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
    }
    catch (error) {
        console.error('Error setting admin status:', error);
        throw new functions.https.HttpsError('internal', 'Unable to set admin status');
    }
});
// Cloud Function to automatically set admin status for the main admin email
exports.setupAdmin = functions.https.onRequest(async (req, res) => {
    try {
        const adminEmail = 'ashishithape.ai@gmail.com';
        // Check if user exists, if not create them
        let user;
        try {
            user = await admin.auth().getUserByEmail(adminEmail);
        }
        catch (error) {
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
    }
    catch (error) {
        console.error('Error setting up admin:', error);
        res.status(500).json({
            success: false,
            error: 'Unable to setup admin user'
        });
    }
});
// Cloud Function to check if user is admin
exports.checkAdminStatus = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        return { isAdmin: false };
    }
    const isAdmin = context.auth.token.admin === true;
    return { isAdmin, uid: context.auth.uid };
});
//# sourceMappingURL=index.js.map