import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IReview } from '../review.model';
import { ReviewService } from '../service/review.service';

@Component({
  templateUrl: './review-delete-dialog.component.html',
})
export class ReviewDeleteDialogComponent {
  review?: IReview;

  constructor(protected reviewService: ReviewService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.reviewService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
