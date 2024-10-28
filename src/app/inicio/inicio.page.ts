import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServicioCService } from '../services/servicio-c.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})

export class InicioPage implements OnInit {

  user = {nombre:'Pedro Perez', uuid:"34523452345234523452345", email:"correo@gmail.com"};

  list: any[]=
  [
    {nombre:'Pedro Perez', uuid:"34523452345234523452345", email:"correo@gmail.com"},
    {nombre:'Pedro Perez', uuid:"34523452345234523452345", email:"correo@gmail.com"},
    {nombre:'Pedro Perez', uuid:"34523452345234523452345", email:"correo@gmail.com"}
  ];

  constructor(private router: Router,
    private serviceCService: ServicioCService) { }

  ngOnInit() {
  }

  gotReceiver(){
    this.serviceCService.sendObjectSource(this.user);
    this.serviceCService.sendListSource(this.list);
    
    this.router.navigate(['/reciever']);
  }


  siguiendo = false;

  editandoMensaje = false;
  editandoCorreo = false;

  usuario = {
    "fotoPerfil" : "../assets/imagenes/Shadow Man.jpg",
    "publicaciones" : 4521792,
    "seguidores" : 942,
    "seguidos" : 1
  }

  seguir(): void {
    this.siguiendo = !this.siguiendo;
  }

  enviarMensaje(): void {
    
  }

  enviarEmail(): void {

  }

  desplegarOpciones(): void {
    //En proceso
  }


}
