import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
// Update the path below to the correct relative path if needed
import { InfoClienteModalPage } from '../info-cliente-modal/info-cliente-modal.page';


@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.page.html',
  styleUrls: ['./mi-cuenta.page.scss'],
  standalone: false,
})
export class MiCuentaPage  {

  // Declaración de variables para los campos del formulario
  nombre: any = '';
  email: any = '';
  telefono: any = '';
  direccion: any = ''
  username: any = '';
  password: any = '';

  animationState: string = '';
  nombreTouched = false;

  constructor(
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
  }

   // Navegación a otras rutas
  irA(ruta: string) {
    this.router.navigate([`/${ruta}`]);
  }

  cerrarSesion() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }

  modificar() {
    console.log('Modificando datos del usuario...');
  }

  // Método para mostrar alertas
  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: mensaje,
      buttons: ['OK']
    });
     await alert.present();
  }

guardar() {


// Validar campos vacíos
if (
  !this.nombre ||
  !this.email ||
  !this.telefono ||
  !this.direccion ||
  !this.username ||
  !this.password
) {
  this.mostrarAlerta('Por favor, complete todos los campos.');
  return;
}

// Validar longitud del nombre
if (this.nombre.trim().length === 0) {
  this.mostrarAlerta('El nombre no puede estar vacío.');
  return;
}

// Validar formato del correo
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(this.email)) {
  this.mostrarAlerta('El correo no tiene un formato válido.');
  return;
}

// Validar nombre de usuario (3-8 caracteres)
if (this.username.length < 3 || this.username.length > 8) {
  this.mostrarAlerta('El usuario debe tener entre 3 y 8 caracteres.');
  return;
}

// Validar contraseña: exactamente 4 dígitos numéricos
const passwordRegex = /^[0-9]{4}$/;
if (!passwordRegex.test(this.password)) {
  this.mostrarAlerta('La contraseña debe tener exactamente 4 dígitos numéricos.');
  return;
}

//  Si todo está bien, guardarDatos()
//this.guardarDatos();

// Guardado exitoso
    console.log('Datos guardados:', {
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      direccion: this.direccion,
      username: this.username,
      password: this.password
    });

// Restablecer el estado para permitir futuras ejecuciones
setTimeout(() => {
  this.animationState = '';
}, 1100); // debe ser un poco más que 1s para permitir reinicio

}

//Método para abril el modal
async abrirModal() {
  this.animationState = 'visible'; // Cambia el estado de la animación
  // Aquí puedes agregar la lógica para abrir el modal
  const modal = await this.modalCtrl.create({
    component: InfoClienteModalPage,
    componentProps: {
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      direccion: this.direccion,
      username: this.username,
      password: this.password,
    },
    cssClass: 'modal-card'
  });

  await modal.present();
}

  // Método para cerrar el modal
  async cerrarModal() {
    this.animationState = 'animateSlide'; // Cambia el estado de la animación
    const modal = await this.modalCtrl.getTop();
    if (modal) {
      await modal.dismiss();
    }
  this.animationState = ''; // Restablece el estado de la animación
  


  }}
