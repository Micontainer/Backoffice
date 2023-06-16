import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SimpleCardModule } from 'src/app/commons/components/simple-card';
import { SimpleMenuModule } from 'src/app/commons/components/simple-menu';
import { SimpleTableModule } from 'src/app/commons/components/simple-table';
import { SimpleTablexModule } from 'src/app/commons/components/simple-tablex';
import { ShapeService } from 'src/app/commons/services/shape.service';
import { ShapeBasicComponent } from './profile/basic/shape-basic.component';
import { ShapeProfileComponent } from './profile/shape-profile.component';
import { ShapeComponent } from './shape.component';
import { ImageGalleryComponentModule } from 'src/app/commons/components/image-gallery/image-gallery.module';


@NgModule({
  declarations: [
    ShapeComponent,
    ShapeProfileComponent,
    ShapeBasicComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ShapeComponent,
      },
      {
        path: 'profile',
        component: ShapeProfileComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    SimpleCardModule,
    SimpleTableModule,
    SimpleMenuModule,
    SimpleTablexModule,
    ImageGalleryComponentModule,
  ],
  providers: [
    ShapeService,
  ]
})
export class ShapeModule { }
