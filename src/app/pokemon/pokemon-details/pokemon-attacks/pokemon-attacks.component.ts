import { Component, input } from '@angular/core';
import { PokemonDetails } from '../../pokemon.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-pokemon-attacks',
  standalone: true,
  imports: [MatTooltipModule],
  templateUrl: './pokemon-attacks.component.html',
  styleUrl: './pokemon-attacks.component.scss',
})
export class PokemonAttacksComponent {
  readonly attacks = input.required<PokemonDetails['attacks']>();
  readonly defaultValue = input<string>('N/A');
}
