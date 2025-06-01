import {
  EditedPokemon,
  LocalStoragePokemon,
  PokemonEditable,
} from './pokemon.model';

// makes it easier to remove all edited pokemons from local storage
// excluding other potential local storage items in the future
const prefix = 'edited-pokemon:';
const attachPrefix = (key: string) => prefix + key;

export const savePokemonToLocalStorage = (
  pokemonObj: LocalStoragePokemon
): boolean => {
  try {
    if (!pokemonObj || !pokemonObj.oldData.id) {
      console.warn('Invalid Pokemon data provided for local storage.');
      return false;
    }

    localStorage.setItem(
      attachPrefix(pokemonObj.oldData.id),
      JSON.stringify(pokemonObj)
    );
    return true;
  } catch (error) {
    console.error('Error saving Pokemon to local storage:', error);
    return false;
  }
};

export const getEditedPokemonsFromLocalStorage = (): LocalStoragePokemon[] => {
  const editedPokemons: LocalStoragePokemon[] = [];
  const keys = Object.keys(localStorage);

  for (const key of keys) {
    if (key.startsWith(prefix)) {
      try {
        const pokemonData = localStorage.getItem(key);
        if (pokemonData) {
          const parsedPokemon: LocalStoragePokemon = JSON.parse(pokemonData);
          editedPokemons.push(parsedPokemon);
        }
      } catch (error) {
        console.error(`Error parsing Pokemon data for key ${key}:`, error);
      }
    }
  }

  return editedPokemons;
};
