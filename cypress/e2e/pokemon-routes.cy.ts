import { baseAppUrl } from '../config';

describe('Pokemon App Routes', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/supertypes*', {
      fixture: 'supertypes.json',
    }).as('getSupertypes');
    cy.intercept('GET', '**/types*', {
      fixture: 'types.json',
    }).as('getTypes');
    cy.intercept('GET', '**/subtypes*', {
      fixture: 'subtypes.json',
    }).as('getSubtypes');
  });

  it('should pre-fill filters and set correct page based on URL query parameters', () => {
    const superType = 'Pokémon';
    const type = 'Fairy';
    const subtype = 'Stage 2';
    const page = 2;

    cy.visit(baseAppUrl, {
      qs: {
        page,
        supertype: superType,
        types: type,
        subtypes: subtype,
      },
    });

    cy.wait('@getSupertypes', { timeout: 5000 });
    cy.wait('@getTypes', { timeout: 5000 });
    cy.wait('@getSubtypes', { timeout: 5000 });

    cy.get('[data-cy=filter-type]').should('contain', type);
    cy.get('[data-cy=filter-subtype]').should('contain', subtype);
    cy.get('[data-cy=filter-supertype]').should('contain', superType);

    cy.get('[data-cy=pokemon-item]').should('have.length.greaterThan', 0);
    cy.get(`[data-cy=page-${page}]`);
  });

  it('should navigate to the Pokemon details page', () => {
    cy.intercept('GET', '**/cards*', { fixture: 'pokemon-list.json' }).as(
      'getAllPokemons'
    );
    cy.visit(baseAppUrl);
    cy.wait('@getAllPokemons', { timeout: 5000 });
    cy.get('[data-cy=pokemon-item]').first().click();
    cy.url().should('include', '/pokemon/');
  });

  it('should navigate to the Pokemon details page and select first similar pokemon', () => {
    cy.intercept('GET', '**/cards*', { fixture: 'pokemon-list.json' }).as(
      'getAllPokemons'
    );
    cy.visit(baseAppUrl);
    cy.wait('@getAllPokemons', { timeout: 5000 });
    cy.get('[data-cy=pokemon-item]').first().click(); // Aggron (hgss4-1) is first pokemon
    cy.intercept('GET', '**/cards*', {
      fixture: 'pokemon-hgss4-1-similar.json',
    }).as('getSimilarPokemons');
    cy.url().should('include', '/pokemon/');
    cy.get('h2').should('contain', 'Aggron');
    cy.wait('@getSimilarPokemons', { timeout: 12000 });
    cy.get('[data-cy=similar-pokemon-item]').first().click();
    cy.get('h2').should('not.contain', 'Aggron');
  });
});
