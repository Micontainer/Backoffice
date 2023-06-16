import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceDTO } from 'src/app/commons/models/global-dto';
import { BranchOfficeService } from 'src/app/commons/services/branch-office.service';
import { NotificationService } from 'src/app/commons/services/notification.service';


@Component({
  selector: 'app-branch-contacts',
  templateUrl: './branch-contacts.component.html',
  styleUrls: ['./branch-contacts.component.scss']
})
export class BranchContactsComponent implements OnInit {

  get isEdition(): boolean {
    return !!this.branchUID?.length;
  }

  branchUID: string = '';
  contactRef: ResourceDTO = {} as ResourceDTO;

  get buttonText(): string {
    return this.hasContact
      ? 'Actualizar Contacto'
      : 'Crear Contacto';
  }

  get hasContact(): boolean {
    return !!this.contactRef?.uid;
  }

  form: FormGroup;

  phoneControl: FormControl = new FormControl('', Validators.required);
  emailControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
  whatsappControl: FormControl = new FormControl('', Validators.required);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private branchService: BranchOfficeService,
  ) {
    this.form = new FormGroup({
      phone: this.phoneControl,
      email: this.emailControl,
      whatsapp: this.whatsappControl,
    });

    this.activatedRoute.queryParams.subscribe(query => {
      const ref = query['ref'] ?? '';

      if (!ref) {
        // FIXME navigate to safe zone here;
        return;
      }

      this.branchUID = ref;
    });
  }

  ngOnInit(): void {
    (async () => {
      try {
        if (!this.isEdition) {
          return;
        }

        const dataset = await this.branchService.fetchByUUID(this.branchUID);

        const contact = dataset.find(row => row.category === 'CONTACTS');
        if (!contact) {
          return;
        }

        this.phoneControl.setValue(contact.phone);
        this.emailControl.setValue(contact.email);
        this.whatsappControl.setValue(contact.whatsapp);

        this.contactRef = contact;
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  submitEventHandler(form: ContactForm): void {
    (async () => {
      try {
        const request = {
          ...form,
        } as ResourceDTO;

        if (this.hasContact) {
          await this.updateHandler(request);
          return;
        }

        await this.branchService.saveContact(request, this.branchUID);

        this.notificationService.show('Se creó el contacto.');

        return;
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  async updateHandler(request: ResourceDTO): Promise<void> {
    try {
      request.uid = this.contactRef.uid;
      await this.branchService.updateContact(request, this.branchUID);
      this.notificationService.show('Se actualizó el contacto.');
    }
    catch (error: any) {
      this.notificationService.errorDialog(error);
    }
    finally {
      return Promise.resolve();
    }
  }
}

interface ContactForm {
  phone: string;
  email: string;
  whatsapp: string;
}
