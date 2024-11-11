import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioCService } from '../services/servicio-c.service';
import { AuthserviceService } from '../services/authservice.service';
import { PhotoService } from '../services/photo.service';
import { UserPhoto } from '../models/user-photo.model';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  user = { nombre: 'Pedro Perez', uuid: '34523452345234523452345', email: 'correo@gmail.com' };
  purchasedPhotos: UserPhoto[] = [];

  constructor(
    private router: Router,
    private serviceCService: ServicioCService,
    private authService: AuthserviceService,
    private photoService: PhotoService,
    private actionSheetController: ActionSheetController
  ) {}

  ionViewWillEnter() {
    this.loadPurchasedPhotos();

    this.authService.getUserEmail().subscribe(email => {
      if (email) {
        this.user.email = email;
      }
    });
  }

  ngOnInit() {
    this.authService.getUserEmail().subscribe(email => {
      if (email) {
        this.user.email = email;
      }
    });
    this.loadPurchasedPhotos();
  }

  async loadPurchasedPhotos() {
    await this.photoService.loadSaved();
    this.purchasedPhotos = this.photoService.inicioPhotos;
  }

  async presentActionSheet(photo: UserPhoto) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Vender',
          role: 'destructive',
          icon: 'cash-outline',
          handler: () => {
            this.sellPhoto(photo);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  // Función para mover la foto a "Targets" y eliminarla de "Inicio" permanentemente
  sellPhoto(photo: UserPhoto) {
    // Eliminar la foto de purchasedPhotos en Inicio
    this.purchasedPhotos = this.purchasedPhotos.filter(p => p !== photo);

    // Mover la foto de la sección "Inicio" a "Targets" usando el método del servicio
    this.photoService.addToTargets(photo);

    alert(`La foto ha sido puesta a la Venta.`);
  }
}

