import { updatePokemons } from './../pokemon.helpers';
import { inject, Injectable, signal } from '@angular/core';
import {
  PokemonApiFilterResponse,
  PokemonApiResponse,
  PokemonEditable,
  PokemonItemFields,
} from '../pokemon.model';
import { baseUrl } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { PokemonFilters } from '../pokemon.model';
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
  private readonly httpClient = inject(HttpClient);
  private readonly pokemonPaginatorService = inject(PokemonPaginatorService);
  private readonly pokemonService = inject(PokemonService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private headers = createApiHeaders();

  private isFiltersDataLoading = signal<boolean>(true);
  private supertypes = signal<string[]>([]);
  private subtypes = signal<string[]>([]);
  private types = signal<string[]>([]);

  private _selectedType = signal<string[]>([]);
  private _selectedSubtype = signal<string[]>([]);
  private _selectedSupertype = signal<string | null>(null);

  private filteredPokemons = signal<PokemonItemFields[]>([]);
  private filteredPokemonsLoading = signal<boolean>(false);
  private isFilterNowActive = signal<boolean>(false);

  loadedSupertypes = this.supertypes.asReadonly();
  loadedSubtypes = this.subtypes.asReadonly();
  loadedTypes = this.types.asReadonly();
  loadedFilteredPokemons = this.filteredPokemons.asReadonly();
  isFilterActive = this.isFilterNowActive.asReadonly();
  isLoadingFilteredPokemons = this.filteredPokemonsLoading.asReadonly();
  areFiltersLoading = this.isFiltersDataLoading.asReadonly();

  selectedType = this._selectedType.asReadonly();
  selectedSubtype = this._selectedSubtype.asReadonly();
  selectedSupertype = this._selectedSupertype.asReadonly();

  loadFilters() {
    console.log('loadFilters()');
    forkJoin({
      types: this.httpClient.get<PokemonApiFilterResponse>(`${baseUrl}/types`, {
        headers: this.headers,
      }),
      subtypes: this.httpClient.get<PokemonApiFilterResponse>(
        `${baseUrl}/subtypes`,
        { headers: this.headers }
      ),
      supertypes: this.httpClient.get<PokemonApiFilterResponse>(
        `${baseUrl}/supertypes`,
        { headers: this.headers }
      ),
    }).subscribe({
      next: ({ types, subtypes, supertypes }) => {
        this.types.set(types.data);
        this.subtypes.set(subtypes.data);
        this.supertypes.set(supertypes.data);
        this.isFiltersDataLoading.set(false);
      },
      error: (err) => {
        this.isFiltersDataLoading.set(false);
        console.error('Failed to load filters', err);
      },
    });
  }

  async restoreFiltersFromUrl() {
    console.log('restoreFiltersFromUrl()');
    this.route.queryParamMap.subscribe((params) => {
      if (
        !params.getAll('types').length &&
        !params.getAll('subtypes').length &&
        !params.getAll('supertype').length
      )
        return;

      console.log('Restoring filters from URL');
      console.log('Loading when restoring: ', this.isFiltersDataLoading());

      const types = params.getAll('types');
      const subtypes = params.getAll('subtypes');
      const supertypes = params.getAll('supertype');

      console.log(types, subtypes, supertypes);

      this._selectedType.set(types);
      this._selectedSubtype.set(subtypes);
      this._selectedSupertype.set(supertypes[0]);
      this.isFilterNowActive.set(true);
    });
  }

  async filterBy(filters: PokemonFilters, page: number = 1): Promise<void> {
    console.log(
      `filterBy({types: ${filters.types}, subtypes: ${filters.subtypes}, supertype: ${filters.supertype}}, ${page})`
    );
    const { types = [], subtypes = [], supertype = null } = filters;

    this._selectedType.set(types);
    this._selectedSubtype.set(subtypes);
    this._selectedSupertype.set(supertype);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        types: types.length ? types : null,
        subtypes: subtypes.length ? subtypes : null,
        supertype: supertype ? supertype : null,
      },
      queryParamsHandling: 'merge',
    });

    if (!types.length && !subtypes.length && !supertype) {
      console.warn('No filters selected, resetting filtered pokemons');
      const page = this.pokemonPaginatorService.currentPagination.page;
      this.filteredPokemons.set([]);
      this.pokemonService.fetchAllPokemons(page);
      this.isFilterNowActive.set(false);
      return;
    }
    this.isFilterNowActive.set(true);
    this.filteredPokemonsLoading.set(true);

    const editedPokemons = getEditedPokemonsFromLocalStorage();
    const filteredPokemonObj = filterEditedPokemons(editedPokemons, {
      types: types,
      subtypes: subtypes,
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
        this.httpClient.get<PokemonApiResponse<PokemonItemFields[]>>(fullUrl, {
          headers: this.headers,
        })
      );
      console.log(`filterBy() - received ${data.length} filtered pokemons`);
      this.filteredPokemons.set(data);
      this.filteredPokemonsLoading.set(false);
      this.pokemonPaginatorService.setTotalCount(totalCount ?? 0);
      this.pokemonPaginatorService.setPage(page);
    } catch (e) {
      console.error(e);
      this.filteredPokemonsLoading.set(false);
    }
  }

  reset() {
    console.log('reset()');
    this._selectedType.set([]);
    this._selectedSubtype.set([]);
    this._selectedSupertype.set(null);
    this.isFilterNowActive.set(false);
    this.filteredPokemons.set([]);
    this.filteredPokemonsLoading.set(false);
    this.pokemonPaginatorService.reset(
      this.pokemonService.allPokemonsTotalCount()
    );

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        types: null,
        subtypes: null,
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

  getSelectedFilters(): PokemonFilters {
    console.log('getSelectedFilters()');
    return {
      types: this._selectedType(),
      subtypes: this._selectedSubtype(),
      supertype: this._selectedSupertype(),
    };
  }

  disableLoading() {
    console.log('disableLoading()');
    this.filteredPokemonsLoading.set(false);
  }

  updatePokemons(pokemon: PokemonEditable) {
    if (!this.filteredPokemons()) return;

    const updatedPokemons = updatePokemons(this.filteredPokemons(), [pokemon]);
    this.filteredPokemons.set(updatedPokemons);
    this.pokemonService.updatePokemonDetails(updatedPokemons);

    const found = updatedPokemons.some((p) => p.id === pokemon.id);

    if (found) {
      const filters = this.getSelectedFilters();
      const page = this.pokemonPaginatorService.currentPagination.page;
      this.filterBy(filters, page);
    }
  }
}
