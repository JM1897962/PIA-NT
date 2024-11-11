import { Injectable } from '@angular/core';
import { UserPhoto } from '../models/user-photo.model';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {


  public photos: UserPhoto[] = [];        // Galería de fotos
  public targetPhotos: UserPhoto[] = [];  // Fotos en la sección de Targets
  public inicioPhotos: UserPhoto[] = [];  // Fotos compradas (Inicio)
  private PHOTO_STORAGE: string = 'photos';
  private TARGET_STORAGE: string = 'targetPhotos';
  private INICIO_STORAGE: string = 'inicioPhotos';  // Nueva clave para almacenamiento de fotos compradas

  constructor(private platform: Platform) { }

  // Cargar las fotos guardadas
  public async loadSaved() {
    // Cargar fotos de la galería
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];

    // Cargar fotos de Targets
    const targetList = await Storage.get({ key: this.TARGET_STORAGE });
    this.targetPhotos = JSON.parse(targetList.value) || [];

    // Cargar fotos de la sección "Inicio"
    const inicioList = await Storage.get({ key: this.INICIO_STORAGE });
    this.inicioPhotos = JSON.parse(inicioList.value) || [];

    if (!this.platform.is('hybrid')) {
      // Cargar archivos locales en webviewPath para visualización
      for (let photo of this.photos) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }

      for (let photo of this.targetPhotos) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }

      for (let photo of this.inicioPhotos) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  // Agregar nueva foto a la galería
  public async addNewToGallery() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }

  // Guardar la imagen capturada
  private async savePicture(cameraPhoto: Photo) {
    const base64Data = await this.readAsBase64(cameraPhoto);
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (this.platform.is('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath,
      };
    }
  }

  // Leer el archivo en base64
  private async readAsBase64(cameraPhoto: Photo) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: cameraPhoto.path,
      });
      return file.data;
    } else {
      const response = await fetch(cameraPhoto.webPath!);
      const blob = await response.blob();
      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  // Eliminar foto
  public async deletePicture(photo: UserPhoto, position: number) {
    this.photos.splice(position, 1);

    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });

    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  }

  // Convertir Blob a Base64
  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  // Método para publicar el precio y el nombre del vendedor
  public async publishPrice(photo: UserPhoto, price: number, seller: string) {
    // Almacenar el precio y el vendedor en el objeto de la foto
    photo.price = price;
    photo.seller = seller;

    // Asegurarse de que webviewPath esté asignado al mover la foto
    if (!photo.webviewPath) {
      if (this.platform.is('hybrid')) {
        photo.webviewPath = Capacitor.convertFileSrc(photo.filepath);
      } else {
        photo.webviewPath = photo.filepath;
      }
    }

    // Mover la foto a la sección de Targets
    this.targetPhotos.push(photo);

    // Eliminar la foto de la galería
    const index = this.photos.indexOf(photo);
    if (index !== -1) {
      this.photos.splice(index, 1);
    }

    // Guardar las fotos actualizadas en la galería
    await Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });

    // Guardar las fotos de Targets
    await Storage.set({
      key: this.TARGET_STORAGE,
      value: JSON.stringify(this.targetPhotos),
    });

    console.log(`Foto publicada con precio: ${price} y vendedor: ${seller}`);
  }

  // Método para mover la foto comprada a la sección "Inicio"
  public async addToPurchased(photo: UserPhoto) {
    // Mover la foto a la sección "Inicio"
    this.inicioPhotos.unshift(photo);  // Agregar al principio de inicioPhotos

    // Eliminar la foto de "Targets"
    const index = this.targetPhotos.indexOf(photo);
    if (index !== -1) {
      this.targetPhotos.splice(index, 1);  // Eliminar de targetPhotos
    }

    // Guardar los cambios en almacenamiento solo en la sección "Inicio"
    await Storage.set({
      key: this.INICIO_STORAGE,  // Usamos el almacenamiento para "Inicio"
      value: JSON.stringify(this.inicioPhotos),  // Guardamos solo en "Inicio"
    });

    // Guardar las fotos de Targets, aunque ya no contengan la foto
    await Storage.set({
      key: this.TARGET_STORAGE,
      value: JSON.stringify(this.targetPhotos),
    });

    console.log(`Foto movida a Inicio: ${photo.filepath}`);
  }

  public async addToTargets(photo: UserPhoto) {
    // Mueve la foto a la sección de "Targets"
    this.targetPhotos.push(photo);
  
    // Elimina la foto de "Inicio"
    this.inicioPhotos = this.inicioPhotos.filter(p => p !== photo);
  
    // Guarda las fotos actualizadas en el almacenamiento
    await Storage.set({
      key: this.TARGET_STORAGE,
      value: JSON.stringify(this.targetPhotos),
    });
  
    await Storage.set({
      key: this.INICIO_STORAGE,
      value: JSON.stringify(this.inicioPhotos),
    });
  
    console.log(`La foto ${photo.filepath} ha sido movida a Compras.`);
  }
}
