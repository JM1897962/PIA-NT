import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { UserPhoto } from '../models/user-photo.model';

@Component({
  selector: 'app-targets',
  templateUrl: './targets.page.html',
  styleUrls: ['./targets.page.scss'],
})
export class TargetsPage implements OnInit {
  public targetPhotos: UserPhoto[] = [];
  public selectedPhoto: UserPhoto;  // Variable para almacenar la foto seleccionada

  constructor(private photoService: PhotoService) {}

  async ngOnInit() {
    // Cargar las fotos de "Targets"
    await this.photoService.loadSaved();
    this.targetPhotos = this.photoService.targetPhotos;

    // Asegurarse de que hay fotos para mostrar y seleccionar la primera (si es necesario)
    if (this.targetPhotos.length > 0) {
      this.selectedPhoto = this.targetPhotos[0];  // Se puede cambiar esta lógica según cómo selecciones la foto
    }
  }

  // Función para mostrar las fotos
  public getWebviewPath(photo: UserPhoto): string {
    return photo?.webviewPath || ''; // Retorna una cadena vacía si no existe webviewPath
  }
}
