import { Injectable } from '@angular/core';
import { ResourceDTO } from '../models/global-dto';
import { BaseService, QueryString } from './base.service';
import { RestService } from './rest.service';


@Injectable()
export class CommonService extends BaseService {

  constructor(
    private restService: RestService,
  ) {
    super();
  }

  async fetchCoefficients(branchUID: string = '', buildingUID: string = '', levelUID: string = '', storageUID: string = ''): Promise<ResourceDTO[]> {
    try {
      const query = {
        branch: branchUID,
        building: buildingUID,
        level: levelUID,
        storage: storageUID,
      } as QueryString;

      const rows = await this.restService.get<ResourceDTO[]>(`commons/coefficients?${this.buildQueryString(query)}`);

      if (!rows?.length) {
        return this.ok(new Array<ResourceDTO>());
      }

      return this.ok(rows);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchStorageBoards(branchUID: string): Promise<BranchBoard> {
    try {
      const rows = await this.restService.get<BranchBoard[]>(`commons/boards/storages?branch=${branchUID}`);

      if (!rows?.length) {
        throw new Error('Algo ocurrió cuando se intentaba acceder al recurso, por favor intenta más tarde.');
      }

      return this.ok(rows[0]);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchRelations(uid: string): Promise<any[]> {
    try {
      const query = {
        uid: uid,
      } as QueryString;
      const rows = await this.restService.get<any[]>(`commons/relations?${this.buildQueryString(query)}`);
      return this.ok(rows);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchConfigurationTotals(): Promise<any> {
    try {
      const rows = await this.restService.get<any>('configuration/totals');
      return this.ok(rows);
    }
    catch (error: any) {
      return this.error(error);
    }
  }
}

export interface StorageBoard {
  uid: string;
  description: string;
  status: string;
  coefficient: number;
  dimensionsM2: number;
}

export interface LevelBoard {
  uid: string;
  description: string;
  status: string;
  coefficient: number;
  storages: StorageBoard[];
}

export interface BuildingBoard {
  uid: string;
  description: string;
  status: string;
  coefficient: number;
  levels: LevelBoard[];
}

export interface BranchBoard {
  uid: string;
  description: string;
  status: string;
  coefficient: number;
  buildings: BuildingBoard[];
}
