import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceDTO } from 'src/app/commons/models/global-dto';
import { BuildingService } from 'src/app/commons/services/building.service';
import { NotificationService } from 'src/app/commons/services/notification.service';


@Component({
  selector: 'app-building-basic',
  templateUrl: './building-basic.component.html',
  styleUrls: ['./building-basic.component.scss']
})
export class BuildingBasicComponent implements OnInit {

  get isEdition(): boolean {
    return !!this.buildingUID.length;
  }

  branchUID: string = '';
  buildingUID: string = '';
  buildingRef: ResourceDTO = {} as ResourceDTO;

  form: FormGroup;

  descriptionControl: FormControl = new FormControl('', Validators.required);
  coefficientControl: FormControl = new FormControl('', Validators.required);

  checked: boolean = false;

  set checkedModel(value: boolean) {
    this.checked = value;
  }

  get checkedModel(): boolean {
    return this.checked;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private buildingService: BuildingService,
  ) {
    this.form = new FormGroup({
      description: this.descriptionControl,
      coefficient: this.coefficientControl,
    });

    this.activatedRoute.queryParams.subscribe(query => {
      const buildingRef = query['ref.building'] || '';
      const ref = query['ref'] || '';

      if (!ref || !ref) {
        // FIXME navigate to safe zone here;
        return;
      }

      this.branchUID = ref;
      this.buildingUID = buildingRef;
    });
  }

  ngOnInit(): void {
    (async () => {
      try {
        const buildingDTO = await this.buildingService.fetchBuildingByUID(this.buildingUID);

        this.descriptionControl.setValue(buildingDTO.description);
        this.coefficientControl.setValue(buildingDTO.coefficient);
        this.checkedModel = (buildingDTO.status === 'active');

        this.buildingRef = buildingDTO;
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  submitEventHandler(form: BasicForm): void {
    (async () => {
      try {
        const request = {
          description: form.description,
          coefficient: +form.coefficient,
          uid: this.buildingUID,
        } as ResourceDTO;

        await this.buildingService.updateBuilding(request, this.branchUID);

        this.notificationService.show('Se actualizó el edificio.');

        return;
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  disableEventHandler(): void {
    (async () => {
      try {
        const request = {
          status: (this.checked) ? 'active' : 'inactive',
          uid: this.buildingUID,
        } as ResourceDTO;

        await this.buildingService.updateBuildingStatus(request, this.branchUID);

        this.notificationService.show('Se actualizó el edificio.');
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  deleteEventHandler(): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confirmas que deseas eliminar el edificio?');
        if (!confirmed) {
          return;
        }

        const request = {
          status: 'trash',
          uid: this.buildingUID,
        } as ResourceDTO;

        await this.buildingService.updateBuildingStatus(request, this.branchUID);

        this.notificationService.show('Se eliminó el edificio.');

        this.router.navigate([
          'admin', 'settings', 'branch-offices', 'create',
        ], {
          queryParams: {
            ref: this.branchUID,
            page: 'buildings',
          },
        });
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

}

interface BasicForm {
  description: string,
  coefficient: string;
}
