import { ShapeModel } from './../../../../commons/view-models/shape.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleColumn } from 'src/app/commons/components/simple-tablex';
import { ResourceDTO } from 'src/app/commons/models/global-dto';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { ShapeService } from 'src/app/commons/services/shape.service';


@Component({
  selector: 'app-shape',
  templateUrl: './shape.component.html',
  styleUrls: ['./shape.component.scss']
})
export class ShapeComponent implements OnInit {

  columns: SimpleColumn[] = [
    { property: 'description', label: 'Descripción' },
    { property: 'height', label: 'Altura' },
    { property: 'width', label: 'Anchura' },
    { property: 'depth', label: 'Profundidad' },
    { property: 'actions', label: 'Actions' },
  ];

  shapes: ResourceDTO[] = new Array<ResourceDTO>();

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
      const collection = await this.shapeService.fetchAllV2();
      this.shapes = collection;
    }
    catch (error: any) {
      this.notificationService.showError(error.message);
    }
  }

  deleteEventHandler(row: ResourceDTO): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confírma que desea eliminar el objeto? esta acción no podrá ser revertida.');
        if (!confirmed) {
          return;
        }
        
        await this.shapeService.updateStatus('trash', row.uid);

        this.notificationService.show('Se eliminó el objeto.');

        await this.fecthData();
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }
  
  editionClickEventHandler(data: ResourceDTO): void {
    this.router.navigate([
      'admin', 'settings', 'shapes', 'profile',
    ], {
      queryParams: {
        ref: data.uid,
      },
      queryParamsHandling: 'merge',
    });
  }
}
