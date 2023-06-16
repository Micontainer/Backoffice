import { Injectable } from '@angular/core';
import { ResourceDTO } from '../models/global-dto';
import { BaseService, QueryString } from './base.service';
import { RestService } from './rest.service';


@Injectable()
export class LevelService extends BaseService {

  constructor(
    private restService: RestService,
  ) {
    super();
  }

  async fetchAllByBranchAndBuildingUID(branchUID: string, value: string): Promise<ResourceDTO[]> {
    try {
      const query = {
        branch: branchUID, building: value,
      } as QueryString;

      const rows = await this.restService.get<ResourceDTO[]>(`branches/buildings/levels?${this.buildQueryString(query)}`);

      if (!rows?.length) {
        return this.ok(new Array<ResourceDTO>());
      }

      return this.ok(rows);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchLevelByUID(value: string): Promise<ResourceDTO> {
    try {
      const rows = await this.restService.get<ResourceDTO[]>(`branches/buildings/levels?uuid=${value}`);

      if (!rows?.length) {
        return this.ok({} as ResourceDTO);
      }

      return this.ok(rows[0] as ResourceDTO);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async save(data: ResourceDTO, branch: string, building: string): Promise<void> {
    try {
      const request = {
        parentPK: branch,
        buildingPK: building,
        ...data,
      }

      await this.restService.post<ResourceDTO>('branches/buildings/levels', request);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async updateLevel(data: ResourceDTO, branch: string, building: string): Promise<void> {
    try {
      const builder = ['branches', branch, 'buildings', building, 'levels'];

      await this.restService.post<ResourceDTO>(builder.join('/'), data);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async updateLevelStatus(data: ResourceDTO, branch: string, building: string): Promise<void> {
    try {
      const builder = ['branches', branch, 'buildings', building, 'levels', 'status'];

      await this.restService.patch<ResourceDTO>(builder.join('/'), data);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

}
