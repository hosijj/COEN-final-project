import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IReview, Review } from '../review.model';
import { ReviewService } from '../service/review.service';
import { IProfessor } from 'app/entities/professor/professor.model';
import { ProfessorService } from 'app/entities/professor/service/professor.service';
import { ICourses } from 'app/entities/courses/courses.model';
import { CoursesService } from 'app/entities/courses/service/courses.service';

@Component({
  selector: 'jhi-review-update',
  templateUrl: './review-update.component.html',
})
export class ReviewUpdateComponent implements OnInit {
  isSaving = false;

  professorsSharedCollection: IProfessor[] = [];
  coursesSharedCollection: ICourses[] = [];

  editForm = this.fb.group({
    id: [],
    rate: [null, [Validators.required]],
    desc: [],
    professors: [],
    courses: [],
  });

  constructor(
    protected reviewService: ReviewService,
    protected professorService: ProfessorService,
    protected coursesService: CoursesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ review }) => {
      this.updateForm(review);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const review = this.createFromForm();
    if (review.id !== undefined) {
      this.subscribeToSaveResponse(this.reviewService.update(review));
    } else {
      this.subscribeToSaveResponse(this.reviewService.create(review));
    }
  }

  trackProfessorById(index: number, item: IProfessor): string {
    return item.id!;
  }

  trackCoursesById(index: number, item: ICourses): string {
    return item.id!;
  }

  getSelectedProfessor(option: IProfessor, selectedVals?: IProfessor[]): IProfessor {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedCourses(option: ICourses, selectedVals?: ICourses[]): ICourses {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReview>>): void {
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

  protected updateForm(review: IReview): void {
    this.editForm.patchValue({
      id: review.id,
      rate: review.rate,
      desc: review.desc,
      professors: review.professors,
      courses: review.courses,
    });

    this.professorsSharedCollection = this.professorService.addProfessorToCollectionIfMissing(
      this.professorsSharedCollection,
      ...(review.professors ?? [])
    );
    this.coursesSharedCollection = this.coursesService.addCoursesToCollectionIfMissing(
      this.coursesSharedCollection,
      ...(review.courses ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.professorService
      .query()
      .pipe(map((res: HttpResponse<IProfessor[]>) => res.body ?? []))
      .pipe(
        map((professors: IProfessor[]) =>
          this.professorService.addProfessorToCollectionIfMissing(professors, ...(this.editForm.get('professors')!.value ?? []))
        )
      )
      .subscribe((professors: IProfessor[]) => (this.professorsSharedCollection = professors));

    this.coursesService
      .query()
      .pipe(map((res: HttpResponse<ICourses[]>) => res.body ?? []))
      .pipe(
        map((courses: ICourses[]) =>
          this.coursesService.addCoursesToCollectionIfMissing(courses, ...(this.editForm.get('courses')!.value ?? []))
        )
      )
      .subscribe((courses: ICourses[]) => (this.coursesSharedCollection = courses));
  }

  protected createFromForm(): IReview {
    return {
      ...new Review(),
      id: this.editForm.get(['id'])!.value,
      rate: this.editForm.get(['rate'])!.value,
      desc: this.editForm.get(['desc'])!.value,
      professors: this.editForm.get(['professors'])!.value,
      courses: this.editForm.get(['courses'])!.value,
    };
  }
}
