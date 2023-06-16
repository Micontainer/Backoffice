import { threadSleep } from '../../functions/thread-sleep.function';
import { FileService } from './../../services/file.service';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';


@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss']
})
export class DropzoneComponent {

  @ViewChild('inputFile') inputFile: ElementRef<HTMLInputElement> | undefined;

  @Output() sync: EventEmitter<void> = new EventEmitter();

  selectedFile: File | undefined;
  isDragged: boolean = false;

  constructor(
    private fileService: FileService,
  ) { }

  onDragOverEventHandler(event: any): void {
    event.preventDefault();
    this.isDragged = true;
  }

  onDragLeaveEventHandler(event: any): void {
    this.isDragged = false;
  }

  onDropEventHandler(event: any): void {
    event.preventDefault();
    this.isDragged = false;

    if (event.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < event.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (event.dataTransfer.items[i].kind === "file"
          && event.dataTransfer.items[i].type.includes('image/')) {
          this.selectedFile = event.dataTransfer.items[i].getAsFile();
        }
      }
    }
  }

  onFileChangeEventHandler(event: any): void {
    if (!event.target.files.length) {
      return;
    }
    this.selectedFile = event.target.files[0];
  }

  uploadEventHandler(event: any) {
    (async () => {
      event.stopPropagation();
      if (!this.selectedFile) {
        return;
      }
      const formData = new FormData();
      let data: any = {
        type: 'image',
      }
      formData.append('files', this.selectedFile);
      formData.append('data', JSON.stringify(data));
      await this.fileService.upload(formData);
      this.selectedFile = undefined;
      this.sync.emit();
    })();
  }

  openSearchDialogEventHandler(event: any) {
    this.inputFile?.nativeElement.click();
  }
}
