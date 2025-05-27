import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PokemonApiResponse, PokemonItemFields } from './pokemon.model';
import { environment } from '../../environments/environment';

// could be extracted as environment variable later
const baseUrl = 'https://api.pokemontcg.io/v2';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private httpClient = inject(HttpClient);
  private headers = new HttpHeaders({
    // if api key is provided
    'X-Api-Key': environment.apiKey || '',
  });

  loadPokemons(limit: number = 10) {
    return this.httpClient.get<PokemonApiResponse<PokemonItemFields[]>>(
      `${baseUrl}/cards?pageSize=${limit}&select=name,id,images,supertype,subtypes,types`,
      {
        headers: this.headers,
      }
    );
  }

  loadPokemonById(id: string) {
    return this.httpClient.get<PokemonApiResponse<any>>(
      `${baseUrl}/cards/${id}`,
      {
        headers: this.headers,
      }
    );
  }
}
