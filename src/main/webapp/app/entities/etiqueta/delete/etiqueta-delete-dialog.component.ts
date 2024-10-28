import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEtiqueta } from '../etiqueta.model';
import { EtiquetaService } from '../service/etiqueta.service';

@Component({
  standalone: true,
  templateUrl: './etiqueta-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EtiquetaDeleteDialogComponent {
  etiqueta?: IEtiqueta;

  protected etiquetaService = inject(EtiquetaService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.etiquetaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
