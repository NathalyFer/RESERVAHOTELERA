import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HabitacionesService, Habitacion } from '../services/habitaciones.service';

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.page.html',
  styleUrls: ['./habitaciones.page.scss'],
  standalone: false
})
export class HabitacionesPage implements OnInit {
  habitaciones: Habitacion[] = [];
  id_habitacion?: number; 
  nombre = '';
  numero = 0;
  tipo = '';
  precio = 0;
  estado = '';
  fotoFile: File | null = null;

  constructor(private habService: HabitacionesService) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.habService.getHabitaciones().subscribe({
      next: (data) => {
        this.habitaciones = data;
        console.log('Habitaciones cargadas', data);
      },
      error: (err) => console.error('Error al cargar', err)
    });
  }

  loadHabitaciones() {
    this.cargar();
  }
  onFileSelected(e: any) {
    this.fotoFile = e.target.files?.[0] ?? null;
  }

  guardar() {
    if (!this.nombre || !this.precio) { alert('Completa nombre y precio'); return; }
    this.habService.createHabitacion({ nombre: this.nombre, precio: this.precio, numero: this.numero, tipo: this.tipo }, this.fotoFile ?? undefined)
      .subscribe({
        next: () => { this.nombre=''; this.numero=0; this.tipo=''; this.precio=0; this.fotoFile=null; this.cargar(); },
        error: (e) => { console.error('Error crear:', e); alert('Error al guardar'); }
      });
  }
}
