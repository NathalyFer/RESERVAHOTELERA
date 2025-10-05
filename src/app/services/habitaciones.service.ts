import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Habitacion {
  id?: number;
  id_habitacion?: number; 
  nombre: string;
  numero: number;
  tipo: string;
  descripcion?: string;
  precio: number;
  estado: string;
  foto?: string | null;
}

@Injectable({ providedIn: 'root' })
export class HabitacionesService {
  private base = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  getHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(`${this.base}/habitaciones`);
  }

  createHabitacion(payload: { nombre: string; numero: number; tipo: string; descripcion?: string; precio: number; estado?: string }, foto?: File): Observable<any> {
    const fd = new FormData();
    fd.append('nombre', payload.nombre);
    fd.append('numero', payload.numero.toString());
    fd.append('tipo', payload.tipo);
    fd.append('descripcion', payload.descripcion ?? '');
    fd.append('precio', payload.precio.toString());
    fd.append('estado', payload.estado ?? 'Disponible');
    if (foto) fd.append('foto', foto, foto.name);
    return this.http.post(`${this.base}/habitaciones`, fd);
  }

  updateHabitacion(id: number, payload: { nombre: string; numero: number; tipo: string; descripcion?: string; precio: number; estado?: string }, foto?: File): Observable<any> {
    const fd = new FormData();
    fd.append('nombre', payload.nombre);
    fd.append('numero', payload.numero.toString());
    fd.append('tipo', payload.tipo);
    fd.append('descripcion', payload.descripcion ?? '');
    fd.append('precio', payload.precio.toString());
    fd.append('estado', payload.estado ?? 'Disponible');
    if (foto) fd.append('foto', foto, foto.name);
    return this.http.put(`${this.base}/habitaciones/${id}`, fd);
  }
}
