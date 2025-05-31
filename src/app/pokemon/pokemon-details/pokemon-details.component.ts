import { Component, computed, inject } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { PokemonEditFormComponent } from './pokemon-edit-form/pokemon-edit-form.component';
import { MatDialog } from '@angular/material/dialog';
import { PokemonAttacksComponent } from './pokemon-attacks/pokemon-attacks.component';
import { ThermometerComponent } from '../../ui/thermometer/thermometer.component';
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
  pokemonService = inject(PokemonService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  dialog = inject(MatDialog);

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

  navigateToThisPokemon(pokemonId: string) {
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
