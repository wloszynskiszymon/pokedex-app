import {
  EditedPokemon,
  LocalStoragePokemon,
  PokemonEditable,
  PokemonItemFields,
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
  filter: PokemonFilter = {}
): FilterResult => {
  const matchesFilter = (
    p: PokemonEditable,
    filter: PokemonFilter
  ): boolean => {
    const matchesType =
      !filter.types ||
      filter.types.length === 0 ||
      (Array.isArray(p.types) &&
        p.types.some((type) => type && filter.types!.includes(type)));

    const matchesSubtype =
      !filter.subtypes ||
      filter.subtypes.length === 0 ||
      (Array.isArray(p.subtypes) &&
        p.subtypes.some(
          (subtype) => subtype && filter.subtypes!.includes(subtype)
        ));

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
    // If neither matches, we skip the pokemon
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
