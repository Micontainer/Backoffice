import { NotificationService } from 'src/app/commons/services/notification.service';
import { OrderService } from 'src/app/commons/services/order.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-invoices-basic',
  templateUrl: './invoices-basic.component.html',
  styleUrls: ['./invoices-basic.component.scss']
})
export class InvoicesBasicComponent implements OnInit {

  orderUID: string = '';
  invoiceUID: string = '';

  //#region ATTACHMENT
  invoiceAttachment: string = '';

  get hasAttachment(): boolean {
    return !!this.invoiceAttachment;
  }

  get attachmentUploadLabel(): string {
    return this.hasAttachment ?
      'Cambiar archivo'
      : 'Archivo';
  }

  statusOptions: selectionOptions[] = [{
    label: 'Pendiente',
    value: 'pending',
  }, {
    label: 'Aprobada',
    value: 'approved',
  }, {
    label: 'Cancelada',
    value: 'deny',
  }]

  get attachmentUploadHintText(): string {
    return this.hasAttachment ?
      'Cambiar foto de la factura'
      : 'Foto de la factura';
  }
  //endregion ATTACHMENT_LABEL

  form: FormGroup;
  descriptionControl: FormControl = new FormControl('', Validators.required);
  commentsControl: FormControl = new FormControl('', Validators.required);
  fileControl: FormControl = new FormControl('');
  fileSourceControl: FormControl = new FormControl('');
  statusSelectionControl: FormControl = new FormControl('', Validators.required);

  constructor(
    private notificationService: NotificationService,
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.form = new FormGroup({
      description: this.descriptionControl,
      comments: this.commentsControl,
      file: this.fileControl,
      fileSource: this.fileSourceControl,
      statusSelection: this.statusSelectionControl,
    });

    this.activatedRoute.queryParams.subscribe(query => {
      const invoiceRef = query['ref.invoice'] || '';
      const ref = query['ref'] || '';

      if (!invoiceRef || !ref) {
        this.notificationService.showWarning('Ha ocurrido algo inesperado');
        this.router.navigate([
          'admin', 'orders'
        ]);
        return;
      }

      this.orderUID = ref;
      this.invoiceUID = invoiceRef;
    });
  }

  ngOnInit(): void {
    try {
      this.fetchData();
    } catch {
      this.notificationService.showWarning('Ha ocurrido algo inesperado');
      return;
    }
  }

  fetchData(): void {
    ((async () => {
      if (this.invoiceUID === '') {
        return;
      }

      const row = await this.orderService.fetchInvoiceByUID(this.orderUID, this.invoiceUID);
      this.descriptionControl.setValue(row.description);
      this.commentsControl.setValue(row.comments);
      this.statusSelectionControl.setValue(row.status);
      this.invoiceAttachment = row.attachment.guid;
      this.fileControl.setValue('');
      this.form.patchValue({
        fileSource: null
      });
    }))();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.form.patchValue({
      fileSource: file
    });
    this.form.get('fileSource')?.updateValueAndValidity();
  }

  submitEventHandler(basicForm: BasicForm): void {
    (async () => {
      try {
        let formData: any = new FormData();
        formData.append('description', basicForm.description);
        formData.append('comments', basicForm.comments);
        formData.append('file', basicForm.fileSource);

        await this.orderService.uploadInvoice(this.orderUID, this.invoiceUID, formData);
        this.notificationService.show('Se actualizó la factura.');
        this.fetchData();
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }

  downloadInvoiceEventHandler(): void {
    (async () => {

    })();
  }

  statusSelectionChange() {
    (async () => {
      try {
        const request = {
          bookingUID: this.orderUID,
          invoiceUID: this.invoiceUID,
          status: this.statusSelectionControl.value,
        };
        await this.orderService.updateInvoiceStatus(request);
        this.notificationService.show('Se actualizó la factura.');
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }
}

interface BasicForm {
  description: string;
  comments: string;
  file: string;
  fileSource: File;
}

interface selectionOptions {
  label: string;
  value: string;
}