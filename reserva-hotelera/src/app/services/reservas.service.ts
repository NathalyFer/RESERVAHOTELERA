import { Injectable } from '@angular/core';

export interface Reserva {
  reserva_id?: number;
  cliente_id: number;
  habitacion_id: number;
  fecha_entrada: string;
  fecha_salida: string;
  cantidad_personas: number;
  estado_reserva: string;
  qr_code: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private reservas: Reserva[] = [];

  crear(reserva: Omit<Reserva, 'reserva_id'>): void {
    const nueva: Reserva = {
      ...reserva,
      reserva_id: this.reservas.length + 1
    };
    this.reservas.push(nueva);
    console.log('Reserva creada:', nueva);
  }

  listar(): Reserva[] {
    return this.reservas;
  }
}