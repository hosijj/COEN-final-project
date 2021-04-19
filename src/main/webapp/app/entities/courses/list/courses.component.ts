import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICourses } from '../courses.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { CoursesService } from '../service/courses.service';
import { CoursesDeleteDialogComponent } from '../delete/courses-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-courses',
  templateUrl: './courses.component.html',
})
export class CoursesComponent implements OnInit {
  courses: ICourses[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected coursesService: CoursesService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.courses = [];
    this.itemsPerPage = ITEMS_PER_PAGE;
    this.page = 0;
    this.links = {
      last: 0,
    };
    this.predicate = 'id';
    this.ascending = true;
  }

  loadAll(): void {
    this.isLoading = true;

    this.coursesService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<ICourses[]>) => {
          this.isLoading = false;
          this.paginateCourses(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.courses = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ICourses): string {
    return item.id!;
  }

  delete(courses: ICourses): void {
    const modalRef = this.modalService.open(CoursesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.courses = courses;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.reset();
      }
    });
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected paginateCourses(data: ICourses[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.courses.push(d);
      }
    }
  }
}
