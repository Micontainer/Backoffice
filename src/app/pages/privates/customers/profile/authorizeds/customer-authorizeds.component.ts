import { CustomerService } from 'src/app/commons/services/customer.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { SimpleColumn } from 'src/app/commons/components/simple-tablex';
import { RecordDTO } from 'src/app/commons/models/global-dto';


@Component({
  selector: 'customer-authorizeds',
  templateUrl: './customer-authorizeds.component.html',
  styleUrls: ['./customer-authorizeds.component.scss']
})
export class CustomerAuthorizedsComponent implements OnInit {

  customerUID: string = '';
  bookings: RecordDTO[];
  authorizeds: any[] = [];

  isEdition: boolean = false;
  authEdition: any = null;

  columns: SimpleColumn[] = [
    { property: 'name', label: 'Nombre y Apellido' },
    { property: 'email', label: 'Email' },
    { property: 'phone', label: 'Teléfono' },
    { property: 'document', label: 'Documento' },
    { property: 'actions', label: 'Acciones' },
  ];

  get hasBookings(): boolean {
    return (this.bookings.length > 0);
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private customerService: CustomerService,
  ) {
    this.activatedRoute.queryParams.subscribe(query => {
      const ref = query['ref'] || '';

      if (!ref) {
        // FIXME we are in creation mode;
        return;
      }

      this.customerUID = ref;
    });
    this.bookings = new Array<RecordDTO>();
  }

  ngOnInit(): void {
    (async () => {
      try {
        if (!this.customerUID) {
          return;
        }
        this.bookings = await this.customerService.getBookings(this.customerUID);
        this.fetchAuthorizations();
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }
  
  fetchAuthorizations() {
    (async () => {
      try {
        if (!this.customerUID) {
          return;
        }
        this.authorizeds = await this.customerService.getAuthorizeds(this.customerUID); 
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }

  deleteEventHandler(row: any) {
    (async () => {
      try {
        const confirmation = await this.notificationService.showQuestion(`¿Desea eliminar la autorización a ${row.name}? Esta acción no puede deshacerse.`);
        if (!confirmation) {
          return;
        }
        await this.customerService.deleteAuthorization(this.customerUID, row.uid);
        this.notificationService.show(`Se ha borrado la autorización.`);
        this.fetchAuthorizations();
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }
}