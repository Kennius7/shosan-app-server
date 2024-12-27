const { signInWithEmailAndPassword } = require("firebase/auth");
const { db, auth } = require("../FirebaseConfig.js");
const { useAuthState } = require("react-firebase-hooks/auth");



export default async function handler(req, res) {
    console.log("Checking...");
    const [ currentlyLoggedInUser ] = useAuthState(auth);

    if (req.method === "OPTIONS") {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.status(200).end();
        return;
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
            const userEmail = currentlyLoggedInUser?.email;
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
            res.json({ error: `Error: ${error.message}` });
        }
    } else res.status(405).json({ error: "Method not allowed" });
}


