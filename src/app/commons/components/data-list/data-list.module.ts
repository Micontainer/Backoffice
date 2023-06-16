import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataListComponent } from './data-list.component';


@NgModule({
  declarations: [
    DataListComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DataListComponent,
  ],
})
export class DataListModule { }
