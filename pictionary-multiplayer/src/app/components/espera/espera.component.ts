import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ModalService } from '../../services/modal.service';
import { PartidaService } from '../../services/partida.service';


@Component({
  selector: 'app-espera',
  templateUrl: './espera.component.html',
  styleUrls: ['./espera.component.css'],
  standalone: false
})
export class EsperaComponent implements OnInit {
  @Input() esEditable: boolean = false; // Nueva propiedad para controlar los permisos de edición
  @Output() cambiarEstado = new EventEmitter<string>();
  @Input() nombreJugador: string = '';
  @Input() codigoPartida: string = '';
  public formOpciones!: FormGroup;
  modalMessage: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private partidaService: PartidaService
  ) {
    this.formBuild();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['esEditable']) {
      this.updateFormControls();
    }
  }

  ngOnInit(): void {
    this.updateFormControls();
  }

  private formBuild() {
    this.formOpciones = this._formBuilder.group({
      numeroPlayers: [{ value: 8, disabled: this.esEditable }],
      tiempoDibujo: [{ value: 60, disabled: this.esEditable }],
      rondas: [{ value: 3, disabled: this.esEditable }]
    });
  }

  private updateFormControls() {
    if (this.formOpciones) {
      Object.keys(this.formOpciones.controls).forEach(controlName => {
        const control = this.formOpciones.get(controlName);
        if (this.esEditable) {
          control?.enable();
        } else {
          control?.disable();
        }
      });
    }
  }

  iniciar() {
    if (this.esEditable) {
      this.partidaService.iniciarPartida(this.codigoPartida, this.formOpciones.get("tiempoDibujo")?.value.toString(), this.formOpciones.get("rondas")?.value.toString(), this.formOpciones.get('numeroPlayers')?.value.toString())
        .subscribe({
          next: (response) => {
            this.cambiarEstado.emit('seleccionandoPalabra');
          },
          error: (err) => {
            let errorMessage = 'Error al iniciar la partida';
            if (err.error && err.error.error) {
              errorMessage += ': ' + err.error.error;
            } else if (err.message) {
              errorMessage += ': ' + err.message;
            } else {
              errorMessage += ': Error desconocido';
            }
            alert(errorMessage);
          }
        });
    }
  }
  copyToClipboard() {
    if (this.codigoPartida) {
      navigator.clipboard.writeText(this.codigoPartida).then(() => {
        this.modalMessage = '¡Código copiado al portapapeles!';
      }).catch(err => {
        this.modalMessage = 'Error al copiar el código al portapapeles.';
      });
    }
  }
}