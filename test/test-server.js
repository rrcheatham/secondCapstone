const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');

const expect = chai.expect;

chai.use(chaiHttp);

describe('index page', function() {
    it('should exist', function() {
        return chai.request(app)
            .get('/')
            .then(function(res) {
                expect(res).to.have.status(200);
            });
    });
});

describe('sign-up page', function() {
    it('should exist', function() {
        return chai.request(app)
            .get('/sign-up.html')
            .then(function(res) {
                expect(res).to.have.status(200);
            });
    });
});

describe('account page', function() {
    it('should exist', function() {
        return chai.request(app)
            .get('/account.html')
            .then(function(res) {
                expect(res).to.have.status(200);
            });
    });
});

describe('rest page', function() {
    it('should exist', function() {
        return chai.request(app)
            .get('/reset.html')
            .then(function(res) {
                expect(res).to.have.status(200);
            });
    });
});
