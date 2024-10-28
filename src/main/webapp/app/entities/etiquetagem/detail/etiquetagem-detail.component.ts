import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IEtiquetagem } from '../etiquetagem.model';

@Component({
  standalone: true,
  selector: 'jhi-etiquetagem-detail',
  templateUrl: './etiquetagem-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class EtiquetagemDetailComponent {
  etiquetagem = input<IEtiquetagem | null>(null);

  previousState(): void {
    window.history.back();
  }
}
