import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modalVisibleSource = new BehaviorSubject<boolean>(false);
  modalVisible$ = this.modalVisibleSource.asObservable();
  showModal() {
    this.modalVisibleSource.next(true);
  }

  hideModal() {
    this.modalVisibleSource.next(false);
  }
}