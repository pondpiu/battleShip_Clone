process.env.NODE_ENV = 'test';

const mongoose = require("mongoose")

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('/GET hello', () =>{
  it('should return Hello World!', (done) => {
    chai.request(server)
      .get('/hello')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.equal('Hello World!');
        done();
      });
  });
});

describe('/POST hello', () =>{
  it('should return Hello World!', (done) => {
    chai.request(server)
      .post('/hello')
      .send('test')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.equal('Hello World!');
        done();
      });
  });
});
