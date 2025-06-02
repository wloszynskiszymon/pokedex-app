import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import {
  EditedPokemon,
  PokemonApiResponse,
  PokemonDetails,
  PokemonItemFields,
} from './pokemon.model';
import { PokemonPaginatorService } from './pokemon-paginator/pokemon-paginator.service';
import { catchError, Observable, of, tap } from 'rxjs';
import { preparePokemonApiUrl } from './pokemon.api';
import { API_SELECTS } from './pokemon.constants';
import { updatePokemons } from './pokemon.helpers';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private http = inject(HttpClient);
  private paginator = inject(PokemonPaginatorService);

  private pokemonApiResponse = signal<PokemonApiResponse<
    PokemonItemFields[]
  > | null>(null);
  private pokemonDetails = signal<PokemonDetails | undefined>(undefined);
  private pokemonsLoading = signal<boolean>(true);
  private pokemonsDetailsLoading = signal<boolean>(false);
  private pokemonsSimilarLoading = signal<boolean>(true);
  private pokemonsSimilar = signal<PokemonItemFields[]>([]);

  readonly loadedApiResponse = this.pokemonApiResponse.asReadonly();
  readonly loadedPokemons = computed(
    () => this.pokemonApiResponse()?.data ?? []
  );
  readonly loadedSimilarPokemons = this.pokemonsSimilar.asReadonly();
  readonly loadedPokemonDetails = this.pokemonDetails.asReadonly();
  readonly isLoadingPokemons = this.pokemonsLoading.asReadonly();
  readonly isLoadingSimilarPokemons = this.pokemonsSimilarLoading.asReadonly();
  readonly isLoadingPokemonDetails = this.pokemonsDetailsLoading.asReadonly();
  readonly totalCount = computed(
    () => this.pokemonApiResponse()?.totalCount ?? 0
  );

  fetchPokemons(page: number = 1) {
    console.log(`fetchPokemons(${page})`);
    this.pokemonsLoading.set(true);

    if (!localStorage) throw new Error('LocalStorage is not available');

    const url = preparePokemonApiUrl({
      route: '/cards',
      page,
      select: API_SELECTS.pokemonItem,
    });

    this.http.get<PokemonApiResponse<PokemonItemFields[]>>(url).subscribe({
      next: (response) => {
        this.pokemonApiResponse.set(response);
        this.paginator.setPage(response.page ?? 1);
        this.paginator.setTotalCount(response.totalCount ?? 0);
        this.pokemonsLoading.set(false);
      },
      error: (e) => {
        this.pokemonsLoading.set(false);
        console.error(e);
      },
    });
  }

  loadPokemonById(id: string): Observable<PokemonApiResponse<PokemonDetails>> {
    this.pokemonsDetailsLoading.set(true);
    const url = preparePokemonApiUrl({
      route: `/cards/${id}`,
      select: API_SELECTS.pokemonDetails,
    });

    return this.http.get<PokemonApiResponse<PokemonDetails>>(url).pipe(
      tap((data) => {
        this.pokemonDetails.set(data.data);
        this.pokemonsDetailsLoading.set(false);
      })
    );
  }

  loadSimilarPokemons$(
    pokemonSet: PokemonDetails['set'],
    excludeId: string
  ): Observable<PokemonApiResponse<PokemonItemFields[]>> {
    console.log(`loadSimilarPokemons(${pokemonSet.name})`);
    this.pokemonsSimilarLoading.set(true);

    const query = `set.series:"${pokemonSet.series}" AND -id:${excludeId}`;
    const url = preparePokemonApiUrl({
      route: '/cards',
      overriddenQuery: query,
      page: 1,
      select: API_SELECTS.pokemonSimilar,
    });

    console.log(url);
    return this.http.get<PokemonApiResponse<PokemonItemFields[]>>(url).pipe(
      tap((response) => {
        this.pokemonsSimilar.set(response.data ?? []);
        this.pokemonsSimilarLoading.set(false);
      })
    );
  }

  disableLoading() {
    console.log('disableLoading()');
    this.pokemonsLoading.set(false);
  }

  updatePokemonDetails(pokemon: PokemonItemFields[]) {
    this.pokemonDetails.set({
      ...this.pokemonDetails()!,
      ...pokemon,
    });
  }

  updatePokemons(pokemon: EditedPokemon) {
    if (!this.pokemonApiResponse()?.data) return;
    const updated = updatePokemons(this.pokemonApiResponse()!.data, [pokemon]);

    this.pokemonApiResponse.set({
      ...this.pokemonApiResponse()!,
      data: updated,
    });
    this.updatePokemonDetails(updated);
  }
}
