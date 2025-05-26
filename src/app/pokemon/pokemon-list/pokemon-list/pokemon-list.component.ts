import { Component, DestroyRef, inject, signal } from '@angular/core';
import { PokemonService } from '../../pokemon.service';
import { SelectedPokemonFields } from '../../pokemon.model';
import { PokemonItemComponent } from '../../pokemon-item/pokemon-item.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [PokemonItemComponent],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss',
})
export class PokemonListComponent {
  private destroyRef = inject(DestroyRef);
  pokemonService = inject(PokemonService);
  pokemons = signal<SelectedPokemonFields[]>([]);

  ngOnInit() {
    const subscription = this.pokemonService.loadPokemons().subscribe({
      next: (data) => {
        console.log('Loaded pokemons:', data);
        this.pokemons.set(data.data);
      },
      error: (err) => {
        console.error('Failed to load places:', err);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
