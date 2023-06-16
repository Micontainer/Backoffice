import { CustomerService } from '../../../../../commons/services/customer.service';
import { CommonService } from 'src/app/commons/services/common.service';
import { SpaceService } from '../../../../../commons/services/space.service';
import { LevelService } from '../../../../../commons/services/level.service';
import { BuildingService } from '../../../../../commons/services/building.service';
import { BranchOfficeService } from '../../../../../commons/services/branch-office.service';
import { OrderService } from 'src/app/commons/services/order.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/commons/services/notification.service';

@Component({
  selector: 'app-booking-basic',
  templateUrl: './booking-basic.component.html',
  styleUrls: ['./booking-basic.component.scss']
})
export class BookingBasicComponent implements OnInit {

  orderUID: string = '';

  form: FormGroup;
  statusOptions: selectionOptions[] = [{
    label: 'Pendiente',
    value: 'pending',
  }, {
    label: 'Aprobada',
    value: 'approved',
  }, {
    label: 'Cancelada',
    value: 'deny',
  }]

  get isEdition(): boolean {
    return !!this.orderUID;
  }

  get submitFormLabel(): string {
    return this.isEdition ? 'Actualizar Órden' : 'Crear Órden';
  }

  get bookingDone(): boolean {
    return this.statusSelectionControl.value !== 'pending';
  }

  userEmailControl: FormControl = new FormControl('');
  customerSelectionControl: FormControl = new FormControl('', Validators.required);
  branchOfficeSelectionControl: FormControl = new FormControl('', Validators.required);
  buildingSelectionControl: FormControl = new FormControl('', Validators.required);
  levelSelectionControl: FormControl = new FormControl('', Validators.required);
  storageSelectionControl: FormControl = new FormControl('', Validators.required);
  priceControl: FormControl = new FormControl('', Validators.required);
  statusSelectionControl: FormControl = new FormControl(this.statusOptions[0].value, Validators.required);

