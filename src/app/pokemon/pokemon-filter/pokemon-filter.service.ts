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

@Injectable({
  providedIn: 'root',
})
export class PokemonFilterService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private headers = new HttpHeaders({
    'X-Api-Key': environment.apiKey || '',
  });

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

  constructor() {
    this.loadFilters();
    this.restoreFiltersFromUrl();
  }

  private loadFilters() {
    this.httpClient
      .get<PokemonApiFilterResponse>(`${baseUrl}/types`, {
        headers: this.headers,
      })
      .subscribe({ next: ({ data }) => this.types.set(data) });

    this.httpClient
      .get<PokemonApiFilterResponse>(`${baseUrl}/subtypes`, {
        headers: this.headers,
      })
      .subscribe({ next: ({ data }) => this.subtypes.set(data) });

    this.httpClient
      .get<PokemonApiFilterResponse>(`${baseUrl}/supertypes`, {
        headers: this.headers,
      })
      .subscribe({ next: ({ data }) => this.supertypes.set(data) });
  }

  private restoreFiltersFromUrl() {
    this.route.queryParamMap.subscribe((params) => {
      const types = params.getAll('types');
      const subtypes = params.getAll('subtypes');
      const supertypes = params.getAll('supertypes');

      this.selectedTypes.set(types);
      this.selectedSubtypes.set(subtypes);
      this.selectedSupertypes.set(supertypes);

      if (types.length || subtypes.length || supertypes.length) {
        this.filterBy({
          types,
          subtypes,
          supertypes,
        });
      }
    });
  }

  filterBy(filters: PokemonFilters) {
    const { types = [], subtypes = [], supertypes = [] } = filters;

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

    const fullUrl = prepareFilterUrl({ types, subtypes, supertypes });

    this.filteredPokemonsLoading.set(true);
    this.httpClient
      .get<PokemonApiResponse<PokemonItemFields[]>>(fullUrl, {
        headers: this.headers,
      })
      .subscribe({
        next: ({ data }) => {
          this.filteredPokemons.set(data);
          this.filteredPokemonsLoading.set(false);
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

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        types: null,
        subtypes: null,
        supertypes: null,
      },
      queryParamsHandling: 'merge',
    });
  }
}
