import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PokemonItemFields } from '../../pokemon.model';

@Component({
  selector: 'app-pokemon-item',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './pokemon-item.component.html',
  styleUrl: './pokemon-item.component.scss',
})
export class PokemonItemComponent {
  readonly pokemon = input.required<PokemonItemFields>();
}
