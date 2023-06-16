import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { NgModule } from "@angular/core";
import { SpinnerButtonModule } from "../spinner-button/spinner-button.module";
import { VolumeCalculatorComponent } from './volume-calculator.component';


@NgModule({
  declarations: [
    VolumeCalculatorComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SpinnerButtonModule,
  ],
  exports: [
    VolumeCalculatorComponent
  ]
})
export class VolumeCalculatorModule { }
