import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Login } from "src/app/commons/models/interfaces/login";
import { NotificationService } from 'src/app/commons/services/notification.service';
import { PublicService } from "src/app/commons/services/public.service";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  authForm: FormGroup;
  viewPassword: boolean = false;

  emailControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
  passwordControl: FormControl = new FormControl('', Validators.required);

  constructor(
    private publicService: PublicService,
    private router: Router,
    private notificationService: NotificationService,
  ) {
    console.log('Login component is online now!');
    this.authForm = new FormGroup({
      email: this.emailControl,
      password: this.passwordControl
    });
  }

  ngOnInit() { }

  submitEventHandler(formValues: Login): void {
    (async () => {
      try {
        await this.publicService.doLogin(formValues);
        this.router.navigate(['admin', 'dashboard']);
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }

}
