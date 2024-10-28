import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IImagem } from '../imagem.model';
import { ImagemService } from '../service/imagem.service';

@Component({
  standalone: true,
  templateUrl: './imagem-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ImagemDeleteDialogComponent {
  imagem?: IImagem;

  protected imagemService = inject(ImagemService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.imagemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
