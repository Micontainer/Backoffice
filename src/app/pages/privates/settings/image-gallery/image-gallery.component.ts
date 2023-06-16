import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { ShapeService } from 'src/app/commons/services/shape.service';


@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit {

  images: string[] = new Array<string>();
  selectedImg: string = '';

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private shapeService: ShapeService,
  ) { }

  ngOnInit(): void { 
    this.fecthData();
  }

  async fecthData(): Promise<void> {
    try {
      this.images = [
        'https://i.pinimg.com/736x/12/46/9c/12469c8a50bcb6e344589c43eb7db72c.jpg',
        'https://eadn-wc01-5964675.nxedge.io/wp-content/uploads/2022/09/RandomSuccessatInnovation-SocialGraphic01-760x394.jpg',
        'https://images3.memedroid.com/images/UPLOADED945/626dbbbf26e4d.jpeg',
      ]
    }
    catch (error: any) {
      this.notificationService.showError(error.message);
    }
  }

  deleteEventHandler(row: string): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confírma que desea eliminar el objeto? esta acción no podrá ser revertida.');
        if (!confirmed) {
          return;
        }
        
        // await this.shapeService.updateStatus('trash', row.uid);

        this.notificationService.show('Se eliminó el objeto.');

        await this.fecthData();
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }
  
  editionClickEventHandler(data: string): void {
    this.router.navigate([
      'admin', 'settings', 'images', 'profile',
    ], {
      queryParams: {
        ref: data,
      },
      queryParamsHandling: 'merge',
    });
  }

  selectImageEventHandler(source: string) {
    this.selectedImg = source;
  }
}
