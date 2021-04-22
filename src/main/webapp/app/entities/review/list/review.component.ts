import {Component, OnInit} from '@angular/core';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {IReview} from '../review.model';

import {ITEMS_PER_PAGE} from 'app/config/pagination.constants';
import {ReviewService} from '../service/review.service';
import {ReviewDeleteDialogComponent} from '../delete/review-delete-dialog.component';
import {ParseLinks} from 'app/core/util/parse-links.service';
import {ChartOptions, ChartType} from "chart.js";
import {Label} from "ng2-charts";
import {ProfessorService} from "app/entities/professor/service/professor.service";
import {IProfessor} from "app/entities/professor/professor.model";
import {CoursesService} from "app/entities/courses/service/courses.service";
import {ICourses} from "app/entities/courses/courses.model";

@Component({
  selector: 'jhi-review',
  templateUrl: './review.component.html',
})
export class ReviewComponent implements OnInit {
  reviews: IReview[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
      title: {
        text: 'Professors',
        display: true
      }
  };
  public pieChartOptionsCrs: ChartOptions = {
    responsive: true,
      title: {
        text: 'Courses',
        display: true
      }
  };
  public pieChartLabels: Label[] = [];
  public pieChartLabelsCrs: Label[] = [];
  // public pieChartData: ChartDataSets[] = [];
    public pieChartData: number[] = [];
    public pieChartDataCrs: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  profer: IProfessor[];
  course: ICourses[];
  public pieChartColors: Array<any> = [
    {
      backgroundColor: ['#ffa1b5', '#ffe29a', '#86c7f3', '#851e3e', '#f9f4f4', '#7bc043']
    }
  ];
  constructor(protected reviewService: ReviewService, protected professorService: ProfessorService, protected coursesService: CoursesService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.reviews = [];
    this.profer = [];
    this.course = [];
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

    this.reviewService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IReview[]>) => {
          this.isLoading = false;
          this.paginateReviews(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.reviews = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;

    this.loadAll();
  }

  ngOnInit(): void {

    this.loadAll();
    this.averageProfessor();
    this.averageCourse();
  }

  averageCourse(): void {
    this.coursesService.query().subscribe(
      res => this.course = res.body!
    );

    this.reviewService.query().subscribe(
      res => {
        for (const crs of this.course) {
          let j = 0;
          let i = 0;

          for (const item of res.body!) {
            item.courses?.forEach(item2 => {
              if (item2.name === crs.name) {
                j++;
                i += item.rate!;
              }
            });

          }

          this.pieChartDataCrs.push(i/j);
          this.pieChartLabelsCrs.push(crs.name!);
        }

      }
    );
    // return null;
  }
  averageProfessor(): void {
    this.professorService.query().subscribe(
      res => this.profer = res.body!
    );

    this.reviewService.query().subscribe(
      res => {
        for (const pr of this.profer) {
          let j = 0;
          let i = 0;

          for (const item of res.body!) {
            item.professors?.forEach(item2 => {
              if (item2.lastName === pr.lastName) {
                j++;
                i += item.rate!;
              }
            });

          }

          this.pieChartData.push(i/j);
          this.pieChartLabels.push(pr.lastName!);
        }

      }
    );
    // return null;
  }

  trackId(index: number, item: IReview): string {
    return item.id!;
  }

  delete(review: IReview): void {
    const modalRef = this.modalService.open(ReviewDeleteDialogComponent, {size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.review = review;
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

  protected paginateReviews(data: IReview[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.reviews.push(d);
      }
    }
  }
}
