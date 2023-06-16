import { Injectable } from "@angular/core";
import { AuthResponse } from "../models/interfaces/auth.response";
import { Login } from "../models/interfaces/login";
import { AuthRequest } from "../models/requests/auth.request";
import { BaseService } from "./base.service";
import { IdentityService } from "./identity.service";
import { RestService } from "./rest.service";


@Injectable()
export class PublicService extends BaseService {

  constructor(
    private restService: RestService,
    private identityService: IdentityService
  ) {
    super();
  }

  public async doLogin(formValues: Login): Promise<void> {
    try {
      const request = new AuthRequest(formValues.email, formValues.password);
      const response = await this.restService.post<AuthResponse>('users/authenticate', request);

      this.identityService.setUserSession(response);

      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

}
