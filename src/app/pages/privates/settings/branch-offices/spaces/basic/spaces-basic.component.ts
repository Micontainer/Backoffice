import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceDTO } from 'src/app/commons/models/global-dto';
import { CommonService } from 'src/app/commons/services/common.service';
import { LevelService } from 'src/app/commons/services/level.service';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { PriceOptions, SpaceService } from 'src/app/commons/services/space.service';


@Component({
  selector: 'app-space-basic',
  templateUrl: './spaces-basic.component.html',
  styleUrls: ['./spaces-basic.component.scss']
})
export class SpaceBasicComponent implements OnInit, AfterViewInit {

  get isEdition(): boolean {
    return !!this.spaceUID.length;
  }

  branchUID: string = '';
  buildingUID: string = '';
  levelUID: string = '';
  spaceUID: string = '';

  spaceRef: ResourceDTO = {} as ResourceDTO;

  get buttonText(): string {
    return (this.isEdition)
      ? 'Actualizar Espacio'
      : 'Crear Espacio';
  }

  form: FormGroup;

  descriptionControl: FormControl = new FormControl('', Validators.required);
  areaCoefficientControl: FormControl = new FormControl('', Validators.required);
  widthControl: FormControl = new FormControl('', Validators.required);
  heightControl: FormControl = new FormControl('', Validators.required);
  depthControl: FormControl = new FormControl('', Validators.required);
  dimensionsM2Control: FormControl = new FormControl('', Validators.required);
  priceControl: FormControl = new FormControl('', Validators.required);

  coefficients: SelectOptions[] = [];
  imageControl: FormControl = new FormControl('', Validators.required);

  selectedState: string = '';
  set optionModel(value: string) {
    this.selectedState = value;
  }

