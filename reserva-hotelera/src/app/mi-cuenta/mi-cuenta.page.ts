import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';


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
    private router: Router,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
  }

   //  Navegación por menú
  irA(pagina: string) {
    this.navCtrl.navigateForward(`/${pagina}`);
  }


  cerrarSesion() {
    console.log('Cerrando sesión...');
    this.navCtrl.navigateForward('/login');
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

//  Si todo está bien, mostrar el modal
    console.log('Datos guardados:', {
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      direccion: this.direccion,
      username: this.username,
      password: this.password
    });

    // Mostrar el modal de información del cliente
    this.abrirModal();

// Restablecer el estado para permitir futuras ejecuciones
setTimeout(() => {
  this.animationState = '';
}, 1100); // debe ser un poco más que 1s para permitir reinicio

}

//Método para abrir el modal
async abrirModal() {
  this.animationState = 'visible'; // Cambia el estado de la animación
  
  // Crear el mensaje HTML correctamente
  const mensaje = `
    <div style="text-align: left; font-family: Arial, sans-serif;">
      <p><strong>Nombre:</strong> ${this.nombre || 'No especificado'}</p>
      <p><strong>Email:</strong> ${this.email || 'No especificado'}</p>
      <p><strong>Teléfono:</strong> ${this.telefono || 'No especificado'}</p>
      <p><strong>Dirección:</strong> ${this.direccion || 'No especificado'}</p>
      <p><strong>Usuario:</strong> ${this.username || 'No especificado'}</p>
      <p><strong>Contraseña:</strong> ${this.password || 'No especificado'}</p>
    </div>
  `;
  
  const alert = await this.alertController.create({
    header: 'Información del Cliente',
    message: mensaje,
    buttons: ['Cerrar']
  });

  await alert.present();
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
