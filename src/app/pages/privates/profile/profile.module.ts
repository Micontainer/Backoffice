import { SimpleTablexModule } from './../../../commons/components/simple-tablex/simple-tablex.component';
import { SimpleCardModule } from './../../../commons/components/simple-card/simple-card.component';
import { ProfileComponent } from './profile.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SimpleMenuModule } from 'src/app/commons/components/simple-menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoContentModule } from 'src/app/commons/components/no-content/no-content.module';
import { ProfileBasicComponent } from './basic/basic.component';
import { UserService } from 'src/app/commons/services/user.service';


@NgModule({
  declarations: [
    ProfileComponent,
    ProfileBasicComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'profile'
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    SimpleMenuModule,
    SimpleCardModule,
    SimpleTablexModule,
    NoContentModule,
    SimpleCardModule,
  ],
  providers: [
    UserService,
  ]
})
export class ProfileModule { }
