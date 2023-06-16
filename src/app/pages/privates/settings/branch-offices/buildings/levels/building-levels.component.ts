import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceDTO } from 'src/app/commons/models/global-dto';
import { BuildingService } from 'src/app/commons/services/building.service';
import { LevelService } from 'src/app/commons/services/level.service';
import { NotificationService } from 'src/app/commons/services/notification.service';


@Component({
  selector: 'app-building-levels',
  templateUrl: './building-levels.component.html',
  styleUrls: ['./building-levels.component.scss']
})
export class BuildingLevelsComponent implements OnInit {

  get isEdition(): boolean {
    return !!this.branchUID?.length;
  }

  branchUID: string = '';
  buildingUID: string = '';

  levels: ResourceDTO[] = new Array<ResourceDTO>();

  form: FormGroup;

  descriptionControl: FormControl = new FormControl('', Validators.required);
  coefficientControl: FormControl = new FormControl('', Validators.required);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private buildingService: BuildingService,
    private levelService: LevelService,
  ) {
    this.form = new FormGroup({
      description: this.descriptionControl,
      coefficient: this.coefficientControl,
    });

    this.activatedRoute.queryParams.subscribe(query => {
      const ref = query['ref'] ?? '';
      const buildingRef = query['ref.building'] ?? '';

      if (!ref || !buildingRef) {
        // FIXME take me to safe zone;
        return;
      }

      this.branchUID = ref;
      this.buildingUID = buildingRef;
    });
  }

  ngOnInit(): void {
    (async () => {
      await this.fetchData();
    })();
  }

  async fetchData(): Promise<void> {
    try {
      this.levels = await this.levelService.fetchAllByBranchAndBuildingUID(this.branchUID, this.buildingUID);
    }
    catch (error: any) {
      this.notificationService.errorDialog(error);
    }
  }

  submitEventHandler(form: LevelForm): void {
    (async () => {
      try {
        const request = {
          description: form.description,
          coefficient: +form.coefficient,
        } as ResourceDTO;

        await this.levelService.save(request, this.branchUID, this.buildingUID);

        this.notificationService.show('Se creó el nivel.');

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

        await this.levelService.updateLevelStatus(request, this.branchUID, this.buildingUID);

        this.notificationService.show('Se actualizó el nivel.');
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  deleteClickEventHandler(row: ResourceDTO): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confirmas que deseas eliminar el nivel?');
        if (!confirmed) {
          return;
        }

        const request = {
          status: 'trash',
          uid: row.uid,
        } as ResourceDTO;

        await this.levelService.updateLevelStatus(request, this.branchUID, this.buildingUID);

        this.notificationService.show('Se eliminó el nivel.');

        await this.fetchData();
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

}

interface LevelForm {
  description: string;
  coefficient: string;
}
