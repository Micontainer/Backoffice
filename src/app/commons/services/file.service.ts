import { Injectable } from '@angular/core';
import { ResourceDTO } from '../models/global-dto';
import { BaseService, QueryString } from './base.service';
import { RestService } from './rest.service';
import { threadSleep } from '../functions/thread-sleep.function';


@Injectable()
export class FileService extends BaseService {

  constructor(
    private restService: RestService,
  ) {
    super();
  }

  async get(mimeType: string, category: string, uid?:string): Promise<any[]> {
    try {
      const query = {
        type: mimeType,
        uid: uid || '',
        category: category,
      } as QueryString;
      const rows = await this.restService.get<ResourceDTO[]>(`api/v1/documents?${this.buildQueryString(query)}`);
      return this.ok(rows);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async upload(formData: FormData): Promise<void> {
    try {
      await this.restService.post<ResourceDTO[]>('api/v1/documents', formData, true);
      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async delete(type: string, uid?:string): Promise<void> {
    try {
      const query = {
        type,
        uid: uid || '',
      } as QueryString;
      await this.restService.patch<void>(`api/v1/documents?${this.buildQueryString(query)}`, null);
      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }
}
