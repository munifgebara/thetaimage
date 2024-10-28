import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IEtiquetagem } from '../etiquetagem.model';
import { EtiquetagemService } from '../service/etiquetagem.service';

@Component({
  standalone: true,
  templateUrl: './etiquetagem-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EtiquetagemDeleteDialogComponent {
  etiquetagem?: IEtiquetagem;

  protected etiquetagemService = inject(EtiquetagemService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.etiquetagemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
