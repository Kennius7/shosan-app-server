const { signInWithEmailAndPassword } = require("firebase/auth");
const { db, auth } = require("../FirebaseConfig.js");
const { useAuthState } = require("react-firebase-hooks/auth");



require('dotenv').config();

const admin = require("firebase-admin");

// const serviceAccount = require("../shosan-acodemia-app-firebase-adminsdk-y3xc9-5128ebd3c2.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_SERVICE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
        databaseURL: 'https://shosan-acodemia-app.firebaseio.com', // Replace with your database URL
    });
}
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });


async function verifyToken(idToken) {
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
    const [ currentlyLoggedInUser ] = useAuthState(auth);
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.status(200).end();
        return;
    }

    if (!idToken) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }


    // Signing In Block
    if (req.method === "POST") {
        try {
            const { email, password } = req.body;
            const newUser = await signInWithEmailAndPassword(auth, email, password);
    
            const message = email || password 
            ? `Welcome, ${newUser?.user?.displayName.split(" ")[0]}` : "Welcome, guest";
    
            res.status(200).json({ message: message });
            console.log(message);
        } catch (error) {
            res.json({ error: `Error: ${error.message}` });
        }
    } else res.status(405).json({ error: "Method not allowed" });


    // Fetching User Data Block
    if (req.method === "GET") {
        try {
            // const userEmail = currentlyLoggedInUser?.email;
            const userData = await verifyToken(idToken);
            const userEmail = userData.email;
            console.log("Current User Email: ", userEmail);
            const q = query(collection(db, "User_Data"), where("email", "==", userEmail));
            const querySnapshot = await getDocs(q);
            const filteredData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Filtered Data: ", filteredData);
            const { name, email, number, batchNum, courseDetails, courseProgress, id } = filteredData[0];
            const fetchedData = {
                name: name, 
                email: email, 
                number: number, 
                batchNum: batchNum, 
                courseDetails: courseDetails, 
                courseProgress: courseProgress,
                id: id,
                currentlyLoggedInUser: currentlyLoggedInUser
            };


            res.status(200).json({ data: fetchedData, message: "Data was fetched successfully" });
            console.log(fetchedData);
        } catch (error) {
            res.json({ error: `Couldn't fetch Data. Error: ${error.message}` });
        }
    } else res.status(405).json({ error: "Method not allowed" });
}


