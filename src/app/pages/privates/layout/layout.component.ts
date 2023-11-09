import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from 'src/app/commons/components/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {
  @ViewChild(SidebarComponent) notificationsSidebar!: SidebarComponent;

  notifications: any[];

  constructor() {
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

  ngAfterViewInit(): void { }

  notificationClickEventHandler(): void {
    this.notificationsSidebar.show(false);
  }
}
