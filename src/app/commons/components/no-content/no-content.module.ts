import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoContentComponent } from './no-content.component';


@NgModule({
  declarations: [
    NoContentComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    NoContentComponent,
  ],
})
export class NoContentModule { }
