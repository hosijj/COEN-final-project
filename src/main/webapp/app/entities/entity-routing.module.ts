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
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
