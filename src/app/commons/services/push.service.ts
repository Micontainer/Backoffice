import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { IdentityService } from "./identity.service";
import { RestService } from "./rest.service";


@Injectable()
export class PushService extends BaseService {

  constructor(
    private restService: RestService,
    private identityService: IdentityService
  ) {
    super();
  }

  public async subscribe(request: PushSubscription): Promise<void> {
    try {
      await this.restService.post<any>('system/notifications/push', request);
      return this.noContent();
    }
    catch (error: any) {
      return this.error(error);
    }
  }

}

export interface PushSubscription {
  token: string;
}

interface TokenForm {
  token: string;
}
