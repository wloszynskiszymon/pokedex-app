import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { PokemonService } from '../pokemon.service';
import { PokemonDetails } from '../pokemon.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.scss',
})
export class PokemonDetailsComponent {
  pokemonService = inject(PokemonService);
  activatedRoute = inject(ActivatedRoute);
  pokemon = signal<PokemonDetails | undefined>(undefined);

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const id = params['id'];
      if (!id) {
        console.error('No Pokemon ID found in route');
        return;
      }

      this.pokemonService.loadPokemonById(id).subscribe({
        next: (data) => this.pokemon.set(data.data),
        error: (err) => console.error('Failed to fetch pokemon details', err),
      });
    });
  }
}
