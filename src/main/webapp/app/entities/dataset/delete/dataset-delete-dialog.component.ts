import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IDataset } from '../dataset.model';
import { DatasetService } from '../service/dataset.service';

@Component({
  standalone: true,
  templateUrl: './dataset-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class DatasetDeleteDialogComponent {
  dataset?: IDataset;

  protected datasetService = inject(DatasetService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.datasetService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
