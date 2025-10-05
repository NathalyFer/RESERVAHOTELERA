import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage {

  
   rooms = [
    { 
      name: 'Junior Suite', 
      img: 'assets/img/junior_suite.png',
      desc: 'Esta suite premium reúne espacio, lujo y elegancia para crear un verdadero oasis. Con una cama doble de gran tamaño.'
    },
    { 
      name: 'Superior King', 
      img: 'assets/img/Superior_king.jpg',
      desc: 'El esplandor y la gracia de estilo inglés definen nuestras habitaciones Superior King, que cuentan con una cama doble extragrande, cálidos detalles en madera y un lujoso baño de mármol.'
    },
    { 
      name: 'Superior Twin', 
      img: 'assets/img/superior_twin.png',
      desc: 'Habitación con dos camas dobles, ideal para compartir y disfrutar del confort.'
    },
  ];

  services = [
    { name: 'pan_uva', img: 'assets/img/pan_uva.png', desc: 'Seleccionamos lo mejor para ti, por que cada detalle importa.' },
    { name: 'vino_melon', img: 'assets/img/vino_melon.png', desc: 'Lo mejor de nuestra tierra, servido para tí.' },
  ];

  reviews = [
    { name: 'Carlos y Fernanda M. Lima, Perú', avatar: 'assets/img/avatar_hombre.jpg', text: 'La atención fue impecable y los amaneceres desde la habitación... simplemente inolvidables. Volveremos sin duda.' },
    { name: 'Maria L., Santiago, Chile', avatar: 'assets/img/avatar_mujer.jpg', text: 'Desde que llegamos nos hicieron sentir en casa. El desayuno delicioso, la vista espectacular y la tranquilidad, única. Ideal para desconectarse.' },
    { name: 'Andrea R., Buenos Aires, Argentina', avatar: 'assets/img/avatar_mujer2.jpg', text: 'Todo fue perfecto: la habitación, la comida, el personal amable Se nota el cariño en cada detalle. ¡Gracias por una estadía inolvidable!.' },
  ];


  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    // Ya no verificamos sesión al cargar el home
    // El home es de acceso público
  }

  //  Navegación por menú
  irA(pagina: string) {
    this.navCtrl.navigateForward(`/${pagina}`);
  }

  //  Ver detalle de habitación
  verHabitacion(roomName: string) {
    this.navCtrl.navigateForward(['/habitacion-detalle'], {
      queryParams: { nombre: roomName }
    });
  }

  irAMiCuenta() {
    this.navCtrl.navigateForward('/login');
  }
}


