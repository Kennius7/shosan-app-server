const { signInWithEmailAndPassword } = require("firebase/auth");
const { auth } = require("../FirebaseConfig.js");
const jwt = require("jsonwebtoken");

require('dotenv').config();


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



export default async function handler(req, res) {
    console.log("Checking...");
    
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

    if (req.method === "OPTIONS") {
        res.status(200).end();
        console.log("Checking OPTIONS Method...", res.statusCode);
        return;
    }
    
    // Signing In Block
    if (req.method === "POST") {
        // ✅ Debug Firebase Auth instance
        console.log("Auth Instance: ", auth);

        console.log("Firebase Admin Config: ", {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_SERVICE_PRIVATE_KEY ? "Loaded" : "Missing",
        });
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                console.log("Missing email or password");
                return res.status(400).json({ error: "Email and password are required" });
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user) {
                return res.status(401).json({ error: "Invalid email or password" });
            }
            // const userInfo = { email: email };
            const userInfo = { email: user.email, uid: user.uid };
            const token = jwt.sign(userInfo, shosanAppSecretKey, { expiresIn: "1h" });
            console.log("Token: >>>", token, "User Info: >>>", userInfo);

            // const newUser = await signInWithEmailAndPassword(auth, email, password);
            // console.log("Logged In User:>>>>>", newUser,);
            const message = `Welcome, ${user?.displayName.split(" ")[0]}`;
            console.log(message);
            return res.status(200).json({ message: message, token: token });
        } catch (error) {
            console.log("Checking POST Method ERROR...", res.statusCode, error);
            console.error("Firebase Auth Error:", error.message);
            
            // Handle specific Firebase Auth errors
            if (error.code === "auth/invalid-credential") {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            return res.status(500).json({ error: `Authentication failed: ${error.message}` });
            // return res.json({ error: `Error: ${error.message}` });
        }
    }

    if (!['POST', 'GET', 'OPTIONS'].includes(req.method)) {
        console.log("Checking NO METHOD SELECTED...", res.statusCode);
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}


