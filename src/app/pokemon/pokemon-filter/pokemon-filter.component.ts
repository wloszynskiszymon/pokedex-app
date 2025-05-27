import { Component, computed, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PokemonFilterService } from './pokemon-filter.service';
import { MatButton } from '@angular/material/button';
import { PokemonPaginatorService } from '../pokemon-paginator/pokemon-paginator.service';
import { PokemonService } from '../pokemon.service';

@Component({
  selector: 'app-pokemon-filter',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
  ],
  templateUrl: './pokemon-filter.component.html',
  styleUrl: './pokemon-filter.component.scss',
})
export class PokemonFilterComponent {
  private readonly pokemonService = inject(PokemonService);
  private readonly pokemonFilterService = inject(PokemonFilterService);
  private readonly pokemonPaginatorService = inject(PokemonPaginatorService);

  typesControl = new FormControl<string | null>(null);
  subtypesControl = new FormControl<string | null>(null);
  supertypesControl = new FormControl<string | null>(null);

  types = computed(() => [
    { label: '-----', value: null },
    ...this.pokemonFilterService
      .loadedTypes()
      .map((type) => ({ label: type, value: type })),
  ]);

  subtypes = computed(() => [
    { label: '-----', value: null },
    ...this.pokemonFilterService
      .loadedSubtypes()
      .map((type) => ({ label: type, value: type })),
  ]);

  supertypes = computed(() => [
    { label: '-----', value: null },
    ...this.pokemonFilterService
      .loadedSupertypes()
      .map((type) => ({ label: type, value: type })),
  ]);

  onSingleTypeChange() {
    const types = this.typesControl.value ? [this.typesControl.value] : [];
    const subtypes = this.subtypesControl.value
      ? [this.subtypesControl.value]
      : [];
    const supertypes = this.supertypesControl.value
      ? [this.supertypesControl.value]
      : [];

    this.pokemonPaginatorService.reset(0);

    this.pokemonFilterService.filterBy({
      types,
      subtypes,
      supertypes,
    });
  }

  onReset() {
    this.typesControl.setValue(null);
    this.subtypesControl.setValue(null);
    this.supertypesControl.setValue(null);
    this.pokemonFilterService.reset();
    this.pokemonPaginatorService.reset(this.pokemonService.totalCount());
  }
}
