import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SimpleColumn } from 'src/app/commons/components/simple-tablex';
import { RecordDTO } from 'src/app/commons/models/global-dto';
import { CustomerService } from 'src/app/commons/services/customer.service';
import { NotificationService } from 'src/app/commons/services/notification.service';


@Component({
  selector: 'app-customer-history',
  templateUrl: './customer-history.component.html',
  styleUrls: ['./customer-history.component.scss']
})
export class CustomerHistoryComponent implements OnInit {

  customerUID: string = '';
  bookings: RecordDTO[];

  columns: SimpleColumn[] = [
    { property: 'storage', label: 'Nombre' },
    { property: 'storageCoefficient', label: 'Coeficiente' },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private notificationService: NotificationService,
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
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
    }

}
