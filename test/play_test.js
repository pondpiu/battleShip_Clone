process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('play test', () => {
  it('should intialize GET board and then use the id to play till game end test (not ensuring test result)', (done) => {
    chai.request(server)
      .get('/board/')
      .end((err, res) => {
        let boardId = res.body.board.boardId;
        done();
        playTillWon(boardId);
      });
  });
});

function playTillWon(boardId){
  _playTillWon(0, 0, boardId);
}

function _playTillWon(x, y, boardId){
  if( x > 9 ){
    x = 0;
    y += 1;
  }
  attackRequest(x, y, boardId);
}

function attackRequest(x, y, boardId){
  coord = {
    x: x,
    y: y
  };
  chai.request(server)
    .post('/board/attack/' + boardId)
    .send(coord)
    .end((err, res) => {
      const msg = res.body.message;
      console.log(msg);
      if(msg.split(" ")[0]!="Win"){
        _playTillWon(x + 1, y, boardId);
      }else{
        console.log("---------------- End testing area ----------------");
      }
    });
}
