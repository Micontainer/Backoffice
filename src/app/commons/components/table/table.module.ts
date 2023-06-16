import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TablePaginationComponent } from './table-pagination/table-pagination.component';
import { TableComponent } from './table.component';


@NgModule({
  declarations: [
    TableComponent,
    TablePaginationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    TableComponent,
    TablePaginationComponent,
  ]
})
export class TableModule { }
