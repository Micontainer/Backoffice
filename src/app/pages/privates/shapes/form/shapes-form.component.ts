import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { ShapeForm, ShapeService } from 'src/app/commons/services/shape.service';


@Component({
  selector: 'app-shapes-form',
  templateUrl: './shapes-form.component.html',
  styleUrls: ['./shapes-form.component.scss']
})
export class ShapesFormComponent implements OnInit {

  form: FormGroup;

  nameControl: FormControl = new FormControl('', Validators.required);
  formSubmitButtonSpinner = false;
  volume: number = 0;
  xyz: string[] = ["0", "0", "0"];

  constructor(
    private notificationService: NotificationService,
    private shapeService: ShapeService,
    private router: Router,
  ) {
    this.form = new FormGroup({
      name: this.nameControl,
    });
  }

  ngOnInit(): void { }

  submitEventHandler(form: ShapeForm): void {
    (async () => {
      try {
        form.width = this.xyz[0];
        form.height = this.xyz[1];
        form.depth = this.xyz[2];
        //await this.shapeService.create(form);

        this.notificationService.show('Se creó el objeto.');

        this.router.navigate([
          'app', 'shapes',
        ]);
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }

  getVolume(volume: number): void {
    this.volume = volume;
  }

  getXyz(xyz: string[]): void {
    console.log(xyz);
    this.xyz = xyz;
  }
}
