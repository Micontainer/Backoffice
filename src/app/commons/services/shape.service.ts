import { Injectable } from '@angular/core';
import { TableAction } from '../components/table/interfaces/table-action';
import { ResourceDTO } from '../models/global-dto';
import { ShapeModel } from '../view-models/shape.model';
import { BaseService } from './base.service';
import { RestService } from './rest.service';


@Injectable()
export class ShapeService extends BaseService {

  constructor(
    private restService: RestService,
  ) {
    super();
  }

  async fetchAll(): Promise<ShapeModel[]> {
    try {
      const response = await this.restService.get<ShapeResponse[]>('shapes');

      const collection = new Array<ShapeModel>();
      if (!response?.length) {
        return this.ok(collection);
      }

      let model: ShapeModel;
      for (const row of response) {
        model = new ShapeModel();
        model.uuid = row.pk;
        model.name = row.name;
        model.height = row.dimensions.height;
        model.width = row.dimensions.width;
        model.depth = row.dimensions.depth;
        model.status = (row.status === 'active') ? 'Activa' : 'Inactiva';
        model.statusData = (row.status === 'active');
        model.created = row.createdAt;

        const editAction = {
          id: 1,
          tooltip: '',
          slug: 'edit',
          icon: 'edit',
          disabled: false
        } as TableAction;

        const deleteAction = {
          id: 2,
          tooltip: '',
          slug: 'delete',
          icon: 'delete',
          disabled: false
        } as TableAction;

        model.setActions([editAction, deleteAction]);

        collection.push(model);
      }

      return this.ok(collection);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchAllV2(): Promise<ResourceDTO[]> {
    try {
      const rows = await this.restService.get<ResourceDTO[]>('shapes');

      if (!rows?.length) {
        return this.ok(new Array<ResourceDTO>());
      }

      return this.ok(rows);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchByUUID(value: string): Promise<any> {
    try {

    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchByUIDV2(value: string): Promise<ResourceDTO> {
    try {
      const rows = await this.restService.get<ResourceDTO[]>(`shapes?uuid=${value}`);
      if (!rows?.length) {
        return this.ok({} as ResourceDTO);
      }
      return this.ok(rows[0] as ResourceDTO);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async save(request: ResourceDTO, uid: string = ''): Promise<string> {
    try {
      let builder = ['shapes'];
      if (uid) {
        builder.push(uid);
      }

      const response = await this.restService.post<ResourceDTO>(builder.join('/'), request);
      
      return this.ok(response.uid);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async updateStatus(value: string, uid: string): Promise<void> {
    try {
      const request = { status: value };
      await this.restService.patch(`shapes/${uid}/status`, request);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }
}


export interface ShapeForm {
  name: string;
  height: string;
  width: string;
  depth: string;
}

export interface ShapeResponse {
  pk: string;
  name: string;
  status: string;
  createdAt: string;
  image: string;
  dimensions: ShapeDimension;
}

export interface ShapeDimension {
  depth: number;
  dimensionM2: number;
  dimensionM3: number;
  height: number;
  width: number;
}
