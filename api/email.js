const nodemailer = require('nodemailer');
require('dotenv').config();



// Configure the email transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., 'gmail'
    auth: {
        user: 'shosanacodemia@gmail.com',
        pass: 'mgkr dhey vfry zdrc',
    },
    tls: {
        rejectUnauthorized: false, // Bypass SSL certificate validation
    },
});

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

      // Sending Email Block
    if (req.method === "POST") {
        const formData = req.body;
        console.log(formData);
        const subject = "Shosan Code Hub Emails";
        const htmlEmail = `
            <html>
                <body>
                <p>${formData.name} just registered for the upcoming ${formData.courses} Online Class.</p>
                <p>His/Her Phone/WhatSapp number is: ${formData.number}</p>
                <p>His/Her Email address is: ${formData.email}</p>
                </body>
            </html>
        `;
    
        const mailOptions = {
            from: 'shosanacodemia@gmail.com',
            to: 'shosanacodemia@gmail.com',
            subject: subject,
            html: htmlEmail,
        }
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).json({ 
                    success: false, 
                    timeoutMessage: "Error: Request Timed Out. Check your network and try again.",
                    errorMessage: "Error: Registration Failed.",
                });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ 
                success: true, 
                emailMessage: `Email sent successfully: ${info.response}`, 
                formMessage: 'Registration successful.'
                });
            }
        });
    }

    if (req.method !== 'POST' || req.method !== 'GET' || req.method !== 'OPTIONS') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}


