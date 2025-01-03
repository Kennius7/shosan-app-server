
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
        console.log("Checking GET DATE Method...");
        try {
            const getDateRef = doc(db, "Current_Date", "date-document");
            const fetchDateData = await getDoc(getDateRef);
            const date = fetchDateData.data().date;
            console.log("Date: >>>>", date);
            return res.status(200).json({ success: true, date: date });
        } catch (error) {
            console.log("Error getting Date: >>>>", error);
            return res.status(404).json({ success: false, msg: "Date not found" });
        }
    }

      // Updating Date Block
    if (req.method === "POST") {
        const updatedDate = req.body.date;
        await setDoc(doc(db, "Current_Date", "date-document"), { date: updatedDate })
        .then(()=>{
            return res.status(200).json({ success: true, msg: "Date Updated Successfully" })
        })
        .catch((error)=>{
            return res.status(500).json({ success: false, msg: `Error updating Date: ${error}` })
        })
    }

    if (!['POST', 'GET', 'OPTIONS'].includes(req.method)) {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    console.log("End of checking...");
}


