import { NavbarModule } from '../../../commons/components/navbar/navbar.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { BreadcrumbModule } from 'src/app/commons/components/breadcrumb/breadcrumb.module';

@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ]),
    NavbarModule,
    BreadcrumbModule,
  ],
  providers: [],
})
export class DashboardModule { }
