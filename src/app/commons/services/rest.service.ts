import { LoadingService } from './../components/loading/loading.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { ApiResponse } from "../models/interfaces/api.response";


@Injectable()
export class RestService {

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) { }

  private urlComposer(endpoint: string): string {
    return `${environment.apiURL}${endpoint}`;
  }

  private getOptions(multipart?: boolean): Object {
    return multipart ? this.getHttpOptionsMultipart() : this.getHttpOptions();
  }

  private getHttpOptions(): Object {
    const httpOptions: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-api-key': environment.apiKey,
      }),
      withCredentials: false,
    };
    return httpOptions;
  }

  private getHttpOptionsMultipart(): Object {
    const httpOptions: Object = {
      headers: new HttpHeaders({
        'x-api-key': environment.apiKey,
      }),
      withCredentials: false,
    };
    return httpOptions;
  }

  post<T>(endpoint: string, payload: any, multipart?: boolean): Promise<T> {
    return new Promise((resolve, reject) => {
      this.loadingService.show();

      const successCallback = (apiResponse: any) => {
        try {
          if (!apiResponse) {
            resolve(apiResponse as T);
            return;
          }
          this.checkResponseStatus(apiResponse as ApiResponse);
          resolve(apiResponse.payload as T);
        }
        catch (error: any) {
          reject(new Error(error.message));
        } finally {
          this.reset();
        }
      }

      const errorCallback = (error: HttpErrorResponse) => {
        // Angular http client methods returns an Observable that either completes automatically after the first notification or errors
        // Thats why I reset the service in this and finally clause on sucessCallback instead using complete callback from subscription
        this.reset();
        reject(new Error(error.error.payload));
      }

      this.http.post(this.urlComposer(endpoint), payload, this.getOptions(multipart)).subscribe({
        next: successCallback,
        error: errorCallback,
      });
    });
  }

  get<T>(endpoint: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.loadingService.show();

      const successCallback = (apiResponse: any) => {
        try {
          if (!apiResponse) {
            resolve(apiResponse as T);
            return;
          }
          this.checkResponseStatus(apiResponse as ApiResponse);
          resolve(apiResponse.payload as T);
        }
        catch (error: any) {
          reject(new Error(error.message));
        } finally {
          this.reset();
        }
      }

      const errorCallback = (error: HttpErrorResponse) => {
        this.reset();
        reject(new Error(error.error.payload));
      }

      this.http.get(this.urlComposer(endpoint), this.getHttpOptions()).subscribe({
        next: successCallback,
        error: errorCallback,
      });
    });
  }

  patch<T>(endpoint: string, payload: any, multipart?: boolean): Promise<T> {
    return new Promise((resolve, reject) => {
      this.loadingService.show();

      const successCallback = (apiResponse: any) => {
        try {
          if (!apiResponse) {
            resolve(apiResponse as T);
            return;
          }
          this.checkResponseStatus(apiResponse as ApiResponse);
          resolve(apiResponse.payload as T);
        }
        catch (error: any) {
          reject(new Error(error.message));
        } finally {
          this.reset();
        }
      }

      const errorCallback = (error: HttpErrorResponse) => {
        this.reset();
        reject(new Error(error.error.payload));
      }

      this.http.patch(this.urlComposer(endpoint), payload, this.getOptions(multipart)).subscribe({
        next: successCallback,
        error: errorCallback,
      });
    });
  }

  put<T>(endpoint: string, payload: any, multipart?: boolean): Promise<T> {
    return new Promise((resolve, reject) => {
      this.loadingService.show();

      const successCallback = (apiResponse: any) => {
        try {
          if (!apiResponse) {
            resolve(apiResponse as T);
            return;
          }
          this.checkResponseStatus(apiResponse as ApiResponse);
          resolve(apiResponse.payload as T);
        }
        catch (error: any) {
          reject(new Error(error.message));
        } finally {
          this.reset();
        }
      }

      const errorCallback = (error: HttpErrorResponse) => {
        this.reset();
        reject(new Error(error.error.payload));
      }

      this.http.put(this.urlComposer(endpoint), payload, this.getOptions(multipart)).subscribe({
        next: successCallback,
        error: errorCallback,
      });
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return new Promise((resolve, reject) => {
      this.loadingService.show();

      const successCallback = (apiResponse: any) => {
        try {
          this.checkResponseStatus(apiResponse as ApiResponse);
          resolve(apiResponse.payload as T);
        }
        catch (error: any) {
          reject(new Error(error.message));
        } finally {
          this.reset();
        }
      }

      const errorCallback = (error: HttpErrorResponse) => {
        this.reset();
        reject(new Error(error.error.payload));
      }

      this.http.delete(this.urlComposer(endpoint), this.getHttpOptions()).subscribe({
        next: successCallback,
        error: errorCallback,
      });
    });
  }

  private checkResponseStatus(data: ApiResponse): void {
    if (500 === data.status) {
      throw new Error(data.payload);
    }
  }

  private reset() {
    this.loadingService.hide();
  }
}

