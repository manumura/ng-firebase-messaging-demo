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
      console.log(
        '[messaging service] serviceWorker handle message event: ',
        event
      );

      // const notification = event.data?.notification;
      const data = event.data?.data;
      if (data && data.messageId) {
        const message: Message = {
          title: data.title,
          body: data.body,
          icon: data.icon,
          link: data.click_action,
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
    // TODO dont need this if message is handled by push event in sw
    // onMessage(this.messaging, (payload: MessagePayload) => {
    //   console.log('[messaging service] Message received: ', payload);
    //   // Show notification if app in foreground
    //   if (this.registration) {
    //     const notification = payload.notification;
    //     const data = payload.data;
    //     const notificationTitle = data?.title
    //       ? data?.title
    //       : 'Notification default title';
    //     const notificationOptions = {
    //       body: data?.body,
    //       icon: data?.icon,
    //       click_action: data?.link,
    //       tag: payload.messageId,
    //       data: {
    //         link: data?.link,
    //       },
    //     };
    //     this.registration.showNotification(
    //       notificationTitle,
    //       notificationOptions
    //     );
    //   }
    // });
  }
}
