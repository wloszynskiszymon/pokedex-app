import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import {
  PokemonApiResponse,
  PokemonDetails,
  PokemonItemFields,
} from './pokemon.model';
import { environment } from '../../environments/environment';
import { baseUrl, pokemonsPerPage } from '../app.config';
import { PokemonPaginatorService } from './pokemon-paginator/pokemon-paginator.service';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private httpClient = inject(HttpClient);
  private paginator = inject(PokemonPaginatorService);

  private headers = new HttpHeaders({
    'X-Api-Key': environment.apiKey || '',
  });

  private pokemonApiResponse = signal<PokemonApiResponse<
    PokemonItemFields[]
  > | null>(null);
  private pokemonDetails = signal<PokemonDetails | undefined>(undefined);
  private pokemonsLoading = signal<boolean>(true);

  // Expose relevant data
  loadedApiResponse = this.pokemonApiResponse.asReadonly();
  loadedPokemons = computed(() => this.pokemonApiResponse()?.data ?? []);
  loadedPokemonDetails = this.pokemonDetails.asReadonly();
  isLoadingPokemons = this.pokemonsLoading.asReadonly();
  totalCount = computed(() => this.pokemonApiResponse()?.totalCount ?? 0);

  constructor() {
    const { page, pageSize } = this.paginator.currentPagination;
    this.fetchPokemons(page, pageSize);
  }

  fetchPokemons(page: number = 0, limit: number = pokemonsPerPage) {
    this.pokemonsLoading.set(true);

    this.httpClient
      .get<PokemonApiResponse<PokemonItemFields[]>>(
        `${baseUrl}/cards?page=${
          page + 1
        }&pageSize=${limit}&select=name,id,images,supertype,subtypes,types`,
        { headers: this.headers }
      )
      .subscribe({
        next: (response) => {
          this.pokemonApiResponse.set(response);
          this.paginator.setTotalCount(response.totalCount ?? 0);
          this.paginator.setPage(page);
          this.paginator.setPageSize(limit);
          this.pokemonsLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading pokemons:', err);
          this.pokemonsLoading.set(false);
        },
      });
  }

  loadPokemonById(id: string) {
    this.httpClient
      .get<PokemonApiResponse<PokemonDetails>>(`${baseUrl}/cards/${id}`, {
        headers: this.headers,
      })
      .subscribe({
        next: (response) => {
          this.pokemonDetails.set(response.data);
        },
        error: (err) => {
          console.error('Error loading pokemon by id:', err);
        },
      });
  }
}
