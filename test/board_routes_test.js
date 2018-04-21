process.env.NODE_ENV = 'test';

const mongoose = require("mongoose");
const Board = require('../app/models/board');
const BoardHistory = require('../app/models/boardHistory');

const BattleShip = require('../app/battleShip');
const History = require('../app/history');

const chai = require('chai');
const chaiHttp = require('chai-http');
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

  describe('/GET board/list', () => {
    it('should GET board list with empty db', (done) => {
      chai.request(server)
        .get('/board/list')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        })
    });
    it('should GET all boards', (done) => {
      const newBoard = createNewBoard();
      newBoard.save((err, board) => {
        chai.request(server)
          .get('/board/list')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(1);
            done();
          })
      });
    });
  });

  describe('/GET board/history/:id', () => {
    it('should GET boardHistory by id with empty db', (done) => {
      chai.request(server)
        .get('/board/history/1234')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        })
    });
    it('should GET all boardHistory of the Board with id = :id', (done) => {
      const newBoard = createNewBoard();
      newBoard.save((err,board) => {
        History.saveHistory(board, (boardHistory) => {
          chai.request(server)
          .get('/board/history/'+ boardHistory.boardId)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(1);
            done();
          })
        });
      })
    });
  })

  describe('/GET board', () => {
    it('should return new board', (done) => {
      chai.request(server)
        .get('/board')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.message.should.be.eql("Board successfully initialize!");
          res.body.should.have.property('board');
          res.body.board.should.have.property('ocean');
          res.body.board.ocean.length.should.be.eql(10);
          res.body.board.ocean[0].length.should.be.eql(10);
          res.body.board.should.have.property('boardId');
          res.body.board.should.have.property('moveNum');
          res.body.board.should.have.property('createAt');
          done();
        });
    });
  });

  describe('/GET board/:id', () => {
    it('should GET boaes by id with invalid id', (done) => {
      chai.request(server)
        .get('/board/1234')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.kind.should.be.eql("ObjectId");
          res.body.path.should.be.eql("_id");
          done();
        });
    })
    it('should GET board by id with empty db', (done) => {
      chai.request(server)
        .get('/board/41224d776a326fb40f000001')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.message.should.be.eql("Board 41224d776a326fb40f000001 not found");
          res.body.should.not.have.property('board');
          done();
        });
    });
    it('should GET board by id = :id', (done) => {
      const newBoard = createNewBoard();
      newBoard.save((err, board) => {
        chai.request(server)
        .get('/board/' + board.id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('board');
          res.body.board.should.be.a('object');
          res.body.board.should.have.property('ocean');
          res.body.board.ocean.length.should.be.eql(10);
          res.body.board.ocean[0].length.should.be.eql(10);
          res.body.board.should.have.property('boardId');
          res.body.board.should.have.property('moveNum');
          res.body.board.should.have.property('createAt');
          done();
        });
      });
    });
  });

  describe('/POST board/attack/:id', () => {
    it('should return not implement', (done) => {
      chai.request(server)
        .post('/board/attack/1234')
        .send({ x: '1', y: '2' })
        .end((err, res) => {
          res.should.have.status(501);
          res.text.should.equal('Not Implemented');
          done();
        });
    });
  });

  describe('/GET board/reset/:id', () => {
    it('should GET board reset by id with invalid id', (done) => {
      chai.request(server)
        .get('/board/reset/1234')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.kind.should.be.eql("ObjectId");
          res.body.path.should.be.eql("_id");
          done();
        });
    });
    it('should GET board reset by id with empty db', (done) => {
      chai.request(server)
        .get('/board/reset/41224d776a326fb40f000001')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.message.should.be.eql("Board 41224d776a326fb40f000001 not found");
          res.body.should.not.have.property('board');
          done();
        });
    });
    it('should GET board reset by id = :id', (done) => {
      const newBoard = createNewBoard();
      //TODO attack ocean
      newBoard.save((err, board) => {
        chai.request(server)
        .get('/board/reset/'+board.id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.message.should.be.eql("Board reset secuessfully");
          res.body.should.have.property('board');
          res.body.board.should.have.property('ocean');
          res.body.board.ocean.length.should.be.eql(10);
          res.body.board.ocean[0].length.should.be.eql(10);
          res.body.board.should.have.property('boardId');
          res.body.board.boardId.should.be.eql(board.id)
          res.body.board.should.have.property('moveNum');
          res.body.board.should.have.property('createAt');
          let ocean = res.body.board.ocean;
          for (let wave of ocean ){
            for (let water of wave){
              // all the water inside ocean array should get reset back to unknow type (type = 0)
              water.type.should.be.eql(0);
            }
          }
          done();
        });
      });
    });
  });

});

function createNewBoard(){
  const newOcean = BattleShip.generateNewOcean();
  const newBoard = new Board(
    {
      ocean: newOcean[0],
      unitLeft: newOcean[1],
      moveNum: 0,
    }
  );

  return newBoard;
}