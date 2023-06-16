

export class BaseService {

  constructor() { }

  protected error(error: Error) {
    return Promise.reject(new Error(error.message));
  }

  protected ok<T>(payload: T): Promise<T> {
    return Promise.resolve(payload);
  }

  protected noContent(): Promise<void> {
    return Promise.resolve();
  }

  protected buildQueryString(data: QueryString): string {
    if (!Object.keys(data).length) {
      return '';
    }

    let tuples = new Array<string>();
    for (const property in data) {
      tuples.push(`${property}=${data[property]}`);
    }

    return tuples.join('&');
  }

}

export interface QueryString {
  [name: string]: string | number | boolean;
}
