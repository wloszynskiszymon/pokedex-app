export interface PokemonApiResponse<T> {
  data: T;
  count: number;
  page: number;
  pageSize: number;
  totalCount: number;
}

// shared
interface ImagePair {
  small: string;
  large: string;
}

interface Legalities {
  unlimited: string;
  expanded?: string;
  standard?: string;
}

interface PokemonSetBase {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: Legalities;
  images: {
    symbol: string;
    logo: string;
  };
  releaseDate: string;
  updatedAt: string;
}

// pokemon models

export interface PokemonItemFields {
  id: string;
  name: string;
  images: ImagePair;
  supertype: string | null;
  subtypes: string[];
  types: string[];
  hp: string;
  rarity: string;
  evolvesFrom: string;
  number: string;
  set: PokemonSetBase;
  _updatedAt: number;
}

export type PokemonCard = {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp: string;
  types: string[];
  rarity?: string;
  number: string;
  artist?: string;
  attacks?: {
    name: string;
    cost: string[];
    convertedEnergyCost: number;
    damage: string;
    text: string;
  }[];
  weaknesses?: {
    type: string;
    value: string;
  }[];
  resistances?: {
    type: string;
    value: string;
  }[];
  images: ImagePair;
  set: PokemonSetBase & {
    ptcgoCode: string;
  };
};

export interface PokemonDetails extends PokemonCard {
  _updatedAt: number | undefined;
}

// filter API
export interface PokemonApiFilterResponse {
  data: string[];
}

// editable Models
export interface PokemonEditable {
  id: string;
  hp: number;
  types: string[];
  subtypes: string[];
  supertype: string | null;
}

export interface EditedPokemon extends PokemonEditable {
  _updatedAt: number;
}

export interface LocalStoragePokemon {
  oldData: PokemonEditable;
  updatedData: EditedPokemon;
}
