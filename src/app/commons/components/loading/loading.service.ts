import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';


@Injectable()
export class LoadingService {

    private loadingSubject: Subject<boolean> = new Subject<boolean>();

    get onLoading(): Observable<boolean> {
        return this.loadingSubject.asObservable();
    }

    private set toggle(value: boolean) {
        document.getElementsByTagName('body')[0].style.overflow = value ? 'hidden' : 'initial';
        this.loadingSubject.next(value);
    }

    show(): void {
        this.toggle = true;
    }

    hide(): void {
        this.toggle = false;
    }
}