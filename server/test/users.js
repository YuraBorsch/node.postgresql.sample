process.env.NODE_ENV = 'test';


const User = require('../models').User;


const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');
let should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {


    var token = null;
    var user = { email:"sample@email.some", password:"1234" };

    beforeEach((done) => {
        User.destroy({where: {}}).then(() => {

            User.create(user).then(() => {
                chai.request(server)
                    .post('/api/signIn')
                    .send(user)
                    .end((err, res) => {
                        token = res.body.accessToken;
                        done();
                    });
            })
        })
    });


    describe('/GET users', () => {
        it('it should GET all users ', (done) => {
            chai.request(server)
                .get('/api/users')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    //should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });


})