import { baseUrl } from '../../app.config';
import { PokemonFilters } from './pokemon-filter.model';

export const prepareFilterUrl = ({
  types = [],
  subtypes = [],
  supertypes = [],
}: PokemonFilters): string => {
  const queryParts: string[] = [];

  if (types.length) {
    queryParts.push(...types.map((val) => `types:"${val}"`));
  }
  if (subtypes.length) {
    queryParts.push(...subtypes.map((val) => `subtypes:"${val}"`));
  }
  if (supertypes.length) {
    queryParts.push(...supertypes.map((val) => `supertype:"${val}"`));
  }

  const query = queryParts.join(' AND ');
  const fullUrl = `${baseUrl}/cards?q=${encodeURIComponent(
    query
  )}&select=name,id,images,supertype,subtypes,types&pageSize=10`;

  return fullUrl;
};