  get optionModel(): string {
    return this.selectedState;
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

  //#region PRICE CALCULATION

  private price: number = 0;

  //#endregion PRICE CALCULATION

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

  branchCoefficient: ResourceDTO = {} as ResourceDTO;
  buildingCoefficient: ResourceDTO = {} as ResourceDTO;
  levelCoefficient: ResourceDTO = {} as ResourceDTO;
  areaCoefficients: ResourceDTO = {} as ResourceDTO;;

  stateOptions: SelectOptions[] = [
    { label: 'Ocupado', value: 'busy' },
    { label: 'Reservado', value: 'reserved' },
    { label: 'Disponible', value: 'available' },
    { label: 'Pendientes', value: 'pending' },
    { label: 'No disponible', value: 'unavailable' },
    { label: 'Activo', value: 'active' },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private levelService: LevelService,
    private spaceService: SpaceService,
    private commonService: CommonService,
  ) {
    this.form = new FormGroup({
      description: this.descriptionControl,
      areaCoefficientUID: this.areaCoefficientControl,
      width: this.widthControl,
      height: this.heightControl,
      depth: this.depthControl,
      dimensionsM2: this.dimensionsM2Control,
      image: this.imageControl,
    });

    this.activatedRoute.queryParams.subscribe(query => {
      const spaceRef = query['ref.space'] || '';
      const levelRef = query['ref.level'] || '';
      const buildingRef = query['ref.building'] || '';
      const ref = query['ref'] || '';

      if (!ref || !buildingRef || !levelRef) {
        // FIXME navigate to safe zone here;
        return;
      }

      this.branchUID = ref;
      this.buildingUID = buildingRef;
      this.levelUID = levelRef;
      this.spaceUID = spaceRef;
    });
  }

  ngOnInit(): void {
    (async () => {
      try {
        const coefficients = await this.commonService.fetchCoefficients(this.branchUID, this.buildingUID, this.levelUID);

        this.branchCoefficient = coefficients.find(row => row.category === 'BRANCHES') || {} as ResourceDTO;
        this.buildingCoefficient = coefficients.find(row => row.category === 'BUILDINGS') || {} as ResourceDTO;
        this.levelCoefficient = coefficients.find(row => row.category === 'LEVELS') || {} as ResourceDTO;
        this.areaCoefficients = coefficients.find(row => row.category === 'AREA_COEFFICIENT') || {} as ResourceDTO;

        this.coefficients = this.areaCoefficients?.coefficients?.map((coefficient: any) => {
          return {
            label: `${coefficient.areaCoefficient} m2 - ${coefficient.coefficient} - $${coefficient.value}`,
            value: coefficient.uid,
          } as SelectOptions;
        }) || [];

        if (!this.isEdition) {
          this.checkSelection(this.areaCoefficientControl, this.coefficients);
          this.dimensionsM2Control.setValue(0);
          return;
        }

        if (this.isEdition) {
          await this.fetchData();
        }
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  async fetchData() {
    try {
      const spaceDTO = await this.spaceService.fetchByUID(this.spaceUID);
      const spaceRelations = await this.commonService.fetchRelations(this.spaceUID);
      spaceDTO.image = spaceRelations.find((element) => element.pk === 'ATTACHMENT');

      this.descriptionControl.setValue(spaceDTO.description);
      this.widthControl.setValue(spaceDTO.width);
      this.heightControl.setValue(spaceDTO.height);
      this.depthControl.setValue(spaceDTO.depth);
      this.dimensionsM2Control.setValue(spaceDTO.dimensionsM2);
      this.imageControl.setValue(spaceDTO.image);

      if (spaceDTO.areaCoefficientUID) {
        this.areaCoefficientControl.setValue(spaceDTO.areaCoefficientUID);
      }

      this.optionModel = spaceDTO.status;
      this.spaceRef = spaceDTO;

      this.runCalculation();
    } catch (error: any) {
      return this.notificationService.errorDialog(error);
    }
  }

  ngAfterViewInit(): void {
    this.heightControl.valueChanges.subscribe(() => {
      this.runCalculation();
    });

    this.depthControl.valueChanges.subscribe(() => {
      this.runCalculation();
    });

    this.widthControl.valueChanges.subscribe(() => {
      this.runCalculation();
    });

    this.areaCoefficientControl.valueChanges.subscribe(() => {
      this.runCalculation();
    });
  }

  private runCalculation(): void {
    // update m3
    if (this.height && this.width && this.depth) {
      this.dimensionModel = this.height * this.width * this.depth;
    } else {
      this.dimensionModel = 0;
    }

    if (this.depth && this.width) {
      this.dimensionsM2Control.setValue(this.depth * this.width);
    } else {
      this.dimensionsM2Control.setValue(0);
      this.priceControl.setValue(0);
      return;
    }

    const coefficientM2: any = this.areaCoefficients?.coefficients?.find((coefficient: any) => coefficient.uid === this.areaCoefficientControl.value);
    if (!coefficientM2) {
      return;
    }

    const purchaseOptions: PriceOptions = {
      branchOfficeCoefficient: this.branchCoefficient.coefficient,
      buildingCoefficient: this.buildingCoefficient.coefficient,
      levelCoefficient: this.levelCoefficient.coefficient,
      storageCoefficient: coefficientM2.coefficient,
      storageDimensionM2: +this.dimensionsM2Control.value,
    }
    this.priceControl.setValue(this.spaceService.priceCalculation(purchaseOptions));
  }

  submitEventHandler(form: BasicForm): void {
    (async () => {
      try {
        const request = {
          ...form,
        } as ResourceDTO;
        request.attachmentUID = this.imageControl.value.uid;

        if (this.isEdition) {
          await this.updateHandler(request);
          return;
        }

        const spaceUID = await this.spaceService.save(request, this.branchUID, this.buildingUID, this.levelUID);
        this.notificationService.show('Se creó el espacio.');

        // refresh query string
        if (!this.isEdition) {
          this.router.navigate([
            'admin', 'settings', 'branch-offices', 'spaces',
          ], {
            queryParams: {
              ref: this.branchUID,
              'ref.building': this.buildingUID,
              'ref.level': this.levelUID,
              'ref.space': spaceUID,
            },
            queryParamsHandling: 'merge',
          });
        }

        return;
      }
      catch (error: any) {
        return this.notificationService.errorDialog(error);
      }
    })();
  }

  async updateHandler(request: ResourceDTO): Promise<void> {
    try {
      request.uid = this.spaceUID;
      request.attachmentUID = this.imageControl.value.uid;
      await this.spaceService.update(request, this.branchUID, this.buildingUID, this.levelUID);
      this.notificationService.show('Se actualizó el espacio.');
    }
    catch (error: any) {
      this.notificationService.errorDialog(error);
    }
    finally {
      return Promise.resolve();
    }
  }

  stateChangeEventHandler(): void {
    (async () => {
      try {
        const request = {
          status: this.selectedState,
          uid: this.spaceUID,
        } as ResourceDTO;

        await this.spaceService.updateStatus(request, this.branchUID, this.buildingUID, this.levelUID);

        this.notificationService.show('Se actualizó el estado del espacio.');
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  deleteEventHandler(): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confirmas que deseas eliminar el espacio?');
        if (!confirmed) {
          return;
        }

        const request = {
          status: 'deleted',
          uid: this.spaceUID,
        } as ResourceDTO;

        await this.spaceService.updateStatus(request, this.branchUID, this.buildingUID, this.levelUID);

        this.notificationService.show('Se eliminó el espacio.');

        this.router.navigate([
          'admin', 'settings', 'branch-offices', 'levels',
        ], {
          queryParams: {
            'ref': this.branchUID,
            'ref.building': this.buildingUID,
            'ref.level': this.levelUID,
            page: 'spaces',
          }
        })
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  checkSelection(formControl: FormControl, collection: any[]) {
    if (this.isEdition
      && collection.find((element) => formControl.value === element.value)) {
      return;
    }
    formControl.setValue(collection[0]?.value);
  }

  addAreaCoefficientEventHandler() {
    this.router.navigate(['admin/settings/branch-offices/create'], {
      queryParams: {
        ref: this.branchUID,
        page: 'area',
      }
    });
  }
  
  selectImageEmitEventHandler(event: any) {
    console.log(this.imageControl.value)
    this.imageControl.setValue(event);
    console.log(this.imageControl.value)
  }

  clearSelectedImageEventHandler() {
    this.imageControl.setValue('');
  }
}

interface BasicForm {
  description: string;
  areaCoefficientUID: string;
  width: number;
  height: number;
  depth: number;
  dimensionsM2: number;
}

interface SelectOptions {
  label: string;
  value: string;
}
