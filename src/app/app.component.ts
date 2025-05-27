import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { PokemonListComponent } from './pokemon/pokemon-list/pokemon-list.component';
import { PokemonFilterComponent } from './pokemon/pokemon-filter/pokemon-filter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatCardModule,
    PokemonListComponent,
    PokemonFilterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
