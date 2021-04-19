jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProfessorService } from '../service/professor.service';
import { IProfessor, Professor } from '../professor.model';

import { ProfessorUpdateComponent } from './professor-update.component';

describe('Component Tests', () => {
  describe('Professor Management Update Component', () => {
    let comp: ProfessorUpdateComponent;
    let fixture: ComponentFixture<ProfessorUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let professorService: ProfessorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProfessorUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProfessorUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProfessorUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      professorService = TestBed.inject(ProfessorService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const professor: IProfessor = { id: 'CBA' };

        activatedRoute.data = of({ professor });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(professor));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const professor = { id: 'ABC' };
        spyOn(professorService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ professor });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: professor }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(professorService.update).toHaveBeenCalledWith(professor);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const professor = new Professor();
        spyOn(professorService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ professor });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: professor }));
        saveSubject.complete();

        // THEN
        expect(professorService.create).toHaveBeenCalledWith(professor);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const professor = { id: 'ABC' };
        spyOn(professorService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ professor });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(professorService.update).toHaveBeenCalledWith(professor);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
