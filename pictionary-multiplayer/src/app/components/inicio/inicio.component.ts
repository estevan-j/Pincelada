import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '../../services/modal.service';
import { PartidaService } from '../../services/partida.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  standalone: false,
})
export class InicioComponent {
  username: string = '';
  showJoin: boolean = false;
  avatars: string[] = ['👤', '👩', '👨', '🧑', '👧', '👦', '🧓', '👴', '👵', '🧔', '👳', '👲', '🧕', '👮', '👷', '💂', '🕵️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🎓', '👨‍🎓', '👩‍🎤', '👨‍🎤', '👩‍🏫', '👨‍🏫', '👩‍🏭', '👨‍🏭', '👩‍💻', '👨‍💻', '👩‍💼', '👨‍💼', '👩‍🔧', '👨‍🔧', '👩‍🔬', '👨‍🔬', '👩‍🎨', '👨‍🎨', '👩‍🚒', '👨‍🚒', '👩‍✈️', '👨‍✈️', '👩‍🚀', '👨‍🚀', '👩‍⚖️', '👨‍⚖️'];
  selectedAvatar: string = this.avatars[0];
  codigoPartida: string | null = null;

  constructor(private router: Router, private modalService: ModalService, private partidaService: PartidaService) {
  }

  // Método para suscribirse a los cambios en el código de la partida
  // Método para navegar a la página de la partida
  OnNavigateToPartida() {
    if (this.codigoPartida) {
      this.router.navigate(['/partida'], {
        queryParams: { codigo_partida: this.codigoPartida, jugador: this.username },
      });
    }
  }


  continueGame() {
    this.partidaService.crearPartida(this.username).subscribe({
      next: (response) => {
        this.codigoPartida = response?.partida?.codigo_partida;
        if (this.codigoPartida) {
          this.partidaService.unirseASala(this.codigoPartida, this.username, this.selectedAvatar);
          this.OnNavigateToPartida();
        }
      },
      error: (err) => {
        alert('Hubo un error al crear la partida. Intenta de nuevo.');
      },
    });
  }

  showJoinComponent() {
    this.showJoin = true;
  }

  onPartidaUnida(codigo: string | null) {
    this.codigoPartida = codigo;
    if (codigo) {
      this.OnNavigateToPartida();
    }
  }
  changeAvatar(direction: string) {
    const currentIndex = this.avatars.indexOf(this.selectedAvatar);
    if (direction === 'prev') {
      this.selectedAvatar = this.avatars[(currentIndex - 1 + this.avatars.length) % this.avatars.length];
    } else if (direction === 'next') {
      this.selectedAvatar = this.avatars[(currentIndex + 1) % this.avatars.length];
    }
  }

  randomizeAvatar() {
    const randomIndex = Math.floor(Math.random() * this.avatars.length);
    this.selectedAvatar = this.avatars[randomIndex];
  }

  handleCloseJoin() {
    this.showJoin = false;
  }
}
