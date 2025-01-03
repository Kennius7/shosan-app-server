
const { getAuth, updateProfile, createUserWithEmailAndPassword } = require("firebase/auth");
const { collection, addDoc } = require("firebase/firestore");
const { db } = require("../FirebaseConfig.js");

require('dotenv').config();



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
        try {
            const { name, email, number, password, batchNum, courseDetails, courseProgress } = req.body;
            const authInstance = getAuth();
            const newUser = await createUserWithEmailAndPassword(authInstance, email, password);
            await updateProfile(newUser.user, { displayName: name });
            await addDoc(
                collection(db, "User_Data"), 
                { name, email, number, password, batchNum, courseDetails, courseProgress }
            );
            // console.log(newUser);
            const message = `Successfully signed up, ${newUser?.user?.displayName.split(" ")[0]}`;
            console.log(message);
            return res.status(200).json({ success: true, message: message });
        } catch (error) {
            console.log("Checking POST Method ERROR...", res.statusCode);

            if (error.code === "auth/email-already-in-use") {
                console.log(error.code);
                return res.status(500).json({ error: `Error: ${error.message}` });
            } else {
                console.log(error.code);
                return res.status(500).json({ error: `Error: ${error.message}` });
            }
        }
    }

    if (!['POST', 'GET', 'OPTIONS'].includes(req.method)) {
        console.log("Checking NO METHOD SELECTED...", res.statusCode);
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}



