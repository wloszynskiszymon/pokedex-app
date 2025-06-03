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

  totalLength = computed(() => this.pokemonPaginatorService.totalCount());
  pageSize = computed(() => this.pokemonPaginatorService.pageSize());
  currentPage = computed(() => {
    console.log('currentPage() - called');
    console.log(this.pokemonPaginatorService.currentPage());
    return this.pokemonPaginatorService.currentPage();
  });

  isLoading = computed(
    () =>
      this.pokemonFilterService.isLoadingFilteredPokemons() ||
      this.pokemonService.isLoadingAllPokemons()
  );

  // when no results or error
  shouldHide = computed(() => {
    const isFilterActive = this.pokemonFilterService.areFiltersActive();
    const isLoading = this.isLoading();
    const totalCount = this.pokemonPaginatorService.totalCount();
    const xd =
      (isFilterActive && !isLoading && totalCount === 0) ||
      (!isFilterActive && !isLoading && totalCount === 0);

    console.log('=========== shouldHide() ===========');
    console.log(xd);
    return (
      (isFilterActive && !isLoading && totalCount === 0) ||
      (!isFilterActive && !isLoading && totalCount === 0)
    );
  });

  onPageChange(event: PageEvent) {
    const page = event.pageIndex + 1; // material paginator uses 0-based index
    console.log(
      `onPageChange() - pageIndex: ${event.pageIndex}, pageSize: ${event.pageSize}`
    );
    if (this.pokemonFilterService.areFiltersActive()) {
      this.pokemonFilterService.filterBy(
        this.pokemonFilterService.getSelectedFilters(),
        page
      );
    } else {
      this.pokemonService.fetchAllPokemons(page);
    }
    this.pokemonPaginatorService.updateUrlPageParam(page);
  }
}
