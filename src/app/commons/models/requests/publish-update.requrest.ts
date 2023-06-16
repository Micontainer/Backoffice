import { BaseRequest } from "./base.request";


export class PublishUpdateRequest extends BaseRequest {
  description: string;
  id: string;

  constructor(description: string = "", id: string = "") {
    super();
    this.description = description;
    this.id = id;
  }
}
