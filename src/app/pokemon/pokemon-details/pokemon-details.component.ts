import { Component, computed, inject, signal } from '@angular/core';
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
  route = inject(ActivatedRoute);
  pokemon = computed(() => this.pokemonService.loadedPokemonDetails());

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (!id) {
        console.error('No Pokemon ID found in route');
        return;
      }

      this.pokemonService.loadPokemonById(id);
    });
  }
}
