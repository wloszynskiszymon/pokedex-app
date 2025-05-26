// for pokemon api v2\
// https://pokeapi.co/docs/v2#pokemon

interface CardImages {
  small: string;
  large: string;
}
// only selected fields for the Pokemon model as well as it's nested types
export interface SelectedPokemonFields {
  name: string;
  id: string;
  images: CardImages;
  supertype: string;
  subtypes: string[];
  types: string[];
}

export type PokemonResult = {
  count: number;
  page: number;
  pageSize: number;
  totalCount: number;
  data: SelectedPokemonFields[];
};
