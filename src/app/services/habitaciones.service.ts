import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Modelo para las habitaciones
export interface Habitacion {
  numero: number;
  tipo: string;
  precio: number;
}

@Injectable({
  providedIn: 'root'
})
export class HabitacionesService {

  private apiUrl = 'http://localhost:3000/api/habitaciones'; // tu backend

  constructor(private http: HttpClient) {}

  // Obtener todas las habitaciones
  getHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.apiUrl);
  }

  // Registrar nueva habitación
  addHabitacion(habitacion: Habitacion): Observable<any> {
    return this.http.post(this.apiUrl, habitacion);
  }
}
