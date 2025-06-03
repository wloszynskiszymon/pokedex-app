import { Component, computed, inject, signal } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { PokemonFilterService } from '../pokemon-filter/pokemon-filter.service';
import { PokemonItemSkeletonComponent } from './pokemon-item/pokemon-item-skeleton/pokemon-item-skeleton.component';
import { PokemonItemComponent } from './pokemon-item/pokemon-item.component';
import { pokemonsPerPage } from '../../app.config';
import { Router } from '@angular/router';
import { getEditedPokemonsFromLocalStorage } from '../pokemon.localstorage';
import { filterEditedPokemons } from '../pokemon.helpers';
import { PokemonItemFields } from '../pokemon.model';
import { PokemonPaginatorService } from '../pokemon-paginator/pokemon-paginator.service';

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
  private pokemonPaginatorService = inject(PokemonPaginatorService);

  pageSize = new Array(pokemonsPerPage);
  selectedPokemonId = computed(() =>
    this.pokemonPaginatorService.selectedPokemonId()
  );

  isLoading = computed(() => {
    return (
      this.pokemonService.isLoadingAllPokemons() ||
      this.pokemonFilterService.isLoadingFilteredPokemons()
    );
  });

  // if any value is selected in the filter, return filtered pokemons
  pokemons = computed(() => {
    if (this.pokemonFilterService.areFiltersActive()) {
      const filtered = this.pokemonFilterService.filteredPokemons();
      if (filtered.length === 0) return [];
      return this.includeEditedPokemons(filtered);
    }

    const allPokemons = this.pokemonService.allPokemons();
    if (allPokemons.length === 0) return [];
    return this.includeEditedPokemons(allPokemons);
  });

  onPokemonItemClick(id: string) {
    this.pokemonPaginatorService.setSelectedPokemonId(id);
    this.router.navigate(['/pokemon', id], {
      queryParamsHandling: 'preserve',
    });
  }

  private includeEditedPokemons = (
    pokemons: PokemonItemFields[]
  ): PokemonItemFields[] => {
    const selectedType = this.pokemonFilterService.selectedType();
    const selectedSubtype = this.pokemonFilterService.selectedSubtype();
    const selectedSupertype = this.pokemonFilterService.selectedSupertype();

    const editedPokemons = getEditedPokemonsFromLocalStorage();
    const { includedPokemons } = filterEditedPokemons(editedPokemons, {
      type: selectedType,
      subtype: selectedSubtype,
      supertype: selectedSupertype || undefined,
    });

    if (!includedPokemons || includedPokemons.length === 0) {
      return pokemons; // no edited pokemons to include
    }

    // replace original pokemons in the list with the editted pokemons
    return pokemons.map((pokemon) => {
      const editedPokemon = includedPokemons.find((ep) => ep.id === pokemon.id);
      if (editedPokemon) {
        return {
          ...pokemon,
          types: editedPokemon.types,
          subtypes: editedPokemon.subtypes,
          supertype: editedPokemon.supertype,
          hp: editedPokemon.hp + '',
          _updatedAt: editedPokemon._updatedAt,
        };
      }
      return pokemon;
    });
  };
}
