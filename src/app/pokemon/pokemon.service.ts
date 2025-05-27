import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
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

  private pokemons = signal<PokemonItemFields[]>([]);
  private pokemonDetails = signal<PokemonDetails | undefined>(undefined);

  loadedPokemons = this.pokemons.asReadonly();
  loadedPokemonDetails = this.pokemonDetails.asReadonly();

  // if api key is provided - could be set as interceptor later
  private headers = new HttpHeaders({
    'X-Api-Key': environment.apiKey || '',
  });

  constructor() {
    if (this.loadedPokemons.length !== 0) return;

    console.log('PokemonService initialized, loading pokemons...');
    this.loadPokemons().subscribe({
      next: (data) => {
        this.pokemons.set(data.data);
      },
      error: (err) => {
        console.error('Error loading pokemons:', err);
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
}
