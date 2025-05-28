import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { PokemonFilterComponent } from './pokemon/pokemon-filter/pokemon-filter.component';
import { PokemonPaginatorComponent } from './pokemon/pokemon-paginator/pokemon-paginator.component';
import { PokemonService } from './pokemon/pokemon.service';

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
  private readonly pokemonService = inject(PokemonService);

  ngOnInit() {
    this.pokemonService.fetchPokemons();
  }
}
