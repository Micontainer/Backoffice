import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconLabelModule } from 'src/app/commons/components/icon-label/icon-label.module';
import { SpinnerButtonModule } from 'src/app/commons/components/spinner-button/spinner-button.module';
import { TableModule } from 'src/app/commons/components/table/table.module';
import { VolumeCalculatorModule } from 'src/app/commons/components/volume-calculator/volume-calculator.module';
import { BranchOfficeService } from 'src/app/commons/services/branch-office.service';
import { CommonService } from 'src/app/commons/services/common.service';
import { BookingBoardComponent } from './board/booking-board.component';
import { StoragesComponent } from './storages.component';


@NgModule({
  declarations: [
    StoragesComponent,
    BookingBoardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: StoragesComponent,
      },
    ]),
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    VolumeCalculatorModule,
    IconLabelModule,
    SpinnerButtonModule,
  ],
  providers: [
    BranchOfficeService,
    CommonService,
  ]
})
export class StoragesModule { }
