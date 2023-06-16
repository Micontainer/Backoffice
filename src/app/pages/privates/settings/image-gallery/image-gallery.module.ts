import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SimpleCardModule } from 'src/app/commons/components/simple-card';
import { SimpleMenuModule } from 'src/app/commons/components/simple-menu';
import { SimpleTablexModule } from 'src/app/commons/components/simple-tablex';
import { ImageGalleryBasicComponent } from './profile/basic/image-gallery-basic.component';
import { ImageGalleryProfileComponent } from './profile/image-gallery-profile.component';
import { ImageGalleryComponent } from './image-gallery.component';
import { ShapeService } from 'src/app/commons/services/shape.service';
import { ImageGalleryComponentModule } from 'src/app/commons/components/image-gallery/image-gallery.module';


@NgModule({
  declarations: [
    ImageGalleryComponent,
    ImageGalleryProfileComponent,
    ImageGalleryBasicComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ImageGalleryComponent,
      },
      {
        path: 'profile',
        component: ImageGalleryProfileComponent,
      },
    ]),
    FormsModule,
    ReactiveFormsModule,
    SimpleCardModule,
    SimpleMenuModule,
    SimpleTablexModule,
    ImageGalleryComponentModule,
  ],
  providers: [
    ShapeService,
  ]
})
export class ImageGalleryModule { }
