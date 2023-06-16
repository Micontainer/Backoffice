import { Component, OnInit } from '@angular/core';
import { SimpleColumn } from 'src/app/commons/components/simple-tablex';
import { AccountDTO } from 'src/app/commons/models/global-dto';
import { CustomerService } from 'src/app/commons/services/customer.service';
import { NotificationService } from 'src/app/commons/services/notification.service';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {

  columns: SimpleColumn[] = [
    { property: 'name', label: 'Nombre' },
    { property: 'email', label: 'Email' },
    { property: 'phone', label: 'Teléfono' },
    { property: 'status', label: 'Estado' },
    { property: 'actions', label: 'Actions' },
  ];

  customers: AccountDTO[] = new Array<AccountDTO>();

  constructor(
    private notificationService: NotificationService,
    private customerService: CustomerService,
  ) { }

  ngOnInit(): void {
    (async () => {
      await this.fetchData();
    })();
  }

  async fetchData(): Promise<void> {
    try {
      const collection = await this.customerService.fetchAll();
      this.customers = collection;
    }
    catch (error: any) {
      this.notificationService.showError(error.message);
    }
  }

  deleteEventHandler(row: AccountDTO): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confirmá que deseas eliminar el cliente?, esta acción no podrá ser revertida.');
        if (!confirmed) {
          return;
        }

        const request = {
          status: 'trash',
          uid: row.uid,
        } as AccountDTO;

        await this.customerService.updateStatus(request);

        this.notificationService.show('Se eliminó el cliente.');

        await this.fetchData();
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

}
