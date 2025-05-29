import { Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PokemonDetails } from '../../pokemon.model';
import { MatSliderModule } from '@angular/material/slider';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PokemonFilterService } from '../../pokemon-filter/pokemon-filter.service';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-pokemon-edit-form',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  templateUrl: './pokemon-edit-form.component.html',
  styleUrl: './pokemon-edit-form.component.scss',
})
export class PokemonEditFormComponent implements OnInit {
  pokemon = inject<PokemonDetails>(MAT_DIALOG_DATA);
  hpControl = new FormControl(this.pokemon?.hp ?? 50);
  private filterService = inject(PokemonFilterService);
  private dialog = inject(MatDialog);

  types = computed(() => this.filterService.loadedTypes());
  subtypes = computed(() => this.filterService.loadedSubtypes());
  supertype = computed(() => this.filterService.loadedSupertypes());
  isLoading = computed(() => this.filterService.areFiltersLoading());

  controls = {
    types: new FormControl<string[] | null[]>([]),
    supertype: new FormControl<string | null>(null),
    subtypes: new FormControl<string[] | null[]>([]),
  };

  ngOnInit() {
    if (!this.pokemon) {
      throw new Error('Pokemon data is required for editing');
    }

    this.controls.types.setValue(this.pokemon.types ?? []);
    this.controls.subtypes.setValue(this.pokemon.subtypes ?? []);
    this.controls.supertype.setValue(this.pokemon.supertype ?? null);
  }

  onCancel() {
    this.dialog.closeAll();
  }
}
