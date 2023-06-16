import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountDTO } from 'src/app/commons/models/global-dto';
import { CustomerService } from 'src/app/commons/services/customer.service';
import { NotificationService } from 'src/app/commons/services/notification.service';


@Component({
  selector: 'app-customer-user',
  templateUrl: './customer-user.component.html',
  styleUrls: ['./customer-user.component.scss']
})
export class CustomerUserComponent implements OnInit {

  get isEdition(): boolean {
    return !!this.customerUID.length;
  }

  customerUID: string = '';

  customerRef: AccountDTO = {} as AccountDTO;

  form: FormGroup;
  emailControl: FormControl = new FormControl('', [Validators.required, Validators.email]);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
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

    this.form = new FormGroup({
      email: this.emailControl,
    });
  }

  ngOnInit(): void {
    (async () => {
      try {
        if (!this.isEdition) {
          return;
        }

        const dataset = await this.customerService.fetchByUID(this.customerUID);

        const [user] = dataset.filter(row => row.category === 'USER');

        this.emailControl.setValue(user.email);

        this.customerRef = user;
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  resetEventHandler(): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confirma que deseas resetear el usuario?');
        if (!confirmed) {
          return;
        }

        await this.customerService.resetUser(this.customerUID);

        this.notificationService.show('Se actualizó el usuario.');

        this.notificationService.showSuccess('Se envio una contraseña nueva al correo del usuario.');
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

}

interface PageForm {
  email: string;
  password: string;
}
