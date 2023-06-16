import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleColumn } from 'src/app/commons/components/simple-tablex';
import { AccountDTO, ResourceDTO } from 'src/app/commons/models/global-dto';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { UserService } from 'src/app/commons/services/user.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  columns: SimpleColumn[] = [
    { property: 'name', label: 'Nombre' },
    { property: 'roleLabel', label: 'Rol' },
    { property: 'email', label: 'Email' },
    { property: 'actions', label: 'Acciones' },
  ];

  users: any[] = new Array<any>();

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private userService: UserService,
  ) { }

  ngOnInit(): void { 
    this.fecthData();
  }

  async fecthData(): Promise<void> {
    try {
      this.users = await this.userService.getUsers();
    }
    catch (error: any) {
      this.notificationService.showError(error.message);
    }
  }

  editClickEventHandler(data: any): void {
    this.router.navigate([
      'admin', 'settings', 'users', 'profile',
    ], {
      queryParams: {
        ref: data.uid,
      },
      queryParamsHandling: 'merge',
    });
  }
}
