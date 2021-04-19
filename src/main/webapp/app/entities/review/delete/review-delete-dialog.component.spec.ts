jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ReviewService } from '../service/review.service';

import { ReviewDeleteDialogComponent } from './review-delete-dialog.component';

describe('Component Tests', () => {
  describe('Review Management Delete Component', () => {
    let comp: ReviewDeleteDialogComponent;
    let fixture: ComponentFixture<ReviewDeleteDialogComponent>;
    let service: ReviewService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ReviewDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(ReviewDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ReviewDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ReviewService);
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
