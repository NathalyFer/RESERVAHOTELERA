import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() { }

  //métodos 

   async loginUser(
    correo: string,
    password: string
  ): Promise<{ correo: string } | null> {
    // Simula llamada a backend con retardo
    return new Promise((resolve) => {
      setTimeout(() => {
        if (correo === 'ejemplo@email.com' && password === '1234') {
          resolve({ correo });
        } else {
          resolve(null);
        }
      }, 1000);
    });
  }
}