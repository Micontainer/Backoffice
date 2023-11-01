import { CustomerService } from './../../commons/services/customer.service';
import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IconLabelModule } from 'src/app/commons/components/icon-label/icon-label.module';
import { SidebarModule } from 'src/app/commons/components/sidebar/sidebar.module';
import { NotificationComponent } from './layout/controls/notification/notification.component';
import { HeaderComponent } from './layout/header/header.component';
import { LayoutComponent } from './layout/layout.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { PrivateRoutingModule } from "./private-routing.module";
import { AdminsOnlyModule } from 'src/app/commons/directives/admins-only/admins-only.module';
import { CurrencyDirective } from 'src/app/commons/directives/currency.directive';
import { PushService } from 'src/app/commons/services/push.service';


@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    NavbarComponent,
    HeaderComponent,
    NotificationComponent,
    CurrencyDirective,
  ],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IconLabelModule,
    SidebarModule,
  ],
  providers: [
    CustomerService,
    PushService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrivateModule { }
