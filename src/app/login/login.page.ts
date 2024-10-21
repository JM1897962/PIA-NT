import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  email: string = '';
  password: string = '';

  constructor(private navCtrl: NavController) {}

  login() {
    // Aquí puedes agregar la lógica de validación de sesión
    this.navCtrl.navigateForward('/menu');
  }

  goToRegister() {
    this.navCtrl.navigateForward('/register');
  }
}
