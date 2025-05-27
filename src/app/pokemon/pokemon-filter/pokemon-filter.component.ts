import { Component, computed, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-pokemon-filter',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './pokemon-filter.component.html',
  styleUrl: './pokemon-filter.component.scss',
})
export class PokemonFilterComponent {
  pokemonService = inject(PokemonService);
  typesControl = new FormControl('');
  typesList = computed(() => this.pokemonService.loadedTypes());
}
