import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICourses, Courses } from '../courses.model';
import { CoursesService } from '../service/courses.service';

@Component({
  selector: 'jhi-courses-update',
  templateUrl: './courses-update.component.html',
})
export class CoursesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    description: [],
  });

  constructor(protected coursesService: CoursesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ courses }) => {
      this.updateForm(courses);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const courses = this.createFromForm();
    if (courses.id !== undefined) {
      this.subscribeToSaveResponse(this.coursesService.update(courses));
    } else {
      this.subscribeToSaveResponse(this.coursesService.create(courses));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourses>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(courses: ICourses): void {
    this.editForm.patchValue({
      id: courses.id,
      name: courses.name,
      code: courses.code,
      description: courses.description,
    });
  }

  protected createFromForm(): ICourses {
    return {
      ...new Courses(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      code: this.editForm.get(['code'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
