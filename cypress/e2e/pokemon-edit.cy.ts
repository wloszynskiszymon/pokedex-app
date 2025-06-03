import { baseAppUrl } from '../config';

describe('Pokemon App', () => {
  const editedData = {
    oldData: {
      id: 'hgss4-1',
      hp: 140,
      types: ['Metal'],
      subtypes: ['Stage 2'],
      supertype: 'Pokémon',
    },
    updatedData: {
      id: 'hgss4-1',
      hp: 20,
      types: ['Fire', 'Grass', 'Lightning', 'Metal'],
      subtypes: ['BREAK', 'Baby', 'Basic', 'Stage 2'],
      supertype: 'Pokémon',
      _updatedAt: 1748900917928,
    },
  };

  beforeEach(() => {
    cy.intercept('GET', '**/cards*', { fixture: 'pokemon-list.json' }).as(
      'getAllPokemons'
    );
    cy.visit(baseAppUrl);
    cy.wait('@getAllPokemons', { timeout: 5000 });
  });

  it('should display the Pokemon edit form', () => {
    cy.get('[data-cy=pokemon-item]').first().click();
    cy.get('[data-cy=pokemon-edit-button]').click();

    cy.get('[data-cy=pokemon-edit-form]')
      .should('exist')
      .within(() => {
        cy.get('[data-cy=pokemon-edit-form-hp]').should('exist');
        cy.get('[data-cy=pokemon-edit-form-types]').should('exist');
        cy.get('[data-cy=pokemon-edit-form-supertype]').should('exist');
        cy.get('[data-cy=pokemon-edit-form-subtypes]').should('exist');
        cy.get('[data-cy=pokemon-edit-form-reset-button]').should('exist');
        cy.get('[data-cy=pokemon-edit-form-cancel-button]').should('exist');
        cy.get('[data-cy=pokemon-edit-form-submit-button]').should('exist');
      });
  });

  it('should display the Pokemon edit form and cancel it', () => {
    cy.get('[data-cy=pokemon-item]').first().click();
    cy.get('[data-cy=pokemon-edit-button]').click();

    cy.get('[data-cy=pokemon-edit-form]').should('exist');
    cy.get('[data-cy=pokemon-edit-form-cancel-button]').click();
  });

  it('should insert into inputs pokemon data', () => {
    cy.get('[data-cy=pokemon-item]').first().click();
    cy.get('[data-cy=pokemon-edit-button]').click();

    cy.get('[data-cy=pokemon-edit-form]').within(() => {
      cy.get('[data-cy=pokemon-edit-form-hp]').should('have.value', '140');
      cy.get('[data-cy=pokemon-edit-form-supertype]').should(
        'contain',
        'Pokémon'
      );
      cy.get('[data-cy=pokemon-edit-form-types]').should('contain', 'Metal');
      cy.get('[data-cy=pokemon-edit-form-subtypes]').should(
        'contain',
        'Stage 2'
      );
    });
  });

  it('should edit form and save to local storage', () => {
    cy.get('[data-cy=pokemon-item]').first().click();
    cy.get('[data-cy=pokemon-edit-button]').click();

    cy.get('[data-cy=pokemon-edit-form]').should('exist');

    cy.get('[data-cy=pokemon-edit-form-hp]')
      .invoke('val', 20)
      .trigger('input')
      .trigger('change');

    const types = ['Metal', 'Lightning', 'Fire', 'Grass'];
    cy.get('[data-cy=pokemon-edit-form-types]').click();
    types.forEach((type) => {
      cy.get(`[data-cy=pokemon-edit-form-types-option-${type}]`).click();
    });
    cy.get('.cdk-overlay-backdrop').last().click({ force: true });

    const subtypes = ['BREAK', 'Baby', 'Basic'];
    cy.get('[data-cy=pokemon-edit-form-subtypes]').click();
    subtypes.forEach((subtype) => {
      cy.get(`[data-cy=pokemon-edit-form-subtypes-option-${subtype}]`).click();
    });
    cy.get('.cdk-overlay-backdrop').last().click({ force: true });

    cy.get('[data-cy=pokemon-edit-form-submit-button]').click();

    cy.window().then((win) => {
      win.localStorage.setItem(
        'edited-pokemon:hgss4-1',
        JSON.stringify(editedData)
      );
      cy.wrap(win.localStorage.getItem('edited-pokemon:hgss4-1')).should(
        'not.be.null'
      );
    });
  });

  it('should display the edited Pokemon data in the list', () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        'edited-pokemon:hgss4-1',
        JSON.stringify(editedData)
      );
    });

    cy.get('[data-cy=pokemon-item]').first().click();
    cy.get('[data-cy=pokemon-edited-label]').should('exist');
  });
});
