import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SimpleCardModule } from 'src/app/commons/components/simple-card';
import { SimpleMenuModule } from 'src/app/commons/components/simple-menu';
import { SimpleTableModule } from 'src/app/commons/components/simple-table';
import { SimpleTablexModule } from 'src/app/commons/components/simple-tablex';
import { UserBasicComponent } from './profile/basic/user-basic.component';
import { UsersComponent } from './users.component';
import { UsersProfileComponent } from './profile/users-profile.component';
import { UserService } from 'src/app/commons/services/user.service';
import { UserDocumentationComponent } from './profile/documentation/user-documentation.component';
import { BranchOfficeService } from 'src/app/commons/services/branch-office.service';


@NgModule({
  declarations: [
    UsersComponent,
    UsersProfileComponent,
    UserBasicComponent,
    UserDocumentationComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UsersComponent,
      },
      {
        path: 'profile',
        component: UsersProfileComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    SimpleCardModule,
    SimpleTableModule,
    SimpleMenuModule,
    SimpleTablexModule,
  ],
  providers: [
    UserService,
    BranchOfficeService,
  ]
})
export class UsersModule { }
