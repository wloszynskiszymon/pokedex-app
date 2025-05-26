import { Component, input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { SelectedPokemonFields } from '../pokemon.model';

@Component({
  selector: 'app-pokemon-item',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './pokemon-item.component.html',
  styleUrl: './pokemon-item.component.scss',
})
export class PokemonItemComponent {
  readonly pokemon = input.required<SelectedPokemonFields>();

  ngOnInit() {
    console.log(
      'PokemonItemComponent initialized with pokemon:',
      this.pokemon()
    );
  }
}
