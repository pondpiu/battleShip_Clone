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
  });

  describe('/GET board/history/:id', () => {
    it('should GET all boardHistory of the Board with id = :id', (done) => {
      const newBoard = createNewBoard();
      newBoard.save((err, board) => {
        History.saveHistory(board, "initialize", (boardHistory) => {
          chai.request(server)
            .get('/board/history/' + boardHistory.boardId)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(1);
              res.body[0].should.have.property('message');
              res.body[0].message.should.be.eql("initialize")
              done();
            })
        });
      })
    });
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
    it('should not GET board by id with invalid id', (done) => {
      chai.request(server)
        .get('/board/1234')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.kind.should.be.eql("ObjectId");
          res.body.path.should.be.eql("_id");
          done();
        });
    })
  });

  describe('/POST board/attack/:id', () => {
    it('should POST board/attack by id =:id at pos { :x, :y }', (done) => {
      const newBoard = createNewBoard();
      coord = {
        x: '0',
        y: '0'
      };
      newBoard.save((err, board) => {
        chai.request(server)
          .post('/board/attack/' + board.id)
          .send(coord)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('message');
            done();
          });
      });
    });
    it('should not POST board/attack by id with invalid id', (done) => {
      coord = {
        x: '0',
        y: '0'
      };
      chai.request(server)
        .post('/board/attack/1234')
        .send(coord)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.kind.should.be.eql("ObjectId");
          res.body.path.should.be.eql("_id");
          done();
        });
    });
    it('should not POST board/attack by id with invalid overflow pos x', (done) => {
      const newBoard = createNewBoard();
      coord = {
        x: '10',
        y: '0'
      };
      newBoard.save((err, board) => {
        chai.request(server)
          .post('/board/attack/' + board.id)
          .send(coord)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('message');
            res.body.message.should.be.eql('(10,0) is not a valid coordinate')
            done();
          });
      });
    });
    it('should not POST board/attack by id with invalid overflow pos y', (done) => {
      const newBoard = createNewBoard();
      coord = {
        x: '0',
        y: '10'
      };
      newBoard.save((err, board) => {
        chai.request(server)
          .post('/board/attack/' + board.id)
          .send(coord)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('message');
            res.body.message.should.be.eql('(0,10) is not a valid coordinate')
            done();
          });
      });
    });
    it('should not POST board/attack by id with invalid underflow pos x', (done) => {
      const newBoard = createNewBoard();
      coord = {
        x: '-1',
        y: '0'
      };
      newBoard.save((err, board) => {
        chai.request(server)
          .post('/board/attack/' + board.id)
          .send(coord)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('message');
            res.body.message.should.be.eql('(-1,0) is not a valid coordinate')
            done();
          });
      });
    });
    it('should not POST board/attack by id with invalid underflow pos y', (done) => {
      const newBoard = createNewBoard();
      coord = {
        x: '0',
        y: '-1'
      };
      newBoard.save((err, board) => {
        chai.request(server)
          .post('/board/attack/' + board.id)
          .send(coord)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('message');
            res.body.message.should.be.eql('(0,-1) is not a valid coordinate')
            done();
          });
      });
    });
    it('should not POST board/attack by id with invalid non number pos x', (done) => {
      const newBoard = createNewBoard();
      coord = {
        x: 'str',
        y: '0'
      };
      newBoard.save((err, board) => {
        chai.request(server)
          .post('/board/attack/' + board.id)
          .send(coord)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('message');
            res.body.message.should.be.eql('(str,0) is not a valid coordinate')
            done();
          });
      });
    });
    it('should not POST board/attack by id with invalid non number pos y', (done) => {
      const newBoard = createNewBoard();
      coord = {
        x: '0',
        y: 'str'
      };
      newBoard.save((err, board) => {
        chai.request(server)
          .post('/board/attack/' + board.id)
          .send(coord)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('message');
            res.body.message.should.be.eql('(0,str) is not a valid coordinate')
            done();
          });
      });
    });
    it('should not POST board/attack by id with missing payload', (done) => {
      const newBoard = createNewBoard();
      newBoard.save((err, board) => {
        chai.request(server)
          .post('/board/attack/' + board.id)
          .end((err, res) => {
            res.should.have.status(400);
            res.should.have.property('text');
            res.text.should.be.eql('Bad Request : missing x or y payload')
            done();
          });
      });
    });
    it('should not POST board/attack by id with missing pos x', (done) => {
      const newBoard = createNewBoard();
      coord = {
        y: '0'
      };
      newBoard.save((err, board) => {
        chai.request(server)
          .post('/board/attack/' + board.id)
          .end((err, res) => {
            res.should.have.status(400);
            res.should.have.property('text');
            res.text.should.be.eql('Bad Request : missing x or y payload')
            done();
          });
      });
    });
    it('should not POST board/attack by id with missing pos y', (done) => {
      const newBoard = createNewBoard();
      coord = {
        x: '0'
      };
      newBoard.save((err, board) => {
        chai.request(server)
          .post('/board/attack/' + board.id)
          .end((err, res) => {
            res.should.have.status(400);
            res.should.have.property('text');
            res.text.should.be.eql('Bad Request : missing x or y payload')
            done();
          });
      });
    });
  });

  describe('/GET board/reset/:id', () => {
    it('should GET board reset by id = :id', (done) => {
      const newBoard = createNewBoard();
      let battleResult = BattleShip.attackWaterAtPos(0, 0, newBoard.ocean);
      newBoard.save((err, board) => {
        chai.request(server)
          .get('/board/reset/' + board.id)
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
            for (let wave of ocean) {
              for (let water of wave) {
                // all the water inside ocean array should get reset back to unknow type (type = 0)
                water.type.should.be.eql(0);
              }
            }
            done();
          });
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
    it('should not GET board reset by id with invalid id', (done) => {
      chai.request(server)
        .get('/board/reset/1234')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.kind.should.be.eql("ObjectId");
          res.body.path.should.be.eql("_id");
          done();
        });
    });
  });
});

function createNewBoard() {
  const newOcean = BattleShip.generateNewOcean();
  const newBoard = new Board(
    {
      ocean: newOcean[0],
      unitLeft: newOcean[1],
      moveNum: 0
    }
  );

  return newBoard;
}