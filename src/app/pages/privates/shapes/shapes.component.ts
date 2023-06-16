import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumn } from 'src/app/commons/components/table/interfaces/table-column';
import { TableOptions } from 'src/app/commons/components/table/interfaces/table-options';
import { TableComponent } from 'src/app/commons/components/table/table.component';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { ShapeService } from 'src/app/commons/services/shape.service';


@Component({
  selector: 'app-shapes',
  templateUrl: './shapes.component.html',
  styleUrls: ['./shapes.component.scss']
})
export class ShapesComponent implements OnInit {
  @ViewChild(TableComponent) shapesList!: TableComponent;

  columnsCollections: TableColumn[] = [
    // { id: 1, property: 'uuid', label: 'ID', size: 'sm', type: 'text', filterable: true, },
    { id: 2, property: 'name', label: 'Nombre', size: 'lg', type: 'text', filterable: true, },
    { id: 3, property: 'height', label: 'Altura', size: 'sm', type: 'text', filterable: true, },
    { id: 4, property: 'width', label: 'Anchura', size: 'sm', type: 'text', filterable: true, },
    { id: 5, property: 'depth', label: 'Profundidad', size: 'sm', type: 'text', filterable: true, },
    { id: 6, property: 'status', label: 'Estado', size: 'sm', type: 'toggle', filterable: true, dataProperty: 'statusData', },
    { id: 7, property: 'created', label: 'Creado', size: 'sm', type: 'text', filterable: true, },
    { id: 8, property: 'actions', label: 'Acción', size: 'sm', type: 'action', },
  ];

  tableOptions: TableOptions;

  constructor(
    private notificationService: NotificationService,
    private shapeService: ShapeService,
    private router: Router,
  ) {
    this.tableOptions = {
      columns: this.columnsCollections,
    } as TableOptions;
  }

  ngOnInit(): void {
    this.onInit();
  }

  async onInit(): Promise<void> {
    try {
      const collection = await this.shapeService.fetchAll();
      this.shapesList.updateData(collection);
    }
    catch (error: any) {
      this.notificationService.showError(error.message);
    }
  }

}
