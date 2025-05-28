import { inject, Injectable, signal } from '@angular/core';
import { pokemonsPerPage } from '../../app.config';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PokemonPaginatorService {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

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
    console.log(`reset(${totalCount})`);
    this.setPage(0);
    this.setPageSize(pokemonsPerPage);
    this.setTotalCount(totalCount);
  }

  updateUrlPageParam(page: number) {
    console.log(`updateUrlPageParam(${page})`);
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  async restorePageFromUrl() {
    console.log('restorePageFromUrl()');
    this.route.queryParamMap.subscribe((params) => {
      console.log(params);
      const page = Number(params.get('page'));
      if (!isNaN(page) && page >= 0) {
        console.log(`Restoring page from URL: ${page}`);
        this.setPage(page);
      } else {
        console.log('No valid page in URL, resetting to 0');
        this.setPage(0);
      }
    });
  }
}
