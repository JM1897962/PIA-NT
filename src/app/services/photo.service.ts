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

  public photos: UserPhoto[] = [];
  public targetPhotos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private TARGET_STORAGE: string = 'targetPhotos';

  constructor(private platform: Platform) { }

  // Cargar las fotos guardadas
  public async loadSaved() {
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photoList.value) || [];

    const targetList = await Storage.get({ key: this.TARGET_STORAGE });
    this.targetPhotos = JSON.parse(targetList.value) || [];

    if (!this.platform.is('hybrid')) {
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
}
