import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { UserPhoto } from '../models/user-photo.model';

@Component({
  selector: 'app-targets',
  templateUrl: './targets.page.html',
  styleUrls: ['./targets.page.scss'],
})
export class TargetsPage implements OnInit {
  public targetPhotos: UserPhoto[] = [];  // Array para almacenar las fotos cargadas
  public selectedPhotos: UserPhoto[] = []; // Array para las fotos seleccionadas para la compra

  constructor(private photoService: PhotoService) {}

  async ngOnInit() {
    // Cargar las fotos de "Targets"
    await this.photoService.loadSaved();
    this.targetPhotos = this.photoService.targetPhotos;  // Almacenar las fotos en targetPhotos
  }

  // Función para mostrar las fotos
  public getWebviewPath(photo: UserPhoto): string {
    return photo?.webviewPath || ''; // Retorna la ruta de la imagen si existe
  }

  // Función para agregar una foto a las fotos seleccionadas (para la sección de compras)
  public addToCart(photo: UserPhoto): void {
    if (!this.selectedPhotos.includes(photo)) {
      this.selectedPhotos.push(photo);  // Agregar la foto a la lista de compras
    }
  }

  // Función para eliminar una foto de la lista de fotos seleccionadas (si se desea eliminar)
  public removeFromCart(photo: UserPhoto): void {
    const index = this.selectedPhotos.indexOf(photo);
    if (index > -1) {
      this.selectedPhotos.splice(index, 1);  // Eliminar la foto de la lista de compras
    }
  }
}
