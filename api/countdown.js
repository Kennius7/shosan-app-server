
const { doc, getDoc, setDoc } = require("firebase/firestore");
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

    // Fetching Date Block
    if (req.method === "GET") {
        const getDateRef = doc(db, "Current_Date", "date-document");
        const fetchDateData = await getDoc(getDateRef);
        if (fetchDateData.data().date) {
            res.status(200).json({ success: true, date: fetchDateData.data().date.toString() });
        } else {
            res.status(404).json({ success: false, msg: "Date not found" });
        }
    }

      // Updating Date Block
    if (req.method === "POST") {
        const updatedDate = req.body.date;
        await setDoc(doc(db, "Current_Date", "date-document"), { date: updatedDate })
        .then(()=>{
            res.status(200).json({ success: true, msg: "Date Updated Successfully" })
        })
        .catch((error)=>{
            res.status(500).json({ success: false, msg: `Error updating Date: ${error}` })
        })
    }

    if (req.method !== 'POST' || req.method !== 'GET' || req.method !== 'OPTIONS') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}


