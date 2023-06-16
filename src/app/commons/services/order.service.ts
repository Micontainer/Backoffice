import { Injectable } from '@angular/core';
import { TableAction } from '../components/table/interfaces/table-action';
import { TableActionModel } from '../components/table/models/table-action.model';
import { RecordDTO, ResourceDTO } from '../models/global-dto';
import { BaseService, QueryString } from './base.service';
import { RestService } from './rest.service';


@Injectable()
export class OrderService extends BaseService {

  readonly StatusTranslation: StatusMap = {
    pending: 'Pendiente',
    active: 'Activo',
    cancelled: 'Cancelado',
  };

  constructor(
    private restService: RestService,
  ) {
    super();
  }

  async fetchAll(): Promise<OrderItemModel[]> {
    try {
      const apiResponse = await this.restService.get<OrderItemModel[]>('bookings');

      const collection = new Array<OrderItemModel>();
      let model: OrderItemModel;
      for (const element of apiResponse) {
        model = new OrderItemModel();
        model.uuid = element.uuid;
        model.client = element.client;
        model.totalShapes = element.totalShapes;
        model.storage = element.storage;
        model.branchOffice = element.branchOffice;
        model.created = element.created;
        model.booking = element.booking;
        model.status = this.StatusTranslation[element.status];

        const viewAction = {
          id: 1,
          tooltip: '',
          slug: 'view',
          icon: 'visibility',
          disabled: false
        } as TableAction;

        const deleteAction = {
          id: 2,
          tooltip: '',
          slug: 'delete',
          icon: 'delete',
          disabled: false
        } as TableAction;

        model.setActions([viewAction, deleteAction]);

        collection.push(model);
      }

      return this.ok(collection);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchAllV2(): Promise<RecordDTO[]> {
    try {
      const query = {
        origin: 'backoffice',
        format: 'view',
      } as QueryString;
      const rows = await this.restService.get<RecordDTO[]>(`bookings?${this.buildQueryString(query)}`);

      if (!rows?.length) {
        return this.ok(new Array<RecordDTO>());
      }

      return this.ok(rows);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchByUID(value: string): Promise<RecordDTO> {
    try {
      const query = {
        origin: 'backoffice',
        uuid: value,
        format: 'view',
      } as QueryString;
      const rows = await this.restService.get<RecordDTO[]>(`bookings?${this.buildQueryString(query)}`);
     
      if (!rows?.length) {
        return this.ok({} as RecordDTO);
      }
      return this.ok(rows[0] as RecordDTO);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async uploadInvoice(orderUID: string, invoiceUID: string, formData: FormData): Promise<any> {
    try {
      const query = {
        uuid: invoiceUID,
        bookingUID: orderUID,
      } as QueryString;
      await this.restService.post<any>(`invoices?${this.buildQueryString(query)}`, formData, true);
      return this.ok(null);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchInvoicesByOrderUID(value: string): Promise<RecordDTO[]> {
    try {
      const query = {
        bookingUID: value,
      } as QueryString;
      const rows = await this.restService.get<RecordDTO[]>(`invoices?${this.buildQueryString(query)}`);
     
      if (!rows?.length) {
        return this.ok({} as RecordDTO[]);
      }
      return this.ok(rows);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async fetchInvoiceByUID(orderUID: string, invoiceUID: string): Promise<RecordDTO> {
    try {
      const query = {
        bookingUID: orderUID,
        uuid: invoiceUID,
      } as QueryString;
      const rows = await this.restService.get<RecordDTO[]>(`invoices?${this.buildQueryString(query)}`);
      return this.ok(rows[0] as RecordDTO);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async updateOrderStatus(orderUID: string, status: string): Promise<RecordDTO> {
    try {
      const rows = await this.restService.patch<RecordDTO[]>(`bookings/${orderUID}/status?`, { status: status });
      return this.ok(rows[0] as RecordDTO);
    }
    catch (error: any) {
      return this.error(error);
    }
  }
  
  async updateOrder(order: any): Promise<void> {
    try {
      await this.restService.patch<void>(`bookings/${order.bookingUID}/`, order);
      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }
  
  async createOrder(order: any): Promise<ResourceDTO> {
    try {
      const rows = await this.restService.post<ResourceDTO[]>('bookings', order);
      return this.ok(rows[0]);
    }
    catch (error: any) {
      return this.error(error);
    }
  }
  
  async updateInvoiceStatus(body: any): Promise<void> {
    try {
      await this.restService.patch<void>('invoices', body);
      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }
}

class OrderItemModel extends TableActionModel {

  uuid: string;
  client: string;
  totalShapes: number;
  storage: string;
  branchOffice: string;
  created: string;
  booking: string;
  status: string;

  constructor() {
    super();

    this.uuid = "";
    this.client = "";
    this.totalShapes = 0;
    this.storage = "";
    this.branchOffice = "";
    this.created = "";
    this.booking = "";
    this.status = "";
  }

}

interface StatusMap {
  [name: string]: string;
}
