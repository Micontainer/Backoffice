import { BaseRequest } from "./base.request";


export class PublishRequest extends BaseRequest {
  description: string;

  constructor(description = "") {
    super();
    this.description = description;
  }
}
