import { Component, computed, inject } from '@angular/core';
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
import { PokemonEditable } from '../pokemon.model';
import { PokemonPaginatorService } from '../pokemon-paginator/pokemon-paginator.service';
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

  pokemon = computed(() => {
    const edittedPokemon = getEditedPokemonsFromLocalStorage();
    if (!edittedPokemon) return this.pokemonService.loadedPokemonDetails();
    const pokemon = this.pokemonService.loadedPokemonDetails();
    const foundPokemon = edittedPokemon.find(
      (p) => p.updatedData.id === pokemon?.id
    );
    return {
      ...pokemon,
      ...foundPokemon?.updatedData,
    };
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
