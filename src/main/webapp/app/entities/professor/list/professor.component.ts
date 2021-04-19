import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProfessor } from '../professor.model';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ProfessorService } from '../service/professor.service';
import { ProfessorDeleteDialogComponent } from '../delete/professor-delete-dialog.component';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-professor',
  templateUrl: './professor.component.html',
})
export class ProfessorComponent implements OnInit {
  professors: IProfessor[];
  isLoading = false;
  itemsPerPage: number;
  links: { [key: string]: number };
  page: number;
  predicate: string;
  ascending: boolean;

  constructor(protected professorService: ProfessorService, protected modalService: NgbModal, protected parseLinks: ParseLinks) {
    this.professors = [];
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

    this.professorService
      .query({
        page: this.page,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe(
        (res: HttpResponse<IProfessor[]>) => {
          this.isLoading = false;
          this.paginateProfessors(res.body, res.headers);
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  reset(): void {
    this.page = 0;
    this.professors = [];
    this.loadAll();
  }

  loadPage(page: number): void {
    this.page = page;
    this.loadAll();
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProfessor): string {
    return item.id!;
  }

  delete(professor: IProfessor): void {
    const modalRef = this.modalService.open(ProfessorDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.professor = professor;
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

  protected paginateProfessors(data: IProfessor[] | null, headers: HttpHeaders): void {
    this.links = this.parseLinks.parse(headers.get('link') ?? '');
    if (data) {
      for (const d of data) {
        this.professors.push(d);
      }
    }
  }
}
