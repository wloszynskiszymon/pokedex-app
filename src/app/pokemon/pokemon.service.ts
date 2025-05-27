import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  PokemonApiFilterResponse,
  PokemonApiResponse,
  PokemonDetails,
  PokemonItemFields,
} from './pokemon.model';
import { environment } from '../../environments/environment';

// could be extracted as environment variable later
const baseUrl = 'https://api.pokemontcg.io/v2';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private httpClient = inject(HttpClient);
  // if api key is provided - could be set as interceptor later
  private headers = new HttpHeaders({
    'X-Api-Key': environment.apiKey || '',
  });

  // pokemon data
  private pokemons = signal<PokemonItemFields[]>([]);
  private pokemonDetails = signal<PokemonDetails | undefined>(undefined);

  // for filtering
  private supertypes = signal<string[]>([]);
  private subtypes = signal<string[]>([]);
  private types = signal<string[]>([]);

  loadedPokemons = this.pokemons.asReadonly();
  loadedPokemonDetails = this.pokemonDetails.asReadonly();

  loadedSupertypes = this.supertypes.asReadonly();
  loadedSubtypes = this.subtypes.asReadonly();
  loadedTypes = this.types.asReadonly();

  constructor() {
    this.loadPokemons().subscribe({
      next: (data) => {
        this.pokemons.set(data.data);
      },
      error: (err) => {
        console.error('Error loading pokemons:', err);
      },
    });

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

  private loadPokemons(limit: number = 10) {
    return this.httpClient.get<PokemonApiResponse<PokemonItemFields[]>>(
      `${baseUrl}/cards?pageSize=${limit}&select=name,id,images,supertype,subtypes,types`,
      {
        headers: this.headers,
      }
    );
  }

  loadPokemonById(id: string) {
    this.httpClient
      .get<PokemonApiResponse<PokemonDetails>>(`${baseUrl}/cards/${id}`, {
        headers: this.headers,
      })
      .subscribe({
        next: (data) => {
          this.pokemonDetails.set(data.data);
        },
      });
  }

  private loadFilters() {
    return this.httpClient.get<PokemonApiFilterResponse>(`${baseUrl}/types`, {
      headers: this.headers,
    });
  }
}
