import { LoadingService } from './commons/components/loading/loading.service';
import { LoadingComponent } from './commons/components/loading/loading.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InfiniteScrollModule } from './commons/directives/infinite-scroll.module';
import { EventService } from './commons/services/event.service';
import { IdentityService } from './commons/services/identity.service';
import { InterceptorService } from './commons/services/interceptor.service';
import { NotificationService } from './commons/services/notification.service';
import { RestService } from './commons/services/rest.service';
import { StorageService } from './commons/services/storage.service';
import { environment } from '../environments/environment';
import { initializeApp } from 'firebase/app';

import { PushService } from './commons/services/push.service';

const app = initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    InfiniteScrollModule,
  ],
  providers: [
    IdentityService,
    RestService,
    NotificationService,
    EventService,
    // {
    //   provide: LOCALE_ID,
    //   useValue: 'es-AR',
    // },
    // {
    //   provide: DEFAULT_CURRENCY_CODE,
    //   useValue: 'ARS',
    // },
    StorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
    LoadingService,
    PushService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
