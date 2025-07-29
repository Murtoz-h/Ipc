/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
 setGlobalOptions({ region: 'asia-south1' })
const logger = require("firebase-functions/logger");
const cors = require('cors')({ origin: true });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const nodemailer = require('nodemailer');

const { google } = require('googleapis');

// OAuth2 credentials
// Make sure to set these environment variables in your Firebase project
// You can set them using the Firebase CLI or in the Firebase Console under Project Settings > Environment
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// Create OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(mailOptions) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();
    

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'admin@indianipc.agency',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // const mailOptions = {
    //   from: 'Your Name <admin@indianipc.agency>',
    //   to: 'murtozhosen@gmail.com',
    //   subject: 'OAuth2 Email Test',
    //   text: 'This email was sent using OAuth2 authentication.',
    //   html: '<b>This email was sent using <i>OAuth2</i> authentication via Nodemailer</b>',
    // };
    console.log("Mail options:", JSON.stringify(mailOptions));
    var localoptions = {
        from: 'IPC Web <web@indianipc.agency>',
        to: "admin@indianipc.agency" ,        
        subject: mailOptions.subject,
        text: mailOptions.text,
    }
    console.log("Sending email with options:", localoptions);
    const result = await transporter.sendMail(localoptions);
    console.log('Email sent:', result.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

exports.sendMail2=onRequest((req,res)=>cors(req, res, () => {
    JSON.stringify(req.body);
logger.info("Received request to send email", { structuredData: true });
// Check if the request method is POST
if (req.method !== 'POST') {
    logger.error("Method Not Allowed", { structuredData: true });
    return res.status(405).send('Method Not Allowed');
}
// Check if the request body is empty
if (!req.body || Object.keys(req.body).length === 0) {
    logger.error("Bad Request: No data provided", { structuredData: true });
    return res.status(400).send('Bad Request: No data provided');
}
// Process the request body
const { subject, text } = req.body;
// Validate email fields
if (!subject || !text) {
    logger.error("Bad Request: Missing required fields", { structuredData: true });
    return res.status(400).send('Bad Request: Missing required fields');
}

    sendMail(req.body);
res.status(200).send('Email sent successfully');
logger.info("Email sent successfully", { structuredData: true });
return;
})); 


// exports.demoRequest=onRequest((req, res) => {
//     logger.info("Received request", { structuredData: true });
    
//     // Check if the request method is POST
//     if (req.method !== 'POST') {
//         return res.status(405).send('Method Not Allowed');
//     }
    
//     // Check if the request body is empty
//     if (!req.body || Object.keys(req.body).length === 0) {
//         return res.status(400).send('Bad Request: No data provided');
//     }
    
//     // Process the request body
//     const data = req.body;
//     logger.info("Request data:", data);
    
//     // Send a response
//     res.status(200).send('Request processed successfully');
// }
// );

// exports.sendMail= onRequest((req, res) => {
//   // Check if the request method is POST
// //   if (req.method !== 'POST') {
// //     return res.status(405).send('Method Not Allowed');
// //   }

// //   // Check if the request body is empty
// //   if (!req.body || Object.keys(req.body).length === 0) {
// //     return res.status(400).send('Bad Request: No data provided');
// //   }

//   // Process the request body
//   const { to, subject, text } = req.body;
//   from='admin@indianipc.agency'

//   // Validate email fields
// //   if (!to || !subject || !text) {
// //     return res.status(400).send('Bad Request: Missing required fields');
// //   }
// //   logger.info("Sending email to:", to);
// //   logger.info("Email subject:", subject);
// //   logger.info("Email text:", text);
// //   let mailDetails = {
// //     from: from,
// //     to: to,
// //     subject: subject,
// //     text: text
// //   };
//   let mailDetails = {
//     from: 'contact@indianipc.agency',
//     to: 'murtozhosen@gmail.com',
//     subject: 'Test Mail',
//     text: 'This is a test email sent using Nodemailer and Gmail SMTP.'
//   };
//   let mailTransporter = nodemailer.createTransport({
//     //host: 'smtp-relay.gmail.com',
//     //port: 465,
//     //secure:true,
//     service: 'gmail',
//     auth: {
//       user: 'admin@indianipc.agency',
//       pass: 'Savory@IPC'
//     }
//   });
//   mailTransporter.sendMail(mailDetails, function (err, data) {
//     if (err) {
//       logger.error('Error Occurs:', err);
//       return res.status(500).send('Internal Server Error: Failed to send email');
//     } else {
//       logger.info('Email sent successfully');
//       return res.status(200).send('Email sent successfully');
//     }
//   });
// });

//   // Send email using Nodemailer
  

// let mailTransporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'admin@indianipc.agency',
//     pass: 'Savory@IPC'
//   }
// });

// let mailDetails = {
//   from: 'admin@indianipc.agency',
//   to: 'murtozhosen@gmail.com',
//   subject: 'Test Mail',
//   text: 'This is a test email sent using Nodemailer and Gmail SMTP.'
// };

// mailTransporter.sendMail(mailDetails, function (err, data) {
//   if (err) {
//     console.log('Error Occurs');
//   } else {
//     console.log('Email sent successfully');
//   }
// });