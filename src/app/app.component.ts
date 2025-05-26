import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonService } from './pokemon/pokemon.service';
import { MatCardModule } from '@angular/material/card';
import { Pokemon } from './pokemon/pokemon.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  pokemonService = inject(PokemonService);
  pokemons = signal<Pokemon[]>([]);

  ngOnInit() {
    const subscription = this.pokemonService.loadPokemons().subscribe({
      next: (data) => {
        this.pokemons.set(data);
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
