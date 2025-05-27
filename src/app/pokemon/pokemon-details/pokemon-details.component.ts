import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { PokemonService } from '../pokemon.service';
import { TODO } from '../pokemon.model';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.scss',
})
export class PokemonDetailsComponent {
  pokemonService = inject(PokemonService);
  pokemon = signal<TODO | undefined>(undefined);
}
