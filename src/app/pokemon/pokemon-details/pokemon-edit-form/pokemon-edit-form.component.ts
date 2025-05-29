import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PokemonDetails } from '../../pokemon.model';
import { MatSliderModule } from '@angular/material/slider';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
  ],
  templateUrl: './pokemon-edit-form.component.html',
  styleUrl: './pokemon-edit-form.component.scss',
})
export class PokemonEditFormComponent implements OnInit {
  pokemon = inject<PokemonDetails>(MAT_DIALOG_DATA);
  hpControl = new FormControl(this.pokemon?.hp ?? 50);

  ngOnInit() {
    if (!this.pokemon) {
      throw new Error('Pokemon data is required for editing');
    }
  }
}
