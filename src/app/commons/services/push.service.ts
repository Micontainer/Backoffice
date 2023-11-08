import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { RestService } from "./rest.service";
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { environment } from "src/environments/environment";

@Injectable()
export class PushService extends BaseService {
  app: FirebaseApp;

  constructor(
    private restService: RestService,
  ) {
    super();
    this.app = initializeApp(environment.firebase);
  }

  async requestPushToken(): Promise<void> {
    try {
      getToken(getMessaging(this.app), {
        vapidKey: 'BOrYxQzjc8u5e4fbgotvaEp28K1vn8jLSWzqM2q-OZjYxPF68AXhaeanfQ76cTsotoUB1FrET147UIM90xQyDqQ',
        serviceWorkerRegistration: await navigator.serviceWorker.register('../../../assets/js/firebase-message-sw.js')
      }).then(async (token) => {
        console.log("Token:", token)
        if (!token) { return; }
        await this.subscribe({
          token
        });
      }).catch((error) => { throw error; });
    } catch (error) {
      console.log(error)
    }
  }

  async listen(): Promise<void> {
    try {
      onMessage(getMessaging(this.app), (payload) => {
        console.log("Here", payload)
      })
    } catch (error) {
      console.log(error)
    }
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

}

export interface PushSubscription {
  token: string;
}

interface TokenForm {
  token: string;
}
