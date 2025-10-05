import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ReservasService, Reserva } from '../../services/reservas.service';

@Component({
  selector: 'app-lista-reservas',
  templateUrl: './lista-reservas.page.html',
  standalone:false,
  styleUrls: ['./lista-reservas.page.scss'],
})
export class ListaReservasPage {
  reservas: Reserva[] = [];

  constructor(
    private reservasSvc: ReservasService,
    private nav: NavController,
    private alert: AlertController
  ) {}

  ionViewWillEnter() { this.cargar(); }

  cargar() {
    this.reservas = this.reservasSvc.listar();
  }

  irNueva() { this.nav.navigateBack('/reservas'); }

  async limpiarTodo() {
    const a = await this.alert.create({
      header: 'Confirmar',
      message: '¿Eliminar todas las reservas?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => { this.reservasSvc.limpiarTodo(); this.cargar(); } }
      ]
    });
    await a.present();
  }
}
