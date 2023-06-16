import { Directive, Output, EventEmitter, ElementRef } from "@angular/core";

@Directive({
  selector: '[appCurrencyInput]',
  host: {
    '(keydown)': 'onKeydown($event)',
    '(keyup)': 'onKeyup($event)',
    '(blur)': 'onBlur($event)',
  }
})
export class CurrencyDirective {

  @Output('doneTyping') doneTyping: EventEmitter<number> = new EventEmitter<number>();

  private readonly NON_DIGIT_REGEXP: RegExp = new RegExp(/\D/g);
  private readonly SPECIAL_KEYS: string[] = ['Backspace', '.'];

  private get value(): string {
    return this.hostInput.nativeElement.value;
  }

  private set value(value: string) {
    this.hostInput.nativeElement.value = value;
  }

  private get sanitize(): string {
    return this.value.slice(0, - 1);
  }

  constructor(
    private hostInput: ElementRef,
  ) { }

  onKeydown(event: KeyboardEvent) {
    if (this.SPECIAL_KEYS.includes(event.key)) {
      return;
    }
    if (String(event.key).match(this.NON_DIGIT_REGEXP)) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
  }

  onKeyup(event: KeyboardEvent) {
    this.value = this.value
      .replaceAll(',', '')
      .replaceAll('$', '');

    const spplitedValue = this.value.split('.');
    if (event.key === "Unidentified" && this.value.match(this.NON_DIGIT_REGEXP)
      || spplitedValue?.length > 2 || spplitedValue[1]?.length > 2) {
      this.value = this.sanitize;
    }
  }

  onBlur() {
    this.doneTyping.emit(+this.value);
  }
}