import { ShapeService } from '../../../../../../commons/services/shape.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceDTO } from 'src/app/commons/models/global-dto';
import { NotificationService } from 'src/app/commons/services/notification.service';


@Component({
  selector: 'app-image-gallery-basic',
  templateUrl: './image-gallery-basic.component.html',
  styleUrls: ['./image-gallery-basic.component.scss']
})
export class ImageGalleryBasicComponent implements OnInit {

  shapeUID: string = '';

  get isEdition(): boolean {
    return !!this.shapeUID.length;
  }
  
  form: FormGroup;

  descriptionControl: FormControl = new FormControl('', Validators.required);
  widthControl: FormControl = new FormControl('', Validators.required);
  heightControl: FormControl = new FormControl('', Validators.required);
  depthControl: FormControl = new FormControl('', Validators.required);
  dimensionsM2Control: FormControl = new FormControl('', Validators.required);

  selectedState: string = '';
  set optionModel(value: string) {
    this.selectedState = value;
  }

  get optionModel(): string {
    return this.selectedState;
  }

  get buttonText(): string {
    return (this.isEdition)
      ? 'Actualizar objeto'
      : 'Crear objeto';
  }

  //#region DIMENSIONS CALCULATION

  private dimensionsM3: number = 0;
  set dimensionModel(value: number) {
    this.dimensionsM3 = value;
  }

  get dimensionModel(): number {
    return this.dimensionsM3;
  }

  //#endregion DIMENSIONS CALCULATION

  //#region SHORTCUTS

  get height(): number {
    return +this.heightControl.value;
  }

  get width(): number {
    return +this.widthControl.value;
  }

  get depth(): number {
    return +this.depthControl.value;
  }

  //#endregion SHORTCUTS
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private shapeService: ShapeService,
  ) {
    this.form = new FormGroup({
      description: this.descriptionControl,
      width: this.widthControl,
      height: this.heightControl,
      depth: this.depthControl,
      dimensionsM2: this.dimensionsM2Control,
    });
    
    this.activatedRoute.queryParams.subscribe(query => {
      const ref = query['ref'] || '';

      if (!ref) {
        // FIXME navigate to safe zone here;
        return;
      }

      this.shapeUID = ref;
    });
  }

  ngOnInit(): void {
    (async () => {
      if (this.shapeUID === '') {
        return;
      }

      const shapeDTO = await this.shapeService.fetchByUIDV2(this.shapeUID);
      
      this.descriptionControl.setValue(shapeDTO.description);
      this.widthControl.setValue(shapeDTO.width);
      this.heightControl.setValue(shapeDTO.height);
      this.depthControl.setValue(shapeDTO.depth);
      this.runCalculation();
    })();
  }

  ngAfterViewInit(): void {
    this.heightControl.valueChanges.subscribe(value => {
      this.runCalculation();
    });

    this.depthControl.valueChanges.subscribe(value => {
      this.runCalculation();
    });

    this.widthControl.valueChanges.subscribe(value => {
      this.runCalculation();
    });
  }
  
  private runCalculation(): void {
    // get height
    const height = this.height;
    // get width
    const width = this.width;
    // get depth
    const depth = this.depth;

    // update m3
    if (height && width && depth) {
      this.dimensionModel = height * width * depth;
    } else {
      this.dimensionModel = 0;
    }

    // update m2
    if (depth && width) {
      this.dimensionsM2Control.setValue(depth * width);
    } else {
      this.dimensionsM2Control.setValue(0);
      return;
    }
  }

  deleteEventHandler(): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confirmas que deseas eliminar el objeto?');
        if (!confirmed) {
          return;
        }
        
        await this.shapeService.updateStatus('trash', this.shapeUID);
        this.notificationService.show('Se eliminó el objeto.');

        this.router.navigate([
          'admin', 'settings', 'shapes'
        ]);
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  submitEventHandler(row: ResourceDTO): void {
    (async () => {
      try {
        const shapeUID = await this.shapeService.save(row, this.shapeUID);
        
        let message = this.isEdition ? 'Se actualizó la sucursal.' : 'Se creó la sucursal.';
        this.notificationService.show(message);

        // refresh query string
        if (!this.isEdition) {
          this.shapeUID = shapeUID;
          
          this.router.navigate([
            'admin', 'settings', 'shapes', 'profile',
          ], {
            queryParams: {
              ref: this.shapeUID
            },
            queryParamsHandling: 'merge',
          });
        }
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }
}

interface BasicForm {
  description: string;
  width: number;
  height: number;
  depth: number;
  dimensionsM2: number;
}

interface SelectOptions {
  label: string;
  value: string;
}
