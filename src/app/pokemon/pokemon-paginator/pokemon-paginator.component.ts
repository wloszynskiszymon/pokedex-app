import { Component, inject, computed } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PokemonService } from '../pokemon.service';
import { PokemonPaginatorService } from './pokemon-paginator.service';
import { PokemonFilterService } from '../pokemon-filter/pokemon-filter.service';

@Component({
  selector: 'app-pokemon-paginator',
  standalone: true,
  imports: [MatPaginatorModule, MatCardModule],
  templateUrl: './pokemon-paginator.component.html',
  styleUrl: './pokemon-paginator.component.scss',
})
export class PokemonPaginatorComponent {
  private pokemonService = inject(PokemonService);
  private pokemonPaginatorService = inject(PokemonPaginatorService);
  private pokemonFilterService = inject(PokemonFilterService);

  totalLength = computed(() => this.pokemonPaginatorService.totalCount$());
  pageSize = computed(() => this.pokemonPaginatorService.pageSize$());
  currentPage = computed(() => this.pokemonPaginatorService.currentPage$() - 1);

  isLoading = computed(
    () =>
      this.pokemonFilterService.isLoadingFilteredPokemons() ||
      this.pokemonService.isLoadingPokemons()
  );

  onPageChange(event: PageEvent) {
    if (this.pokemonFilterService.isFilterActive()) {
      this.pokemonFilterService.filterBy(
        this.pokemonFilterService.getSelectedFilters(),
        event.pageIndex
      );
    } else {
      this.pokemonService.fetchPokemons(event.pageIndex);
    }
    this.pokemonPaginatorService.updateUrlPageParam(event.pageIndex + 1);
  }
}
