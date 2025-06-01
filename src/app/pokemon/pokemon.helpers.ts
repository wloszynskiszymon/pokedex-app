import { EditedPokemon } from './pokemon.model';

type PokemonFilter = {
  types?: string[];
  subtypes?: string[];
  supertype?: string;
};

// this function returns just the pokemon ids!
export const filterEditedPokemons = (
  pokemons: EditedPokemon[],
  filter: PokemonFilter = {}
): EditedPokemon[] => {
  if (!filter || Object.keys(filter).length === 0) {
    return pokemons; // no filter applied, return all ids
  }

  return pokemons.filter((p) => {
    const matchesType =
      !filter.types ||
      filter.types.length === 0 ||
      (Array.isArray(p.types) &&
        p.types &&
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
  });
};
