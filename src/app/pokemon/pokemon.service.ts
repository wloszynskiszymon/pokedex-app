import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, computed } from '@angular/core';
import {
  EditedPokemon,
  PokemonApiResponse,
  PokemonDetails,
  PokemonItemFields,
} from './pokemon.model';
import { PokemonPaginatorService } from './pokemon-paginator/pokemon-paginator.service';
import { Observable, tap } from 'rxjs';
import { preparePokemonApiUrl } from './pokemon.api';
import { API_SELECTS } from './pokemon.constants';
import { updatePokemons } from './pokemon.helpers';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  // services
  private http = inject(HttpClient);
  private paginator = inject(PokemonPaginatorService);

  // data
  private _allPokemonsApiResponse = signal<PokemonApiResponse<
    PokemonItemFields[]
  > | null>(null);
  private _pokemonDetails = signal<PokemonDetails | undefined>(undefined);
  private _pokemonsSimilar = signal<PokemonItemFields[]>([]);

  // loading states
  private _isLoadingAllPokemons = signal<boolean>(true);
  private _isLoadingPokemonDetails = signal<boolean>(false);
  private _isLoadingAllPokemonsSimilar = signal<boolean>(true);

  // public readonly signals
  readonly allPokemonsApiResponse = this._allPokemonsApiResponse.asReadonly();
  readonly allPokemons = computed(
    () => this._allPokemonsApiResponse()?.data ?? []
  );
  readonly similarPokemons = this._pokemonsSimilar.asReadonly();
  readonly pokemonDetails = this._pokemonDetails.asReadonly();

  readonly isLoadingAllPokemons = this._isLoadingAllPokemons.asReadonly();
  readonly isLoadingSimilarPokemons =
    this._isLoadingAllPokemonsSimilar.asReadonly();
  readonly isLoadingPokemonDetails = this._isLoadingPokemonDetails.asReadonly();

  readonly allPokemonsTotalCount = computed(
    () => this._allPokemonsApiResponse()?.totalCount ?? 0
  );

  // fetch all pokemons (no filters)
  fetchAllPokemons(page: number = 1) {
    console.log(`fetchPokemons(${page})`);
    this._isLoadingAllPokemons.set(true);

    if (!localStorage) throw new Error('LocalStorage is not available');

    const url = preparePokemonApiUrl({
      route: '/cards',
      page,
      select: API_SELECTS.pokemonItem,
    });

    this.http.get<PokemonApiResponse<PokemonItemFields[]>>(url).subscribe({
      next: (response) => {
        this._allPokemonsApiResponse.set(response);
        this.paginator.setCurrentPage(response.page ?? 1);
        this.paginator.setTotalCount(response.totalCount ?? 0);
        this._isLoadingAllPokemons.set(false);
      },
      error: (e) => {
        this._isLoadingAllPokemons.set(false);
        console.error(e);
      },
    });
  }

  // load pokemon details by ID
  fetchPokemonById$(
    id: string
  ): Observable<PokemonApiResponse<PokemonDetails>> {
    this._isLoadingPokemonDetails.set(true);
    const url = preparePokemonApiUrl({
      route: `/cards/${id}`,
      select: API_SELECTS.pokemonDetails,
    });

    return this.http.get<PokemonApiResponse<PokemonDetails>>(url).pipe(
      tap((data) => {
        this._pokemonDetails.set(data.data);
        this._isLoadingPokemonDetails.set(false);
      })
    );
  }

  // fetch similar pokemons for pokemon details page
  fetchSimilarPokemons$(
    pokemonSet: PokemonDetails['set'],
    excludeId: string
  ): Observable<PokemonApiResponse<PokemonItemFields[]>> {
    console.log(`loadSimilarPokemons(${pokemonSet.name})`);
    this._isLoadingAllPokemonsSimilar.set(true);

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
        this._pokemonsSimilar.set(response.data ?? []);
        this._isLoadingAllPokemonsSimilar.set(false);
      })
    );
  }

  // disables loading state for all pokemons
  disableAllPokemonsLoading() {
    console.log('disableLoading()');
    this._isLoadingAllPokemons.set(false);
  }

  // updates the pokemon details with data from local storage
  updatePokemonDetails(pokemon: PokemonItemFields[]) {
    this._pokemonDetails.set({
      ...this._pokemonDetails()!,
      ...pokemon,
    });
  }

  // updates all pokemons with data from local storage
  updateAllPokemons(pokemon: EditedPokemon) {
    if (!this._allPokemonsApiResponse()?.data) return;
    const updated = updatePokemons(this._allPokemonsApiResponse()!.data, [
      pokemon,
    ]);

    this._allPokemonsApiResponse.set({
      ...this._allPokemonsApiResponse()!,
      data: updated,
    });
    this.updatePokemonDetails(updated);
  }
}
