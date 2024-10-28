import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { ConjuntoDetailComponent } from './conjunto-detail.component';

describe('Conjunto Management Detail Component', () => {
  let comp: ConjuntoDetailComponent;
  let fixture: ComponentFixture<ConjuntoDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConjuntoDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./conjunto-detail.component').then(m => m.ConjuntoDetailComponent),
              resolve: { conjunto: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ConjuntoDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConjuntoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load conjunto on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ConjuntoDetailComponent);

      // THEN
      expect(instance.conjunto()).toEqual(expect.objectContaining({ id: 123 }));
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
