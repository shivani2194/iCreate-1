import { createRandomString, createRandomEmail } from '../support/helper'

const admin = Cypress.env('ADMIN_USER')
//const url = Cypress.env('BASE_URL')
let KtUrl = Cypress.env('iCreate_Base_KT')
const userName = createRandomString(4)
const userEmail = createRandomEmail(5)

describe('Login test', () => {
    let polyfill
    // grab fetch polyfill from remote URL, could be also from a local package
    before(() => {

        cy.visit('/login.jsp')
        cy.login(admin.username, admin.password)
        const polyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js'

        cy.request(polyfillUrl)
            .then((response) => {
                polyfill = response.body
            })
    })

    // yields iframe's document
    const getIframeDocument = () => {
        return cy
            .get('iframe')
            .its('0.contentDocument').should('exist')
    }

    const getIframeBody = () => {
        return getIframeDocument().its('body').should('not.be.undefined').then(cy.wrap)
    }

    const getIframeWindow = () => {
        return cy
            .get('iframe')
            .its('0.contentWindow').should('exist')
    }

    const replaceIFrameFetchWithXhr = () => {
        // see recipe "Stubbing window.fetch" in
        // https://github.com/cypress-io/cypress-example-recipes
        getIframeWindow().then((iframeWindow) => {
            delete iframeWindow.fetch
            // since the application code does not ship with a polyfill
            // load a polyfilled "fetch" from the test
            iframeWindow.eval(polyfill)
            iframeWindow.fetch = iframeWindow.unfetch

            // BUT to be able to spy on XHR or stub XHR requests
            // from the iframe we need to copy OUR window.XMLHttpRequest into the iframe
            cy.window().then((appWindow) => {
                iframeWindow.XMLHttpRequest = appWindow.XMLHttpRequest
            })
        })
    }


    it('UI login', () => {
        replaceIFrameFetchWithXhr()
        cy.server()
        cy.route('POST', '/api-proxy/esolg.icreate.security/v1/user-accounts?siteId=1').as('userCreated')
        cy.route('POST', '/api-proxy/esolg.icreate.security/v1/user-accounts/108484/user-groups').as('user')


        cy.get('#more-').click()
        cy.get(':nth-child(29) > .ng-binding').click()
        cy.location('href').should('eq', 'https://icreate3.qa.esolutionsgroup.ca/icreate/ui/workbench2/sites/1/modules/user')
        cy.wait(3000)
        cy.get('iframe').iframe().within(() => {
            cy.get('button.btn.btn-primary').first().should("have.text", ' Add a New User').click()
            cy.get('.col-sm-6').type(userName)
            cy.get('input.form-control.ng-pristine.ng-untouched.ng-empty.ng-valid-email.ng-invalid.ng-invalid-required.ng-valid-maxlength').type(userEmail)
            cy.get('input.form-control.ng-pristine').should('have.attr', 'name', 'userFirstName')
            //Password
            cy.get('input.form-control.ng-pristine.ng-untouched.ng-empty.ng-valid-validator.ng-invalid.ng-invalid-required.ng-valid-maxlength').type('Test!234')
            cy.get('input.form-control.ng-pristine.ng-untouched.ng-empty.ng-invalid.ng-invalid-required.ng-valid-maxlength').should('have.attr', 'name', 'userFirstName', { force: true }).first().type('Shiv')
            cy.get('input.form-control.ng-pristine.ng-empty.ng-invalid.ng-invalid-required.ng-valid-maxlength').first().type('Joshi')
            cy.get('input.form-control.ng-pristine.ng-empty.ng-invalid.ng-invalid-required.ng-valid-maxlength').last().type('Test!234')
            cy.get('[value="Administrators"]').check()
            cy.get('.btn.btn-primary').should('have.text', ' Save').click()
            cy.wait('@userCreated')

        })
    })

});
/*
it('spies on XHR request', () => {
  cy.visit('index.html')

  replaceIFrameFetchWithXhr()
  // prepare to spy on XHR before clicking the button
  cy.server()
  cy.route('/todos/1').as('getTodo')

  cy.getIframeBody().find('#run-button')
    .should('have.text', 'Try it').click()

  // let's wait for XHR request to happen
  // for more examples, see recipe "XHR Assertions"
  // in repository https://github.com/cypress-io/cypress-example-recipes
  cy.wait('@getTodo').its('response.body').should('deep.equal', {
    completed: false,
    id: 1,
    title: 'delectus aut autem',
    userId: 1,
  })

  // and we can confirm the UI has updated correctly
  getIframeBody().find('#result')
    .should('include.text', '"delectus aut autem"')
}) */
