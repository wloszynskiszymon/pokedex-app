// for pokemon api v2\
// https://pokeapi.co/docs/v2#pokemon

export type TODO = any;
export interface PokemonApiResponse<T> {
  data: T;
  count: number;
  page: number;
  pageSize: number;
  totalCount: number;
}

interface CardImages {
  small: string;
  large: string;
}

// only selected fields for the Pokemon model as well as it's nested types
export interface PokemonItemFields {
  name: string;
  id: string;
  images: CardImages;
  supertype: string;
  subtypes: string[];
  types: string[];
}

export interface PokemonDetails extends PokemonItemFields {
  // TODO: select fields for details
}
