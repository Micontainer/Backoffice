import { VolumeCalculatorModule } from './../../../commons/components/volume-calculator/volume-calculator.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SpinnerButtonModule } from 'src/app/commons/components/spinner-button/spinner-button.module';
import { TableModule } from 'src/app/commons/components/table/table.module';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { ShapeService } from 'src/app/commons/services/shape.service';
import { ShapesFormComponent } from './form/shapes-form.component';
import { ShapesComponent } from './shapes.component';
import { BreadcrumbModule } from 'src/app/commons/components/breadcrumb/breadcrumb.module';


@NgModule({
  declarations: [
    ShapesComponent,
    ShapesFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ShapesComponent,
      },
      {
        path: 'create',
        component: ShapesFormComponent,
      },
    ]),
    TableModule,
    SpinnerButtonModule,
    FormsModule,
    ReactiveFormsModule,
    VolumeCalculatorModule,
    BreadcrumbModule,
  ],
  providers: [
    NotificationService,
    ShapeService,
  ],
})
export class ShapesModule { }
