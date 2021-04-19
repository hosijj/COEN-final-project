import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProfessorComponent } from '../list/professor.component';
import { ProfessorDetailComponent } from '../detail/professor-detail.component';
import { ProfessorUpdateComponent } from '../update/professor-update.component';
import { ProfessorRoutingResolveService } from './professor-routing-resolve.service';

const professorRoute: Routes = [
  {
    path: '',
    component: ProfessorComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProfessorDetailComponent,
    resolve: {
      professor: ProfessorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProfessorUpdateComponent,
    resolve: {
      professor: ProfessorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProfessorUpdateComponent,
    resolve: {
      professor: ProfessorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(professorRoute)],
  exports: [RouterModule],
})
export class ProfessorRoutingModule {}
