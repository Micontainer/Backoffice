import { Injectable } from '@angular/core';
import { ResourceDTO } from '../models/global-dto';
import { BaseService, QueryString } from './base.service';
import { RestService } from './rest.service';


@Injectable()
export class SpaceService extends BaseService {

  constructor(
    private restService: RestService,
  ) {
    super();
  }

  async fetchAllByBranchBuildingLevelUID(branchUID: string, buildingUID: string, levelUID: string): Promise<ResourceDTO[]> {
    try {
      const query = {
        branch: branchUID, building: buildingUID, level: levelUID, selector: 'level',
      } as QueryString;

      const rows = await this.restService.get<ResourceDTO[]>(`branches/buildings/levels/storages?${this.buildQueryString(query)}`)

      if (!rows?.length) {
        return this.ok(new Array<ResourceDTO>());
      }

      return this.ok(rows);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchByUID(value: string): Promise<ResourceDTO> {
    try {
      const rows = await this.restService.get<ResourceDTO[]>(`branches/buildings/levels/storages?uuid=${value}`);

      if (!rows?.length) {
        return this.ok({} as ResourceDTO);
      }

      return this.ok(rows[0] as ResourceDTO);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async save(data: ResourceDTO, branchUID: string, buildingUID: string, levelUID: string): Promise<string> {
    try {
      const request = {
        branchUID, buildingUID, levelUID,
        ...data,
      }

      const rows = await this.restService.post<ResourceDTO[]>(`branches/buildings/levels/storages`, request);

      if (!rows?.length) {
        throw new Error('Parece que hubo un problema al momento de crear el espacio.');
      }

      return this.ok(rows[0].uid);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async update(data: ResourceDTO, branchUID: string, buildingUID: string, levelUID: string): Promise<void> {
    try {
      const builder = ['branches', branchUID, 'buildings', buildingUID, 'levels', levelUID, 'storages'];

      await this.restService.post<ResourceDTO>(builder.join('/'), data);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async updateStatus(data: ResourceDTO, branchUID: string, buildingUID: string, levelUID: string): Promise<void> {
    try {
      const builder = ['branches', branchUID, 'buildings', buildingUID, 'levels', levelUID, 'storages', 'status'];

      await this.restService.patch<ResourceDTO>(builder.join('/'), data);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  priceCalculation(priceOptions: PriceOptions): number {
    const collector = [
      priceOptions.branchOfficeCoefficient,
      priceOptions.buildingCoefficient,
      priceOptions.levelCoefficient,
      priceOptions.storageCoefficient,
      priceOptions.storageDimensionM2,
    ];
    return +collector.reduce((last, current) => last * current).toFixed(2);
  }
  
}

export interface PriceOptions {
  branchOfficeCoefficient: number;
  buildingCoefficient: number;
  levelCoefficient: number;
  storageCoefficient: number;
  storageDimensionM2: number;
}
