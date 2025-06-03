import { inject, Injectable, signal } from '@angular/core';
import { pokemonsPerPage } from '../../app.config';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PokemonPaginatorService {
  // services
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // private
  private _pageSize = signal<number>(pokemonsPerPage);
  private _currentPage = signal<number>(1);
  private _totalCount = signal<number>(0);
  private _selctedPokemonId = signal<string | null>(null);

  // public readonly signals
  readonly selectedPokemonId = this._selctedPokemonId.asReadonly();

  readonly pageSize = this._pageSize.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly totalCount = this._totalCount.asReadonly();

  setCurrentPage(page: number) {
    this._currentPage.set(page);
  }

  setPageSize(size: number) {
    this._pageSize.set(size);
  }

  setTotalCount(count: number) {
    this._totalCount.set(count);
  }

  getCurrentPagination() {
    return {
      page: this._currentPage(),
      pageSize: this._pageSize(),
    };
  }

  // selected pokemon id from the list - to apply hihlight class
  setSelectedPokemonId(id: string | null) {
    this._selctedPokemonId.set(id);
  }

  // update URL with the current page number
  updateUrlPageParam(page: number) {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  // restored data from URL is used to set the current page
  async restorePageFromUrl() {
    this.route.queryParamMap.subscribe((params) => {
      const page = Number(params.get('page'));
      if (!isNaN(page) && page > 0) {
        this.setCurrentPage(page);
      } else {
        this.setCurrentPage(1);
      }
    });
  }

  resetPagination(totalCount: number) {
    this.setCurrentPage(1);
    this.setCurrentPage(pokemonsPerPage);
    this.setTotalCount(totalCount);
  }
}
