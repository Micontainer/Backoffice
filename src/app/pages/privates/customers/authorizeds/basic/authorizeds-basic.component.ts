import { CustomerService } from 'src/app/commons/services/customer.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { SimpleColumn } from 'src/app/commons/components/simple-tablex';
import { RecordDTO } from 'src/app/commons/models/global-dto';


@Component({
  selector: 'authorizeds-basic',
  templateUrl: './authorizeds-basic.component.html',
  styleUrls: ['./authorizeds-basic.component.scss']
})
export class AuthorizedsBasicComponent implements OnInit {

  customerUID: string = '';
  authorizedUID: string = '';
  bookings: RecordDTO[];

  get isEdition(): boolean {
    return !!this.authorizedUID;
  };

  authorized: any = {};

  columns: SimpleColumn[] = [
    { property: 'name', label: 'Nombre y Apellido' },
    { property: 'email', label: 'Email' },
    { property: 'phone', label: 'Teléfono' },
    { property: 'document', label: 'Documento' },
    { property: 'actions', label: 'Acciones' },
  ];

  get validForm(): boolean {
    return this.form.valid && this.isStorageChecked();
  }

  form: FormGroup;
  nameLastnameControl: FormControl = new FormControl('', Validators.required);
  emailControl: FormControl = new FormControl('', Validators.required);
  phoneControl: FormControl = new FormControl('', Validators.required);
  documentControl: FormControl = new FormControl('', Validators.required);
  docFrontFileControl: FormControl = new FormControl('', Validators.required);
  docFrontfileSourceControl: FormControl = new FormControl('');
  docBackFileControl: FormControl = new FormControl('', Validators.required);
  docBackfileSourceControl: FormControl = new FormControl('');

  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private customerService: CustomerService,
    private router: Router,
  ) {
    this.activatedRoute.queryParams.subscribe(query => {
      this.customerUID = query['ref'] || '';
      if (!this.customerUID) {
        this.router.navigate(['/admin/customers']);
      }
      this.authorizedUID = query['ref.authorized'] || '';
    });

    this.form = new FormGroup({
      nameLastname: this.nameLastnameControl,
      email: this.emailControl,
      phone: this.phoneControl,
      document: this.documentControl,
      docFrontFile: this.docFrontFileControl,
      docFrontfileSource: this.docFrontfileSourceControl,
      docBackFile: this.docBackFileControl,
      docBackfileSource: this.docBackfileSourceControl,
    });
    this.bookings = new Array<RecordDTO>();
  }    

  ngOnInit(): void {
    (async () => {
      try {
        await this.fetchBookings();
        if (this.isEdition) {
          await this.fetchAuthorized();
        }
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }
  
  async fetchBookings() {
    (async () => {
      try {
        this.bookings = await this.customerService.getBookings(this.customerUID);
        for (const booking of this.bookings) {
          this.form.addControl(booking.storageUid, new FormControl(false));
        };
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }

  async fetchAuthorized() {
    (async () => {
      try {
        [ this.authorized ] = await this.customerService.getAuthorizeds(this.customerUID, this.authorizedUID);
        this.syncForm();
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }

  onFileChange(event: any, face: string) {
    const file = event.target.files[0];
    if (face === 'front') {
      this.form.patchValue({
        docFrontfileSource: file
      });
      this.form.get('docFrontfileSource')?.updateValueAndValidity();
      return;
    }
    this.form.patchValue({
      docBackfileSource: file
    });
    this.form.get('docBackfileSource')?.updateValueAndValidity();
  }

  submitEventHandler(basicForm: BasicForm) {
    let data: any = {
      customerUID: this.customerUID,
      nameLastname: basicForm.nameLastname,
      email: basicForm.email,
      phone: basicForm.phone,
      document: basicForm.document,
    }
    const storages = Object.entries(this.form.controls)
    .filter(([key, control]) => key.includes('stge:') && control.value)
    .map(([key]) => key);
    data.storages = storages;

    let formData = new FormData();

    formData.append('data', JSON.stringify(data));
    formData.append('docFrontFile', basicForm.docFrontfileSource);
    formData.append('docBackFile', basicForm.docBackfileSource);

    if (this.isEdition) {
      this.updateAuthorized(formData);
      return;
    }
    
    this.createAuthorized(formData);
  }
  
  createAuthorized(formData: FormData) {
    (async() => { 
      try {
        const authorized = await this.customerService.createAuthorization(formData);
        this.notificationService.show(`Se ha creado la autorización.`);

        this.router.navigate(['admin/customers/authorizeds'], {
          queryParams: {
            'ref.authorized': authorized.uid,
          },
          queryParamsHandling: 'merge',
        });
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }
  
  updateAuthorized(formData: FormData) {
    (async() => { 
      try {
        this.authorized = await this.customerService.updateAuthorization(formData, this.authorized.uid);
        this.notificationService.show(`Se ha actualizado la autorización.`);
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }

  syncForm() {
    this.nameLastnameControl.setValue(this.authorized.name);
    this.emailControl.setValue(this.authorized.email);
    this.phoneControl.setValue(this.authorized.phone);
    this.documentControl.setValue(this.authorized.document);
    this.docFrontFileControl.removeValidators([Validators.required]);
    this.docBackFileControl.removeValidators([Validators.required]);
    this.docFrontFileControl.updateValueAndValidity();
    this.docBackFileControl.updateValueAndValidity();

    for (const storage of this.authorized.storages) {
      this.form.controls[storage].setValue(true);
    }
  }

  isStorageChecked(): boolean {
    let result = false;
    for (const booking of this.bookings) {
      if (this.form.controls[booking.storageUid].value) {
        result = true;
        break;
      }
    }
    return result;
  }
}

interface BasicForm {
  nameLastname: string;
  email: string;
  phone: string;
  document: string;
  docFront: string;
  docFrontfileSource: File;
  docBack: string;
  docBackfileSource: File;
}