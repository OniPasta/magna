const fetch = require('node-fetch');  // Ensure node-fetch is installed
const firebaseAdmin = require('firebase-admin');

// Parse Firebase service account from environment variables
const SERVICE_ACCOUNT = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(SERVICE_ACCOUNT),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = firebaseAdmin.firestore();

// Zoho API URL and OAuth Access Token
const ZOHO_API_URL = `https://mail.zoho.com/api/accounts/${process.env.ZOHO_ACCOUNT_ID}/messages`; // Ensure ZOHO_ACCOUNT_ID is set
const ACCESS_TOKEN = process.env.ZOHO_ACCESS_TOKEN;

// Fetch emails from Zoho
const getEmailsFromZoho = async () => {
  const response = await fetch(ZOHO_API_URL, {
    method: 'GET',
    headers: {
      'Authorization': `Zoho-oauthtoken ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching emails from Zoho: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data; // Emails are in data.data
};

// Save emails to Firebase
const saveEmailsToFirestore = async (emails) => {
  for (const email of emails) {
    const emailData = {
      sender: email.fromEmail,
      subject: email.subject,
      content: email.body,
      timestamp: email.dateTime,
      conversationId: email.conversationId, // If available
    };

    try {
      const emailRef = db.collection('emails'); // Save to 'emails' collection
      await emailRef.add(emailData); // Save the email data to Firestore
      console.log(`Email saved: ${email.subject}`);
    } catch (error) {
      console.error('Error saving email to Firestore:', error);
    }
  }
};

// Vercel serverless function to handle the email fetch
module.exports = async (req, res) => {
  try {
    const emails = await getEmailsFromZoho();
    await saveEmailsToFirestore(emails);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ success: false, error: 'Error fetching or saving emails' });
  }
};
