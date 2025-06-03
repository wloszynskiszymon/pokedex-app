import { updatePokemons } from './../pokemon.helpers';
import { inject, Injectable, signal } from '@angular/core';
import {
  PokemonApiFilterResponse,
  PokemonApiResponse,
  PokemonEditable,
  PokemonItemFields,
  SelectedPokemonFilters,
} from '../pokemon.model';
import { baseUrl } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonPaginatorService } from '../pokemon-paginator/pokemon-paginator.service';
import { PokemonService } from '../pokemon.service';
import { firstValueFrom, forkJoin } from 'rxjs';
import { createApiHeaders, preparePokemonApiUrl } from '../pokemon.api';
import { API_SELECTS } from '../pokemon.constants';
import { getEditedPokemonsFromLocalStorage } from '../pokemon.localstorage';
import { filterEditedPokemons } from '../pokemon.helpers';

@Injectable({
  providedIn: 'root',
})
export class PokemonFilterService {
  // services
  private readonly http = inject(HttpClient);
  private readonly pokemonPaginatorService = inject(PokemonPaginatorService);
  private readonly pokemonService = inject(PokemonService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // private
  private _headers = createApiHeaders();

  private _isFilterDataLoading = signal<boolean>(true);
  private _supertype = signal<string[]>([]);
  private _subtypes = signal<string[]>([]);
  private _types = signal<string[]>([]);

  private _selectedType = signal<string | null>(null);
  private _selectedSubtype = signal<string | null>(null);
  private _selectedSupertype = signal<string | null>(null);

  private _filteredPokemons = signal<PokemonItemFields[]>([]);
  private _isLoadingFilteredPokemons = signal<boolean>(false);
  private _areFiltersActive = signal<boolean>(false);

  // public
  readonly supertype = this._supertype.asReadonly();
  readonly subtypes = this._subtypes.asReadonly();
  readonly types = this._types.asReadonly();
  readonly filteredPokemons = this._filteredPokemons.asReadonly();
  readonly areFiltersActive = this._areFiltersActive.asReadonly();
  readonly isLoadingFilteredPokemons =
    this._isLoadingFilteredPokemons.asReadonly();
  readonly isFilterDataLoading = this._isFilterDataLoading.asReadonly();

  readonly selectedType = this._selectedType.asReadonly();
  readonly selectedSubtype = this._selectedSubtype.asReadonly();
  readonly selectedSupertype = this._selectedSupertype.asReadonly();

  fetchFilters() {
    console.log('loadFilters()');
    forkJoin({
      types: this.http.get<PokemonApiFilterResponse>(`${baseUrl}/types`, {
        headers: this._headers,
      }),
      subtypes: this.http.get<PokemonApiFilterResponse>(`${baseUrl}/subtypes`, {
        headers: this._headers,
      }),
      supertypes: this.http.get<PokemonApiFilterResponse>(
        `${baseUrl}/supertypes`,
        { headers: this._headers }
      ),
    }).subscribe({
      next: ({ types, subtypes, supertypes }) => {
        this._types.set(types.data);
        this._subtypes.set(subtypes.data);
        this._supertype.set(supertypes.data);
        this._isFilterDataLoading.set(false);
      },
      error: (err) => {
        this._isFilterDataLoading.set(false);
        console.error('Failed to load filters', err);
      },
    });
  }

  async restoreFiltersFromUrl() {
    console.log('restoreFiltersFromUrl()');
    this.route.queryParamMap.subscribe((params) => {
      if (
        !params.getAll('type').length &&
        !params.getAll('subtype').length &&
        !params.getAll('supertype').length
      )
        return;

      console.log('Restoring filters from URL');
      console.log('Loading when restoring: ', this._isFilterDataLoading());

      const type = params.getAll('type');
      const subtype = params.getAll('subtype');
      const supertype = params.getAll('supertype');

      console.log(type, subtype, supertype);

      this._selectedType.set(type[0]);
      this._selectedSubtype.set(subtype[0]);
      this._selectedSupertype.set(supertype[0]);
      this._areFiltersActive.set(true);
    });
  }

  async filterBy(
    filters: SelectedPokemonFilters,
    page: number = 1
  ): Promise<void> {
    console.log(
      `filterBy({type: ${filters.type}, subtype: ${filters.subtype}, supertype: ${filters.supertype}}, ${page})`
    );
    const { type = null, subtype = null, supertype = null } = filters;

    this._selectedType.set(type);
    this._selectedSubtype.set(subtype);
    this._selectedSupertype.set(supertype);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        type: type ?? null,
        subtype: subtype ?? null,
        supertype: supertype ?? null,
      },
      queryParamsHandling: 'merge',
    });

    if (!type && !subtype && !supertype) {
      console.warn('No filters selected, resetting filtered pokemons');
      const page = this.pokemonPaginatorService.getCurrentPagination().page;
      this._filteredPokemons.set([]);
      this.pokemonService.fetchAllPokemons(page);
      this._areFiltersActive.set(false);
      return;
    }

    this._areFiltersActive.set(true);
    this._isLoadingFilteredPokemons.set(true);

    const editedPokemons = getEditedPokemonsFromLocalStorage();
    const filteredPokemonObj = filterEditedPokemons(editedPokemons, {
      type: type,
      subtype: subtype,
      supertype: supertype ?? undefined,
    });

    const filteredIds = {
      include: filteredPokemonObj.includedPokemons.map((p) => p.id),
      exclude: filteredPokemonObj.excludedPokemons.map((p) => p.id),
    };

    const fullUrl = preparePokemonApiUrl({
      route: '/cards',
      filters,
      page,
      select: API_SELECTS.pokemonItem,
      idsToInclude: filteredIds.include,
      idsToExclude: filteredIds.exclude,
    });

    console.log(fullUrl);

    try {
      const { data, totalCount } = await firstValueFrom(
        this.http.get<PokemonApiResponse<PokemonItemFields[]>>(fullUrl, {
          headers: this._headers,
        })
      );
      console.log(`filterBy() - received ${data.length} filtered pokemons`);
      this._filteredPokemons.set(data);
      this._isLoadingFilteredPokemons.set(false);
      this.pokemonPaginatorService.setTotalCount(totalCount ?? 0);
      this.pokemonPaginatorService.setCurrentPage(page);
    } catch (e) {
      console.error(e);
      this._isLoadingFilteredPokemons.set(false);
    }
  }

  getSelectedFilters(): SelectedPokemonFilters {
    console.log('getSelectedFilters()');
    return {
      type: this._selectedType(),
      subtype: this._selectedSubtype(),
      supertype: this._selectedSupertype(),
    };
  }

  disableFilteredPokemonsLoading() {
    console.log('disableLoading()');
    this._isLoadingFilteredPokemons.set(false);
  }

  updateFilteredPokemons(pokemon: PokemonEditable) {
    if (!this._filteredPokemons()) return;

    const updatedPokemons = updatePokemons(this._filteredPokemons(), [pokemon]);
    this._filteredPokemons.set(updatedPokemons);
    this.pokemonService.updatePokemonDetails(updatedPokemons);

    const found = updatedPokemons.some((p) => p.id === pokemon.id);

    if (found) {
      const filters = this.getSelectedFilters();
      const page = this.pokemonPaginatorService.getCurrentPagination().page;
      this.filterBy(filters, page);
    }
  }

  resetFilters() {
    console.log('reset()');
    this._selectedType.set(null);
    this._selectedSubtype.set(null);
    this._selectedSupertype.set(null);
    this._areFiltersActive.set(false);
    this._filteredPokemons.set([]);
    this._isLoadingFilteredPokemons.set(false);
    this.pokemonPaginatorService.resetPagination(
      this.pokemonService.allPokemonsTotalCount()
    );

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        type: null,
        subtype: null,
        supertype: null,
        page: null,
      },
      queryParamsHandling: 'merge',
    });

    if (this.pokemonService.allPokemons.length === 0) {
      console.warn('No pokemons loaded, fetching all pokemons');

      this.pokemonService.fetchAllPokemons();
    }
  }
}
