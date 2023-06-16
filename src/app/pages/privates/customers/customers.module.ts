import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'src/app/commons/components/breadcrumb/breadcrumb.module';
import { IconLabelModule } from 'src/app/commons/components/icon-label/icon-label.module';
import { SimpleTablexModule } from 'src/app/commons/components/simple-tablex/simple-tablex.component';
import { SpinnerButtonModule } from 'src/app/commons/components/spinner-button/spinner-button.module';
import { TableModule } from 'src/app/commons/components/table/table.module';
import { CustomerService } from 'src/app/commons/services/customer.service';
import { CustomersComponent } from './customers.component';
import { CustomerProfileComponent } from './profile/customer-profile.component';
import { CustomerBasicComponent } from './profile/basic/customer-basic.component';
import { CustomerHistoryComponent } from './profile/history/customer-history.component';
import { CustomerUserComponent } from './profile/user/customer-user.component';
import { SimpleMenuModule } from 'src/app/commons/components/simple-menu';
import { SimpleCardModule } from 'src/app/commons/components/simple-card';
import { SimpleTableModule } from 'src/app/commons/components/simple-table';
import { CustomerAuthorizedsComponent } from './profile/authorizeds/customer-authorizeds.component';
import { AuthorizedsComponent } from './authorizeds/authorizeds.component';
import { AuthorizedsBasicComponent } from './authorizeds/basic/authorizeds-basic.component';
import { NoContentModule } from 'src/app/commons/components/no-content/no-content.module';


@NgModule({
  declarations: [
    CustomersComponent,
    CustomerProfileComponent,
    CustomerBasicComponent,
    CustomerUserComponent,
    CustomerHistoryComponent,
    CustomerAuthorizedsComponent,
    AuthorizedsComponent,
    AuthorizedsBasicComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: CustomersComponent,
      },
      {
        path: 'profile',
        component: CustomerProfileComponent
      },
      {
        path: 'authorizeds',
        component: AuthorizedsComponent
      }
    ]),
    FormsModule,
    ReactiveFormsModule,
    SpinnerButtonModule,
    BreadcrumbModule,
    IconLabelModule,
    TableModule,
    SimpleTablexModule,
    SimpleMenuModule,
    SimpleCardModule,
    SimpleTableModule,
    NoContentModule,
  ],
  providers: [
    CustomerService,
  ],
})
export class CustomersModule { }
