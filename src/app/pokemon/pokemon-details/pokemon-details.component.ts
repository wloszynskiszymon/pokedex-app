import { Component, computed, inject } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.scss',
})
export class PokemonDetailsComponent {
  pokemonService = inject(PokemonService);
  route = inject(ActivatedRoute);
  pokemon = computed(() => {
    console.log(this.pokemonService.loadedPokemonDetails());
    return this.pokemonService.loadedPokemonDetails();
  });

  defaultValue = 'N/A';

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (!id) {
        console.error('No Pokemon ID found in route');
        return;
      }

      this.pokemonService.loadPokemonById(id);
    });
  }

  normalizeToUnit(
    value: number | string | null | undefined,
    max: number = 100
  ): number {
    if (value === null || value === undefined) return 0;
    const num = Math.abs(+value); // take absolute value
    if (isNaN(num)) return 0;
    return Math.max(0, Math.min(1, num / max));
  }
}
