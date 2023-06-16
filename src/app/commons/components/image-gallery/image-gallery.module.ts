import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageGalleryComponent } from './image-gallery.component';
import { DropzoneModule } from '../dropzone/dropzone.module';
import { FileService } from '../../services/file.service';
import { NoContentComponent } from '../no-content/no-content.component';
import { NoContentModule } from '../no-content/no-content.module';
import { CommonService } from '../../services/common.service';


@NgModule({
  declarations: [
    ImageGalleryComponent,
  ],
  imports: [
    CommonModule,
    DropzoneModule,
    NoContentModule,
  ],
  exports: [
    ImageGalleryComponent,
  ],
  providers: [
    FileService,
    CommonService,
  ]
})
export class ImageGalleryComponentModule { }
