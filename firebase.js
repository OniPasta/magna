const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./keys/magnacraft-5c18b-firebase-adminsdk-w28qq-5488498e4d.json');  // Correct path with forward slashes

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: 'https://magnacraft-5c18b.firebaseio.com'  // Replace with your Firebase project URL
});

const db = firebaseAdmin.firestore();

module.exports = db;  // Export db to use in other parts of your app
