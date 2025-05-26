// for pokemon api v2

type TODO = any;

export type PokemonResult = {
  count: number;
  next: TODO;
  previous: TODO;
  results: Pokemon[];
};

export type Pokemon = {
  name: string;
  url: TODO;
};
