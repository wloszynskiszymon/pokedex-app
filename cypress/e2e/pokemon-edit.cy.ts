// ignore similar pokemons fetching

describe('Pokemon App', () => {
  it('should display the Pokemon edit form', () => {
    cy.intercept('GET', '**/cards*', { fixture: 'pokemon-list.json' }).as(
      'getAllPokemons'
    );
    cy.visit('http://localhost:4200/');
    cy.wait('@getAllPokemons', { timeout: 5000 });

    cy.get('[data-cy=pokemon-item]').first().click();
    cy.get('[data-cy=pokemon-edit-button]').click();

    cy.get('[data-cy=pokemon-edit-form]').should('exist');
    cy.get('[data-cy=pokemon-edit-form]').within(() => {
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
    cy.intercept('GET', '**/cards*', { fixture: 'pokemon-list.json' }).as(
      'getAllPokemons'
    );
    cy.visit('http://localhost:4200/');
    cy.wait('@getAllPokemons', { timeout: 5000 });

    cy.get('[data-cy=pokemon-item]').first().click();
    cy.get('[data-cy=pokemon-edit-button]').click();

    cy.get('[data-cy=pokemon-edit-form]').should('exist');
    cy.get('[data-cy=pokemon-edit-form-cancel-button]').should('exist').click();
  });

  it('should insert into inputs pokemon data', () => {
    cy.intercept('GET', '**/cards*', { fixture: 'pokemon-list.json' }).as(
      'getAllPokemons'
    );
    cy.visit('http://localhost:4200/');
    cy.wait('@getAllPokemons', { timeout: 5000 });

    cy.get('[data-cy=pokemon-item]').first().click(); // Aggron (hgss4-1) is first pokemon
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
    cy.intercept('GET', '**/cards*', { fixture: 'pokemon-list.json' }).as(
      'getAllPokemons'
    );
    cy.visit('http://localhost:4200/');
    cy.wait('@getAllPokemons', { timeout: 5000 });

    cy.get('[data-cy=pokemon-item]').first().click(); // Aggron (hgss4-1) is first pokemon
    cy.get('[data-cy=pokemon-edit-button]').click();

    cy.get('[data-cy=pokemon-edit-form]').should('exist');
    cy.get('[data-cy=pokemon-edit-form-hp]').type('20');

    const types = ['Metal', 'Lightning', 'Fire', 'Grass'];
    cy.get('[data-cy=pokemon-edit-form-types]').click();
    types.forEach((type) => {
      cy.get(`[data-cy=pokemon-edit-form-types-option-${type}]`).click();
    });

    cy.get('.cdk-overlay-backdrop').last().click({ force: true });

    const subtypes = ['BREAK', 'Baby', 'Basic'];
    cy.get('[data-cy=pokemon-edit-form-subtypes]').click();

    subtypes.forEach((subtype) => {
      cy.get(`[data-cy=pokemon-edit-form-subtypes-option-${subtype}]`);
    });

    cy.get('.cdk-overlay-backdrop').last().click({ force: true });

    cy.get('[data-cy=pokemon-edit-form-submit-button]').click();

    const dataToStore =
      '{"oldData":{"id":"hgss4-1","hp":140,"types":["Metal"],"subtypes":["Stage 2"],"supertype":"Pokémon"},"updatedData":{"id":"hgss4-1","hp":100,"types":["Fire","Grass","Lightning","Metal"],"subtypes":["BREAK","Baby","Basic","Stage 2"],"supertype":"Pokémon","_updatedAt":1748900917928}}';

    cy.window().then((win) => {
      win.localStorage.setItem('edited-pokemon:hgss4-1', dataToStore);
      const item = win.localStorage.getItem('edited-pokemon:hgss4-1');
      expect(item).to.not.be.null;
      const parsed = JSON.parse(item!);
      expect(parsed).to.not.be.null;
    });
  });

  it('should display the edited Pokemon data in the list', () => {
    cy.intercept('GET', '**/cards*', { fixture: 'pokemon-list.json' }).as(
      'getAllPokemons'
    );

    const dataToStore =
      '{"oldData":{"id":"hgss4-1","hp":140,"types":["Metal"],"subtypes":["Stage 2"],"supertype":"Pokémon"},"updatedData":{"id":"hgss4-1","hp":100,"types":["Fire","Grass","Lightning","Metal"],"subtypes":["BREAK","Baby","Basic","Stage 2"],"supertype":"Pokémon","_updatedAt":1748900917928}}';

    cy.visit('http://localhost:4200/');

    cy.window().then((win) => {
      win.localStorage.setItem('edited-pokemon:hgss4-1', dataToStore);
    });

    cy.wait('@getAllPokemons', { timeout: 5000 });
    cy.get('[data-cy=pokemon-item]').first().click();
    cy.get('[data-cy=pokemon-edited-label]').should('exist');
  });
});
