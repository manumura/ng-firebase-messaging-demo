// Handle notification click
// https://stackoverflow.com/questions/53595019/service-worker-notificationclick-event-doesnt-focus-or-open-my-website-in-tab
self.addEventListener('notificationclick', function(event) {
  console.log('notificationclick event: ', event);
  event.notification.close();

  if (!event.notification.data || !event.notification.data.link) {
    return;
  }

  const urlToOpen = event.notification.data.link;

  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (windowClient.url === urlToOpen) {
          matchingClient = windowClient;
          break;
        }
      }

      console.log('matching client: ', matchingClient);
      return (matchingClient) ? matchingClient.focus() : clients.openWindow(urlToOpen);
    });

  event.waitUntil(promiseChain);
});

importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-messaging-compat.js');
// import { initializeApp } from "firebase/app";
// import { getMessaging } from "firebase/messaging/sw";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWxsJMFccGa8dLBjYzUWZ62LEkV9amk_s",
  authDomain: "ng-firebase-messaging-demo.firebaseapp.com",
  projectId: "ng-firebase-messaging-demo",
  storageBucket: "ng-firebase-messaging-demo.appspot.com",
  messagingSenderId: "545326615823",
  appId: "1:545326615823:web:d06c70736af1b44646c27a",
  measurementId: "G-N1XGBTW9V0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// const firebaseApp = initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();
// const messaging = getMessaging(firebaseApp);

// messaging.onBackgroundMessage(function(payload) {
//   console.log('Received background message ', payload);
//   console.log('origin: ', self.location.origin);
//   if (!payload || !payload.data) {
//     return;
//   }
//   const notificationTitle = payload.data.title;
//   const notificationOptions = {
//     body: payload.data.body,
//     icon: payload.data.icon,
//     click_action: payload.data.link,
//     data: { 
//       click_action: payload.data.link,
//       link: payload.data.link //the url which we gonna use later
//     },
//     actions: [{
//         action: "open_url", 
//         title: "Open now",
//     }],
//     origin: self.location.origin,
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });
