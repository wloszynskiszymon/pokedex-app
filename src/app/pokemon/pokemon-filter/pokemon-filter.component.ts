import { Component, computed, effect, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { PokemonFilterService } from './pokemon-filter.service';
import { PokemonPaginatorService } from '../pokemon-paginator/pokemon-paginator.service';
import { PokemonService } from '../pokemon.service';
import { SelectedPokemonFilters } from '../pokemon.model';

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
  private filterService = inject(PokemonFilterService);
  private paginator = inject(PokemonPaginatorService);
  private pokemonService = inject(PokemonService);

  controls = {
    type: new FormControl<string | null>(null),
    subtype: new FormControl<string | null>(null),
    supertype: new FormControl<string | null>(null),
  };

  types = computed(() => this.withDefault(this.filterService.types()));
  subtypes = computed(() => this.withDefault(this.filterService.subtypes()));
  supertypes = computed(() => this.withDefault(this.filterService.supertype()));

  isLoading = computed(
    () =>
      this.filterService.isLoadingFilteredPokemons() ||
      this.pokemonService.isLoadingAllPokemons() ||
      this.filterService.isFilterDataLoading()
  );

  constructor() {
    effect(() => {
      console.log('effect() - isLoading triggered');
      const loading = this.isLoading();
      Object.values(this.controls).forEach((control) => {
        loading ? control.disable() : control.enable();
      });
    });

    effect(() => {
      const type = this.filterService.selectedType();
      const subtype = this.filterService.selectedSubtype();
      const supertype = this.filterService.selectedSupertype();

      this.controls.type.setValue(type ?? null, {
        emitEvent: false,
      });
      this.controls.subtype.setValue(subtype ?? null, {
        emitEvent: false,
      });
      this.controls.supertype.setValue(supertype ?? null, {
        emitEvent: false,
      });

      console.log(
        `effect() - selected filters updated: type=${type}, subtype=${subtype}, supertype=${supertype}`
      );
    });
  }

  onFilterChange() {
    const filters: SelectedPokemonFilters = {
      type: this.controls.type.value,
      subtype: this.controls.subtype.value,
      supertype: this.controls.supertype.value,
    };
    this.paginator.resetPagination(0);
    this.filterService.filterBy(filters);
  }

  onReset() {
    console.log('onReset() - resetting filters');
    Object.values(this.controls).forEach((control) => control.setValue(null));
    this.filterService.resetFilters();
    this.paginator.resetPagination(this.pokemonService.allPokemonsTotalCount());
  }

  private withDefault = (values: string[]) => [
    { label: '-----', value: null },
    ...values.map((val) => ({ label: val, value: val })),
  ];
}
