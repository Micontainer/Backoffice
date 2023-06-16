import { Injectable } from "@angular/core";
import Swal from "sweetalert2";
import { SwalResult, SwalSeverityType } from '../externals/swal';

@Injectable()
export class NotificationService {
  private readonly DefaultTitle: string = 'Mi Container';

  private toast: any;

  constructor() {
    this.toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
  }

  show(message: string, icon: 'success' | 'info' | 'warning' | 'error' = 'success'): void {
    this.toast.fire({
      icon,
      title: message,
    });
  }

  showInfo(message: string): void {
    this.dispatch(message, 'info');
  }

  showSuccess(message: string): void {
    this.dispatch(message, 'success');
  }

  showWarning(message: string): void {
    this.dispatch(message, 'warning');
  }

  showError(message: string): void {
    this.dispatch(message, 'error');
  }

  errorDialog(error: Error): void {
    this.showError(error.message);
  }

  async showQuestion(message: string): Promise<boolean> {
    const result = await this.dispatchDialog(message);
    return Promise.resolve(result.isConfirmed);
  }

  private dispatch(message: string, icon: SwalSeverityType): void {
    Swal.fire(this.DefaultTitle, message, icon);
  }

  private async dispatchDialog(message: string): Promise<SwalResult> {
    return await Swal.fire({
      title: this.DefaultTitle,
      text: message,
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: 'var(--bs-active-danger)',
      confirmButtonColor: 'var(--bs-active-success)',
      confirmButtonText: 'SI',
      cancelButtonText: 'CANCELAR',
    });
  }

}
