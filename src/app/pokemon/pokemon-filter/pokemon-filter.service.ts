import { inject, Injectable, signal } from '@angular/core';
import {
  PokemonApiFilterResponse,
  PokemonApiResponse,
  PokemonItemFields,
} from '../pokemon.model';
import { baseUrl } from '../../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { prepareFilterUrl } from './pokemon-filter.helpers';
import { PokemonFilters } from './pokemon-filter.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonPaginatorService } from '../pokemon-paginator/pokemon-paginator.service';
import { PokemonService } from '../pokemon.service';
import { forkJoin } from 'rxjs';
import { createApiHeaders } from '../../api.helpers';

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
  private supertypes = signal<string[] | null[]>([]);
  private subtypes = signal<string[] | null[]>([]);
  private types = signal<string[] | null[]>([]);

  private selectedTypes = signal<string[]>([]);
  private selectedSubtypes = signal<string[]>([]);
  private selectedSupertypes = signal<string[]>([]);

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

  private loadFilters() {
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

  private restoreFiltersFromUrl() {
    this.route.queryParamMap.subscribe((params) => {
      if (
        !params.getAll('types').length &&
        !params.getAll('subtypes').length &&
        !params.getAll('supertypes').length
      )
        return;

      const types = params.getAll('types');
      const subtypes = params.getAll('subtypes');
      const supertypes = params.getAll('supertypes');

      this.selectedTypes.set(types);
      this.selectedSubtypes.set(subtypes);
      this.selectedSupertypes.set(supertypes);
    });
  }

  filterBy(filters: PokemonFilters, pageIndex: number = 0) {
    const { types = [], subtypes = [], supertypes = [] } = filters;

    console.log('Fetching pokemons for page:', pageIndex);

    this.selectedTypes.set(types);
    this.selectedSubtypes.set(subtypes);
    this.selectedSupertypes.set(supertypes);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        types: types.length ? types : null,
        subtypes: subtypes.length ? subtypes : null,
        supertypes: supertypes.length ? supertypes : null,
      },
      queryParamsHandling: 'merge',
    });

    if (!types.length && !subtypes.length && !supertypes.length) {
      console.warn('No filters selected, resetting filtered pokemons');
      this.filteredPokemons.set([]);
      this.isFilterNowActive.set(false);
      return;
    }
    this.isFilterNowActive.set(true);
    this.filteredPokemonsLoading.set(true);

    const fullUrl = prepareFilterUrl(
      { types, subtypes, supertypes },
      pageIndex + 1
    );

    this.httpClient
      .get<PokemonApiResponse<PokemonItemFields[]>>(fullUrl, {
        headers: this.headers,
      })
      .subscribe({
        next: ({ data, totalCount, page }) => {
          this.filteredPokemons.set(data);
          this.filteredPokemonsLoading.set(false);
          this.pokemonPaginatorService.setTotalCount(totalCount ?? 0);
          this.pokemonPaginatorService.setPage(page);
        },
        error: () => this.filteredPokemonsLoading.set(false),
      });
  }

  reset() {
    this.selectedTypes.set([]);
    this.selectedSubtypes.set([]);
    this.selectedSupertypes.set([]);
    this.isFilterNowActive.set(false);
    this.filteredPokemons.set([]);
    this.filteredPokemonsLoading.set(false);
    this.pokemonPaginatorService.reset(this.pokemonService.totalCount());

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        types: null,
        subtypes: null,
        supertypes: null,
        page: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  getSelectedFilters(): PokemonFilters {
    return {
      types: this.selectedTypes(),
      subtypes: this.selectedSubtypes(),
      supertypes: this.selectedSupertypes(),
    };
  }

  init() {
    this.loadFilters();
    this.restoreFiltersFromUrl();
  }
}
