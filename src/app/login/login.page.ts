import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { NavController } from '@ionic/angular';
import { AuthService } from '@auth0/auth0-angular';
import { MenuController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})

export class LoginPage {
  username: string = '';
  correo: string = 'ejemplo@email.com';
  password: string = '';
  errorPassword: boolean = false;

  constructor(
    private navCtrl: NavController,
    private alertController: AlertController,
    private dataService: DataService,
    public auth: AuthService,
    private menu: MenuController
  ) {
    this.menu.enable(true, 'mainMenu');
    
    // Escuchar cuando Auth0 complete la autenticación y redirigir al home
    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        // Redirigir al home después del login exitoso con Auth0
        this.navCtrl.navigateRoot('/home');
      }
    });
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async login() {
    if (!this.validarEmail(this.correo) || this.password.trim() === '') {
      this.mostrarAlerta('Por favor, ingresa un correo válido y contraseña.');
      return;
    }

    const user = await this.dataService.loginUser(this.correo, this.password);

    if (user !== null) {
      await Preferences.set({
        key: 'user_session',
        value: JSON.stringify(user)
      });

      localStorage.setItem('usuarioActivo', 'true');

      this.navCtrl.navigateForward(['/home'], {
        queryParams: {
          email: user.correo
        }
      });
    } else {
      this.mostrarAlerta('Correo o contraseña incorrectos');
    }
  }

  loginCalendar() {
    this.auth.loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2',
        scope: 'openid profile email https://www.googleapis.com/auth/calendar'
      }
    });
  }

  irARecuperarContrasena() {
    this.navCtrl.navigateForward('/recuperar-contrasena');
  }

  registro() {
    this.navCtrl.navigateForward(['/registro']);
  }
}
