import { PokemonFilters } from './pokemon-filter/pokemon-filter.model';
import { baseUrl, pokemonsPerPage } from './../app.config';

type PokemonApi = {
  route: PokemonApiSuportedRoutes;
  filters?: PokemonFilters;
  page?: number;
  idsToInclude?: string[];
  select?: string;
  overriddenQuery?: string; // overrides filers and idsToInclude!!!!
};

export const preparePokemonApiUrl = ({
  route,
  filters,
  page = 1,
  idsToInclude = [],
  select,
  overriddenQuery,
}: PokemonApi): string => {
  const queryParts: string[] = [];
  let query = '';

  const { types = [], subtypes = [], supertype = null } = filters || {};

  if (overriddenQuery) {
    query = overriddenQuery;
  } else {
    if (Array.isArray(types) && types.length) {
      queryParts.push(...types.map((val: string) => `types:"${val}"`));
    }
    if (Array.isArray(subtypes) && subtypes.length) {
      queryParts.push(...subtypes.map((val: string) => `subtypes:"${val}"`));
    }
    if (typeof supertype === 'string' && supertype) {
      queryParts.push(`supertype:"${supertype}"`);
    }

    query = queryParts.join(' AND ');

    if (idsToInclude.length) {
      const orIds = idsToInclude.map((id) => `id:${id}`).join(' OR ');
      query = query ? `(${query}) OR (${orIds})` : orIds;
    }
  }

  const fullUrl = `${baseUrl}/${route}?q=${encodeURIComponent(query)}&${
    select ? '&select:' + select : ''
  }&pageSize=${pokemonsPerPage}&page=${page}`;

  return fullUrl;
};

type PokemonApiSuportedRoutes =
  | '/cards'
  | '/sets'
  | '/types'
  | '/subtypes'
  | '/supertypes'
  | '/rarities'
  | `/cards/${string}`;
