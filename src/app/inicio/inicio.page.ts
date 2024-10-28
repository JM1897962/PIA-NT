import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioCService } from '../services/servicio-c.service';
import { AuthserviceService } from '../services/authservice.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  user = { nombre: 'Pedro Perez', uuid: '34523452345234523452345', email: 'correo@gmail.com' };

  list: any[] = [
    { nombre: 'Pedro Perez', uuid: '34523452345234523452345', email: 'correo@gmail.com' },
    { nombre: 'Pedro Perez', uuid: '34523452345234523452345', email: 'correo@gmail.com' },
    { nombre: 'Pedro Perez', uuid: '34523452345234523452345', email: 'correo@gmail.com' }
  ];

  constructor(
    private router: Router,
    private serviceCService: ServicioCService,
    private authService: AuthserviceService // Servicio de autenticación
  ) {}

  ngOnInit() {
    // Suscríbete al Observable para obtener el correo del usuario
    this.authService.getUserEmail().subscribe(email => {
      if (email) {
        this.user.email = email; // Actualiza el correo en la propiedad `user.email`
        this.list.forEach(item => item.email = email); // Si deseas que también actualice el email en la lista
      }
    });
  }

  gotReceiver() {
    this.serviceCService.sendObjectSource(this.user);
    this.serviceCService.sendListSource(this.list);
    this.router.navigate(['/reciever']);
  }

  siguiendo = false;
  editandoMensaje = false;
  editandoCorreo = false;

  usuario = {
    fotoPerfil: '../assets/imagenes/Shadow Man.jpg',
  };
}
