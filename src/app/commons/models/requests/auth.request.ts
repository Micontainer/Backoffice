import { BaseRequest } from "./base.request";


export class AuthRequest extends BaseRequest {

  email: string;
  password: string;

  constructor(email: string, password: string) {
    super();
    this.email = email;
    this.password = password;
  }

}
