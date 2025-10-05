import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: false,
})
export class ContactoPage implements OnInit {

   contactoForm!: FormGroup;

constructor(
  private fb: FormBuilder,
  private router: Router) { 
}

get nombre() {
  return this.contactoForm.get('nombre')!;
}

get apellido() {
  return this.contactoForm.get('apellido')!;
}

get correo() {
  return this.contactoForm.get('correo')!;
}

get mensaje() {
  return this.contactoForm.get('mensaje')!;
}

  ngOnInit() {
        this.contactoForm = this.fb.group({
          nombre: ['', [Validators.required, Validators.minLength(2)]],
          apellido: ['', [Validators.required, Validators.minLength(2)]],
          correo: ['', [Validators.required, Validators.email]],
          mensaje: ['', [Validators.required, Validators.minLength(10)]],
    });
  
  }

  enviarFormulario() {
     if (this.contactoForm.valid) {
      console.log('Formulario válido:', this.contactoForm.value);
      alert('Formulario enviado correctamente');
      this.contactoForm.reset();
    } else {
      this.contactoForm.markAllAsTouched(); // para mostrar errores
    }
  }

  irA(ruta: string) {                     
    this.router.navigate([`/${ruta}`]);
  }
}
