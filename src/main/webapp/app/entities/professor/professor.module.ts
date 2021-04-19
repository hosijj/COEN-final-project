import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ProfessorComponent } from './list/professor.component';
import { ProfessorDetailComponent } from './detail/professor-detail.component';
import { ProfessorUpdateComponent } from './update/professor-update.component';
import { ProfessorDeleteDialogComponent } from './delete/professor-delete-dialog.component';
import { ProfessorRoutingModule } from './route/professor-routing.module';

@NgModule({
  imports: [SharedModule, ProfessorRoutingModule],
  declarations: [ProfessorComponent, ProfessorDetailComponent, ProfessorUpdateComponent, ProfessorDeleteDialogComponent],
  entryComponents: [ProfessorDeleteDialogComponent],
})
export class ProfessorModule {}
