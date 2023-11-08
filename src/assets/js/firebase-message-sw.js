importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-messaging.js');

firebase.initializeApp({
    projectId: 'mi-container',
    appId: '1:131439675803:web:7b627a93a34e8b7091393e',
    storageBucket: 'mi-container.appspot.com',
    apiKey: 'AIzaSyBHD2tM3rH1DaxlEvzg5vzAxVGBdNqY4SI',
    authDomain: 'mi-container.firebaseapp.com',
    messagingSenderId: '131439675803',
    measurementId: 'G-HC5779Q19N',
});

const messaging = firebase.messaging()