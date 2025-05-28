import { afterNextRender, Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { PokemonFilterComponent } from './pokemon/pokemon-filter/pokemon-filter.component';
import { PokemonPaginatorComponent } from './pokemon/pokemon-paginator/pokemon-paginator.component';
import { PokemonService } from './pokemon/pokemon.service';
import { PokemonFilterService } from './pokemon/pokemon-filter/pokemon-filter.service';
import { PokemonPaginatorService } from './pokemon/pokemon-paginator/pokemon-paginator.service';
import { filter, first, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatCardModule,
    PokemonListComponent,
    PokemonFilterComponent,
    PokemonPaginatorComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly pokemonService = inject(PokemonService);
  private readonly pokemonFilterService = inject(PokemonFilterService);
  private readonly pokemonPaginatorService = inject(PokemonPaginatorService);

  async ngOnInit() {
    // wait for url params to become available
    await firstValueFrom(
      this.router.events.pipe(
        filter((event) => event instanceof NavigationEnd),
        first()
      )
    );

    // safe to call restorePageFromUrl and restoreFiltersFromUrl
    await Promise.all([
      this.pokemonPaginatorService.restorePageFromUrl(),
      this.pokemonFilterService.restoreFiltersFromUrl(),
    ]);

    this.pokemonFilterService.loadFilters();

    const isFilterActive = this.pokemonFilterService.isFilterActive();

    console.log('Is filted active: ', isFilterActive);
    if (isFilterActive) {
      // all pokemon data not needed
      this.pokemonService.disableLoading();

      // fetch filtered pokemons
      this.pokemonFilterService.filterBy(
        this.pokemonFilterService.getSelectedFilters(),
        this.pokemonPaginatorService.currentPagination.page - 1 // page index starts from 0
      );
    } else {
      // filtered data not needed
      this.pokemonFilterService.disableLoading();
      // fetch all pokemons
      this.pokemonService.fetchPokemons();
    }
  }
}
