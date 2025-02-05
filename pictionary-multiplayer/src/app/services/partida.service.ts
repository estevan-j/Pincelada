// src/app/services/partida.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {
  private socket: Socket;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    // Inicializar SocketIO
    this.socket = io(environment.socketUrl);
  }

  // Método para crear una partida
  crearPartida(nombreAnfitrion: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear_partida`, {
      nombre_anfitrion: nombreAnfitrion
    });
  }

  // Método para iniciar la partida
  iniciarPartida(codigoPartida: string, tiempo: string, rondas: string, numJugadores: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/iniciar_partida`, {
      codigo_partida: codigoPartida,
      tiempo_por_ronda: tiempo,
      rondas: rondas,
      numJugadores: numJugadores
    });
  }

  // Emitir un dibujo en tiempo real
  actualizarDibujo(codigo_partida: string, dibujo: string, nombre_jugador: string): void {
    this.socket.emit('actualizar_dibujo', { codigo_partida, dibujo, nombre_jugador });
  }

  // Escuchar actualizaciones de dibujo
  escucharDibujo(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('actualizar_dibujo', (data: any) => {
        observer.next(data);
      });
    });
  }


  // Método para reconectar un jugador
  reconectarJugador(codigoPartida: string, nombreJugador: string): void {
    this.socket.emit('reconectar_jugador', { codigo_partida: codigoPartida, nombre_jugador: nombreJugador });
  }

  // Método para escuchar el estado del juego
  onEstadoJuego(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('estado_juego', (data) => {
        observer.next(data);
      });

      // Manejar errores
      this.socket.on('error', (error) => {
        observer.error(error);
      });
    });
  }


  // Método para iniciar una nueva ronda
  iniciarRonda(codigoPartida: string, palabra: string): void {
    this.socket.emit('iniciar_ronda', { codigo_partida: codigoPartida, palabra });
  }

  // Método para escuchar el evento iniciar_ronda
  escucharInicioRonda(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('tu_turno', (data: any) => {
        observer.next(data);
      });
    });
  }


  getOpcionesPalabras(): Observable<any> {
    return this.http.get(`${this.apiUrl}/palabras`);
  }


  // Emitir evento cuando el temporizador llegue a cero
  notificarTemporizadorTerminado(codigoPartida: string, tiempoActual: number): void {
    this.socket.emit('temporizador_terminado', { codigo_partida: codigoPartida, tiempo_actual: tiempoActual });
  }
  // Escuchar notificación del servidor
  escucharTemporizadorTerminado(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('temporizador_terminado', (data: any) => {
        observer.next(data);
      });
    });
  }

  unirseASala(codigoPartida: string, nombreJugador: string, avatar: string): void {
    this.socket.emit('unirse_partida_socket', codigoPartida, nombreJugador, avatar);
  }


  // Salir de la sala
  salirDeSala(codigoPartida: string): void {
    this.socket.emit('salir_partida_socket', codigoPartida);
  }

  // Método para escuchar errores
  escucharErrores(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('error', (data: any) => {
        observer.next(data);
      });
    });
  }

  // Salir de la sala
  salir() {
    this.socket.disconnect();
  }
  ngOnDestroy(): void {
    // Cerrar la conexión cuando el servicio se destruya
    this.socket.disconnect();
  }

  // Método para obtener todo el chat
  obtenerTodoChat(codigoPartida: string): void {
    this.socket.emit('obtener_todo_chat', codigoPartida);
  }

  // Método para escuchar todo el chat
  escucharTodoChat(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('todo_chat', (mensajes: any) => {
        observer.next(mensajes);
      });
    });
  }

  // Enviar mensaje de chat
  enviarMensajeChat(codigoPartida: string, nombre: string, mensaje: string): void {
    this.socket.emit('adivinar', codigoPartida, nombre, mensaje); //a def adivinar
  }

  escucharChat(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('mensaje_chat', (data: { nombre_jugador: string, mensaje: string }) => {
        observer.next(data);
      });
    });
  }

  // Método para escuchar la lista actualizada de jugadores
  escucharActualizacionJugadores(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('actualizar_jugadores', (data) => {
        observer.next(data);
      });
    });
  }


  escucharFinPartida(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('fin_partida', (data: any) => {
        observer.next(data);
      });
    });
  }


}