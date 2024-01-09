import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleColumn } from 'src/app/commons/components/simple-tablex';
import { ResourceDTO } from 'src/app/commons/models/global-dto';
import { BranchOfficeService } from 'src/app/commons/services/branch-office.service';
import { NotificationService } from 'src/app/commons/services/notification.service';


@Component({
  selector: 'app-branch-area',
  templateUrl: './branch-area.component.html',
  styleUrls: ['./branch-area.component.scss']
})
export class BranchAreaComponent implements OnInit {

  branchUID: string = '';
  coefficients: ResourceDTO[] = [];
  branchCoefficient: number = 0;

  columns: SimpleColumn[] = [
    { property: 'areaCoefficient', label: 'Área' },
    { property: 'coefficient', label: 'Coeficiente' },
    { property: 'value', label: 'Valor' },
    { property: 'actions', label: 'Acciones' },
  ];

  form: FormGroup;
  areaCoefficientControl = new FormControl('', [Validators.required]);
  coefficientControl = new FormControl('', [Validators.required]);
  valueControl = new FormControl('', [Validators.required]);

  constructor(
    private notificationService: NotificationService,
    private branchService: BranchOfficeService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.form = new FormGroup({
      areaCoefficient: this.areaCoefficientControl,
      coefficient: this.coefficientControl,
      value: this.valueControl,
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
    this.fetchCoefficients();

    this.coefficientControl.valueChanges.subscribe((value) => {
      this.valueControl.setValue(value * this.branchCoefficient);
    })
  }

  submitEventHandler(values: any) {
    this.createAreaCoefficient(values);
  }

  async fetchCoefficients() {
    try {
      const dataset = await this.branchService.fetchByUUID(this.branchUID);
      this.branchCoefficient = dataset.find(row => row.category === 'BRANCHES')?.coefficient || 0;
      this.coefficients = dataset.find(row => row.category === 'AREA_COEFFICIENT')?.coefficients || [] as ResourceDTO[];
    } catch (error) {
      console.log(error)
    }
  }

  async createAreaCoefficient(values: any) {
    try {
      const request = {
        areaCoefficient: values.areaCoefficient,
        coefficient: values.coefficient,
        value: values.value,
        branchUID: this.branchUID,
      }
      await this.branchService.createAreaCoefficient(request)
      this.notificationService.show('Se creó el coeficiente.');
      this.form.reset();
      this.fetchCoefficients();
    } catch (error: any) {
      this.notificationService.showError(error.message);
    }
  }

  async deleteAreaCoefficient(uid: any) {
    try {
      const confirmed = await this.notificationService.showQuestion('¿Confirmá que deseas eliminar el coeficiente? ésta acción no podrá ser revertida.');
      if (!confirmed) {
        return;
      }
      await this.branchService.deleteAreaCoefficient(this.branchUID, uid);
      this.notificationService.show('Se borró el coeficiente.');
      this.fetchCoefficients();
    } catch (error: any) {
      this.notificationService.showError(error.message);
    }
  }
  
}
