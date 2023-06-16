import { CommonService } from 'src/app/commons/services/common.service';
import { SpaceService } from '../../../commons/services/space.service';
import { LevelService } from '../../../commons/services/level.service';
import { BuildingService } from '../../../commons/services/building.service';
import { BranchOfficeService } from 'src/app/commons/services/branch-office.service';
import { OrderService } from 'src/app/commons/services/order.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SimpleCardModule } from 'src/app/commons/components/simple-card';
import { SimpleMenuModule } from 'src/app/commons/components/simple-menu';
import { SimpleTableModule } from 'src/app/commons/components/simple-table';
import { SimpleTablexModule } from 'src/app/commons/components/simple-tablex';
import { BookingsComponent } from './bookings.component';
import { BookingBasicComponent } from './profile/basic/booking-basic.component';
import { BookingProfileComponent } from './profile/booking-profile.component';
import { BookingInvoicesComponent } from './profile/invoices/booking-invoices.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoicesBasicComponent } from './invoices/basic/invoices-basic.component';
import { NoContentModule } from 'src/app/commons/components/no-content/no-content.module';

@NgModule({
  declarations: [
    BookingsComponent,
    BookingProfileComponent,
    BookingBasicComponent,
    BookingInvoicesComponent,
    InvoicesComponent,
    InvoicesBasicComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: BookingsComponent,
      },
      {
        path: 'profile',
        component: BookingProfileComponent,
      },
      {
        path: 'invoices',
        component: InvoicesComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    SimpleCardModule,
    SimpleMenuModule,
    SimpleTablexModule,
    NoContentModule,
  ],
  providers: [
    OrderService,
    BranchOfficeService,
    BuildingService,
    LevelService,
    SpaceService,
    CommonService,
  ]
})
export class BookingsModule { }
