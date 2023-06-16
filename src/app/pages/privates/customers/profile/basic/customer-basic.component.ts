import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountDTO } from 'src/app/commons/models/global-dto';
import { CustomerService } from 'src/app/commons/services/customer.service';
import { NotificationService } from 'src/app/commons/services/notification.service';


@Component({
  selector: 'app-customer-basic',
  templateUrl: './customer-basic.component.html',
  styleUrls: ['./customer-basic.component.scss']
})
export class CustomerBasicComponent implements OnInit {

  get isEdition(): boolean {
    return !!this.customerUID.length;
  }

  customerUID: string = '';

  customerRef: AccountDTO = {} as AccountDTO;

  get buttonText(): string {
    return this.isEdition
      ? 'Actualizar Cliente'
      : 'Crear Cliente';
  }

  form: FormGroup;

  checked: boolean = false;

  set checkedModel(value: boolean) {
    this.checked = value;
  }

  get checkedModel(): boolean {
    return this.checked;
  }

  personTypeOptions: SelectOptions[] = [
    {
      label: 'Persona Humana',
      value: 'natural',
    },
    {
      label: 'Persona Jurídica',
      value: 'legal',
    },
  ];

  nameControl: FormControl = new FormControl('', Validators.required);
  personTypeControl: FormControl = new FormControl(this.personTypeOptions[0].value, Validators.required);
  businessNameControl: FormControl = new FormControl('', Validators.required);
  documentControl: FormControl = new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(7)]);
  emailControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
  phoneControl: FormControl = new FormControl('', Validators.required);
  addressControl: FormControl = new FormControl('', Validators.required);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private customerService: CustomerService,
  ) {
    this.activatedRoute.queryParams.subscribe(query => {
      const ref = query['ref'] || '';
      this.customerUID = ref;
    });

    this.form = new FormGroup({
      name: this.nameControl,
      personType: this.personTypeControl,
      businessName: this.businessNameControl,
      document: this.documentControl,
      email: this.emailControl,
      phone: this.phoneControl,
      address: this.addressControl,
    });
  }

  ngOnInit(): void {
    if (this.isEdition) {
      this.fetchData();
    }
  }

  fetchData() {
    (async () => {
      try {
        const dataset = await this.customerService.fetchByUID(this.customerUID);
        const [ person ] = dataset.filter(row => row.category === 'PERSON');
        this.nameControl.setValue(person.name);
        this.personTypeControl.setValue(person.type);
        this.businessNameControl.setValue(person.businessName);
        this.documentControl.setValue(person.document);
        this.emailControl.setValue(person.email);
        this.phoneControl.setValue(person.phone);
        this.addressControl.setValue(person.address);
        this.checkedModel = (person.status === 'active');
        this.customerRef = person;
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  submitEventHandler(form: BasicForm): void {
    (async () => {
      try {
        const request = {
          name: form.name,
          type: form.personType,
          businessName: form.businessName,
          document: form.document,
          email: form.email,
          phone: form.phone,
          address: form.address,
        } as AccountDTO;

        if (this.isEdition) {
          await this.updateHandler(request);
          return;
        }
        await this.createHandler(request);
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }
  
  async createHandler(data: AccountDTO): Promise<void> {
    try {
      const iam = await this.customerService.createAccount(data);
      this.router.navigate(['admin/customers/profile'], {
        queryParams: {
          ref: iam,
        }
      });
      this.notificationService.show('Se creó el cliente.');
    }
    catch (error: any) {
      this.notificationService.errorDialog(error);
    }
    finally {
      return Promise.resolve();
    }
  }

  async updateHandler(data: AccountDTO): Promise<void> {
    try {
      data.uid = this.customerUID;
      await this.customerService.update(data);
      this.notificationService.show('Se actualizó el cliente.');
    }
    catch (error: any) {
      this.notificationService.errorDialog(error);
    }
    finally {
      return Promise.resolve();
    }
  }

  disableEventHandler(): void {
    (async () => {
      try {
        const request = {
          status: (this.checked) ? 'active' : 'inactive',
          uid: this.customerUID,
        } as AccountDTO;

        await this.customerService.updateStatus(request);

        let message = 'Se activó el cliente.';
        if (request.status === 'inactive') {
          message = 'Se Desactivó el cliente.';
        }

        this.notificationService.show(message);
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  deleteEventHandler(): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confirmá que deseas eliminar el cliente?, esta acción no podrá ser revertida.');
        if (!confirmed) {
          return;
        }

        const request = {
          status: 'trash',
          uid: this.customerUID,
        } as AccountDTO;

        await this.customerService.updateStatus(request);

        this.notificationService.show('Se eliminó el cliente.');

        this.router.navigate([
          'admin', 'customers'
        ]);
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

}

interface SelectOptions {
  label: string;
  value: string;
}

interface BasicForm {
  name: string;
  personType: string;
  businessName: string;
  document: string;
  email: string;
  phone: string;
  address: string;
}
