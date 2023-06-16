import { Injectable } from '@angular/core';


@Injectable()
export class StorageService {

  constructor() { }

  public exists(key: string): boolean {
    return this.get(key) !== null;
  }

  public get(key: string): string | null {
    return localStorage.getItem(key);
  }

  public set(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public clear(): void {
    localStorage.clear();
  }

  public setObject(key: string, value: any): void {
    this.set(key, JSON.stringify(value));
  }

  public getObject<T>(key: string): T | null {
    const data = this.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  public getBoolean(key: string): boolean {
    if (this.exists(key)) {
      return (this.get(key) === '1') ? true : false;
    }
    return false;
  };

  public getInt(key: string): number {
    if (this.exists(key)) {
      return (this.get(key) === '1') ? 1 : 0;
    }
    return 0;
  }

  public setBoolean(key: string, data: boolean): void {
    const dataString = (data) ? '1' : '0';
    this.set(key, dataString);
  }

  //#region SESSION

  public getSessionItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  public setSessionItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  public removeSessionData(key: string): void {
    sessionStorage.removeItem(key);
  }

  public getSessionObject<T>(key: string): T | null {
    const user = this.getSessionItem(key);
    if (!user) {
      return null;
    }
    return JSON.parse(user) as T;
  }

  public setSessionObject<T>(key: string, data: T): void {
    this.setSessionItem(key, JSON.stringify(data));
  }

  public setRoleObject<T>(key: string, data: T): void {
    this.setRoleItem(key, JSON.stringify(data));
  }

  public setRoleItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  //#endregion

}
