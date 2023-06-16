import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountDTO } from 'src/app/commons/models/global-dto';
import { BranchOfficeService } from 'src/app/commons/services/branch-office.service';
import { CustomerService } from 'src/app/commons/services/customer.service';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { UserService } from 'src/app/commons/services/user.service';


@Component({
  selector: 'app-user-basic',
  templateUrl: './user-basic.component.html',
  styleUrls: ['./user-basic.component.scss']
})
export class UserBasicComponent implements OnInit {

  roles: any[] = [];
  branchOffices: any[] = [];

  get isEdition(): boolean {
    return !!this.userUID.length;
  }

  userUID: string = '';

  customerRef: AccountDTO = {} as AccountDTO;

  get buttonText(): string {
    return this.isEdition
      ? 'Actualizar Usuario'
      : 'Crear Usuario';
  }

  form: FormGroup;

  checked: boolean = false;

  set isDeactivatedCheckModel(value: boolean) {
    this.checked = value;
  }

  get isDeactivatedCheckModel(): boolean {
    return this.checked;
  }

  get roleOperatorSelected(): boolean {
    return this.roleSelectionControl.value === 'role-operator'
  }

  get validForm(): boolean {
    return this.form.valid && this.isBranchOfficeChecked();
  }

  // personTypeOptions: SelectOptions[] = [
  //   {
  //     label: 'Persona Humana',
  //     value: 'natural',
  //   },
  //   {
  //     label: 'Persona Jurídica',
  //     value: 'legal',
  //   },
  // ];

  nameControl: FormControl = new FormControl('', Validators.required);
  roleSelectionControl: FormControl = new FormControl('', Validators.required);
  documentControl: FormControl = new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(7)]);
  emailControl: FormControl = new FormControl('', [Validators.required, Validators.email]);
  phoneControl: FormControl = new FormControl('', Validators.required);
  addressControl: FormControl = new FormControl('', Validators.required);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private customerService: CustomerService,
    private userService: UserService,
    private branchOfficeService: BranchOfficeService,
  ) {
    this.activatedRoute.queryParams.subscribe(query => {
      const ref = query['ref'] || '';
      this.userUID = ref;
    });

    this.form = new FormGroup({
      name: this.nameControl,
      roleSelection: this.roleSelectionControl,
      document: this.documentControl,
      email: this.emailControl,
      phone: this.phoneControl,
      address: this.addressControl,
    });
  }

  ngOnInit(): void {
    (async () => {
      await this.fetchRoles();
      await this.fetchBranches();
      
      if (this.isEdition) {
        await this.fetchData();
      }
    })();
  }

  async fetchBranches() {
      const branches = await this.branchOfficeService.fetchAll();
      for (const branch of branches) {
        this.branchOffices.push({
          label: branch.name,
          value: branch.pk,
        });
        this.form.addControl(branch.pk, new FormControl(false));
      }
      // this.checkSelection(this.roleSelectionControl, this.roles);
  }

  async fetchRoles() {
    try {
      const roles = await this.userService.getRoles();
      for (const role of roles) {
        this.roles.push({
          label: role.name,
          value: role.gsi,
        });
      }
      this.checkSelection(this.roleSelectionControl, this.roles);
    }
    catch (error: any) {
      this.notificationService.errorDialog(error);
    }
  }

  async fetchData() {
    try {
      const [person] = await this.userService.getUsers(this.userUID);
      this.nameControl.setValue(person.name);
      this.roleSelectionControl.setValue(person.roleName);
      this.documentControl.setValue(person.document);
      this.emailControl.setValue(person.email);
      this.phoneControl.setValue(person.phone);
      this.addressControl.setValue(person.address);
      this.isDeactivatedCheckModel = (person.status !== 'active');
      this.customerRef = person;

      if (person.roleName === 'role-operator') {
        const branches = await this.userService.getOperatorBranchOffices(person.uid);
        for (const branch of branches) {
          this.form.controls[branch].setValue(true);
        }
      }
    }
    catch (error: any) {
      this.notificationService.errorDialog(error);
    }
  }

  submitEventHandler(form: any): void {
    (async () => {
      try {
        let request: any = {
          name: form.name,
          roleName: form.roleSelection,
          document: form.document,
          email: form.email,
          phone: form.phone,
          address: form.address,
        };

        const branches = Object.entries(this.form.controls)
        .filter(([key, control]) => key.includes('bo:') && control.value)
        .map(([key]) => key);

        request.branches = branches;

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
  
  async createHandler(data: any): Promise<void> {
    try {
      const iam = await this.userService.createUser(data);
      this.router.navigate(['admin/settings/users/profile'], {
        queryParams: {
          ref: iam,
        }
      });
      this.notificationService.show('Se creó el usuario.');
    }
    catch (error: any) {
      this.notificationService.errorDialog(error);
    }
    finally {
      return Promise.resolve();
    }
  }

  async updateHandler(data: any): Promise<void> {
    try {
      data.uid = this.userUID;
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
          uid: this.userUID,
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
          uid: this.userUID,
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

  checkSelection(formControl: FormControl, collection: any[]) {
    if (this.isEdition
      && collection.find((element) => formControl.value === element.value)) {
        return;
    }
    formControl.setValue(collection[0].value);
  }
  
  resetEventHandler(): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confirma que deseas resetear el usuario?');
        if (!confirmed) {
          return;
        }

        await this.customerService.resetUser(this.userUID);

        this.notificationService.show('Se actualizó el usuario.');

        this.notificationService.showSuccess('Se envio una contraseña nueva al correo del usuario.');
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  isBranchOfficeChecked(): boolean {
    if (this.roleSelectionControl.value !== 'role-operator') {
      return true;
    }

    let result = false;
    for (const branch of this.branchOffices) {
      if (this.form.controls[branch.value].value) {
        result = true;
        break;
      }
    }
    return result;
  }
}
