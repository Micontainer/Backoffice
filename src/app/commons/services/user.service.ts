import { Injectable } from "@angular/core";
import { BaseService, QueryString } from "./base.service";
import { RestService } from "./rest.service";
import { AccountDTO } from "../models/global-dto";
import { IdentityService } from "./identity.service";


@Injectable()
export class UserService extends BaseService {

  constructor(
    private restService: RestService,
    private identityService: IdentityService,
  ) {
    super();
  }

  async getUsers(uid: string = ''): Promise<any[]> {
    try {
      const query = {
        uid: uid
      } as QueryString;
      const response = this.restService.get<any[]>(`users?${this.buildQueryString(query)}`);
      return this.ok(response);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async getRoles(): Promise<any[]> {
    try {
      const response = this.restService.get<any[]>('roles');
      return this.ok(response);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async createUser(data: any): Promise<any> {
    try {
      const response = this.restService.post<any>('users', data);
      return this.ok(response);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async getOperatorBranchOffices(uid: string): Promise<any> {
    try {
      const query = {
        uid: uid
      } as QueryString;
      const response = this.restService.get<any>(`users/branches?${this.buildQueryString(query)}`);
      return this.ok(response);
    }
    catch (error: any) {
      return this.error(error);
    }
  }

  async updateData(userDTO: any): Promise<void> {
    try {
      userDTO.uid = this.identityService.getLoggedUser()?.user.uid || '';
      const response = await this.restService.patch<any>('admin/profile', userDTO);

      this.identityService.removeUserSession();
      this.identityService.setUserSession(response);
      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }
  
  async updatePassword(password: PasswordDTO): Promise<void> {
    try {
      await this.restService.patch<void>('admin/profile/password', password);
      return this.noContent()
    }
    catch (error: any) {
      return this.error(error);
    }
  }
}

export interface PasswordDTO {
  email: string;
  uid: string;
  password: string;
}