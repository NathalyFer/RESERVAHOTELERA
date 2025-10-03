import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { ReservasService, Reserva } from '../../services/reservas.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
  standalone:false,
})
export class ReservasPage {
  form: Omit<Reserva, 'reserva_id'> = {
    cliente_id: 0,
    habitacion_id: 0,
    fecha_entrada: '',
    fecha_salida: '',
    cantidad_personas: 1,
    estado_reserva: 'pendiente',
    qr_code: null
  };

  minDate = new Date().toISOString().slice(0, 10);

  constructor(
    private reservasSvc: ReservasService,
    private nav: NavController,
    private toast: ToastController
  ) {}

  private normalizeDate(v: string) { return v ? v.slice(0, 10) : ''; }

  async guardar() {
    if (!this.form.cliente_id || !this.form.habitacion_id) {
      return this.present('Cliente y Habitación son obligatorios');
    }
    this.form.fecha_entrada = this.normalizeDate(this.form.fecha_entrada);
    this.form.fecha_salida = this.normalizeDate(this.form.fecha_salida);
    if (!this.form.fecha_entrada || !this.form.fecha_salida) {
      return this.present('Debes seleccionar ambas fechas');
    }
    if (this.form.fecha_salida < this.form.fecha_entrada) {
      return this.present('La fecha de salida no puede ser menor a la de entrada');
    }

    this.reservasSvc.crear(this.form);
    await this.present('Reserva creada ✅');
    this.nav.navigateForward('/lista-reservas');
  }

  irListado() { this.nav.navigateForward('/lista-reservas'); }

  private async present(message: string) {
    const t = await this.toast.create({ message, duration: 1800, position: 'bottom' });
    t.present();
  }
}
