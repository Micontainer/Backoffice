import { Directive, Output, EventEmitter, HostListener, Host, Optional, Self, ElementRef } from '@angular/core';
import { DebounceHandler } from '../../utils/debounce-handler';
import { GoogleAPIService } from './google-api.service';
import { PredictionModel } from './models/prediction.model';


@Directive({
  selector: '[search-place]'
})
export class SearchPlaceDirective {

  @Output() placeEvent: EventEmitter<PredictionModel[]>;

  private inputElement: HTMLInputElement;

  private get value(): string {
    return this.inputElement.value;
  }

  private get length(): number {
    return this.value.length;
  }

  private debounce: DebounceHandler;

  constructor(
    @Host() @Self() @Optional() private hostInput: ElementRef<HTMLInputElement>,
    private googleApiService: GoogleAPIService,
  ) {
    this.placeEvent = new EventEmitter();

    this.inputElement = this.hostInput.nativeElement;
    this.debounce = new DebounceHandler({ delay: 300 });

    this.debounce.getContent().subscribe(async value => {
      this.placeEvent.emit(await this.googleApiService.getGooglePredictions(value));
    });
  }

  @HostListener('keyup', ['$event'])
  onkeyup(event: KeyboardEvent): void {
    if (!this.length) {
      return;
    }

    this.debounce.setContent(this.value);
  }

}
