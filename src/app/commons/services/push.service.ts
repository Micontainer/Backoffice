import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { IdentityService } from "./identity.service";
import { RestService } from "./rest.service";
import { SwPush } from "@angular/service-worker";


@Injectable()
export class PushService extends BaseService {

    private readonly serverPublicKey: string = 'BIMBkG1e5pxJayaY5pvW0FGUB2Nl7SuvRs3E83Zy2Br4yHrCu8ozGEeNAMXuDtgSk8jy7NUbZR2248pYiNaXMLY';

    constructor(
        private restService: RestService,
        private identityService: IdentityService,
        private swPush: SwPush
    ) {
        super();
    }

    public async postSubscription(payload: PushSubscriptionJSON): Promise<void> {
        try {
            await this.restService.post<void>('push/subscribe', payload);
            return this.noContent();
        }
        catch (error: any) {
            return this.error(error);
        }
    }

    public async subscribe(): Promise<PushSubscriptionJSON> {
        try {
            const response = (await this.swPush.requestSubscription({
                serverPublicKey: this.serverPublicKey,
            })).toJSON();
            return this.ok(response);
        }
        catch (error: any) {
            return this.error(error);
        }
    }
}