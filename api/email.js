const nodemailer = require('nodemailer');
require('dotenv').config();



const userEmail = process.env.NODEMAILER_USER_EMAIL;
const userPassword = process.env.NODEMAILER_USER_PASSWORD;

console.log(userEmail, userPassword);


const emailTransporter = (data, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // e.g., 'gmail'
        auth: {
            user: "shosanacodemia@gmail.com",
            pass: "mgkr dhey vfry zdrc",
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const htmlEmail = `
        <html>
            <body>
                <p>${data.name} just sent an email.</p>
                <p>Phone/WhatSapp number: ${data.number}</p>
                <p>Email address: ${data.email}</p>
                <p>Email Subject Header: ${data.subject}</p>
                <p>Email: ${data.message}</p>
            </body>
        </html>
    `;

    const mailOptions = {
        from: "shosanacodemia@gmail.com",
        to: "shosanacodemia@gmail.com",
        subject: data.subject,
        html: htmlEmail,
    }

    console.log(htmlEmail, mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ 
                success: false, 
                timeoutMessage: "Error: Request Timed Out. Check your network and try again.",
                errorMessage: "Error: Registration Failed.",
            });
        } else {
            console.log('Email sent: ' + info.response);
            return res.status(200).json({ 
            success: true, 
            emailMessage: `Email sent successfully: ${info.response}`, 
            formMessage: 'Registration successful.'
            });
        }
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

      // Sending Email Block
    if (req.method === "POST") {
        try {
            const formData = req.body;
            emailTransporter(formData, res);
            return res.status(200).json({ success: true, message: 'Email sent successfully' });
        } catch (error) {
            console.error("Error: ", error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    if (!['POST', 'GET', 'OPTIONS'].includes(req.method)) {
        console.log("Method not allowed");
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}

