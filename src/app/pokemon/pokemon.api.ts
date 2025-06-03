import { PokemonFilters, SelectedPokemonFilters } from './pokemon.model';
import { baseUrl, pokemonsPerPage } from './../app.config';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

type PokemonApi = {
  route: PokemonApiSuportedRoutes;
  filters?: SelectedPokemonFilters;
  page?: number;
  idsToInclude?: string[];
  idsToExclude?: string[];
  select?: string;
  overriddenQuery?: string; // overrides "q" - filers, idsToInclude and idsToExclude!!!!
};

export const preparePokemonApiUrl = ({
  route,
  filters,
  page = 1,
  idsToInclude = [],
  idsToExclude = [],
  select,
  overriddenQuery,
}: PokemonApi): string => {
  const queryParts: string[] = [];
  let query = '';

  const { type = null, subtype = null, supertype = null } = filters || {};

  if (overriddenQuery) {
    query = overriddenQuery;
  } else {
    if (type) {
      queryParts.push(`types:"${type}"`);
    }
    if (subtype) {
      queryParts.push(`subtypes:"${subtype}"`);
    }
    if (supertype) {
      queryParts.push(`supertype:"${supertype}"`);
    }

    const filterQuery = queryParts.join(' AND ');

    let includeQuery = '';
    if (idsToInclude.length) {
      const orIds = idsToInclude.map((id) => `id:"${id}"`).join(' OR ');
      includeQuery = `(${orIds})`;
    }

    if (filterQuery && includeQuery) {
      query = `(${filterQuery}) OR ${includeQuery}`;
    } else {
      query = filterQuery || includeQuery;
    }

    if (idsToExclude.length) {
      const excludeQuery = idsToExclude.map((id) => `-id:"${id}"`).join(' ');
      query = query ? `${query} ${excludeQuery}` : excludeQuery;
    }
  }

  const fullUrl = `${baseUrl}${route}?q=${encodeURIComponent(query)}&${
    select ? 'select=' + select + '&' : ''
  }pageSize=${pokemonsPerPage}&page=${page}`;

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

export function createApiHeaders(): HttpHeaders {
  return new HttpHeaders({
    'X-Api-Key': environment.apiKey || '',
  });
}
