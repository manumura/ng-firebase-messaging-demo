// Handle notification click
// https://stackoverflow.com/questions/53595019/service-worker-notificationclick-event-doesnt-focus-or-open-my-website-in-tab
self.addEventListener('notificationclick', function(event) {
  console.log('notificationclick event: ', event);
  event.notification.close();

  // for foreground message: event.notification?.data?.link
  // for background message: event.notification?.data?.FCM_MSG?.data?.link
  const linkToOpen = event.notification?.data?.link;
  if (!linkToOpen) {
    return;
  }

  const promiseChain = getClientList()
    .then((windowClients) => {
      const urlToOpen = new URL(linkToOpen, self.location.href);
      const matchingClient = getWindowClient(urlToOpen, windowClients);
      // return (matchingClient) ? matchingClient.focus() : clients.openWindow(linkToOpen);
      return clients.openWindow(linkToOpen);
    });

  event.waitUntil(promiseChain);
});

// Handle push message
// https://stackoverflow.com/questions/51441510/the-web-app-showing-this-website-has-been-updated-in-the-background
self.addEventListener('push', function(event) {
  console.log('Received push message ', event);
  if (!event || !event.data) {
    return;
  }

  try {
    const message = event.data.json();
    const data = message.data;

    const notificationTitle = data.title;
    const notificationOptions = {
      title: notificationTitle,
      body: data.body,
      icon: data.icon,
      click_action: data.link,
      tag: message.fcmMessageId,
      messageId: message.fcmMessageId,
      data: {
        link: data.link,
      },
    };

    const promiseChain = getClientList()
      .then((windowClients) => {
        for (const windowClient of windowClients) {
          const windowClientUrl = new URL(windowClient.url, self.location.href);
          if (windowClientUrl.host === self.location.host) {
            matchingClient = windowClient;
          }
      
          // Send notification to messaging service
          if (matchingClient) {
            // console.log('post message to matchingClient: ', matchingClient);
            matchingClient.postMessage({
              data: notificationOptions
            });
          }
        }
      
        event.waitUntil(
          self.registration.showNotification(notificationTitle, notificationOptions)
        );
    });

    event.waitUntil(promiseChain);

  } catch (err) {
    // Not JSON so not an FCM message.
    return;
  }
});

importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.7/firebase-messaging-compat.js');

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

// Retrieve firebase messaging
const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {
//   console.log('Received background message ', payload);
//   // if (!payload || !payload.data) {
//     // return;
//   // }
//   const notificationTitle = payload.data.title;
//   const notificationOptions = {
//     title: notificationTitle,
//     body: payload.data.body,
//     icon: payload.data.icon,
//     click_action: payload.data.link,
//     tag: payload.messageId,
//     data: {
//       link: payload.data.link, //the url which we gonna use later
//       // origin: self.location.origin,
//     },
//     // actions: [{
//     //     action: "open_url", 
//     //     title: "Open now",
//     // }],
//   };

//   const promiseChain = getClientList()
//     .then((windowClients) => {
//       for (let i = 0; i < windowClients.length; i++) {

//         const windowClient = windowClients[i];
//         if (windowClient.url.indexOf(self.location.origin) === 0) {
//           matchingClient = windowClient;
//         }
    
//         // Send notification to messaging service
//         if (matchingClient) {
//           matchingClient.postMessage({
//             data: notificationOptions
//           });
//         }
//       }
    
//       self.registration.showNotification(notificationTitle, notificationOptions);
//   });
// });

function getClientList() {
  return self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  });
}

function getWindowClient(url, clientList) {
  for (const client of clientList) {
    const clientUrl = new URL(client.url, self.location.href);
    if (url.host === clientUrl.host) {
      // console.log('found matching client: ', client);
      return client;
    }
  }

  return null;
}
