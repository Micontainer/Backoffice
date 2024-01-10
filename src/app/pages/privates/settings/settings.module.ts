import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { AdminsOnlyModule } from 'src/app/commons/directives/admins-only/admins-only.module';
import { CommonService } from 'src/app/commons/services/common.service';
import { NotificationService } from 'src/app/commons/services/notification.service';


@NgModule({
  declarations: [
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SettingsComponent,
      },
      {
        path: 'branch-offices',
        loadChildren: () => import('./branch-offices/branch-offices.module').then(module => module.BranchOfficesModule),
      },
      // {
      //   path: 'branch-offices/create',
      //   component: BranchOfficeProfileComponent,
      // },
      {
        path: 'shapes',
        loadChildren: () => import('./shapes/shape.module').then(module => module.ShapeModule),
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(module => module.UsersModule),
      },
      {
        path: 'images-gallery',
        loadChildren: () => import('./image-gallery/image-gallery.module').then(module => module.ImageGalleryModule),
      },
    ]),
    AdminsOnlyModule,
  ],
  providers: [
    CommonService,
    NotificationService,
  ],
})
export class SettingsModule { }
