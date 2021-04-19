import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CoursesComponent } from '../list/courses.component';
import { CoursesDetailComponent } from '../detail/courses-detail.component';
import { CoursesUpdateComponent } from '../update/courses-update.component';
import { CoursesRoutingResolveService } from './courses-routing-resolve.service';

const coursesRoute: Routes = [
  {
    path: '',
    component: CoursesComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CoursesDetailComponent,
    resolve: {
      courses: CoursesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CoursesUpdateComponent,
    resolve: {
      courses: CoursesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CoursesUpdateComponent,
    resolve: {
      courses: CoursesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(coursesRoute)],
  exports: [RouterModule],
})
export class CoursesRoutingModule {}
