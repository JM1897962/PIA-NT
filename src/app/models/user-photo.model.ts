export interface UserPhoto {
  filepath: string;
  webviewPath: string;
  id?: number;
  price?: number; // Propiedad opcional para almacenar el precio de la foto
  seller?: string;
}