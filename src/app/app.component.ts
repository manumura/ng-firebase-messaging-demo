import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from './core/model/message.model';
import { MessagingService } from './core/service/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private messageSubscription?: Subscription;

  title = 'ng-firebase-messaging-demo';
  message?: Message;

  constructor(private readonly messagingService: MessagingService) {}

  ngOnInit(): void {
    this.messagingService.requestPermission();

    this.messageSubscription = this.messagingService.notification$.subscribe(
      (message: Message) => {
        console.log('message to display in component: ', message);
        this.message = message;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }
}
