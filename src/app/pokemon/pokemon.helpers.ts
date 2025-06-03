import {
  EditedPokemon,
  LocalStoragePokemon,
  PokemonEditable,
  PokemonItemFields,
  SelectedPokemonFilters,
} from './pokemon.model';

export interface PokemonFilter {
  types?: string[];
  subtypes?: string[];
  supertype?: string;
}

export interface FilterResult {
  includedPokemons: EditedPokemon[];
  excludedPokemons: EditedPokemon[];
}

export const filterEditedPokemons = (
  pokemons: LocalStoragePokemon[],
  filter: SelectedPokemonFilters = {}
): FilterResult => {
  const matchesFilter = (
    p: PokemonEditable,
    filter: SelectedPokemonFilters
  ): boolean => {
    const matchesType =
      !filter.type || (Array.isArray(p.types) && p.types.includes(filter.type));

    const matchesSubtype =
      !filter.subtype ||
      (Array.isArray(p.subtypes) && p.subtypes.includes(filter.subtype));

    const matchesSupertype =
      !filter.supertype || p.supertype === filter.supertype;

    return matchesType && matchesSubtype && matchesSupertype;
  };

  const includedPokemons: EditedPokemon[] = [];
  const excludedPokemons: EditedPokemon[] = [];

  for (const pokemon of pokemons) {
    const matchesUpdated = matchesFilter(pokemon.updatedData, filter);
    const matchesOld = matchesFilter(pokemon.oldData, filter);

    if (matchesUpdated) {
      includedPokemons.push(pokemon.updatedData);
    } else if (matchesOld) {
      excludedPokemons.push(pokemon.updatedData);
    }
  }

  return { includedPokemons, excludedPokemons };
};

export const updatePokemons = (
  pokemons: PokemonItemFields[],
  newData: PokemonEditable[]
): PokemonItemFields[] => {
  return pokemons.map((pokemon) => {
    const updatedData = newData.find((p) => p.id === pokemon.id);
    if (updatedData) {
      return {
        ...pokemon,
        hp: updatedData.hp + '',
        types: updatedData.types || [],
        subtypes: updatedData.subtypes || [],
        supertype: updatedData.supertype || null,
      };
    }
    return pokemon;
  });
};
