import { catchError } from 'rxjs';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { PushService } from './../../../commons/services/push.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from 'src/app/commons/components/sidebar/sidebar.component';
import { onMessage, Messaging, getToken } from '@angular/fire/messaging';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  @ViewChild(SidebarComponent) notificationsSidebar!: SidebarComponent;

  notifications: any[];

  constructor(
    private pushService: PushService,
    private app: Messaging
  ) {
    this.notifications = new Array<any>();
  }

  ngOnInit(): void {
    this.notifications = [
      {
        name: 'John Doe',
        subject: 'Reserva de Baulera 04, Nivel 1, Edificio A',
        severity: 'success'
      },
      {
        name: 'Frank Miller',
        subject: 'Expiró la fecha de pago pendiente',
        severity: 'warning',
      },
      {
        name: 'Rocío García',
        subject: 'Cancela la reserva de Baulera 01, Nivel 1, Edificio F',
        severity: 'danger',
      },
      {
        name: 'Mi Container',
        subject: 'Aviso de Solicitud de credenciales',
        severity: 'default',
      }
    ];
  }

  async ngAfterViewInit() {
    const sw = await navigator.serviceWorker.register('../../../assets/js/firebase-message-sw.js');
    console.log("SW", sw)

    getToken(this.app, {
      vapidKey: 'BOrYxQzjc8u5e4fbgotvaEp28K1vn8jLSWzqM2q-OZjYxPF68AXhaeanfQ76cTsotoUB1FrET147UIM90xQyDqQ',
      serviceWorkerRegistration: sw,
    }).then(async (token) => {
      if (!token) { return; }
      await this.pushService.subscribe({
        token
      });
    }).catch((e) => console.log("e", e));

    onMessage(this.app, (a) => {
      console.log(a)
    })
    onMessage(this.app, (a) => {
      console.log(a)
    })
    // this.ngMessaging.requestToken.subscribe({
    //   next: (token) => console.log(token),
    //   error: (error) => console.log(error)
    // })
  }

  notificationClickEventHandler(): void {
    this.notificationsSidebar.show(false);
  }
}
