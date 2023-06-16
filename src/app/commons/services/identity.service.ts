import { Injectable } from "@angular/core";
import { AuthResponse } from '../models/interfaces/auth.response';
import { StorageService } from './storage.service';
import { Observable, Subject } from "rxjs";


@Injectable()
export class IdentityService {

  readonly NowIndex: string = 'mi.container.time.now';
  readonly SessionIndex: string = 'mi.container.identity.session';
  readonly HistoryDateIndex: string = 'mi.container.history.date';
  readonly SessionTokenIndex: string = 'mi.container.token.session';

  private readonly sessionSubject: Subject<AuthResponse | null> = new Subject();
  
  get sessionSubscription(): Observable<AuthResponse | null> {
    return this.sessionSubject.asObservable();
  }

  constructor(
    private storageService: StorageService,
  ) { }

  setUserSession(user: AuthResponse): void {
    this.storageService.setSessionObject(this.SessionIndex, user);
    this.sessionSubject.next(user);
  }

  getLoggedUser(): AuthResponse | null {
    return this.storageService.getSessionObject<AuthResponse>(this.SessionIndex);
  }

  removeUserSession(): void {
    this.storageService.removeSessionData(this.SessionIndex);
    this.sessionSubject.next(null);
  }

  getToken(): string {
    const user = this.getLoggedUser();
    return (user) ? user.token : "";
  }

}
