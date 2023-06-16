import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpinnerModule } from '../spinner/spinner.module';
import { SidebarComponent } from './sidebar.component';


@NgModule({
  declarations: [
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    SpinnerModule,
  ],
  exports: [
    SidebarComponent,
  ],
})
export class SidebarModule { }
