import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-modal',
  templateUrl: './modal-generic.component.html',
  styleUrls: ['./modal-generic.component.scss']
})
export class ModalGeneriComponent implements OnInit, AfterViewInit {

  @ViewChild('genericModal') modalReference!: ElementRef<HTMLDivElement>;

  @Input() caption: string = '';
  @Input() showCloseButton: boolean = true;

  modal: any;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.modal = new bootstrap.Modal(this.modalReference.nativeElement);
  }

  toggle(): void {
    this.modal.toggle();
  }
}
