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
          text: 'Vender',
          icon: 'pricetag',
          handler: async () => {
            // Abre un prompt para ingresar el precio y el nombre
            const alert = await this.alertController.create({
              header: 'Ingresar Precio y Nombre del Vendedor',
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
                      // Publicar o almacenar el precio y el nombre
                      console.log(`Precio publicado: ${price}, Vendedor: ${seller}`);
                      this.photoService.publishPrice(photo, price, seller); // Método para guardar o publicar el precio y el vendedor
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
