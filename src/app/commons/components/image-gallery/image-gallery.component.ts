import { CommonService } from 'src/app/commons/services/common.service';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { FileService } from '../../services/file.service';


@Component({
  selector: 'app-image-gallery-component',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent {

  @ViewChild('closeButton') closeButton: ElementRef<HTMLButtonElement> | undefined;

  @Input() isModal = false;
  @Output() selectImage: EventEmitter<any> = new EventEmitter;

  images: any[] = new Array<any>();
  selectedImage: any;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private fileService: FileService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.fetchData();
  }

  async fetchData(): Promise<void> {
    try {
      this.images = await this.fileService.get('image', 'GALLERY');
      if (this.isModal) {
        return;
      }
      for (const image of this.images) {
        image.resources = await this.commonService.fetchRelations(image.uid);
      }
    }
    catch (error: any) {
      this.notificationService.showError(error.message);
    }
  }

  deleteEventHandler(): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confírma que desea eliminar la imagen? esta acción no podrá ser revertida.');
        if (!confirmed) {
          return;
        }

        await this.fileService.delete('image', this.selectedImage.uid);
        this.notificationService.show('Se eliminó la imagen.');
        this.closeButton?.nativeElement.click();
        await this.fetchData();
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  selectImageEventHandler(source: any) {
    this.selectedImage = source;
    if (this.isModal) {
      this.selectImage.emit(this.selectedImage);
    }
  }
}
