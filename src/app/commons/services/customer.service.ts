import { Injectable } from '@angular/core';
import { AccountDTO, RecordDTO } from '../models/global-dto';
import { BaseService } from './base.service';
import { RestService } from './rest.service';


@Injectable()
export class CustomerService extends BaseService {

  constructor(
    private restService: RestService,
  ) {
    super();
  }

  async fetchAll(): Promise<AccountDTO[]> {
    try {
      const rows = await this.restService.get<AccountDTO[]>('customers');

      if (!rows?.length) {
        return this.ok(new Array<AccountDTO>());
      }

      return this.ok(rows);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchByUID(value: string): Promise<AccountDTO[]> {
    try {
      const rows = await this.restService.get<AccountDTO[]>(`customers?uuid=${value}`);

      if (!rows?.length) {
        return this.ok(new Array<AccountDTO>());
      }

      return this.ok(rows);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async update(data: AccountDTO): Promise<void> {
    try {
      await this.restService.put<AccountDTO>('customers', data);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async updateUser(data: AccountDTO): Promise<void> {
    try {
      await this.restService.patch<AccountDTO>('customers/user', data);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async updateStatus(data: AccountDTO): Promise<void> {
    try {
      await this.restService.patch<AccountDTO>('customers', data);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async resetUser(uid: string): Promise<void> {
    try {
      await this.restService.get<AccountDTO>(`customers/user/reset?uuid=${uid}`);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async createAccount(data: AccountDTO): Promise<string> {
    try {
      const iam = await this.restService.post<any>('customers', data);
      return this.ok(iam);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async getAuthorizeds(customerUID: string, authorizedUID?: string): Promise<any[]> {
    try {
      const authorizeds = await this.restService.get<any>(`customers/user/authorizations?${this.buildQueryString({
        uuid: customerUID,
        authorizedUID: authorizedUID || ''
      })}`);
      return this.ok(authorizeds);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async getBookings(customerUID: string): Promise<RecordDTO[]> {
    try {
      const authorizeds = await this.restService.get<RecordDTO[]>(`customers/bookings?${this.buildQueryString({
        uuid: customerUID,
      })}`);
      return this.ok(authorizeds);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async createAuthorization(formData: FormData): Promise<any> {
    try {
      const authorizeds = await this.restService.post<any>(`customers/user/authorizations/`, formData, true);
      return this.ok(authorizeds);
    }
    catch (error: any) {
      return this.error(error);
    }
  }
  
  async deleteAuthorization(customerUID: string, authorizedUID: string): Promise<any[]> {
    try {
      const authorizeds = await this.restService.patch<any>(`customers/user/authorizations/${authorizedUID}?${this.buildQueryString({
        customerUID,
      })}`, null);
      return this.ok(authorizeds);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async updateAuthorization(formData: FormData, uuid: string): Promise<any[]> {
    try {
      const authorizeds = await this.restService.post<any>(`customers/user/authorizations/${uuid}`, formData, true);
      return this.ok(authorizeds);
    }
    catch (error: any) {
      return this.error(error);
    }
  }
}
