import { PredictionModel } from 'src/app/commons/directives/search-places/models/prediction.model';
import { Injectable } from '@angular/core';
import { TableAction } from '../components/table/interfaces/table-action';
// import { BranchOfficePair } from '../models/interfaces/branch-office.pair';
import { StorageResponse } from '../models/interfaces/storage.response';
import { BranchOfficeModel } from '../view-models/branch-office.model';
import { StorageModel } from '../view-models/storage.model';
import { BaseService, QueryString } from './base.service';
import { RestService } from './rest.service';
import { Dates } from '../helpers/dates.helper';
import { RecordDTO, ResourceDTO } from '../models/global-dto';


@Injectable()
export class BranchOfficeService extends BaseService {

  constructor(
    private restService: RestService,
  ) {
    super();
  }

  async save(request: ResourceDTO[], uid: string = ''): Promise<string> {
    try {
      let builder = ['branches'];
      if (uid) {
        builder.push(uid);
      }

      const response = await this.restService.post<ResourceDTO[]>(builder.join('/'), request);

      const branch = response.find(row => row.category === 'BRANCHES');
      if (!branch?.category) {
        throw new Error('Parece que hubo un problema al momento de crear o actualizar la sucursal.');
      }

      return this.ok(branch.uid);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async updateStatus(value: string, uid: string): Promise<void> {
    try {
      const request = { status: value };
      await this.restService.patch(`branches/${uid}/status`, request);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async saveSchedule(data: ResourceDTO, uid: string): Promise<void> {
    try {
      const request = {
        parentPK: uid, ...data
      }

      await this.restService.post('branches/schedules', request);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async updateScheduleStatus(data: ResourceDTO, uid: string): Promise<void> {
    try {
      const request = {
        status: data.status,
        uid: data.uid
      }

      await this.restService.patch(`branches/${uid}/schedules/status`, request);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async saveContact(data: ResourceDTO, uid: string): Promise<void> {
    try {
      const request = {
        parentPK: uid, ...data,
      }

      await this.restService.post('branches/contact', request);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async updateContact(data: ResourceDTO, uid: string): Promise<void> {
    try {
      const request = {
        ...data,
      }

      await this.restService.put(`branches/${uid}/contact`, request);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchAll(): Promise<BranchOfficeModel[]> {
    try {
      const response = await this.restService.get<BranchOfficeDTO[]>('branches');

      const collection = new Array<BranchOfficeModel>();
      if (!response?.length) {
        return this.ok(collection);
      }

      let model: BranchOfficeModel;
      for (const row of response) {
        model = new BranchOfficeModel();
        model.pk = row.uid;
        model.name = row.description;
        // model.status = (row.status === 'active') ? 'Activa' : 'Inactiva';
        model.status = '';
        model.statusData = (row.status === 'active');
        model.created = Dates.toUserDatetime(row.createdAt);
        model.baseValue = row.coefficient;

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

        // const viewAction = {
        //   id: 3,
        //   tooltip: '',
        //   slug: 'view',
        //   icon: 'remove_red_eye',
        //   disabled: false
        // } as TableAction;

        model.setActions([editAction, deleteAction]);

        collection.push(model);
      }

      return this.ok(collection);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchKeyValueList(): Promise<BranchOfficePair[]> {
    try {
      const response = await this.restService.get<BranchOfficeDTO[]>('branches');

      const collection = new Array<BranchOfficePair>();
      if (!response?.length) {
        return collection;
      }

      let pair: BranchOfficePair;
      for (const row of response) {
        pair = {
          label: row.description,
          value: row.uid,
        } as BranchOfficePair;
        collection.push(pair);
      }

      return this.ok(collection);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchByUUID(value: string): Promise<ResourceDTO[]> {
    try {
      const response = await this.restService.get<ResourceDTO[]>(`branches?uuid=${value}`);

      // FIXME this object must to be mapped
      // if (Array.isArray(response)) {
      //   return this.ok(response[0]);
      // }

      return this.ok(response);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async addStorageByBranchOfficeUUID(data: StorageForm): Promise<void> {
    try {
      const response = await this.restService.post('branch-offices/storages', data);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchAllStorages(): Promise<StorageModel[]> {
    try {
      const response = await this.restService.get<StorageResponse[]>('branch-offices/storages');

      const collection = new Array<StorageModel>();
      if (!response?.length) {
        return collection;
      }

      let model: StorageModel;
      for (const row of response) {
        model = new StorageModel();
        model.type = row.type;
        model.uuid = row.uuid;
        model.description = row.description;
        model.maxCapacity = row.maxCapacity;
        model.status = (row.status === 'available') ? 'Disponible' : 'Ocupado';
        model.statusData = (row.status === 'available');
        model.created = row.createdAt;
        model.branchOfficeUUID = row.branchOfficeUUID;
        model.branchOfficeName = row.branchOfficeName;

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
      const rows = await this.restService.get<ResourceDTO[]>('branches');

      if (!rows?.length) {
        return this.ok(new Array<ResourceDTO>());
      }

      return this.ok(rows);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async createAreaCoefficient(body: any): Promise<void> {
    try {
      await this.restService.post<void>('branches/area-coefficient', body);
      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async getAreaCoefficients(branchUID: string): Promise<ResourceDTO[]> {
    try {
      const query = {
        branchUID,
      } as QueryString;
      const rows = await this.restService.get<ResourceDTO[]>(`branches/area-coefficient?${this.buildQueryString(query)}`);
      return this.ok(rows);
    }
    catch (error: any) {
      return this.error(error);
    }
  }
  
  async deleteAreaCoefficient(branchUID: string, uid: string): Promise<void> {
    try {
      const query = {
        areaCoefficientUID: uid,
        branchUID,
      } as QueryString;
      await this.restService.patch<void>(`branches/area-coefficient?${this.buildQueryString(query)}`, null);
      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }
}


export interface BranchOfficeForm {
  name: string;
  location?: PredictionModel;
}

export interface StorageForm {
  branchOffice: string;
  description: string;
  maxCapacity: number;
  type?: string;
}

export interface ScheduleForm {
  pk: string;
  uid: string;
  description: string;
  timeDescription: string;
}

export interface BuildingForm {
  uid: string;
  description: string;
  branchOffice: string;
}


/**
 * DATA TRANSFER OBJECTS
 */
export interface BranchOfficeDTO {
  uid: string,
  createdAt: number,
  gsi2sk: number,
  sk: string,
  gsi2pk: string,
  coefficient: number,
  description: string,
  pk: string,
  gsi: string,
  slug: string,
  updatedAt: number,
  status: string,
}

export interface BranchOfficeStorageDTO {
  pk: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  building: string;
  level: string;
  coefficient: number;
  dimensionsM2: number;
  status: number;
  storagesSize: number[];
  height: number;
  width: number;
  depth: number;
}

// export interface ResourceDTO {
//   category: string;
//   createdAt: number;
//   updatedAt: number;
//   slug: string;
//   status: string;
//   uid: string;
//   coefficient: number;
//   description: string;
//   storagesSize?: number[];
//   whatsapp?: string;
//   phone?: string;
//   email?: string;
//   country?: string;
//   province?: string;
//   city?: string;
//   latitude?: number;
//   postalCode?: string;
//   placeId?: string;
//   fullAddress?: string;
//   longitude?: number;
//   secondaryText?: string;
//   mainText?: string;
//   hourFrom?: string;
//   hourTo?: string;
//   dimensionsM2?: number;
//   depth?: number;
//   width?: number;
//   height?: number;
// }

export interface BranchOfficePair {
  label: string;
  value: string;
}
