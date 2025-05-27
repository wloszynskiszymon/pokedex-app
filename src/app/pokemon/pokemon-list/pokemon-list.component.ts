import { Component, computed, inject, signal } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { PokemonItemFields } from '../pokemon.model';
import { PokemonItemComponent } from '../pokemon-item/pokemon-item.component';
import { PokemonFilterService } from '../pokemon-filter/pokemon-filter.service';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [PokemonItemComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent {
  private pokemonService = inject(PokemonService);
  private pokemonFilterService = inject(PokemonFilterService);

  // if any value is selected in the filter, return filtered pokemons
  pokemons = computed(() => {
    if (!this.pokemonFilterService.isFilterActive()) {
      return this.pokemonService.loadedPokemons();
    }

    const filtered = this.pokemonFilterService.loadedFilteredPokemons();
    return filtered.length > 0 ? filtered : [];
  });
}
