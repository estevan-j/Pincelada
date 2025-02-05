import { Component, Input, OnInit } from '@angular/core';
import { PartidaService } from '../../services/partida.service'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-word-page',
  templateUrl: './select-word-page.component.html',
  styleUrls: ['./select-word-page.component.css'],
  standalone: false
})
export class SelectWordPageComponent implements OnInit {
  @Input() nombreJugador: string | null = null;
  @Input() codigoPartida: string = '';
  opciones: any[] = [];
  constructor(private partidaService: PartidaService, private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.codigoPartida = params['codigo_partida'] || '';
    });

    this.partidaService.getOpcionesPalabras().subscribe({
      next: (response) => {
        this.opciones = response.opciones;
        console.log('Opciones de palabras:', this.opciones);

        this.partidaService.enviarMensajeChat(this.codigoPartida, "Game", `${this.nombreJugador} esta seleccionando la palabra.`);
      },
      error: (error) => {
        console.error('Error al cargar las opciones de palabras:', error);
      }
    });
  }

  //-------------------asdsad-------------------  
  seleccionarPalabra(palabra: string): void {
    if (this.codigoPartida) {
      this.partidaService.iniciarRonda(this.codigoPartida, palabra);
    }
  }
}