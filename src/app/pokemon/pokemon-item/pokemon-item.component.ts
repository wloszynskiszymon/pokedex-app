import { Component, inject, input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { PokemonItemFields } from '../pokemon.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-item',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './pokemon-item.component.html',
  styleUrl: './pokemon-item.component.scss',
})
export class PokemonItemComponent implements OnInit {
  readonly pokemon = input.required<PokemonItemFields>();
  readonly router = inject(Router);

  ngOnInit() {
    console.log(
      'PokemonItemComponent initialized with pokemon:',
      this.pokemon()
    );
  }

  onClick(id: string) {
    this.router.navigate(['/pokemon', id]);
  }
}
