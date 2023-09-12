import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAPIService } from 'src/app/commons/directives/search-places/google-api.service';
import { PredictionModel } from 'src/app/commons/directives/search-places/models/prediction.model';
import { ResourceDTO } from 'src/app/commons/models/global-dto';
import { BranchOfficeService } from 'src/app/commons/services/branch-office.service';
import { NotificationService } from 'src/app/commons/services/notification.service';


@Component({
  selector: 'app-branch-basic',
  templateUrl: './branch-basic.component.html',
  styleUrls: ['./branch-basic.component.scss']
})
export class BranchBasicComponent implements OnInit {

  get isEdition(): boolean {
    return !!this.branchUID.length;
  }

  branchUID: string = '';
  branchRef: ResourceDTO = {} as ResourceDTO;
  locationRef: ResourceDTO = {} as ResourceDTO;

  form: FormGroup;

  descriptionControl: FormControl = new FormControl('', Validators.required);
  addressControl: FormControl = new FormControl('', Validators.required);
  coefficientControl: FormControl = new FormControl('', Validators.required);

  get buttonText(): string {
    return (!this.isEdition) ? 'Crear Sucursal' : 'Actualizar Sucursal';
  }

  checked: boolean = false;

  set checkedModel(value: boolean) {
    this.checked = value;
  }

  get checkedModel(): boolean {
    return this.checked;
  }

  //#region PLACES

  // addressInputValue = '';
  set address(value: string) {
    this.addressControl.setValue(value);
  }

  get address(): string {
    return this.addressControl.value;
  }

  toggleList = false;

  placesCollection!: PredictionModel[];

  hasLocation = false;
  selectedPlace: PredictionModel = new PredictionModel();

  //#endregion PLACES

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private branchService: BranchOfficeService,
    private notificationService: NotificationService,
    private googleApi: GoogleAPIService,
  ) {
    this.form = new FormGroup({
      description: this.descriptionControl,
      address: this.addressControl,
      coefficient: this.coefficientControl,
    });

    this.activatedRoute.queryParams.subscribe(query => {
      const ref = query['ref'] ?? '';

      if (!ref) {
        return;
      }

      this.branchUID = ref;
    });
  }

  ngOnInit(): void {
    console.log('--- Branch Basic Component is Loaded...');
    (async () => {
      try {
        if (!this.isEdition) {
          return;
        }

        const dataset = await this.branchService.fetchByUUID(this.branchUID);

        const branch = dataset.find(row => row.category === 'BRANCHES');
        const location = dataset.find(row => row.category === 'LOCATIONS');

        if (!branch?.category || !location?.category) {
          throw new Error('');
        }

        this.descriptionControl.setValue(branch.description);
        this.addressControl.setValue(location.description);
        this.coefficientControl.setValue(branch.coefficient);
        this.checkedModel = (branch.status !== 'active');

        this.branchRef = branch;
        this.locationRef = location;
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }

  //#region GOOGLE SEARCH API

  setPlaceEventHandler(collection: PredictionModel[]): void {
    this.placesCollection = collection;
    this.toggleList = true;
  }

  selectPlaceEventHandler(place: PredictionModel): void {
    (async (): Promise<void> => {
      try {
        this.selectedPlace = await this.googleApi.getGeocodePlace(place);
        // hidding the list
        this.toggleList = false;
        // restarting the collection
        this.initializePlaces();
        // resetting search input
        const addressTextParts = [
          this.selectedPlace.mainText,
          this.selectedPlace.city,
          this.selectedPlace.province,
        ];
        this.address = addressTextParts.join(', ');
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }

  clearInputPlaceEventHandler(): void {
    if (this.address) {
      return;
    }

    // hidding the list
    this.toggleList = false;
    // restarting the collection
    this.initializePlaces();
    // resetting search input
    this.address = '';
  }

  removeSelectedPlaceEventHandler(): void { }

  private initializePlaces(): void {
    this.placesCollection = new Array<PredictionModel>();
  }

  //#endregion GOOGLE SEARCH API

  submitEventHandler(form: BasicForm): void {
    (async () => {
      try {
        console.log({form, place: this.selectedPlace});

        const branch = {
          description: form.description,
          coefficient: +form.coefficient,
        } as ResourceDTO;

        const {
          city, country, id, latitude, longitude,
          mainText, province, secondaryText, text,
        } = this.selectedPlace;

        const place = {
          city, country,
          placeId: id,
          latitude: +latitude,
          longitude: +longitude,
          mainText, province,
          secondaryText,
          fullAddress: text,
          postalCode: '', // FIXME
          description: secondaryText,
        } as ResourceDTO;

        const branchUID = await this.branchService.save([branch, place], this.branchUID);

        let message = 'Se creó la sucursal.';
        if (this.isEdition) {
          message = 'Se actualizó la sucursal.';
        }

        this.notificationService.show(message);

        // refresh query string
        if (!this.isEdition) {
          this.router.navigate([
            'admin', 'settings', 'branch-offices', 'create'
          ], {
            queryParams: {
              ref: branchUID
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

  disableBranchEventHandler(): void {
    (async () => {
      try {
        const status = (this.checked) ? 'inactive' : 'active';
        await this.branchService.updateStatus(status, this.branchUID);

        let message = 'Se Activó la sucursal.';
        if (this.checked) {
          message = 'Se Desactivó la sucursal.';
        }

        this.notificationService.show(message);
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }

  deleteBranchEventHandler(): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confirmas que deseas eliminar la sucursal?');
        if (!confirmed) {
          return;
        }

        await this.branchService.updateStatus('trash', this.branchUID);

        this.notificationService.show('Se eliminó la sucursal');

        this.router.navigate([
          'admin', 'settings', 'branch-offices'
        ]);
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }

  valueControlChange(event: any) {
    this.coefficientControl.setValue(event.target.value);
  }
}

interface BasicForm {
  description: string,
  address: string;
  coefficient: string;
}

interface SelectOptions {
  label: string;
  value: string;
}
