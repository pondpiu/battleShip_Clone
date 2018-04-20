process.env.NODE_ENV = 'test';

const mongoose = require("mongoose")

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('/GET board', () =>{
  it('should return not implement', (done) => {
    chai.request(server)
      .get('/board')
      .end((err, res) => {
        res.should.have.status(501);
        res.text.should.equal('Not Implemented');
        done();
      });
  });
});

describe('/GET board/:id', () =>{
  it('should return not implement', (done) => {
    chai.request(server)
      .get('/board/1234')
      .end((err, res) => {
        res.should.have.status(501);
        res.text.should.equal('Not Implemented');
        done();
      });
  });
});

describe('/GET board/reset/:id', () =>{
  it('should return not implement', (done) => {
    chai.request(server)
      .get('/board/reset/1234')
      .end((err, res) => {
        res.should.have.status(501);
        res.text.should.equal('Not Implemented');
        done();
      });
  });
});

describe('/POST board/attack/:id', () =>{
  it('should return not implement', (done) => {
    chai.request(server)
      .post('/board/attack/1234')
      .send({x : '1', y: '2'})
      .end((err, res) => {
        res.should.have.status(501);
        res.text.should.equal('Not Implemented');
        done();
      });
  });
});