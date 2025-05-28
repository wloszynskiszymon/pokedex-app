import { effect, inject, Injectable, signal } from '@angular/core';
import { pokemonsPerPage } from '../../app.config';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PokemonPaginatorService {
  private router = inject(Router);

  private pageSize = signal<number>(pokemonsPerPage);
  private currentPage = signal<number>(0);
  private totalCount = signal<number>(0);

  pageSize$ = this.pageSize.asReadonly();
  currentPage$ = this.currentPage.asReadonly();
  totalCount$ = this.totalCount.asReadonly();

  setPage(page: number) {
    this.currentPage.set(page);
  }

  setPageSize(size: number) {
    this.pageSize.set(size);
  }

  setTotalCount(count: number) {
    this.totalCount.set(count);
  }

  get currentPagination() {
    return {
      page: this.currentPage(),
      pageSize: this.pageSize(),
    };
  }

  reset(totalCount: number) {
    this.setPage(0);
    this.setPageSize(pokemonsPerPage);
    this.setTotalCount(totalCount);
  }

  updateUrlPageParam(page: number) {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
}
