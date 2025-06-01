import { EditedPokemon, PokemonEditable } from './pokemon.model';

// makes it easier to remove all edited pokemons from local storage
// excluding other potential local storage items in the future
const prefix = 'edited-pokemon:';
const attachPrefix = (key: string) => prefix + key;

export const savePokemonToLocalStorage = (
  pokemon: PokemonEditable
): boolean => {
  try {
    if (!pokemon || !pokemon.id) {
      console.warn('Invalid Pokemon data provided for local storage.');
      return false;
    }
    const timestamp = Date.now();

    const pokemonToStore: EditedPokemon = {
      ...pokemon,
      _updatedAt: timestamp,
    };

    localStorage.setItem(
      attachPrefix(pokemon.id),
      JSON.stringify(pokemonToStore)
    );
    return true;
  } catch (error) {
    console.error('Error saving Pokemon to local storage:', error);
    return false;
  }
};

export const getEditedPokemonsFromLocalStorage = (): EditedPokemon[] => {
  const editedPokemons: EditedPokemon[] = [];
  const keys = Object.keys(localStorage);

  for (const key of keys) {
    if (key.startsWith(prefix)) {
      try {
        const pokemonData = localStorage.getItem(key);
        if (pokemonData) {
          const parsedPokemon: EditedPokemon = JSON.parse(pokemonData);
          editedPokemons.push(parsedPokemon);
        }
      } catch (error) {
        console.error(`Error parsing Pokemon data for key ${key}:`, error);
      }
    }
  }

  return editedPokemons;
};
