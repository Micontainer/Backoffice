import { Injectable } from '@angular/core';
import { ResourceDTO } from '../models/global-dto';
import { BaseService, QueryString } from './base.service';
import { RestService } from './rest.service';


@Injectable()
export class BuildingService extends BaseService {

  constructor(
    private restService: RestService,
  ) {
    super();
  }

  async fetchAllByBranchUID(value: string): Promise<ResourceDTO[]> {
    try {
      const rows = await this.restService.get<ResourceDTO[]>(`branches/buildings?branch=${value}`);

      if (!rows?.length) {
        return this.ok(new Array<ResourceDTO>());
      }

      return this.ok(rows);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchBuildingByUID(value: string): Promise<ResourceDTO> {
    try {
      const rows = await this.restService.get<ResourceDTO[]>(`branches/buildings?uuid=${value}`);

      if (!rows?.length) {
        return this.ok({} as ResourceDTO);
      }

      return this.ok(rows[0] as ResourceDTO);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async saveBuilding(data: ResourceDTO, uid: string): Promise<void> {
    try {
      const request = {
        parentPK: uid, ...data,
      };

      await this.restService.post('branches/buildings', request);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async updateBuilding(data: ResourceDTO, uid: string): Promise<void> {
    try {
      await this.restService.post<ResourceDTO>(`branches/${uid}/buildings`, data);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async updateBuildingStatus(data: ResourceDTO, uid: string): Promise<void> {
    try {
      const request = {
        status: data.status,
        uid: data.uid,
      }

      await this.restService.patch(`branches/${uid}/buildings/status`, request);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }
}
