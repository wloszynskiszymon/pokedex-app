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

  typesControl = new FormControl<string | null>(null);
  subtypesControl = new FormControl<string | null>(null);
  supertypesControl = new FormControl<string | null>(null);

  types = computed(() =>
    this.pokemonFilterService
      .loadedTypes()
      .map((type) => ({ label: type, value: type }))
  );

  subtypes = computed(() =>
    this.pokemonFilterService
      .loadedSubtypes()
      .map((type) => ({ label: type, value: type }))
  );

  supertypes = computed(() =>
    this.pokemonFilterService
      .loadedSupertypes()
      .map((type) => ({ label: type, value: type }))
  );

  onSingleTypeChange() {
    const types = this.typesControl.value ? [this.typesControl.value] : [];
    const subtypes = this.subtypesControl.value
      ? [this.subtypesControl.value]
      : [];
    const supertypes = this.supertypesControl.value
      ? [this.supertypesControl.value]
      : [];

    this.pokemonFilterService.filterBy({
      types,
      subtypes,
      supertypes,
    });
  }
}
