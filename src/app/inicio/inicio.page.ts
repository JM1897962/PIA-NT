import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioCService } from '../services/servicio-c.service';
import { AuthserviceService } from '../services/authservice.service';
import { PhotoService } from '../services/photo.service';  // Importar el servicio de fotos
import { UserPhoto } from '../models/user-photo.model';  // Importar el modelo de foto

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  user = { nombre: 'Pedro Perez', uuid: '34523452345234523452345', email: 'correo@gmail.com' };
  purchasedPhotos: UserPhoto[] = [];  // Array para almacenar las fotos compradas

  constructor(
    private router: Router,
    private serviceCService: ServicioCService,
    private authService: AuthserviceService, // Servicio de autenticación
    private photoService: PhotoService  // Inyectar el servicio de fotos
  ) {}

  ngOnInit() {
    // Suscríbete al Observable para obtener el correo del usuario
    this.authService.getUserEmail().subscribe(email => {
      if (email) {
        this.user.email = email; // Actualiza el correo en la propiedad `user.email`
      }
    });

    // Cargar las fotos compradas al iniciar la página
    this.loadPurchasedPhotos();
  }

  // Función para cargar las fotos compradas
  async loadPurchasedPhotos() {
    await this.photoService.loadSaved();  // Cargar las fotos guardadas
    this.purchasedPhotos = this.photoService.inicioPhotos;  // Obtener las fotos de la sección "Inicio", donde están las compradas
  }

  // Función para navegar a la página de receiver
  gotReceiver() {
    this.serviceCService.sendObjectSource(this.user);
    this.router.navigate(['/reciever']);
  }

  // Función para manejar la acción de "Comprar" (si es necesario implementar)
  async onBuy(photo: UserPhoto) {
    // Confirmar compra
    const confirm = window.confirm("¿Estás seguro de que deseas comprar esta foto?");
    if (confirm) {
      await this.photoService.addToPurchased(photo);  // Mover la foto a "Inicio"
      alert("Foto comprada con éxito!");
      this.loadPurchasedPhotos();  // Recargar las fotos compradas
    }
  }
}
