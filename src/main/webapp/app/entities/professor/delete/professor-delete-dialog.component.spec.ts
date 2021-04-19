jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ProfessorService } from '../service/professor.service';

import { ProfessorDeleteDialogComponent } from './professor-delete-dialog.component';

describe('Component Tests', () => {
  describe('Professor Management Delete Component', () => {
    let comp: ProfessorDeleteDialogComponent;
    let fixture: ComponentFixture<ProfessorDeleteDialogComponent>;
    let service: ProfessorService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProfessorDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(ProfessorDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProfessorDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProfessorService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete('ABC');
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith('ABC');
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
