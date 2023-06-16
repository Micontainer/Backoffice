import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DropzoneComponent } from './dropzone.component';
import { FileService } from '../../services/file.service';


@NgModule({
  declarations: [
    DropzoneComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DropzoneComponent,
  ],
  providers: [
    FileService,
  ],
})
export class DropzoneModule { }
