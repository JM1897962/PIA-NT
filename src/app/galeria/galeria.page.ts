import { Component, OnInit } from '@angular/core';
import { UserPhoto } from '../models/user-photo.model';
import { PhotoService } from '../services/photo.service';
import { ActionSheetController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.page.html',
  styleUrls: ['./galeria.page.scss'],
})
export class GaleriaPage implements OnInit {

  constructor(
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController,
    public alertController: AlertController  // Inyección de AlertController para mostrar el prompt
  ) { }

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [
        {
          text: 'Eliminar',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.deletePicture(photo, position);
          }
        },
        {
          text: 'Precio',
          icon: 'pricetag',
          handler: async () => {
            // Abre un prompt para ingresar el precio
            const alert = await this.alertController.create({
              header: 'Ingresar Precio',
              inputs: [
                {
                  name: 'price',
                  type: 'number',
                  placeholder: 'Ingrese el precio'
                }
              ],
              buttons: [
                {
                  text: 'Cancelar',
                  role: 'cancel',
                  handler: () => {
                    console.log('Publicación de precio cancelada');
                  }
                },
                {
                  text: 'Publicar',
                  handler: (data) => {
                    const price = data.price;
                    if (price) {
                      // Publicar o almacenar el precio
                      console.log(`Precio publicado: ${price}`);
                      this.photoService.publishPrice(photo, price); // Método para guardar o publicar el precio
                    } else {
                      console.log('No se ingresó un precio');
                    }
                  }
                }
              ]
            });
            await alert.present();
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    await actionSheet.present();
  }
}
