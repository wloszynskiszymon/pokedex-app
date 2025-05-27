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

@Injectable({
  providedIn: 'root',
})
export class PokemonFilterService {
  private readonly httpClient = inject(HttpClient);
  // if api key is provided - could be set as interceptor later
  private headers = new HttpHeaders({
    'X-Api-Key': environment.apiKey || '',
  });

  private supertypes = signal<string[] | null[]>([]);
  private subtypes = signal<string[] | null[]>([]);
  private types = signal<string[] | null[]>([]);
  private isFilterNowActive = signal<boolean>(false);
  private filteredPokemonsLoading = signal<boolean>(false);

  private readonly filteredPokemons = signal<PokemonItemFields[]>([]);

  loadedSupertypes = this.supertypes.asReadonly();
  loadedSubtypes = this.subtypes.asReadonly();
  loadedTypes = this.types.asReadonly();
  loadedFilteredPokemons = this.filteredPokemons.asReadonly();
  isFilterActive = this.isFilterNowActive.asReadonly();
  isLoadingFilteredPokemons = this.filteredPokemonsLoading.asReadonly();

  constructor() {
    this.httpClient
      .get<PokemonApiFilterResponse>(`${baseUrl}/types`, {
        headers: this.headers,
      })
      .subscribe({
        next: ({ data }) => {
          console.log('Filter types loaded:', data);
          this.types.set(data);
        },
        error: (err) => {
          console.error('Error loading filters:', err);
        },
      });

    this.httpClient
      .get<PokemonApiFilterResponse>(`${baseUrl}/subtypes`, {
        headers: this.headers,
      })
      .subscribe({
        next: ({ data }) => {
          console.log('Filter subtypes loaded:', data);
          this.subtypes.set(data);
        },
        error: (err) => {
          console.error('Error loading filters:', err);
        },
      });

    this.httpClient
      .get<PokemonApiFilterResponse>(`${baseUrl}/supertypes`, {
        headers: this.headers,
      })
      .subscribe({
        next: ({ data }) => {
          console.log('Filter supertypes loaded:', data);
          this.supertypes.set(data);
        },
        error: (err) => {
          console.error('Error loading filters:', err);
        },
      });
  }

  filterBy({
    types: types = [],
    subtypes: subtypes = [],
    supertypes: supertypes = [],
  }: PokemonFilters) {
    if (
      types.length === 0 &&
      subtypes.length === 0 &&
      supertypes.length === 0
    ) {
      console.warn('No types provided for filtering. Returning empty result.');
      this.filteredPokemons.set([]);
      this.isFilterNowActive.set(false);
      this.filteredPokemonsLoading.set(false);
      return;
    }
    this.filteredPokemonsLoading.set(true);
    this.isFilterNowActive.set(true);

    const fullUrl = prepareFilterUrl({ types, subtypes, supertypes });

    this.httpClient
      .get<PokemonApiResponse<PokemonItemFields[]>>(fullUrl, {
        headers: this.headers,
      })
      .subscribe({
        next: ({ data }) => {
          console.log('Filtered Pokemons:', data);
          this.filteredPokemons.set(data);
          this.filteredPokemonsLoading.set(false);
        },
      });
  }

  reset() {
    this.isFilterNowActive.set(false);
    this.filteredPokemons.set([]);
    this.filteredPokemonsLoading.set(false);
  }
}
