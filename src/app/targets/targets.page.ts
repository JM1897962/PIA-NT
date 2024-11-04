import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular'; // Importar AlertController

@Component({
  selector: 'app-targets',
  templateUrl: 'targets.page.html',
  styleUrls: ['targets.page.scss'],
})
export class TargetsPage {
  tarjetas: any[] = []; // Array para almacenar las tarjetas

  // Variables para almacenar temporalmente los datos del formulario
  numeroTarjeta: string = '';
  nombreTitular: string = '';
  fechaVencimiento: string = '';
  cvv: string = '';

  constructor(private alertController: AlertController) {} // Inyectar AlertController

  // Función para formatear el número de la tarjeta
  formatearNumeroTarjeta(event: any) {
    let input = event.target.value;
    // Eliminar todos los caracteres que no sean dígitos
    input = input.replace(/\D/g, '');

    // Limitar la entrada a 16 dígitos
    if (input.length > 16) {
      input = input.slice(0, 16);
    }

    // Insertar un espacio cada 4 dígitos
    this.numeroTarjeta = input.replace(/(.{4})/g, '$1 ').trim();
  }

  // Función para formatear la fecha de vencimiento
  formatearFechaVencimiento(event: any) {
    let input = event.target.value;
    // Eliminar todos los caracteres que no sean dígitos
    input = input.replace(/\D/g, '');

    // Limitar la entrada a 4 dígitos
    if (input.length > 4) {
      input = input.slice(0, 4);
    }

    // Insertar un slash (/) después de los primeros 2 dígitos
    if (input.length > 2) {
      this.fechaVencimiento = input.slice(0, 2) + '/' + input.slice(2);
    } else {
      this.fechaVencimiento = input; // Mostrar los 2 primeros dígitos tal cual
    }
  }

  async guardarTarjeta() {
    // Validar si todos los campos están llenos y tienen la longitud correcta
    const formateadoNumero = this.numeroTarjeta.replace(/\D/g, ''); // Quitar espacios para validar longitud
    const fechaCompleta = this.fechaVencimiento.replace(/\D/g, ''); // Quitar el slash para validar longitud

    if (formateadoNumero.length !== 16 || 
        !this.nombreTitular || 
        fechaCompleta.length !== 4 || 
        this.cvv.length !== 3) {
      this.mostrarAlerta('Por favor, completa todos los campos correctamente.');
      return; // Salir de la función si falta información o longitud incorrecta
    }

    // Formatear la fecha de vencimiento en MM/AA
    const fechaFormateada = this.formatearFecha(this.fechaVencimiento);

    const nuevaTarjeta = {
      numero: formateadoNumero,
      nombreTitular: this.nombreTitular,
      fechaVencimiento: fechaFormateada,
      cvv: '***', // Mostrar el CVV como ***
    };

    this.tarjetas.push(nuevaTarjeta); // Agregar la nueva tarjeta al array

    // Limpiar los campos después de guardar
    this.numeroTarjeta = '';
    this.nombreTitular = '';
    this.fechaVencimiento = '';
    this.cvv = '';
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Advertencia',
      message: mensaje,
      buttons: ['OK'],
    });

    await alert.present();
  }

  // Función para formatear el número de tarjeta con espacios
  formatearNumeroConEspacios(numero: string): string {
    return numero.replace(/(.{4})/g, '$1 ').trim(); // Insertar espacio cada 4 dígitos
  }

  formatearFecha(fecha: string): string {
    const partes = fecha.split('/');
    if (partes.length === 2 && partes[0].length <= 2 && partes[1].length <= 2) {
      return `${partes[0].padStart(2, '0')}/${partes[1].padStart(2, '0')}`;
    }
    return fecha; // Si no está en el formato correcto, devolverla sin cambios
  }
}
