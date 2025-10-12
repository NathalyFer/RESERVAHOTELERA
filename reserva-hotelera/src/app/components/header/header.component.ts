import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent {

  constructor(private router: Router,
              private navCtrl: NavController
  ) {}

irA(pagina: string) {
  const rutaActual = this.router.url;

  if (rutaActual !== `/${pagina}`) {
    this.navCtrl.navigateRoot(`/${pagina}`);
  } else {
    console.log(`Ya estás en la página ${pagina}`);
  }
}
}