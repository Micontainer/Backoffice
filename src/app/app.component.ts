import { LoadingService } from './commons/components/loading/loading.service';
import { Component, HostListener, OnInit, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { EventService } from './commons/services/event.service';
import { Subscription } from 'rxjs';
import { PushService } from './commons/services/push.service';

@Component({
  selector: 'body[root]',
  template: `
  <app-loading-component *ngIf="isLoading"></app-loading-component>
  <router-outlet></router-outlet>
`,
  styles: [':host { height: 100vh; margin: 0; }']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {

  title = 'mi-container';

  isLoading: boolean = false;
  loadingSubscription: Subscription = new Subscription();

  constructor(
    private loadingService: LoadingService,
    private changeDetectorRef: ChangeDetectorRef,
    private pushService: PushService
  ) { }

  async ngOnInit(): Promise<void> {
    this.loadingSubscription = this.loadingService.onLoading.subscribe((value) => this.isLoading = value);
    await this.pushService.requestPermission();
    await this.pushService.listen();
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  globalClickEventHandler(event: any): void {

  }

}
