import { OrderService } from 'src/app/commons/services/order.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleColumn } from 'src/app/commons/components/simple-tablex';
import { AccountDTO, RecordDTO, ResourceDTO } from 'src/app/commons/models/global-dto';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { Dates } from 'src/app/commons/helpers/dates.helper';


@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit {

  columns: SimpleColumn[] = [
    { property: 'userEmail', label: 'Descripción' },
    { property: 'price', label: 'Precio' },
    { property: 'createdAt', label: 'Fecha de creación' },
    { property: 'updatedAt', label: 'Última actualización' },
    { property: 'status', label: 'Estado' },
    { property: 'actions', label: 'Acciones' },
  ];

  orders: RecordDTO[] = new Array<RecordDTO>();

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private orderService: OrderService,
  ) { }

  ngOnInit(): void { 
    this.fecthData();
  }

  async fecthData(): Promise<void> {
    try {
      const collection = await this.orderService.fetchAllV2();
      this.orders = collection;
    }
    catch (error: any) {
      this.notificationService.showError(error.message);
    }
  }

  viewBookingClickEventHandler(data: RecordDTO): void {
    this.router.navigate([
      'admin', 'orders', 'profile',
    ], {
      queryParams: {
        ref: data.uid,
      },
      queryParamsHandling: 'merge',
    });
  }
  
  invoicesClickEventHandler(data: RecordDTO): void {
    this.router.navigate([
      'admin', 'orders', 'profile',
    ], {
      queryParams: {
        ref: data.uid,
        page: 'invoices'
      },
      queryParamsHandling: 'merge',
    });
  }
  
  getRowFormattedDateByUnix(value: any) {
    return Dates.toShortDateTime(value);
  }
}
