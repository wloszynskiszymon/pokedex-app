import { baseUrl, pokemonsPerPage } from '../../app.config';
import { PokemonFilters } from './pokemon-filter.model';

export const prepareFilterUrl = (
  filters: PokemonFilters,
  page: number = 1
): string => {
  const { types = [], subtypes = [], supertype = [] } = filters;

  const queryParts: string[] = [];

  if (types.length) {
    queryParts.push(...types.map((val) => `types:"${val}"`));
  }
  if (subtypes.length) {
    queryParts.push(...subtypes.map((val) => `subtypes:"${val}"`));
  }
  if (supertype) {
    queryParts.push(`supertype:"${supertype}"`);
  }

  const query = queryParts.join(' AND ');
  const fullUrl = `${baseUrl}/cards?q=${encodeURIComponent(
    query
  )}&select=name,id,supertype,subtypes,types,hp,rarity,evolvesFrom,number,set&pageSize=${pokemonsPerPage}&page=${page}`;

  return fullUrl;
};
