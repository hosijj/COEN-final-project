import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProfessor } from '../professor.model';
import { ProfessorService } from '../service/professor.service';

@Component({
  templateUrl: './professor-delete-dialog.component.html',
})
export class ProfessorDeleteDialogComponent {
  professor?: IProfessor;

  constructor(protected professorService: ProfessorService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.professorService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
