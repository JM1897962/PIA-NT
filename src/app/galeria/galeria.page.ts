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
    public alertController: AlertController
  ) { }

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Fotos',
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
          text: 'Vender',
          icon: 'pricetag',
          handler: async () => {
            const alert = await this.alertController.create({
              header: 'Ingresar Datos de Venta',
              inputs: [
                {
                  name: 'price',
                  type: 'number',
                  placeholder: 'Ingrese el precio'
                },
                {
                  name: 'seller',
                  type: 'text',
                  placeholder: 'Ingrese su nombre'
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
                    const seller = data.seller;
                    if (price && seller) {
                      // Publicar la foto y moverla a targets
                      this.photoService.publishPrice(photo, price, seller);
                    } else {
                      console.log('No se ingresó un precio o nombre');
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
