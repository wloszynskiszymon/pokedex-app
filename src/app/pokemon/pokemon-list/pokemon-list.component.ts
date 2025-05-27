import { Component, inject, signal } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { PokemonItemFields } from '../pokemon.model';
import { PokemonItemComponent } from '../pokemon-item/pokemon-item.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [PokemonItemComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent {
  private pokemonService = inject(PokemonService);
  pokemons = signal<PokemonItemFields[]>([]);

  ngOnInit() {
    this.pokemonService.loadPokemons().subscribe({
      next: (data) => this.pokemons.set(data.data),
      error: (err) => console.error('Failed to fetch pokemons', err),
    });
  }
}
