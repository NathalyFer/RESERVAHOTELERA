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
  ): Promise<{ correo: string; isAdmin: boolean } | null> {
    // Simula llamada a backend con retardo
    return new Promise((resolve) => {
      setTimeout(() => {
        // Admin: admin@hotel.com / admin123
        if (correo === 'admin@hotel.com' && password === 'admin123') {
          resolve({ correo, isAdmin: true });
        } else if (correo === 'ejemplo@email.com' && password === '1234') {
          resolve({ correo, isAdmin: false });
        } else {
          resolve(null);
        }
      }, 1000);
    });
  }

  isAdmin(): boolean {
    const userSession = localStorage.getItem('user_session');
    if (userSession) {
      try {
        const user = JSON.parse(userSession);
        return user.isAdmin === true;
      } catch {
        return false;
      }
    }
    return false;
  }
}