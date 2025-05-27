import { Routes } from '@angular/router';
import { PokemonDetailsComponent } from './pokemon/pokemon-details/pokemon-details.component';

export const routes: Routes = [
  {
    component: PokemonDetailsComponent,
    path: 'pokemon/:id',
  },
];
