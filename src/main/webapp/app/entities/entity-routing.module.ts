import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'courses',
        data: { pageTitle: 'Courses' },
        loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule),
      },
      {
        path: 'professor',
        data: { pageTitle: 'Professors' },
        loadChildren: () => import('./professor/professor.module').then(m => m.ProfessorModule),
      },
      {
        path: 'review',
        data: { pageTitle: 'Reviews' },
        loadChildren: () => import('./review/review.module').then(m => m.ReviewModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
