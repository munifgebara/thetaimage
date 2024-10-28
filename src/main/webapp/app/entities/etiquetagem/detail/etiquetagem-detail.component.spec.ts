import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { EtiquetagemDetailComponent } from './etiquetagem-detail.component';

describe('Etiquetagem Management Detail Component', () => {
  let comp: EtiquetagemDetailComponent;
  let fixture: ComponentFixture<EtiquetagemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EtiquetagemDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./etiquetagem-detail.component').then(m => m.EtiquetagemDetailComponent),
              resolve: { etiquetagem: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(EtiquetagemDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EtiquetagemDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load etiquetagem on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', EtiquetagemDetailComponent);

      // THEN
      expect(instance.etiquetagem()).toEqual(expect.objectContaining({ id: 123 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
