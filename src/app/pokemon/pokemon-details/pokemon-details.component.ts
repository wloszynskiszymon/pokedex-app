import { Component, computed, inject, signal } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { PokemonEditFormComponent } from './pokemon-edit-form/pokemon-edit-form.component';
import { MatDialog } from '@angular/material/dialog';
import { PokemonAttacksComponent } from './pokemon-attacks/pokemon-attacks.component';
import { ThermometerComponent } from '../../ui/thermometer/thermometer.component';
import { getEditedPokemonsFromLocalStorage } from '../pokemon.localstorage';
import { PokemonPaginatorService } from '../pokemon-paginator/pokemon-paginator.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [
    MatTooltipModule,
    MatButtonModule,
    PokemonAttacksComponent,
    ThermometerComponent,
  ],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.scss',
})
export class PokemonDetailsComponent {
  private pokemonService = inject(PokemonService);
  private pokemonPaginator = inject(PokemonPaginatorService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  pokemonLoading = computed(() => {
    const detailsLoading = this.pokemonService.isLoadingPokemonDetails();
    const similarLoading = this.pokemonService.isLoadingSimilarPokemons();
    return detailsLoading || similarLoading;
  });

  pokemonError = signal<{ status: number; message: string } | undefined>(
    undefined
  );

  pokemon = computed(() => {
    const edittedPokemon = getEditedPokemonsFromLocalStorage();
    if (!edittedPokemon) return this.pokemonService.pokemonDetails();
    const pokemon = this.pokemonService.pokemonDetails();
    const foundPokemon = edittedPokemon.find(
      (p) => p.updatedData.id === pokemon?.id
    );
    return {
      ...pokemon,
      ...foundPokemon?.updatedData,
    };
  });

  similarPokemons = computed(() => {
    return this.pokemonService.similarPokemons();
  });

  defaultValue = 'N/A';

  ngOnInit() {
    this.route.params
      .pipe(
        filter((params) => !!params['id']),
        switchMap((params) =>
          this.pokemonService.fetchPokemonById$(params['id']).pipe(
            switchMap(({ data }) => {
              if (!data?.set) {
                throw new Error(
                  `No Pokemon set found in ngOnInit for ID: ${params['id']}`
                );
              }
              return this.pokemonService.fetchSimilarPokemons$(
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
          const pokemonError = err as HttpErrorResponse;

          if (pokemonError.status === 404) {
            this.pokemonError.set({
              status: pokemonError.status,
              message: `Pokemon with this ID not found.`,
            });
          } else {
            this.pokemonError.set({
              status: pokemonError.status,
              message: pokemonError.message,
            });
          }
        },
        next: (data) => {
          console.log(
            'Pokemon details and similar pokemons loaded successfully'
          );
          console.log(data);
        },
      });
  }

  navigateToThisPokemon(pokemonId: string) {
    this.pokemonPaginator.setSelectedPokemonId(pokemonId);
    this.router.navigate(['../', pokemonId], {
      relativeTo: this.route,
      queryParamsHandling: 'preserve',
    });
  }

  openEditDialog() {
    this.dialog.open(PokemonEditFormComponent, {
      data: this.pokemon(),
    });
  }
}
