const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fs = require('fs')
admin.initializeApp();

const { Translate } = require('@google-cloud/translate');
// const { Speech } = require('@google-cloud/speech');
// Creates a client
const translate = new Translate();

// // Start writing Firebase Functions

//  detection of text sample
/**
 * TODO(developer): Uncomment the following line before running the sample.
 */
// const text = 'The text for which to detect language, e.g. Hello, world!';

// Detects the language. "text" can be a string for detecting the language of
// a single piece of text, or an array of strings for detecting the languages
// of multiple texts.
// let [detections] = await translate.detect(text);
// detections = Array.isArray(detections) ? detections : [detections];
// console.log('Detections:');
// detections.forEach(detection => {
//   console.log(`${detection.input} => ${detection.language}`);
// });





// Text to Text Translate
exports.translateText = functions.firestore.document('/messages/{messageID}').onCreate(
  async (snap: any, context: any) => {
    if (snap.data().translated) {
      return null
    }
  
    let [detections] = await translate.detect(snap.data().text);

    detections = Array.isArray(detections) ? detections : [detections];
    
    console.log(detections)
    if (detections[0].language ===  'en') {
      return null
    }

    // TODO: detect language from preferences from users
    const results = await translate.translate(detections[0].input, { from: detections[0].language, to: 'en'}); 

    return admin.firestore().collection('messages').doc(context.params.messageID).update({
      text: `${snap.data().text}\n-\n${results[0]}`
    })

});

// // Voice to text - not working
// exports.translateVoice = functions.firestore.document('/messages/{messageID}').onCreate(
//   async (snap: any, context: any) => {

//   if (snap.data().translated) {
//     return null
//   }

//   const results = await translate.translate(snap.data().text, { from: 'es', to: 'en' });

//   return admin.firestore().collection('messages').doc(context.params.messageID).update({
//     text: `${snap.data().text}\n-\n${results[0]}`
//   })
// });