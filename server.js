const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow CORS for all requests
app.use(bodyParser.json()); // Parse application/json

// Set up Nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use your email service
    auth: {
        user: 'your-email@gmail.com', // Your email
        pass: 'your-email-password' // Your email password or App Password
    }
});

// Endpoint to send notifications
app.post('/send-notification', (req, res) => {
    const { username, message } = req.body;

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'yassin.hussein@capital-schools.com',
        subject: 'New User Notification',
        text: message || `${username} has logged in.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email'); // Send back an error response
        }
        console.log('Email sent:', info.response);
        res.status(200).send('Email sent'); // Send back a success response
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});