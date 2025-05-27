import { Component, computed, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { PokemonService } from '../pokemon.service';
import { PokemonFilterService } from './pokemon-filter.service';

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
  pokemonFilterService = inject(PokemonFilterService);
  pokemonService = inject(PokemonService);
  typesControl = new FormControl<string[]>([]);

  options = computed(() =>
    this.pokemonFilterService
      .loadedTypes()
      .map((type) => ({ label: type, value: type }))
  );

  onSingleTypeChange(event: MatSelectChange) {
    const selected = event.value;
    this.pokemonFilterService.filterBy('types', [selected]);
  }
}
