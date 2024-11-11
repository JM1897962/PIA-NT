import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { UserPhoto } from '../models/user-photo.model';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-targets',
  templateUrl: './targets.page.html',
  styleUrls: ['./targets.page.scss'],
})
export class TargetsPage implements OnInit {
  public targetPhotos: UserPhoto[] = [];  // Array para almacenar las fotos cargadas
  

  constructor(
    private photoService: PhotoService,
    private alertController: AlertController  // Servicio de AlertController para mostrar alertas
  ) {}

  async ionViewWillEnter() {
    await this.photoService.loadSaved();
    this.targetPhotos = this.photoService.targetPhotos;
  }


  async ngOnInit() {
    // Cargar las fotos de "Targets"
    await this.photoService.loadSaved();
    this.targetPhotos = this.photoService.targetPhotos;  // Almacenar las fotos en targetPhotos
  }

  // Función para mostrar las fotos
  public getWebviewPath(photo: UserPhoto): string {
    return photo?.webviewPath || ''; // Retorna la ruta de la imagen si existe
  }

  // Función para confirmar la compra de una foto
  public async confirmPurchase(photo: UserPhoto) {
    const alert = await this.alertController.create({
      header: 'Confirmar Compra',
      message: '¿Deseas confirmar la compra de esta imagen?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Compra cancelada');
          }
        },
        {
          text: 'Confirmar',
          handler: async () => {
            // Llamamos al servicio para mover la foto a "Inicio"
            await this.photoService.addToPurchased(photo);  // Mueve la foto a Inicio

            // También eliminamos la foto de "Targets"
            this.removePhotoFromTargets(photo); // Elimina la foto de la lista de Target después de la compra
          }
        }
      ]
    });

    await alert.present();
  }

  // Función para eliminar una foto de la lista de Target después de la compra
  private removePhotoFromTargets(photo: UserPhoto) {
    const index = this.targetPhotos.indexOf(photo);
    if (index > -1) {
      this.targetPhotos.splice(index, 1); // Eliminar la foto de "targetPhotos"
    }
  }


}
