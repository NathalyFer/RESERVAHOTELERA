import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-info-cliente-modal',
  templateUrl: './info-cliente-modal.page.html',
  styleUrls: ['./info-cliente-modal.page.scss'],
  standalone: false,
})
export class InfoClienteModalPage  {

  // declaración de inputs para recibir datos desde HomePage
  @Input() nombre!: any;
  @Input() email!: any;
  @Input() telefono!: any;
  @Input() direccion!: any;
  @Input() password!: any;

  constructor( private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  // Método para cerrar el modal
  close() {
  this.modalCtrl.dismiss();
}

}

