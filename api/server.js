import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../FirebaseConfig.js";



export default async function handler(req, res) {
    console.log("Checking...");

    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.status(200).end();
        return;
    }

    if (req.method === "POST") {
        try {
            const { email, password } = req.body;
            const newUser = await signInWithEmailAndPassword(auth, email, password);
    
            const message = email || password 
            ? `Welcome, ${newUser?.user?.displayName.split(" ")[0]}` : "Welcome, guest";
    
            res.status(200).json({ message: message });
        } catch (error) {
            res.json({ error: `Error: ${error.message}` });
        }
    } else res.status(405).json({ error: "Method not allowed" });
}


