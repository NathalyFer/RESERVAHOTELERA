import { Component, OnInit } from '@angular/core';
import { HabitacionesService, Habitacion } from '../services/habitaciones.service';

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.page.html',
  styleUrls: ['./habitaciones.page.scss'],
  standalone: false
})
export class HabitacionesPage implements OnInit {

  habitaciones: Habitacion[] = [];
  nuevaHabitacion: Habitacion = { numero: 0, tipo: '', precio: 0 };

  constructor(private habitacionesService: HabitacionesService) {}

  ngOnInit() {
    this.cargarHabitaciones();
  }

  cargarHabitaciones() {
    this.habitacionesService.getHabitaciones().subscribe(data => {
      this.habitaciones = data;
    });
  }

  agregarHabitacion() {
    console.log('Intentando agregar habitación:', this.nuevaHabitacion);
    this.habitacionesService.addHabitacion(this.nuevaHabitacion).subscribe({
      next: (response) => {
        console.log('Habitación agregada exitosamente:', response);
        this.cargarHabitaciones(); // recargar lista
        this.nuevaHabitacion = { numero: 0, tipo: '', precio: 0 }; // limpiar form
      },
      error: (error) => {
        console.error('Error al agregar habitación:', error);
        alert('Error al agregar habitación: ' + (error.error?.details || error.message));
      }
    });
  }
}

