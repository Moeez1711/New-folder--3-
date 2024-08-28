const otpService = require('../utils/otpService');
const admin = require('firebase-admin');
const serviceAccount = require('../../config/serviceAccountKey.json');
 
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://nfc-project-21b56-default-rtdb.firebaseio.com"
});

// Initialize Firestore
const db = admin.firestore();

async function sendOTP(req, res) {
    const { uid } = req.body;

    // Retrieve the user's email using the UID
    const userProfileRef = db.collection('users').doc(uid).collection('userProfile').doc('details');
    const doc = await userProfileRef.get();

    if (!doc.exists) {
        return res.status(404).json({ message: 'User profile not found' });
    }

    const email = doc.data().email;
    if (!email) {
        return res.status(400).json({ message: 'Email not found in user profile' });
    }

    const otp = otpService.generateOTP();
 
    // Store OTP in Firestore at the specific location
    await userProfileRef.set({ otp }, { merge: true });

    // Send OTP to user's email
    await otpService.sendOTPEmail(email, otp);
    res.status(200).json({ message: 'OTP sent' });
}

async function verifyOTP(req, res) {
    const { uid, otp } = req.body;

    // Retrieve OTP from Firestore
    const userProfileRef = db.collection('users').doc(uid).collection('userProfile').doc('details');
    const doc = await userProfileRef.get();

    if (doc.exists && doc.data().otp === otp) {
        res.status(200).json({ message: 'OTP verified' });
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
}

// async function resendOTP(req, res) { 
//     const { uid } = req.body;

//     // Retrieve the user's email using the UID
//     const userProfileRef = db.collection('users').doc(uid).collection('userProfile').doc('details');
//     const doc = await userProfileRef.get();

//     if (!doc.exists) {
//         return res.status(404).json({ message: 'User profile not found' });
//     }

//     const email = doc.data().email;
//     if (!email) {
//         return res.status(400).json({ message: 'Email not found in user profile' });
//     }

//     const otp = otpService.generateOTP();

//     // Update OTP in Firestore at the specific location
//     await userProfileRef.set({ otp }, { merge: true });

//     // Resend OTP to user's email
//     await otpService.sendOTPEmail(email, otp);
//     res.status(200).json({ message: 'OTP resent' });
// }

module.exports = { sendOTP, verifyOTP};
