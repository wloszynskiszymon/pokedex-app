import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { PokemonResult } from './pokemon.model';
import { map } from 'rxjs';

// could be extracted as environment variable later
const baseUrl = 'https://pokeapi.co/api/v2';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private httpClient = inject(HttpClient);

  loadPokemons(limit: number = 10) {
    return this.httpClient
      .get<PokemonResult>(`${baseUrl}/pokemon?limit=${limit}`)
      .pipe(map((response) => response.results));
  }
}