  //#region SELECTORS
  customers: selectionOptions[] = [];
  branchOffices: selectionableOption[] = [];
  buildings: selectionableOption[] = [];
  storages: selectionableOption[] = [];
  levels: selectionableOption[] = [];
  //#endregion SELECTORS

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private orderService: OrderService,
    private branchOfficeService: BranchOfficeService,
    private buildingService: BuildingService,
    private levelService: LevelService,
    private spaceService: SpaceService,
    private commonsService: CommonService,
    private customerService: CustomerService,
  ) {
    this.form = new FormGroup({
      userEmail: this.userEmailControl,
      customerSelection: this.customerSelectionControl,
      branchOfficeSelection: this.branchOfficeSelectionControl,
      buildingSelection: this.buildingSelectionControl,
      levelSelection: this.levelSelectionControl,
      storageSelection: this.storageSelectionControl,
      price: this.priceControl,
      statusSelection: this.statusSelectionControl,
    });
    this.activatedRoute.queryParams.subscribe(query => {
      this.orderUID = query['ref'] || '';
    });
  }

  ngOnInit(): void {
    (async () => {
      try {
        if (this.isEdition) {
          this.customerSelectionControl.clearValidators();
          this.customerSelectionControl.updateValueAndValidity();
          await this.fetchOrderData();
        } else {
          await this.fetchCustomers();
        }
        await this.fetchBranchOffices();
      }
      catch (error: any) {
        this.notificationService.showError(error.message);
      }
    })();
  }

  async fetchOrderData() {
    try {
      const orderDTO = await this.orderService.fetchByUID(this.orderUID);
      this.userEmailControl.setValue(orderDTO.userEmail);
      this.userEmailControl.disable();
      this.branchOfficeSelectionControl.setValue(orderDTO.branchOfficeUid);
      this.buildingSelectionControl.setValue(orderDTO.buildingUid);
      this.levelSelectionControl.setValue(orderDTO.levelUid);
      this.storageSelectionControl.setValue(orderDTO.storageUid);
      this.priceControl.setValue(orderDTO.price);
      this.statusSelectionControl.setValue(orderDTO.status);
      if (this.bookingDone) {
        Object.values(this.form.controls).find((control) => control.disable());
      }
    }
    catch (error: any) {
      console.log(error.message);
    }
  }

  async fetchBranchOffices() {
    try {
      const collection = await this.branchOfficeService.fetchAllV2();
      if (!collection.length) {
        this.priceControl.setValue('');
        this.resetCollections(this.branchOffices, this.buildings, this.levels, this.storages);
        return;
      }
      this.branchOffices = collection.map((element) => {
        return {
          label: element.description,
          value: element.uid,
          coefficient: element.coefficient,
        } as selectionableOption;
      });
      this.checkSelection(this.branchOfficeSelectionControl, this.branchOffices);
      await this.fetchBuildings();
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async fetchBuildings() {
    try {
      const collection = await this.buildingService.fetchAllByBranchUID(this.branchOfficeSelectionControl.value);
      if (!collection.length) {
        this.priceControl.setValue('');
        this.resetCollections(this.buildings, this.levels, this.storages);
        return;
      }
      this.buildings = collection.map((element) => {
        return {
          label: element.description,
          value: element.uid,
          coefficient: element.coefficient,
        } as selectionableOption;
      });
      this.checkSelection(this.buildingSelectionControl, this.buildings);
      await this.fetchLevels();
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async fetchLevels() {
    try {
      const collection = await this.levelService.fetchAllByBranchAndBuildingUID(this.branchOfficeSelectionControl.value, this.buildingSelectionControl.value);
      if (!collection.length) {
        this.priceControl.setValue('');
        this.resetCollections(this.levels, this.storages);
        return;
      }
      this.levels = collection.map((element) => {
        return {
          label: element.description,
          value: element.uid,
          coefficient: element.coefficient,
        } as selectionableOption;
      });
      this.checkSelection(this.levelSelectionControl, this.levels);
      await this.fetchStorages();
    } catch (error: any) {
      console.log(error.message);
    }
  }

  async fetchStorages() {
    try {
      const collection = await this.spaceService.fetchAllByBranchBuildingLevelUID(this.branchOfficeSelectionControl.value, this.buildingSelectionControl.value, this.levelSelectionControl.value);
      if (!collection.length) {
        this.priceControl.setValue('');
        this.resetCollections(this.storages);
        return;
      }
      this.storages = collection
      .filter((element) => 
        !(element.status === 'busy' && !this.isEdition
        || element.status === 'busy' && this.isEdition && this.storageSelectionControl.value !== element.uid))
      .map((element) => {
        return {
          label: element.description,
          value: element.uid,
          coefficient: element.coefficient,
          dimensionM2: element.dimensionsM2,
        } as selectionableOption;
      });
      this.checkSelection(this.storageSelectionControl, this.storages);
      await this.runCalculation();
    } catch (error: any) {
      console.log(error.message);
    }
  }

  private async runCalculation(): Promise<void> {
    try {
      const coefficients = await this.commonsService.fetchCoefficients(
        this.branchOfficeSelectionControl.value,
        this.buildingSelectionControl.value,
        this.levelSelectionControl.value,
        this.storageSelectionControl.value
      );
      this.priceControl.setValue(coefficients.find((coefficient) => coefficient.category === 'STORAGES')?.price);
    } catch (error: any) {
      console.log(error.message);
    }
  }

  onStatusChangeEventHandler() {
    (async () => {
      try {
        if (!this.isEdition) {
          return;
        }
        await this.orderService.updateOrderStatus(this.orderUID, this.statusSelectionControl.value);
        this.notificationService.show('Se actualizó la orden.');
        this.fetchOrderData();
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  branchOfficeChangeEventHandler() {
    this.fetchBuildings();
  }

  buildingChangeEventHandler() {
    this.fetchLevels();
  }

  levelChangeEventHandler() {
    this.fetchStorages();
  }

  storageChangeEventHandler() {
    (async () => {
      const response = await this.commonsService.fetchCoefficients(
        this.branchOfficeSelectionControl.value,
        this.buildingSelectionControl.value,
        this.levelSelectionControl.value,
        this.storageSelectionControl.value
      );
      const storage = response.find((element) => element.category === 'STORAGES');
      if (storage) {
        this.priceControl.setValue(storage.price);
      }
    })();
  }

  checkSelection(formControl: FormControl, collection: any[]) {
    if (this.isEdition
      && collection.find((element) => formControl.value === element.value)) {
      return;
    }
    formControl.setValue(collection[0].value);
  }

  updateOrder() {
    (async () => {
      try {
        const record = {
          bookingUID: this.orderUID,
          branchOfficeUID: this.branchOfficeSelectionControl.value,
          buildingUID: this.buildingSelectionControl.value,
          levelUID: this.levelSelectionControl.value,
          storageUID: this.storageSelectionControl.value,
          status: this.statusSelectionControl.value,
        };
        await this.orderService.updateOrder(record);
        this.notificationService.show('Se actualizó la orden.');
        this.fetchOrderData();
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  createOrder() {
    (async () => {
      try {
        const record = {
          userUID: this.customerSelectionControl.value,
          branchOfficeUID: this.branchOfficeSelectionControl.value,
          buildingUID: this.buildingSelectionControl.value,
          levelUID: this.levelSelectionControl.value,
          storageUID: this.storageSelectionControl.value,
          status: this.statusSelectionControl.value,
        };
        this.orderUID = (await this.orderService.createOrder(record)).uid;
        this.notificationService.show('Se creó la orden.');
        this.router.navigate(['admin/orders/profile'], {
          queryParams: {
            'ref': this.orderUID,
          },
          queryParamsHandling: 'merge',
        });
      }
      catch (error: any) {
        this.notificationService.errorDialog(error);
      }
    })();
  }

  submitEventHandler() {
    if (this.isEdition) {
      this.updateOrder();
      return;
    }
    this.createOrder();
  }

  async fetchCustomers(): Promise<void> {
    try {
      const collection = await this.customerService.fetchAll();
      if (!collection.length) {
        return;
      }
      this.customers = collection.map((element) => {
        return {
          label: element.email,
          value: element.uid,
        } as selectionableOption;
      });
      this.customerSelectionControl.setValue(this.customers[0].value);
    }
    catch (error: any) {
      console.log(error.message);
    }
  }

  addCustomerEventHandler() {
    this.router.navigate(['admin/customers/profile']);
  }

  validCollection(collection: any): boolean {
    return collection?.length;
  }

  resetCollections(...collections: any) {
    for (const collection of collections) {
      collection.length = 0;
    }
  }

  valueControlChange(event: any) {
    this.priceControl.setValue(event.target.value);
  }
}

interface selectionableOption {
  label: string;
  value: string;
  coefficient: number;
  dimensionM2: number;
}

interface selectionOptions {
  label: string;
  value: string;
}