const admin = Cypress.env('ADMIN_USER')
const url = Cypress.env('BASE_URL')
let KtUrl = Cypress.env('iCreate_Base_KT')

describe('Login test', () => {
    //Test if we are navigated to the correct page
    it('UI login', () => {
        cy.visit(url)
        cy.login(admin.username, admin.password)
    })
   /* it.only('Login with HOT-Keys', () => {
        cy.visit(KtUrl)
        //cy.get('.Close')
        
        //cy.type('{ctrl}')
        cy.wait(2000)
        cy.get('#uber').click({force:true})
        cy.get('body').type('{ctrl}')
        cy.get('body').trigger('keypress', { key: "F9", code: "F9", which: 120, force:true })
        cy.get('body').trigger('keypress', { key: "F9", code: "F9", which: 120, force:true})

        //scrollTo('bottom').trigger('keyup', { key: "Control", code: "ControlRight", which: 17}).trigger('keyup', { key: "F9", code: "F9", which: 120}).trigger('keyup', { key: "F9", code: "F9", which: 120 })
       // Cypress.$.event.trigger({ type: 'keydown', which: 120 });
        //.scrollIntoView().type('{ctrl}').type('function(9)').type('function(9)')
        //cy.get('body').scrollIntoView().type('{ctrl}').trigger('keydown', { key: "F9", code: "F9", which: 120}, {force:true }).trigger('keydown', { key: "F9", code: "F9", which: 120 }, {force:true })
        
        //type('function (9)', { parseSpecialCharSequences: false }).type('function (9)', { parseSpecialCharSequences: false })
        //trigger('keydown', { key: "F9", code: "F9", which: 120 }).trigger('keydown', { key: "F9", code: "F9", which: 120 })
        //trigger('keydown', { key: "control", code: "ControlLeft", which: 17 },{force: true}).trigger('keydown', { key: "F9", code: "F9", which: 120 },{force: true}).trigger('keydown', { key: "F9", code: "F9", which: 120 },{force: true})
        //type('{ctrl}{F9}{F9}') #topNavContainer
    })*/
})
