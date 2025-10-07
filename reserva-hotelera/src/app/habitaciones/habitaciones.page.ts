import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { HabitacionesService, Habitacion } from '../services/habitaciones.service';
import { DataService } from '../services/data.service';
import { NavController } from '@ionic/angular';

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
  descripcion = '';
  precio = 0;
  estado = 'Disponible';
  fotoFile: File | null = null;
  modoEdicion = false;
  isAdmin = false;

  constructor(
    private habService: HabitacionesService,
    private dataService: DataService,
    private navCtrl: NavController
  ) {}

  ngOnInit() { 
    this.cargar();
    this.isAdmin = this.dataService.isAdmin();
  }

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
    
    if (this.modoEdicion && this.id_habitacion) {
      // Actualizar
      this.habService.updateHabitacion(this.id_habitacion, { 
        nombre: this.nombre, 
        precio: this.precio, 
        numero: this.numero, 
        tipo: this.tipo,
        descripcion: this.descripcion,
        estado: this.estado 
      }, this.fotoFile ?? undefined)
        .subscribe({
          next: () => { 
            this.limpiarFormulario();
            this.cargar(); 
          },
          error: (e) => { console.error('Error actualizar:', e); alert('Error al actualizar'); }
        });
    } else {
      // Crear
      this.habService.createHabitacion({ 
        nombre: this.nombre, 
        precio: this.precio, 
        numero: this.numero, 
        tipo: this.tipo,
        descripcion: this.descripcion,
        estado: this.estado 
      }, this.fotoFile ?? undefined)
        .subscribe({
          next: () => { 
            this.limpiarFormulario();
            this.cargar(); 
          },
          error: (e) => { console.error('Error crear:', e); alert('Error al guardar'); }
        });
    }
  }

  editar(hab: Habitacion) {
    this.modoEdicion = true;
    this.id_habitacion = hab.id;
    this.nombre = hab.nombre;
    this.numero = hab.numero;
    this.tipo = hab.tipo;
    this.descripcion = hab.descripcion || '';
    this.precio = hab.precio;
    this.estado = hab.estado;
    this.fotoFile = null;
  }

  cancelar() {
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.modoEdicion = false;
    this.id_habitacion = undefined;
    this.nombre = '';
    this.numero = 0;
    this.tipo = '';
    this.descripcion = '';
    this.precio = 0;
    this.estado = 'Disponible';
    this.fotoFile = null;
  }

  // Navegación por menú
  irA(pagina: string) {
    console.log('Navegando a:', pagina);
    this.navCtrl.navigateForward(`/${pagina}`);
  }
}
