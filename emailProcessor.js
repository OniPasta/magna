// emailProcessor.js
const db = require('./firebase');  // Import Firestore setup from firebase.js
const openai = require('openai');  // Assuming you have set up OpenAI API

// Function to get emails by sender
const getEmailsBySender = async (sender) => {
  try {
    const emailRef = db.collection('emails').where('sender', '==', sender);
    const snapshot = await emailRef.get();

    if (snapshot.empty) {
      console.log('No emails found for this sender.');
      return [];
    }

    // Collect email data
    const emails = [];
    snapshot.forEach(doc => {
      emails.push(doc.data());
    });

    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    return [];
  }
};

// Function to get emails by conversationId
const getEmailsByConversationId = async (conversationId) => {
  try {
    const emailRef = db.collection('emails').where('conversationId', '==', conversationId);
    const snapshot = await emailRef.get();

    if (snapshot.empty) {
      console.log('No emails found for this conversation ID.');
      return [];
    }

    // Collect email data
    const emails = [];
    snapshot.forEach(doc => {
      emails.push(doc.data());
    });

    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    return [];
  }
};

// Function to generate a response with ChatGPT
const generateResponseWithChatGPT = async (emails) => {
  let conversationContext = '';
  emails.forEach(email => {
    conversationContext += `\nSender: ${email.sender}\nSubject: ${email.subject}\nContent: ${email.content}\n`;
  });

  const prompt = `
    Customer Email Conversation:
    ${conversationContext}
    
    Generate a helpful and professional response to this customer inquiry.
  `;

  try {
    const response = await openai.Completion.create({
      model: 'gpt-3.5-turbo',  // Or whichever GPT model you are using
      prompt: prompt,
      max_tokens: 150,
    });

    const aiResponse = response.choices[0].text.trim();
    console.log('AI Response:', aiResponse);
    return aiResponse;
  } catch (error) {
    console.error('Error generating response with ChatGPT:', error);
  }
};

module.exports = { getEmailsBySender, getEmailsByConversationId, generateResponseWithChatGPT };
