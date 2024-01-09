import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BranchOfficeService } from 'src/app/commons/services/branch-office.service';
import { NotificationService } from 'src/app/commons/services/notification.service';
import { BranchOfficeModel } from 'src/app/commons/view-models/branch-office.model';
import { SimpleColumn } from 'src/app/commons/components/simple-tablex';


@Component({
  selector: 'app-branch-office',
  templateUrl: './branch-offices.component.html',
  styleUrls: ['./branch-offices.component.scss'],
})
export class BranchOfficesComponent implements OnInit {

  columns: SimpleColumn[] = [
    { property: 'description', label: 'Descripción' },
    { property: 'status', label: 'Estado' },
    { property: 'createdAt', label: 'Fecha de creación' },
    { property: 'actions', label: 'Acciones' },
  ];

  branchOffices: any[] = [];

  constructor(
    private notificationService: NotificationService,
    private branchOfficeService: BranchOfficeService,
    private router: Router,
  ) {
    // this.branchOfficeCollection = new Array<BranchOfficeModel>();
  }

  ngOnInit(): void {
    this.onInit();
  }

  async onInit(): Promise<void> {
    try {
      this.branchOffices = await this.branchOfficeService.fetchAllV2();
      console.log(this.branchOffices)
    }
    catch (error: any) {
      this.notificationService.showError(error.message);
    }
  }

  editionClickEventHandler(data: any): void {
    this.router.navigate([
      'admin', 'settings', 'branch-offices', 'create',
    ], {
      queryParams: {
        ref: data.uid,
      },
      queryParamsHandling: 'merge',
    });
  }

  deleteClickEventHandler(data: any): void {
    (async () => {
      try {
        const confirmed = await this.notificationService.showQuestion('¿Confirmas que deseas eliminar la sucursal?');
        if (!confirmed) {
          return;
        }

        await this.branchOfficeService.updateStatus('trash', data.uid);
        await this.onInit();

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
}
