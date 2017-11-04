process.env.NODE_ENV = 'test';


const Todo = require('../models').Todo;
const TodoItem = require('../models').TodoItem;

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../app.js');
let should = chai.should();

chai.use(chaiHttp);

describe('Todos', () => {
    beforeEach((done) => {
        Todo.destroy({where: {}}).then(()=>(done()));
    });
    describe('/GET todos', () => {
        it('it should GET all the todos', (done) => {
            chai.request(server)
                .get('/api/todos')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });


    describe('/POST todo', () => {
        it('it should POST todo ', (done) => {
            let todo = {
                title: "test todo",
            }
            chai.request(server)
                .post('/api/todos')
                .send(todo)
                .end((err, res) => {
                    //should.exist(res);
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.title.should.be.eql("test todo");
                    done();
                });
        });
    });

});
