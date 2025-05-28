import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import {
  PokemonApiResponse,
  PokemonDetails,
  PokemonItemFields,
} from './pokemon.model';
import { baseUrl, pokemonsPerPage } from '../app.config';
import { PokemonPaginatorService } from './pokemon-paginator/pokemon-paginator.service';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private http = inject(HttpClient);
  private paginator = inject(PokemonPaginatorService);

  private pokemonApiResponse = signal<PokemonApiResponse<
    PokemonItemFields[]
  > | null>(null);
  private pokemonDetails = signal<PokemonDetails | undefined>(undefined);
  private pokemonsLoading = signal<boolean>(true);

  readonly loadedApiResponse = this.pokemonApiResponse.asReadonly();
  readonly loadedPokemons = computed(
    () => this.pokemonApiResponse()?.data ?? []
  );
  readonly loadedPokemonDetails = this.pokemonDetails.asReadonly();
  readonly isLoadingPokemons = this.pokemonsLoading.asReadonly();
  readonly totalCount = computed(
    () => this.pokemonApiResponse()?.totalCount ?? 0
  );

  fetchPokemons(page: number = 0, limit: number = pokemonsPerPage) {
    this.pokemonsLoading.set(true);

    const params = new URLSearchParams({
      page: (page + 1).toString(),
      pageSize: limit.toString(),
      select:
        'name,id,supertype,subtypes,types,hp,rarity,evolvesFrom,number,set',
    });

    this.http
      .get<PokemonApiResponse<PokemonItemFields[]>>(
        `${baseUrl}/cards?${params.toString()}`
      )
      .subscribe({
        next: (response) => {
          this.pokemonApiResponse.set(response);
          this.updatePagination(page, response.totalCount ?? 0);
          this.pokemonsLoading.set(false);
          console.log('Pokemons loaded:', response.data);
        },
        error: () => this.pokemonsLoading.set(false),
      });
  }

  loadPokemonById(id: string) {
    this.http
      .get<PokemonApiResponse<PokemonDetails>>(`${baseUrl}/cards/${id}`)
      .subscribe({
        next: ({ data }) => this.pokemonDetails.set(data),
        error: (err) => console.error('Error loading pokemon:', err),
      });
  }

  private updatePagination(page: number, totalCount: number) {
    this.paginator.setPage(page);
    this.paginator.setTotalCount(totalCount);
    this.paginator.setPageSize(pokemonsPerPage);
  }
}
