import { NgModule } from '@angular/core';
import { GoogleAPIService } from './google-api.service';
import { SearchPlaceDirective } from './search-places.directive';


@NgModule({
  declarations: [
    SearchPlaceDirective,
  ],
  exports: [
    SearchPlaceDirective,
  ],
  providers: [
    GoogleAPIService,
  ],
})
export class SearchPlacesModule { }
