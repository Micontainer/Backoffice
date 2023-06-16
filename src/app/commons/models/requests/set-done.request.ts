import { BaseRequest } from "./base.request";


export class SetDoneRequest extends BaseRequest {
  id: string;

  constructor(id: string = "") {
    super();
    this.id = id;
  }
}
