

/**
 * ## String Builder Class
 * provide an API for array join handling and getting a merged string whe invoke the `toString()` method
 */
export class StringBuilder {

  private data: string[];

  public get length(): number {
    return this.data.length;
  }

  constructor() {
    this.data = new Array<string>();
  }

  public append(value: string): StringBuilder {
    this.data.push(value);
    return this;
  }

  public clear(): StringBuilder {
    this.data = new Array<string>();
    return this;
  }

  public remove(startIndex: number, length: number): void {
    this.data.splice(startIndex, length);
  }

  public toString(separator: string = ''): string {
    return this.data.join(separator);
  }

}
