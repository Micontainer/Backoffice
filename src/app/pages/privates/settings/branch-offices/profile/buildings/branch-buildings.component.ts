import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceDTO } from 'src/app/commons/models/global-dto';
import { BranchOfficeService } from 'src/app/commons/services/branch-office.service';
import { BuildingService } from 'src/app/commons/services/building.service';
import { NotificationService } from 'src/app/commons/services/notification.service';


@Component({
  selector: 'app-branch-buildings',
  templateUrl: './branch-buildings.component.html',
  styleUrls: ['./branch-buildings.component.scss']
})
export class BranchBuildingsComponent implements OnInit {

  get isEdition(): boolean {
    return !!this.branchUID.length;
  }

  branchUID: string = '';
  buildings: ResourceDTO[] = new Array<ResourceDTO>();

  form: FormGroup;

  descriptionControl: FormControl = new FormControl('', Validators.required);
  coefficientControl: FormControl = new FormControl('', Validators.required);

  private contact: ResourceDTO | undefined;
  private schedules: ResourceDTO[] = [];

  get cantCreateBuilding(): boolean {
    return !this.contact || !this.schedules?.length
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private branchService: BranchOfficeService,
    private buildingService: BuildingService,
  ) {
    this.form = new FormGroup({
      description: this.descriptionControl,
      coefficient: this.coefficientControl,
    });

    this.activatedRoute.queryParams.subscribe(query => {
      const ref = query['ref'] ?? '';

      if (!ref) {
        // FIXME navigate to safe zone here;
        return;
      }

      this.branchUID = ref;
    });
  }

  ngOnInit(): void {
    console.log('--- Branch Buildings Component is Loaded...');
    (async () => {
      await this.fetchData();
    })();
  }

  async fetchData(): Promise<void> {
    try {
      if (!this.isEdition) {
        return;
      }

      const dataset = await this.branchService.fetchByUUID(this.branchUID);
      this.contact = dataset.find(row => row.category === 'CONTACTS');
      this.schedules = dataset.filter(row => row.category === 'SCHEDULES');

      this.buildings = await this.buildingService.fetchAllByBranchUID(this.branchUID);
    }
    catch (error: any) {
      this.notificationService.errorDialog(error);
    }
  }

  submitEventHandler(form: BuildingForm): void {
    (async () => {
      try {
        const request = {
          description: form.description,
          coefficient: +form.coefficient,
        } as ResourceDTO;

        await this.buildingService.saveBuilding(request, this.branchUID);

        this.notificationService.show('Se creó el edificio.');

        await this.fetchData();

        this.form.reset();
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  statusChangeEventHandler(row: ResourceDTO): void {
    (async () => {
      try {
        console.log({row});
        const request = {
          status: (row.status === 'active') ? 'inactive' : 'active',
          uid: row.uid,
        } as ResourceDTO;

        await this.buildingService.updateBuildingStatus(request, this.branchUID);

        this.notificationService.show('Se actualizó el edificio.');
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  deleteClickEventHandler(row: ResourceDTO): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confirmas que deseas eliminar el edificio?');
        if (!confirmed) {
          return;
        }

        const request = {
          status: 'trash',
          uid: row.uid,
        } as ResourceDTO;

        await this.buildingService.updateBuildingStatus(request, this.branchUID);

        this.notificationService.show('Se eliminó el edificio.');

        await this.fetchData();
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

}

interface BuildingForm {
  description: string;
  coefficient: string;
}
