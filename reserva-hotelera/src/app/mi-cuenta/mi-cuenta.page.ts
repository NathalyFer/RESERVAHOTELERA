import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController,  } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { trigger, transition, style, animate } from '@angular/animations';
import { InfoClienteModalPage } from '../info-cliente-modal/info-cliente-modal.page';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.page.html',
  styleUrls: ['./mi-cuenta.page.scss'],
  standalone: false,
   animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 })),
      ]),
    ])
  ]
})
export class MiCuentaPage  {

  // Variables de formulario
  nombre: string = '';
  email: string = '';
  telefono: string = '';
  direccion: string = '';
  password: string = '';

  // Flags para controlar errores y touch
  nombreTouched = false;
  emailTouched = false;
  telefonoTouched = false;
  direccionTouched = false;
  passwordTouched = false;

  // Variables para errores
  nombreError = '';
  emailError = '';
  telefonoError = '';
  direccionError = '';
  passwordError = '';
  animationState: string = '';

  constructor(
      private modalCtrl: ModalController,
      private alertController: AlertController,
      private router: Router,
      private navCtrl: NavController
    ) {}

  ngOnInit() {
  }


 irA(pagina: string) {
  const rutaActual = this.router.url;

  if (rutaActual !== `/${pagina}`) {
    console.log('Navegando a:', pagina);
    this.navCtrl.navigateRoot(`/${pagina}`);
  } else {
    console.log(`Ya estás en la página ${pagina}`);
  }
}

 // Validación para cada campo
  validarNombre() {
    this.nombreTouched = true;
    if (!this.nombre.trim()) {
      this.nombreError = 'El nombre no puede estar vacío.';
      return false;
    }
    this.nombreError = '';
    return true;
  }

  validarEmail() {
    this.emailTouched = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email.trim()) {
      this.emailError = 'El email es obligatorio.';
      return false;
    } else if (!emailRegex.test(this.email)) {
      this.emailError = 'El correo no tiene un formato válido.';
      return false;
    }
    this.emailError = '';
    return true;
  }

  validarTelefono() {
    this.telefonoTouched = true;
    if (!this.telefono.trim()) {
      this.telefonoError = 'El teléfono es obligatorio.';
      return false;
    }
    this.telefonoError = '';
    return true;
  }

  validarDireccion() {
    this.direccionTouched = true;
    if (!this.direccion.trim()) {
      this.direccionError = 'La dirección es obligatoria.';
      return false;
    }
    this.direccionError = '';
    return true;
  }



  validarPassword() {
    this.passwordTouched = true;
    const passwordRegex = /^[0-9]{4}$/;
    if (!this.password.trim()) {
      this.passwordError = 'La contraseña es obligatoria.';
      return false;
    } else if (!passwordRegex.test(this.password)) {
      this.passwordError = 'La contraseña debe tener exactamente 4 dígitos numéricos.';
      return false;
    }
    this.passwordError = '';
    return true;
  }

   // Validar todo el formulario
  validarFormulario() {
    const nombreValido = this.validarNombre();
    const emailValido = this.validarEmail();
    const telefonoValido = this.validarTelefono();
    const direccionValido = this.validarDireccion();
    const passwordValido = this.validarPassword();

    return nombreValido && emailValido && telefonoValido && direccionValido && passwordValido;
  }

   //  Ver detalle de habitación
  verHabitacion(roomName: string) {
    this.navCtrl.navigateForward(['/habitaciones1'], {
      queryParams: { nombre: roomName }
    });
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

  // Guardar solo si todo es válido
  guardar() {
    if (!this.validarFormulario()) {
      // No mostrar alert, los errores ya se muestran inline
      return;
    }

    // Si pasa validación, abrir modal etc.
    console.log('Datos guardados:', {
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      direccion: this.direccion,
      password: this.password
    });

    this.abrirModal();

    setTimeout(() => {
      this.animationState = '';
    }, 1100);
  }

async abrirModal() {
  const modal = await this.modalCtrl.create({
    component: InfoClienteModalPage,
    componentProps: {
      nombre: this.nombre,
      email: this.email,
      telefono: this.telefono,
      direccion: this.direccion,
      password: this.password
    }
  });

  await modal.present();
}
  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  
}



