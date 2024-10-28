import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { DatasetService } from '../service/dataset.service';
import { IDataset } from '../dataset.model';
import { DatasetFormService } from './dataset-form.service';

import { DatasetUpdateComponent } from './dataset-update.component';

describe('Dataset Management Update Component', () => {
  let comp: DatasetUpdateComponent;
  let fixture: ComponentFixture<DatasetUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let datasetFormService: DatasetFormService;
  let datasetService: DatasetService;
  let usuarioService: UsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DatasetUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DatasetUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DatasetUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    datasetFormService = TestBed.inject(DatasetFormService);
    datasetService = TestBed.inject(DatasetService);
    usuarioService = TestBed.inject(UsuarioService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Usuario query and add missing value', () => {
      const dataset: IDataset = { id: 456 };
      const usuario: IUsuario = { id: 8896 };
      dataset.usuario = usuario;

      const usuarioCollection: IUsuario[] = [{ id: 8584 }];
      jest.spyOn(usuarioService, 'query').mockReturnValue(of(new HttpResponse({ body: usuarioCollection })));
      const additionalUsuarios = [usuario];
      const expectedCollection: IUsuario[] = [...additionalUsuarios, ...usuarioCollection];
      jest.spyOn(usuarioService, 'addUsuarioToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ dataset });
      comp.ngOnInit();

      expect(usuarioService.query).toHaveBeenCalled();
      expect(usuarioService.addUsuarioToCollectionIfMissing).toHaveBeenCalledWith(
        usuarioCollection,
        ...additionalUsuarios.map(expect.objectContaining),
      );
      expect(comp.usuariosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const dataset: IDataset = { id: 456 };
      const usuario: IUsuario = { id: 17913 };
      dataset.usuario = usuario;

      activatedRoute.data = of({ dataset });
      comp.ngOnInit();

      expect(comp.usuariosSharedCollection).toContain(usuario);
      expect(comp.dataset).toEqual(dataset);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDataset>>();
      const dataset = { id: 123 };
      jest.spyOn(datasetFormService, 'getDataset').mockReturnValue(dataset);
      jest.spyOn(datasetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dataset });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dataset }));
      saveSubject.complete();

      // THEN
      expect(datasetFormService.getDataset).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(datasetService.update).toHaveBeenCalledWith(expect.objectContaining(dataset));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDataset>>();
      const dataset = { id: 123 };
      jest.spyOn(datasetFormService, 'getDataset').mockReturnValue({ id: null });
      jest.spyOn(datasetService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dataset: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: dataset }));
      saveSubject.complete();

      // THEN
      expect(datasetFormService.getDataset).toHaveBeenCalled();
      expect(datasetService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IDataset>>();
      const dataset = { id: 123 };
      jest.spyOn(datasetService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ dataset });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(datasetService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUsuario', () => {
      it('Should forward to usuarioService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(usuarioService, 'compareUsuario');
        comp.compareUsuario(entity, entity2);
        expect(usuarioService.compareUsuario).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
