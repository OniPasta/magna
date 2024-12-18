// /api/app.js

const { getEmailsBySender, generateResponseWithChatGPT } = require('../emailProcessor');

// Vercel handler for serverless function
module.exports = async (req, res) => {
  // Example: Get emails by sender from the query string (you can adjust this as needed)
  const sender = req.query.sender || 'support@magnacraft.co';  // Default sender

  try {
    // Fetch emails from Firestore by sender
    const emails = await getEmailsBySender(sender);

    if (emails.length === 0) {
      return res.status(404).json({ message: 'No emails found for this sender.' });
    }

    // Generate a response from ChatGPT
    const aiResponse = await generateResponseWithChatGPT(emails);

    // Respond back with the generated response
    return res.status(200).json({ aiResponse });
  } catch (error) {
    console.error('Error processing the request:', error);
    return res.status(500).json({ message: 'Error processing the request' });
  }
};
