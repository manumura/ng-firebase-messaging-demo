import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  getMessaging,
  getToken,
  MessagePayload,
  Messaging,
  onMessage,
} from 'firebase/messaging';
import { Subject } from 'rxjs';
import { Message } from '../model/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private messaging: Messaging;
  private registration?: ServiceWorkerRegistration;
  private notificationSubject: Subject<Message> = new Subject();

  // TODO https://developers.google.com/oauthplayground/ (scope: https://www.googleapis.com/auth/firebase.messaging)
  constructor() {
    this.messaging = getMessaging();

    navigator.serviceWorker
      // .register(
      //   `firebase-messaging-sw.js?messagingSenderId=${environment.firebase.messagingSenderId}`
      // )
      .getRegistration()
      .then((registration) => {
        this.registration = registration;
      });

    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('serviceWorker message event: ', event);

      if (event.data && event.data.notification) {
        const notification = event.data.notification;
        const message: Message = {
          title: notification.title,
          body: notification.body,
          icon: notification.icon,
          link: notification.click_action,
        };
        this.notificationSubject.next(message);
      }
    });
  }

  get notification$() {
    return this.notificationSubject.asObservable();
  }

  requestPermission() {
    getToken(this.messaging, { vapidKey: environment.firebase.vapidKey })
      .then((currentToken) => {
        if (currentToken) {
          console.log('Hurraaa!!! we got the token.....');
          console.log(currentToken);
          // Send the token to your server and update the UI if necessary
          this.listen();
        } else {
          // Show permission request UI
          console.log(
            'No registration token available. Request permission to generate one.'
          );
        }
      })
      .catch((err) => {
        console.error('An error occurred while retrieving token. ', err);
      });
  }

  private listen() {
    onMessage(this.messaging, (payload: MessagePayload) => {
      console.log('Message received in messaging service: ', payload);
      // this.message = payload;
      // const message: Message = {
      //   body: payload.notification?.body,
      //   title: payload.notification?.title,
      //   icon: payload.notification?.icon,
      //   link: payload.fcmOptions?.link,
      // };
      // this.notificationSubject.next(message);

      // Show notification if app NOT in background
      if (this.registration) {
        const notificationTitle = payload.notification?.title; // payload.notification?.title;
        const notificationOptions = {
          body: payload.notification?.body, // payload.notification?.body,
          icon: payload.data?.icon,
          click_action: payload.data?.link,
          data: {
            // click_action: payload.data?.link,
            link: payload.data?.link, //the url which we gonna use later
          },
          // actions: [
          //   {
          //     action: 'open_url',
          //     title: 'Open now',
          //   },
          // ],
          origin: self.location.origin,
        };
        this.registration.showNotification(
          notificationTitle ? notificationTitle : 'Notification default title',
          notificationOptions
        );
      }
    });
  }
}
