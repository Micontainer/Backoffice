import { Directive, ElementRef, EventEmitter, Host, Input, Optional, Output, Self } from '@angular/core';
import { ScrollStage } from './enums/scroll-stage';


@Directive({
  selector: '[infiniteScroll]',
  host: {
    '(scroll)': 'scrollEventHandler($event)',
  },
})
export class InfiniteScrollDirective {

  private element!: HTMLDivElement;

  @Output() scrollFinishEvent: EventEmitter<void>;

  get offsetHeight(): number {
    return this.element.offsetHeight;
  }

  get scrollTop(): number {
    return this.element.scrollTop;
  }

  get scrollHeight(): number {
    return this.element.scrollHeight;
  }

  get scrollFinished(): boolean {
    return (this.offsetHeight + this.scrollTop >= this.scrollHeight);
  }

  private stage: string = ScrollStage.Initial;

  get isLoadingStage(): boolean {
    return (this.stage === ScrollStage.Loading);
  }

  constructor(
    @Host() @Self() @Optional() hostDiv: ElementRef<HTMLDivElement>,
  ) {
    this.element = hostDiv.nativeElement;
    this.scrollFinishEvent = new EventEmitter();
  }

  scrollEventHandler(event: any): void {
    if (!this.scrollFinished || this.isLoadingStage) {
      return;
    }

    this.scrollFinishEvent.emit();
    this.stage = ScrollStage.Loading;
  }

  complete(): void {
    this.stage = ScrollStage.Initial;
  }

}
