import { Component, computed, inject, signal } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { PokemonFilterService } from '../pokemon-filter/pokemon-filter.service';
import { PokemonItemSkeletonComponent } from './pokemon-item/pokemon-item-skeleton/pokemon-item-skeleton.component';
import { PokemonItemComponent } from './pokemon-item/pokemon-item.component';
import { pokemonsPerPage } from '../../app.config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [PokemonItemComponent, PokemonItemSkeletonComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent {
  readonly router = inject(Router);

  private pokemonService = inject(PokemonService);
  private pokemonFilterService = inject(PokemonFilterService);

  pageSize = new Array(pokemonsPerPage);
  selectedPokemonId = signal<string | null>(null);

  isLoading = computed(() => {
    return (
      this.pokemonService.isLoadingPokemons() ||
      this.pokemonFilterService.isLoadingFilteredPokemons()
    );
  });

  // if any value is selected in the filter, return filtered pokemons
  pokemons = computed(() => {
    console.log(
      `pokemons() - isFilterActive: ${this.pokemonFilterService.isFilterActive()}`
    );

    if (this.pokemonFilterService.isFilterActive()) {
      const filtered = this.pokemonFilterService.loadedFilteredPokemons();
      console.log(filtered);
      return filtered.length > 0 ? filtered : [];
    }

    return this.pokemonService.loadedPokemons();
  });

  onPokemonItemClick(id: string) {
    this.selectedPokemonId.set(id);
    this.router.navigate(['/pokemon', id], {
      queryParamsHandling: 'preserve',
    });
  }
}
