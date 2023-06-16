import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceDTO } from 'src/app/commons/models/global-dto';
import { BuildingService } from 'src/app/commons/services/building.service';
import { LevelService } from 'src/app/commons/services/level.service';
import { NotificationService } from 'src/app/commons/services/notification.service';


@Component({
  selector: 'app-level-basic',
  templateUrl: './level-basic.component.html',
  styleUrls: ['./level-basic.component.scss']
})
export class LevelBasicComponent implements OnInit {

  get isEdition(): boolean {
    return !!this.buildingUID.length;
  }

  branchUID: string = '';
  buildingUID: string = '';
  levelUID: string = '';
  levelRef: ResourceDTO = {} as ResourceDTO;

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
    private levelService: LevelService,
  ) {
    this.form = new FormGroup({
      description: this.descriptionControl,
      coefficient: this.coefficientControl,
    });

    this.activatedRoute.queryParams.subscribe(query => {
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
    });
  }

  ngOnInit(): void {
    (async () => {
      try {
        const levelDTO = await this.levelService.fetchLevelByUID(this.levelUID);

        this.descriptionControl.setValue(levelDTO.description);
        this.coefficientControl.setValue(levelDTO.coefficient);
        this.checkedModel = (levelDTO.status === 'active');

        this.levelRef = levelDTO;
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
          uid: this.levelUID,
        } as ResourceDTO;

        await this.levelService.updateLevel(request, this.branchUID, this.buildingUID);

        this.notificationService.show('Se actualizó el nivel.');

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
          uid: this.levelUID,
        } as ResourceDTO;

        await this.levelService.updateLevelStatus(request, this.branchUID, this.buildingUID);

        this.notificationService.show('Se actualizó el nivel.');
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  deleteEventHandler(): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confirmas que deseas eliminar el nivel?');
        if (!confirmed) {
          return;
        }

        const request = {
          status: 'trash',
          uid: this.levelUID,
        } as ResourceDTO;

        await this.levelService.updateLevelStatus(request, this.branchUID, this.buildingUID);

        this.notificationService.show('Se eliminó el nivel.');

        this.router.navigate([
          'admin', 'settings', 'branch-offices', 'buildings',
        ], {
          queryParams: {
            'ref': this.branchUID,
            'ref.building': this.buildingUID,
            page: 'levels',
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
