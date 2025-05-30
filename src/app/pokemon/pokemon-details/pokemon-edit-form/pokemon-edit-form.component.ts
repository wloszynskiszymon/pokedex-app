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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PokemonFilterService } from '../../pokemon-filter/pokemon-filter.service';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule,
  ],
  templateUrl: './pokemon-edit-form.component.html',
  styleUrl: './pokemon-edit-form.component.scss',
})
export class PokemonEditFormComponent implements OnInit {
  pokemon = inject<PokemonDetails>(MAT_DIALOG_DATA);
  private filterService = inject(PokemonFilterService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  types = computed(() => this.filterService.loadedTypes());
  subtypes = computed(() => this.filterService.loadedSubtypes());
  supertype = computed(() => this.filterService.loadedSupertypes());

  form = new FormGroup({
    hp: new FormControl<number>(Number(this.pokemon?.hp) ?? 1),
    types: new FormControl<string[] | null[]>([]),
    supertype: new FormControl<string | null>(null),
    subtypes: new FormControl<string[] | null[]>([]),
  });

  ngOnInit() {
    if (!this.pokemon) {
      throw new Error('Pokemon data is required for editing');
    }

    this.form.controls.types.setValue(this.pokemon.types ?? []);
    this.form.controls.subtypes.setValue(this.pokemon.subtypes ?? []);
    this.form.controls.supertype.setValue(this.pokemon.supertype ?? null);
  }

  onReset() {
    this.form.controls.hp.setValue(Number(this.pokemon?.hp) ?? 1);
    this.form.controls.types.setValue(this.pokemon.types);
    this.form.controls.subtypes.setValue(this.pokemon.subtypes);
    this.form.controls.supertype.setValue(this.pokemon.supertype);
    this.form.markAsPristine();
  }

  onCancel() {
    this.dialog.closeAll();
  }

  // TODO: Perhaps some validation logic
  onSave() {
    try {
      if (this.form.invalid) {
        console.error('Form is invalid, cannot save');
        return;
      }

      const pokemonDataToStore = {
        id: this.pokemon.id,
        hp: this.form.controls.hp.value,
        types: this.form.controls.types.value,
        subtypes: this.form.controls.subtypes.value,
        supertype: this.form.controls.supertype.value,
      };

      // keys of stored pokemons could be stored as well for easier removal
      localStorage.setItem(this.pokemon.id, JSON.stringify(pokemonDataToStore));

      this.showSnackbar(`Pokemon ${this.pokemon.name} saved successfully!`);

      this.dialog.closeAll();
    } catch (error) {
      console.error('Error saving Pokemon:', error);
    }
  }

  showSnackbar(message: string) {
    this.snackBar.open(message, undefined, {
      verticalPosition: 'top',
      duration: 2000,
      panelClass: ['app-snackbar'],
    });
  }
}
