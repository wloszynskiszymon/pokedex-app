import { Component, computed, inject } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.scss',
})
export class PokemonDetailsComponent {
  pokemonService = inject(PokemonService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  pokemon = computed(() => {
    console.log(this.pokemonService.loadedPokemonDetails());
    return this.pokemonService.loadedPokemonDetails();
  });

  similarPokemons = computed(() => {
    return this.pokemonService.loadedSimilarPokemons();
  });

  defaultValue = 'N/A';

  ngOnInit() {
    this.route.params
      .pipe(
        filter((params) => !!params['id']),
        switchMap((params) =>
          this.pokemonService.loadPokemonById(params['id']).pipe(
            switchMap(({ data }) => {
              if (!data?.set) {
                throw new Error(
                  `No Pokemon set found in ngOnInit for ID: ${params['id']}`
                );
              }
              return this.pokemonService.loadSimilarPokemons$(
                data.set,
                data.id
              );
            })
          )
        )
      )
      .subscribe({
        error: (err) => {
          console.error(
            'Failed to load pokemon details or similar pokemons',
            err
          );
        },
        next: (data) => {
          console.log(
            'Pokemon details and similar pokemons loaded successfully'
          );
          console.log(data);
        },
      });
  }

  normalizeToUnit(
    value: number | string | null | undefined,
    max: number = 100
  ): number {
    if (value === null || value === undefined) return 0;
    const num = Math.abs(+value); // take absolute value
    if (isNaN(num)) return 0;
    return Math.max(0, Math.min(1, num / max));
  }

  navigateToThisPokemon(pokemonId: string) {
    this.router.navigate(['../', pokemonId], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve',
    });
  }
}
