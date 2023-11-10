import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { RestService } from "./rest.service";
import { Messaging, getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from "src/environments/environment";


@Injectable()
export class PushService extends BaseService {

  swReg: ServiceWorkerRegistration | undefined;

  constructor(
    private restService: RestService,
  ) {
    super();
  }

  public async subscribe(request: PushSubscription): Promise<void> {
    try {
      await this.restService.post<any>('system/notifications/push', request);
      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  public async requestPermission() {
    const messaging = getMessaging();
    this.swReg = await navigator.serviceWorker.register('../../../assets/js/firebase-message-sw.js');
    getToken(messaging,
      { vapidKey: environment.firebase.vapidKey, serviceWorkerRegistration: this.swReg }).then(
        async (token) => {
          if (!token) {
            console.log('No registration token available. Request permission to generate one.');
          }

          console.log(token);

          await this.subscribe({ token });
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
        });

  }

  public async listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      this.swReg?.showNotification('Notification from Mi container');
      console.log('Message received. ', payload);
    });
  }
}

export interface PushSubscription {
  token: string;
}

interface TokenForm {
  token: string;
}
