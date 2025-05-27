import { inject, Injectable, signal } from '@angular/core';
import {
  PokemonApiFilterResponse,
  PokemonApiResponse,
  PokemonItemFields,
} from '../pokemon.model';
import { baseUrl } from '../../app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PokemonFilterService {
  private readonly httpClient = inject(HttpClient);
  // if api key is provided - could be set as interceptor later
  private headers = new HttpHeaders({
    'X-Api-Key': environment.apiKey || '',
  });

  private supertypes = signal<string[]>([]);
  private subtypes = signal<string[]>([]);
  private types = signal<string[]>([]);

  private readonly filteredPokemons = signal<PokemonItemFields[]>([]);

  loadedSupertypes = this.supertypes.asReadonly();
  loadedSubtypes = this.subtypes.asReadonly();
  loadedTypes = this.types.asReadonly();
  loadedFilteredPokemons = this.filteredPokemons.asReadonly();

  constructor() {
    this.loadFilters().subscribe({
      next: ({ data }) => {
        console.log('Filters loaded:', data);
        this.types.set(data);
      },
      error: (err) => {
        console.error('Error loading filters:', err);
      },
    });
  }

  private loadFilters() {
    return this.httpClient.get<PokemonApiFilterResponse>(`${baseUrl}/types`, {
      headers: this.headers,
    });
  }

  filterBy(filterType: 'types' | 'subtypes' | 'xd', selectedValues: string[]) {
    if (selectedValues.length === 0) {
      console.warn('No types provided for filtering. Returning empty result.');
      this.filteredPokemons.set([]);
      return;
    }

    const query = selectedValues
      .map((val) => `${filterType}:"${val}"`)
      .join(' AND ');
    const fullUrl = `${baseUrl}/cards?q=${encodeURIComponent(
      query
    )}&select=name,id,images,supertype,subtypes,types&pageSize=10`;

    console.log('Filtering Pokemons with query:', query);

    this.httpClient
      .get<PokemonApiResponse<PokemonItemFields[]>>(fullUrl, {
        headers: this.headers,
      })
      .subscribe({
        next: ({ data }) => {
          console.log('Filtered Pokemons:', data);
          this.filteredPokemons.set(data);
        },
      });
  }
}
