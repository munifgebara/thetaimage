import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IConjunto } from '../conjunto.model';
import { ConjuntoService } from '../service/conjunto.service';

@Component({
  standalone: true,
  templateUrl: './conjunto-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ConjuntoDeleteDialogComponent {
  conjunto?: IConjunto;

  protected conjuntoService = inject(ConjuntoService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.conjuntoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
