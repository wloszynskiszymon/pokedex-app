import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-pokemon-item-skeleton',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './pokemon-item-skeleton.component.html',
  styleUrl: './pokemon-item-skeleton.component.scss',
})
export class PokemonItemSkeletonComponent {}
