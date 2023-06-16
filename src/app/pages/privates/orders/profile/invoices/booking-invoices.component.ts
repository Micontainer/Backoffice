import { NotificationService } from 'src/app/commons/services/notification.service';
import { RecordDTO } from 'src/app/commons/models/global-dto';
import { OrderService } from 'src/app/commons/services/order.service';
import { Component, OnInit } from '@angular/core'; 
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleColumn } from 'src/app/commons/components/simple-tablex';
import { Dates } from 'src/app/commons/helpers/dates.helper';

@Component({
  selector: 'app-booking-invoices',
  templateUrl: './booking-invoices.component.html',
  styleUrls: ['./booking-invoices.component.scss']
})
export class BookingInvoicesComponent implements OnInit {

  columns: SimpleColumn[] = [
    { property: 'description', label: 'Descripción' },
    { property: 'comments', label: 'Comentarios' },
    { property: 'price', label: 'Precio' },
    { property: 'updatedAt', label: 'Última actualización' },
    { property: 'status', label: 'Estado de pago' },
  ];

  orderUID: string = '';

  invoices: RecordDTO[] = new Array<RecordDTO>();

  constructor(
    private notificationService: NotificationService,
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe(query => {
      const ref = query['ref'] || '';

      if (!ref) {
        // FIX
      }

      this.orderUID = ref;
    });
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    ((async () => {
      if (this.orderUID === '') {
        return;
      }
      
      this.invoices = await this.orderService.fetchInvoicesByOrderUID(this.orderUID);
    }))();
  }

  downloadInvoiceAttachmentEventHandler(row: RecordDTO): void {
    (async () => {
      
    })();
  }

  getRowFormattedDateByUnix(value: any) {
    return Dates.toShortDateTime(value);
  }
}