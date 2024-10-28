import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  public isLoged: any = false;
  private userEmail = new BehaviorSubject<string | null>(null); // BehaviorSubject para almacenar el correo

  constructor(private afAuth: AngularFireAuth) { 
    afAuth.authState.subscribe(user => {
      this.isLoged = user;
      if (user?.email) {
        this.setUserEmail(user.email); // Establece el correo si el usuario está logueado
      }
    });
  }

  // Método para iniciar sesión
  async onLogin(user: User) {
    try {
      const response = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      this.setUserEmail(user.email); // Guarda el correo al iniciar sesión
      return response;
    } catch (error) {
      console.log('Error en login user', error);
      return error;
    }
  }

  // Método para registrar usuario
  async onRegister(user: User) {
    try {
      const response = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
      this.setUserEmail(user.email); // Guarda el correo al registrarse
      return response;
    } catch (error) {
      console.log('Error en register user', error);
    }
  }

  // Establece el correo en BehaviorSubject
  setUserEmail(email: string) {
    this.userEmail.next(email);
  }

  // Devuelve el correo como un Observable
  getUserEmail(): Observable<string | null> {
    return this.userEmail.asObservable();
  }
}
