import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IEtiqueta } from '../etiqueta.model';

@Component({
  standalone: true,
  selector: 'jhi-etiqueta-detail',
  templateUrl: './etiqueta-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EtiquetaDetailComponent {
  etiqueta = input<IEtiqueta | null>(null);

  previousState(): void {
    window.history.back();
  }
}
