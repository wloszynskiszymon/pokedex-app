import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  PokemonApiResponse,
  PokemonDetails,
  PokemonItemFields,
} from './pokemon.model';
import { environment } from '../../environments/environment';
import { baseUrl, pokemonsPerPage } from '../app.config';

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
  private pokemonsLoading = signal<boolean>(true);

  loadedPokemons = this.pokemons.asReadonly();
  loadedPokemonDetails = this.pokemonDetails.asReadonly();
  isLoadingPokemons = this.pokemonsLoading.asReadonly();

  constructor() {
    this.loadPokemons().subscribe({
      next: (data) => {
        this.pokemons.set(data.data);
        this.pokemonsLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading pokemons:', err);
      },
    });
  }

  private loadPokemons(limit: number = pokemonsPerPage) {
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
