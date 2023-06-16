
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-volume-calculator',
  templateUrl: './volume-calculator.component.html',
  styleUrls: ['./volume-calculator.component.scss']
})
export class VolumeCalculatorComponent {

  @Output() volume: EventEmitter<number> = new EventEmitter<number>();
  @Output() canContinue: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() xyz: EventEmitter<string[]> = new EventEmitter<string[]>();

  volumeLabel: number = 0;

  form: FormGroup;
  heightControl: FormControl = new FormControl('', Validators.required);
  widhtControl: FormControl = new FormControl('', Validators.required);
  depthControl: FormControl = new FormControl('', Validators.required);

  constructor() {
    this.form = new FormGroup({
      height: this.heightControl,
      width: this.widhtControl,
      depth: this.depthControl,
    });

    this.heightControl.valueChanges.subscribe(() => {
      this.calculateVolume();
    });
    this.widhtControl.valueChanges.subscribe(() => {
      this.calculateVolume();
    });
    this.depthControl.valueChanges.subscribe(() => {
      this.calculateVolume();
    });
  }

  calculateVolume(): void {
    this.volumeLabel  = this.depthControl.value * this.widhtControl.value * this.heightControl.value;
    this.volume.emit(this.volumeLabel);
    this.xyz.emit([this.widhtControl.value, this.heightControl.value, this.depthControl.value]);
  }
}
