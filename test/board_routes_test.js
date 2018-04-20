process.env.NODE_ENV = 'test';

const mongoose = require("mongoose")
const Board = require('../app/models/board');
const BoardHistory = require('../app/models/boardHistory');

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('Boards', () => {
  beforeEach((done) => { //Before each test we empty the database
    Board.remove({}, (err) => { 
      done();         
    });     
  });

  beforeEach((done) => {
    BoardHistory.remove({}, (err) => {
      done();
    })
  })

  describe('/GET board/list when empty', () => {
    it('should GET 0 boards', (done) => {
      chai.request(server)
        .get('/board/list')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        })
    })
  })

  describe('/GET board/history/:id when empty', () => {
    it('should GET 0 boardHistory', (done) => {
      chai.request(server)
        .get('/board/history/1234')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        })
    })
  })

  describe('/GET board', () => {
    it('should return new board', (done) => {
      chai.request(server)
        .get('/board')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('ocean');
          res.body.ocean.length.should.be.eql(10);
          res.body.ocean[0].length.should.be.eql(10);
          res.body.should.have.property('_id');
          res.body.should.have.property('moveNum');
          res.body.should.have.property('createAt');
          done();
        });
    });
  });
  

  // describe('/GET board/list ', () => {
  //   it('should GET all boards', (done) => {
  //     chai.request(server)
  //       .get('/board/list')
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.a('array');
  //         res.body.length.should.be.eql(1);
  //         done();
  //       })
  //   })
  // })

  describe('/GET board/:id', () => {
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

  describe('/GET board/reset/:id', () => {
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

  describe('/POST board/attack/:id', () => {
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

  describe('/GET board/history/:id', () => {
    it('should GET all boardHistory of the Board with id = :id', (done) => {
      chai.request(server)
        .get('/board/history/1234')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        })
    })
  })

});