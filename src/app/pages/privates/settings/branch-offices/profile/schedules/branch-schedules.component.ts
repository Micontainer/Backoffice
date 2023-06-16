import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceDTO } from 'src/app/commons/models/global-dto';
import { BranchOfficeService } from 'src/app/commons/services/branch-office.service';
import { NotificationService } from 'src/app/commons/services/notification.service';


@Component({
  selector: 'app-branch-schedules',
  templateUrl: './branch-schedules.component.html',
  styleUrls: ['./branch-schedules.component.scss']
})
export class BranchSchedulesComponent implements OnInit {

  get isEdition(): boolean {
    return !!this.branchUID?.length;
  }

  branchUID: string = '';
  schedules: ResourceDTO[] = new Array<ResourceDTO>();

  form: FormGroup;

  descriptionControl: FormControl = new FormControl('', Validators.required);
  hourFromControl: FormControl = new FormControl('', Validators.required);
  hourToControl: FormControl = new FormControl('', Validators.required);

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private branchService: BranchOfficeService,
  ) {
    this.form = new FormGroup({
      description: this.descriptionControl,
      hourFrom: this.hourFromControl,
      hourTo: this.hourToControl,
    });

    this.activatedRoute.queryParams.subscribe(query => {
      const ref = query['ref'] ?? '';

      if (!ref) {
        // FIXME maybe here we can navigate to safe zone;
        return;
      }

      this.branchUID = ref;
    });
  }

  ngOnInit(): void {
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

      this.schedules = dataset.filter(row => row.category === 'SCHEDULES');
    }
    catch (error: any) {
      this.notificationService.errorDialog(error);
    }
  }

  submitEventHandler(form: ScheduleForm): void {
    (async () => {
      try {
        const request = {
          ...form,
        } as ResourceDTO;

        await this.branchService.saveSchedule(request, this.branchUID);

        this.notificationService.show('Se creó el horario.');

        await this.fetchData();
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  statusChangeEventHandler(schedule: ResourceDTO): void {
    (async () => {
      try {
        const request = {
          status: (schedule.status === 'active') ? 'inactive' : 'active',
          uid: schedule.uid,
        } as ResourceDTO;

        await this.branchService.updateScheduleStatus(request, this.branchUID);

        this.notificationService.show('Se actualizó el horario.');
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  deleteClickEventHandler(schedule: ResourceDTO): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confirmas que deseas eliminar el horario?');
        if (!confirmed) {
          return;
        }

        const request = {
          status: 'trash',
          uid: schedule.uid,
        } as ResourceDTO;

        await this.branchService.updateScheduleStatus(request, this.branchUID);

        this.notificationService.show('Se eliminó el horario.');

        await this.fetchData();
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

}

interface ScheduleForm {
  description: string;
  hourFrom: string;
  hourTo: string;
}
