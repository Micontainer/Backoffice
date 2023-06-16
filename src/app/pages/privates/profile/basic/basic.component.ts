import { IdentityService } from './../../../../commons/services/identity.service';

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { PasswordDTO, UserService } from 'src/app/commons/services/user.service';


@Component({
  selector: 'app-profile-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss']
})
export class ProfileBasicComponent implements OnInit {

  iam: string | undefined;

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

  formUserInfo: FormGroup;
  nameLastnameControl: FormControl = new FormControl('', Validators.required);
  documentControl: FormControl = new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(7)]);
  emailControl: FormControl = new FormControl('', Validators.required);
  phoneControl: FormControl = new FormControl('', Validators.required);
  addressControl: FormControl = new FormControl('', Validators.required);

  //#region USER_PASSWORD
  formPassword: FormGroup;

  oldPasswordControl: FormControl = new FormControl('', Validators.required);
  newPasswordControl: FormControl = new FormControl('', Validators.required);
  repeatNewPasswordControl: FormControl = new FormControl('', Validators.required);

  PASSWORD_VIEW = {
    OLD_PASSWORD: false,
    NEW_PASSWORD: false,
    REPEAT_NEW_PASSWORD: false,
  }

  retrieveLabelType(value: boolean): string {
    return value ? 'text' : 'password';
  }

  changeIcon(value: boolean): string {
    return value ? 'visibility_off' : 'visibility';
  }

  get checkNewPassword(): boolean {
    return this.newPasswordControl.value === this.repeatNewPasswordControl.value
      && this.oldPasswordControl.value !== this.newPasswordControl.value;
  }
  //#endregion USER_PASSWORD

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private identityService: IdentityService,
    private userService: UserService,
  ) {
    this.formUserInfo = new FormGroup({
      nameLastname: this.nameLastnameControl,
      document: this.documentControl,
      email: this.emailControl,
      phone: this.phoneControl,
      address: this.addressControl,
    });

    this.formPassword = new FormGroup({
      oldPassword: this.oldPasswordControl,
      newPassword: this.newPasswordControl,
      repeatNewPassword: this.repeatNewPasswordControl
    });
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    const user = this.identityService.getLoggedUser();
    if (!user) {
      this.router.navigate(['home']);
    }
    this.iam = user?.user.uid;

    this.nameLastnameControl.setValue(user?.user.fullName);
    this.documentControl.setValue(user?.user.document);
    this.emailControl.setValue(user?.user.username);
    this.phoneControl.setValue(user?.user.phone);
    this.addressControl.setValue(user?.user.address);
  }

  updateUserData(form: any) {
    (async () => {
      try {
        const userDTO = {
          ...form,
          name: form.nameLastname,
        };
        await this.userService.updateData(userDTO);
        this.notificationService.show('Se han actualizado tus datos.');
        this.fetchData();
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }

  changePassword(form: any) {
    (async () => {
      try {
        const passworDTO = {
          uid: this.iam,
          password: /*atob(*/form.newPassword/*)*/,
        } as PasswordDTO;
        await this.userService.updatePassword(passworDTO);
        this.notificationService.show('Se ha cambiado tu contraseña.');
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }
}

interface SelectOptions {
  label: string;
  value: string;
}
