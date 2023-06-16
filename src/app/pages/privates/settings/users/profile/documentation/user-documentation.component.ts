import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountDTO } from 'src/app/commons/models/global-dto';
import { CustomerService } from 'src/app/commons/services/customer.service';
import { NotificationService } from 'src/app/commons/services/notification.service';


@Component({
  selector: 'app-user-documentation',
  templateUrl: './user-documentation.component.html',
  styleUrls: ['./user-documentation.component.scss']
})
export class UserDocumentationComponent implements OnInit {

  get isEdition(): boolean {
    return !!this.customerUID.length;
  }

  customerUID: string = '';

  customerRef: AccountDTO = {} as AccountDTO;

  form: FormGroup;
  docFrontFileControl: FormControl = new FormControl('', Validators.required);
  docFrontfileSourceControl: FormControl = new FormControl('');
  docBackFileControl: FormControl = new FormControl('', Validators.required);
  docBackfileSourceControl: FormControl = new FormControl('');

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
      docFrontFile: this.docFrontFileControl,
      docFrontfileSource: this.docFrontfileSourceControl,
      docBackFile: this.docBackFileControl,
      docBackfileSource: this.docBackfileSourceControl,
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

        // this.emailControl.setValue(user.email);

        this.customerRef = user;
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
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

}

interface PageForm {
  email: string;
  password: string;
}
