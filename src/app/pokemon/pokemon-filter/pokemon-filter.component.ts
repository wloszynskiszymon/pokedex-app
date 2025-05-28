import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { PokemonFilterService } from './pokemon-filter.service';
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
export class PokemonFilterComponent implements OnInit {
  private filterService = inject(PokemonFilterService);
  private paginator = inject(PokemonPaginatorService);
  private pokemonService = inject(PokemonService);

  controls = {
    types: new FormControl<string | null>(null),
    subtypes: new FormControl<string | null>(null),
    supertypes: new FormControl<string | null>(null),
  };

  types = computed(() => this.withDefault(this.filterService.loadedTypes()));
  subtypes = computed(() =>
    this.withDefault(this.filterService.loadedSubtypes())
  );
  supertypes = computed(() =>
    this.withDefault(this.filterService.loadedSupertypes())
  );

  isLoading = computed(
    () =>
      this.filterService.isLoadingFilteredPokemons() ||
      this.pokemonService.isLoadingPokemons() ||
      this.filterService.areFiltersLoading()
  );

  ngOnInit(): void {
    this.filterService.init();
  }

  constructor() {
    effect(() => {
      const loading = this.isLoading();
      Object.values(this.controls).forEach((control) => {
        loading ? control.disable() : control.enable();
      });
    });
  }

  onFilterChange() {
    const filters = {
      types: this.toArray(this.controls.types.value),
      subtypes: this.toArray(this.controls.subtypes.value),
      supertypes: this.toArray(this.controls.supertypes.value),
    };
    this.paginator.reset(0);
    this.filterService.filterBy(filters);
  }

  onReset() {
    Object.values(this.controls).forEach((control) => control.setValue(null));
    this.filterService.reset();
    this.paginator.reset(this.pokemonService.totalCount());
  }

  private toArray(value: string | null): string[] {
    return value ? [value] : [];
  }

  private withDefault = (values: string[] | null[]) => [
    { label: '-----', value: null },
    ...values.map((val) => ({ label: val, value: val })),
  ];
}
