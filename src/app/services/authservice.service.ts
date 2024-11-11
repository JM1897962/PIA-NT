import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  public isLoged: any = false;
  private userEmail = new BehaviorSubject<string | null>(null);

  constructor(private auth: Auth) {
    // Nueva forma de suscribirse al estado de autenticación
    authState(this.auth).subscribe(user => {
      this.isLoged = user;
      if (user?.email) {
        this.setUserEmail(user.email);
      }
    });
  }

  // Método para iniciar sesión actualizado
  async onLogin(user: User) {
    try {
      const response = await signInWithEmailAndPassword(
        this.auth,
        user.email,
        user.password
      );
      this.setUserEmail(user.email);
      return response;
    } catch (error) {
      console.log('Error en login user', error);
      return error;
    }
  }

  // Método para registrar usuario actualizado
  async onRegister(user: User) {
    try {
      const response = await createUserWithEmailAndPassword(
        this.auth,
        user.email,
        user.password
      );
      this.setUserEmail(user.email);
      return response;
    } catch (error) {
      console.log('Error en register user', error);
      return error;
    }
  }

  // Estos métodos se mantienen igual
  setUserEmail(email: string) {
    this.userEmail.next(email);
  }

  getUserEmail(): Observable<string | null> {
    return this.userEmail.asObservable();
  }
}