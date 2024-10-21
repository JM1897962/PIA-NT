import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
})
export class RegisterPage {
  firstName: string = '';  // Inicializa las propiedades
  lastName: string = '';
  birthDate: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  async register() {
    // Aquí puedes implementar tu lógica de registro
    // Asegúrate de validar que las contraseñas coincidan

    if (this.password !== this.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      // Lógica de registro aquí (puedes usar otro método de autenticación)
      console.log('Usuario registrado:', {
        firstName: this.firstName,
        lastName: this.lastName,
        birthDate: this.birthDate,
        email: this.email,
      });
      // Redirigir al login o a la página principal
      this.router.navigate(['/']); 
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  }

  goToLogin() {
    this.router.navigate(['/']); // Redirigir al inicio de sesión
  }
}
