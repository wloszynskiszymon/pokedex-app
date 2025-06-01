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
  id: string;
  name: string;
  images: CardImages;
  supertype: string;
  subtypes: string[];
  types: string[];
  hp: string;
  rarity: string;
  evolvesFrom: string;
  number: string;
  set: PokemonSet;
}

interface PokemonSet {
  id: string;
  name: string;
  series: string;
  printedTotal: number;
  total: number;
  legalities: {
    unlimited: string;
    expanded: string;
    standard: string;
  };
  images: {
    symbol: string;
    logo: string;
  };
  releaseDate: string;
  updatedAt: string;
}
export interface PokemonDetails extends PokemonCard {
  // TODO: select fields for details
}

export type PokemonCard = {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp: string;
  types: string[];
  evolvesFrom?: string;
  flavorText?: string;
  nationalPokedexNumbers: number[];
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
  retreatCost?: string[];
  convertedRetreatCost?: number;
  legalities: {
    unlimited: string;
  };
  images: {
    small: string;
    large: string;
  };
  set: {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    legalities: {
      unlimited: string;
    };
    ptcgoCode: string;
    releaseDate: string;
    updatedAt: string;
    images: {
      symbol: string;
      logo: string;
    };
  };
  cardmarket?: {
    url: string;
    updatedAt: string;
    prices: {
      averageSellPrice: number;
      lowPrice: number;
      trendPrice: number;
      germanProLow: number;
      suggestedPrice: number;
      reverseHoloSell: number;
      reverseHoloLow: number;
      reverseHoloTrend: number;
    };
  };
};

// for /types /subtypes / supertypes endpoints
export interface PokemonApiFilterResponse {
  data: string[];
}

export interface PokemonEditable {
  id: string;
  hp: number;
  types: string[];
  subtypes: string[];
  supertype: string | null;
}

export interface EditedPokemon extends PokemonEditable {
  _updatedAt: number; // _ because it's local, not from API
}
