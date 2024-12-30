const { signInWithEmailAndPassword } = require("firebase/auth");
const { db, auth } = require("../FirebaseConfig.js");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

require('dotenv').config();


// const secretKey = crypto.randomBytes(32).toString("hex");
// console.log("Secret Key: >>>>", secretKey);
const shosanAppSecretKey = process.env.SHOSAN_APP_SECRET_KEY;

const admin = require("firebase-admin");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_SERVICE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        databaseURL: 'https://shosan-acodemia-app.firebaseio.com',
    });
}


async function verifyToken(idToken) {

    if (!idToken || typeof idToken !== 'string') {
        throw new Error('Invalid or missing token');
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userRecord = await admin.auth().getUser(decodedToken.uid);

        return {
            userId: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            photoURL: userRecord.photoURL,
        };
    } catch (error) {
        console.error('Error verifying token:', error);
        throw new Error('Invalid token');
    }
}


export default async function handler(req, res) {
    console.log("Checking...");

    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.status(200).end();
        console.log("Checking OPTIONS Method...", res.statusCode);
        return;
    }

    
    // const authHeader = req.headers.authorization;
    
    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
        //     console.log("Checking AUTHHEADER...", res.statusCode);
        //     return res.status(401).json({ success: false, message: 'Unauthorized: Missing or malformed token' });
        // }
        
        // const idToken = authHeader.split('Bearer ')[1];
        
        // console.log("ID Token :>>>>", idToken);
        
        
        // Signing In Block
        if (req.method === "POST") {
            try {
                const { email, password } = req.body;
                const userInfo = { email: email };
                const token = jwt.sign(userInfo, shosanAppSecretKey, { expiresIn: "1h" });
                console.log("Token: >>>", token);
                
                const newUser = await signInWithEmailAndPassword(auth, email, password);
                
                const message = email || password 
                ? `Welcome, ${newUser?.user?.displayName.split(" ")[0]}` : "Welcome, guest";
                
                console.log(message);
                return res.status(200).json({ message: message, token: token });
            } catch (error) {
                console.log("Checking POST Method ERROR...", res.statusCode);
                return res.json({ error: `Error: ${error.message}` });
            }
        }

        if (req.method !== 'POST' || req.method !== 'GET' || req.method !== 'OPTIONS') {
            console.log("Checking NO METHOD SELECTED...", res.statusCode);
            return res.status(405).json({ success: false, message: 'Method not allowed' });
        }
}


